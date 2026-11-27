#!/usr/bin/env node
/**
 * Test one exported library in an isolated temporary project.
 *
 * For every package manager (npm, yarn, pnpm, bun) the script:
 *   1. packs the library (and its internal workspace closure) with pnpm/npm,
 *   2. installs the tarballs in a clean consumer project,
 *   3. imports every runtime export subpath (and `require`s every CJS subpath),
 *   4. repeats the install with the declared external peer dependencies,
 *   5. records peer warnings and import failures in `report.json`.
 *
 * Usage:
 *   node test-lib.mjs --package <dir> [options]
 */
import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { discover, exportEntries, findRepoRoot, readJson, slug } from './lib.mjs';

const PMS = ['npm', 'yarn', 'pnpm', 'bun']; // package managers
const CHECK_MARKER = '__CHECK_JSON__';

const HELP = `Usage:
  test-lib.mjs --package <dir> [options]

Options:
  --root <dir>         Repository root (defaults to the nearest workspace/git root)
  --package <dir>      Package directory, relative to the repository root
  --out <dir>          Output directory, outside the repository (defaults to a temp dir)
  --pms <list>         Comma-separated package managers (default: npm,yarn,pnpm,bun)
  --timeout <ms>       Per-command timeout (default: 300000)
  --pack-manager <pm>  Package manager used to pack (pnpm or npm; default: pnpm then npm)
  --build <command>    Command run once in the repository root before packing
  --clean              Remove the working directory after writing the report
  --json-only          Print only the JSON report
  -h, --help           Show this help`;

const fail = message => {
  console.error(`Error: ${message}`);
  process.exit(1);
};

const parseArgs = argv => {
  const args = { pms: [...PMS], timeout: 300_000, clean: false, jsonOnly: false };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];

    if (arg === '-h' || arg === '--help') args.help = true;
    else if (arg === '--root') args.root = argv[++index];
    else if (arg === '--package' || arg === '--dir') args.package = argv[++index];
    else if (arg === '--out') args.out = argv[++index];
    else if (arg === '--pms')
      args.pms = argv[++index]
        .split(',')
        .map(value => value.trim())
        .filter(Boolean);
    else if (arg === '--timeout') args.timeout = Number(argv[++index]);
    else if (arg === '--pack-manager') args.packManager = argv[++index];
    else if (arg === '--build') args.build = argv[++index];
    else if (arg === '--clean') args.clean = true;
    else if (arg === '--json-only') args.jsonOnly = true;
    else fail(`unknown option: ${arg}`);
  }

  if (!args.help && !args.package) fail(`--package is required\n\n${HELP}`);

  return args;
};

const run = (command, args, cwd, timeout) => {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    timeout,
    env: { ...process.env, CI: '1' },
    maxBuffer: 64 * 1024 * 1024,
  });

  return {
    ok: !result.error && result.status === 0,
    status: result.status,
    signal: result.signal,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error ? String(result.error) : null,
  };
};

const outputOf = result => `${result.stdout}\n${result.stderr}`;

const pmVersion = (pm, timeout) => {
  const result = run(pm, ['--version'], process.cwd(), Math.min(timeout, 30_000));
  if (!result.ok) return null;
  return result.stdout.trim().split(/\s+/)[0] || 'unknown';
};

const isInside = (parent, child) => {
  const relative = resolve(child).slice(resolve(parent).length);
  return resolve(child) === resolve(parent) || relative.startsWith(sep);
};

const packTarball = (root, pkgDir, outDir, packManager, timeout) => {
  mkdirSync(outDir, { recursive: true });

  const candidates = [];
  if (packManager === 'pnpm' || packManager === 'npm') {
    candidates.push(packManager);
  } else {
    candidates.push('pnpm', 'npm');
  }

  const logs = [];

  for (const manager of candidates) {
    const args =
      manager === 'pnpm'
        ? ['pack', '--pack-destination', outDir]
        : ['pack', '--pack-destination', outDir];
    const result = run(manager, args, join(root, pkgDir), timeout);
    logs.push({ manager, ...result });

    if (!result.ok) continue;

    const tarballs = readdirSync(outDir)
      .filter(file => file.endsWith('.tgz'))
      .sort();

    if (tarballs.length) {
      return { tarball: join(outDir, tarballs.at(-1)), log: result, manager };
    }
  }

  const details = logs
    .map(
      log =>
        `$ ${log.manager} pack (${log.status ?? 'error'})\n${outputOf(log).trim()}`,
    )
    .join('\n\n');

  throw new Error(`could not pack ${pkgDir}\n\n${details}`);
};

const readPackedManifest = (tarball, timeout) => {
  const result = run(
    'tar',
    ['-xOf', tarball, 'package/package.json'],
    dirname(tarball),
    timeout,
  );
  if (!result.ok) return null;

  try {
    return JSON.parse(result.stdout);
  } catch {
    return null;
  }
};

const listPackedFiles = (tarball, timeout) => {
  const result = run('tar', ['-tzf', tarball], dirname(tarball), timeout);
  if (!result.ok) return null;

  return new Set(
    result.stdout
      .split(/\r?\n/)
      .map(line =>
        line
          .replace(/^package\//, '')
          .replace(/^\.\//, '')
          .trim(),
      )
      .filter(Boolean),
  );
};

const INTERNAL_SECTIONS = [
  'dependencies',
  'optionalDependencies',
  'peerDependencies',
];

/**
 * Rewrite a packed tarball so internal workspace dependencies point at their
 * local tarballs. Without this, npm/yarn/pnpm/bun try to resolve the
 * unpublished internal versions from the registry.
 */
const rewriteTarball = ({ original, destination, internalPaths, timeout }) => {
  mkdirSync(dirname(destination), { recursive: true });
  const scratch = `${destination}.work`;
  rmSync(scratch, { recursive: true, force: true });
  mkdirSync(scratch, { recursive: true });

  const extract = run(
    'tar',
    ['-xzf', original, '-C', scratch],
    dirname(original),
    timeout,
  );
  const manifestPath = join(scratch, 'package', 'package.json');

  if (!extract.ok || !existsSync(manifestPath)) {
    rmSync(scratch, { recursive: true, force: true });
    copyFileSync(original, destination);
    return { tarball: destination, rewritten: false, replaced: [] };
  }

  const manifest = readJson(manifestPath);
  const replaced = [];

  for (const section of INTERNAL_SECTIONS) {
    const dependencies = manifest[section];
    if (!dependencies) continue;

    for (const name of Object.keys(dependencies)) {
      const local = internalPaths.get(name);
      if (!local) continue;
      dependencies[name] = `file:${local}`;
      replaced.push(name);
    }
  }

  if (!replaced.length) {
    rmSync(scratch, { recursive: true, force: true });
    copyFileSync(original, destination);
    return { tarball: destination, rewritten: false, replaced: [] };
  }

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  const packed = run('tar', ['-czf', destination, 'package'], scratch, timeout);
  rmSync(scratch, { recursive: true, force: true });

  if (!packed.ok) {
    copyFileSync(original, destination);
    return { tarball: destination, rewritten: false, replaced: [] };
  }

  return { tarball: destination, rewritten: true, replaced: [...new Set(replaced)] };
};

const buildClosure = (target, byName) => {
  const closure = new Map();
  const queue = [target];
  const visited = new Set([target.name]);

  while (queue.length) {
    const pkg = queue.shift();

    for (const section of [
      'dependencies',
      'optionalDependencies',
      'peerDependencies',
    ]) {
      for (const name of Object.keys(pkg[section] ?? {})) {
        const dependency = byName.get(name);
        if (!dependency || visited.has(name)) continue;

        visited.add(name);
        closure.set(name, dependency);
        queue.push(dependency);
      }
    }
  }

  return [...closure.values()];
};

const preflight = (root, pkg, entries) => {
  const missing = [];

  for (const entry of entries) {
    for (const target of [
      entry.importTarget,
      entry.requireTarget,
      entry.typeTarget,
    ]) {
      if (!target || !target.startsWith('./')) continue;
      const clean = target.replace(/^\.\//, '');
      if (!existsSync(join(root, pkg.dir, clean)))
        missing.push({ subpath: entry.subpath, target: clean });
    }
  }

  return missing;
};

const checkPackedFiles = (files, entries) => {
  if (!files) return { checked: false, missing: [] };

  const missing = [];

  for (const entry of entries) {
    for (const target of [
      entry.importTarget,
      entry.requireTarget,
      entry.typeTarget,
    ]) {
      if (!target) continue;
      const clean = target.replace(/^\.\//, '');
      if (!files.has(clean)) missing.push({ subpath: entry.subpath, target: clean });
    }
  }

  return { checked: true, missing };
};

const peerWarningsOf = output => {
  const lines = output
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  return lines
    .filter(line => {
      if (
        /unmet peer|broken peer|missing peer|peer dependenc|peerDependencies/i.test(
          line,
        )
      ) {
        return true;
      }
      if (/ERESOLVE/i.test(line)) return true;
      if (/WARN/i.test(line) && /peer/i.test(line)) return true;
      return false;
    })
    .slice(0, 40);
};

const viewCache = new Map();

const npmView = (spec, field, root, timeout) => {
  const key = `${spec}|${field}`;
  if (viewCache.has(key)) return viewCache.get(key);

  const result = run(
    'npm',
    ['view', spec, field, '--json'],
    root,
    Math.min(timeout, 120_000),
  );

  let value = null;
  if (result.ok) {
    try {
      value = JSON.parse(result.stdout);
    } catch {
      value = null;
    }
  }

  viewCache.set(key, value);
  return value;
};

/**
 * Add the required peers of external peers (for example `vite` for `vitest`)
 * so the "complete" scenario satisfies the whole peer chain on every package
 * manager, including Yarn which never auto-installs peers.
 */
const expandExternalPeers = (initial, root, byName, timeout, maxDepth = 2) => {
  const result = new Map(initial);
  const queue = [...initial].map(([name, spec]) => ({ name, spec, depth: 0 }));
  const visited = new Set(initial.keys());

  while (queue.length) {
    const item = queue.shift();
    if (item.depth >= maxDepth) continue;

    const peers =
      npmView(`${item.name}@${item.spec}`, 'peerDependencies', root, timeout) ?? {};
    const meta =
      npmView(`${item.name}@${item.spec}`, 'peerDependenciesMeta', root, timeout) ??
      {};

    for (const [name, spec] of Object.entries(peers)) {
      if (typeof spec !== 'string') continue;
      if (meta[name]?.optional) continue;
      if (byName.has(name)) continue;
      if (spec.startsWith('catalog:') || spec.startsWith('workspace:')) continue;

      if (!result.has(name)) result.set(name, spec);
      if (!visited.has(name)) {
        visited.add(name);
        queue.push({ name, spec, depth: item.depth + 1 });
      }
    }
  }

  return result;
};

const consumerPackageJson = (pm, target) => ({
  name: `pkg-compat-${slug(target.name)}-${pm}`,
  version: '0.0.0',
  private: true,
  type: 'module',
});

const createConsumer = (dir, pm, target) => {
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'package.json'),
    `${JSON.stringify(consumerPackageJson(pm, target), null, 2)}\n`,
  );

  if (pm === 'yarn') {
    writeFileSync(join(dir, '.yarnrc.yml'), 'nodeLinker: node-modules\n');
  }

  writeFileSync(
    join(dir, 'entries.json'),
    `${JSON.stringify(target.entries, null, 2)}\n`,
  );

  writeFileSync(
    join(dir, 'check.mjs'),
    `import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const name = ${JSON.stringify(target.name)};
const entries = JSON.parse(readFileSync(new URL('./entries.json', import.meta.url), 'utf8'));
const require = createRequire(import.meta.url);
const results = [];

for (const entry of entries) {
  const spec = entry.subpath === '.' ? name : name + entry.subpath.slice(1);

  if (entry.hasImport) {
    try {
      const module = await import(spec);
      results.push({ subpath: entry.subpath, kind: 'import', ok: true, exports: Object.keys(module).length });
    } catch (error) {
      results.push({ subpath: entry.subpath, kind: 'import', ok: false, code: error.code ?? '', message: String(error.message ?? error) });
    }
  }

  if (entry.hasRequire) {
    try {
      const module = require(spec);
      results.push({ subpath: entry.subpath, kind: 'require', ok: true, exports: Object.keys(module ?? {}).length });
    } catch (error) {
      results.push({ subpath: entry.subpath, kind: 'require', ok: false, code: error.code ?? '', message: String(error.message ?? error) });
    }
  }
}

console.log('${CHECK_MARKER}' + JSON.stringify(results));
`,
  );
};

const installArgs = (pm, specs) => {
  switch (pm) {
    case 'npm':
      return ['install', ...specs, '--no-audit', '--no-fund', '--loglevel', 'warn'];
    case 'yarn':
      return ['add', ...specs];
    case 'pnpm':
      return ['add', ...specs, '--reporter', 'append-only'];
    case 'bun':
      return ['add', ...specs];
    default:
      return ['add', ...specs];
  }
};

const parseChecks = result => {
  const index = result.stdout.indexOf(CHECK_MARKER);
  if (index === -1) return null;

  const line = result.stdout.slice(index + CHECK_MARKER.length).split(/\r?\n/)[0];

  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
};

const runScenario = ({ pm, stage, dir, specs, target, timeout }) => {
  createConsumer(dir, pm, target);

  const install = run(pm, installArgs(pm, specs), dir, timeout);
  const installed = existsSync(
    join(dir, 'node_modules', target.name, 'package.json'),
  );
  const runtime = pm === 'bun' ? 'bun' : 'node';
  const check = run(runtime, ['check.mjs'], dir, timeout);
  const parsed = parseChecks(check);

  const results = parsed ?? [
    {
      subpath: '.',
      kind: 'check',
      ok: false,
      code: check.error ?? `exit ${check.status ?? '?'}`,
      message: outputOf(check).trim().slice(-4000),
    },
  ];

  const runtimeFailures = results.filter(result => !result.ok);

  return {
    stage,
    pm,
    dir,
    specs,
    installOk: install.ok,
    installed,
    installOutput: outputOf(install).trim().slice(-8000),
    peerWarnings: peerWarningsOf(outputOf(install)),
    checkOk: check.ok,
    runtimeFailures,
    results,
  };
};

const pkgDirExists = (root, dir) => existsSync(join(root, dir, 'package.json'));

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(HELP);
    return;
  }

  const root = findRepoRoot(args.root ?? process.cwd());
  const pkgDir = args.package.replace(/^\.\//, '').replace(/\/$/, '');

  if (!pkgDirExists(root, pkgDir))
    fail(`no package.json found in ${join(root, pkgDir)}`);

  const discovery = discover(root);
  const byName = new Map(discovery.workspace.map(pkg => [pkg.name, pkg]));
  const target = byName.get(readJson(join(root, pkgDir, 'package.json')).name);

  if (!target) fail(`package ${pkgDir} is not part of the workspace`);

  const raw = target.raw;
  const entries = exportEntries(raw.exports, { main: raw.main, module: raw.module });
  const runtimeEntries = entries.filter(
    entry => entry.hasImport || entry.hasRequire,
  );

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outRoot = args.out
    ? resolve(args.out)
    : join(os.tmpdir(), 'repo-libs-check', timestamp);

  if (isInside(root, outRoot)) {
    fail(`--out must be outside the repository (got ${outRoot})`);
  }

  const pkgOut = join(outRoot, slug(target.name));
  const work = join(pkgOut, 'work');

  rmSync(pkgOut, { recursive: true, force: true });
  mkdirSync(work, { recursive: true });

  if (args.build) {
    const shell = process.platform === 'win32' ? 'cmd' : 'sh';
    const shellArgs =
      process.platform === 'win32' ? ['/c', args.build] : ['-c', args.build];
    const build = run(shell, shellArgs, root, Math.max(args.timeout, 600_000));
    if (!build.ok) {
      fail(`build command failed: ${args.build}\n\n${outputOf(build)}`);
    }
  }

  const missingSources = preflight(root, target, entries);
  const closure = buildClosure(target, byName);
  const packManager =
    args.packManager ?? (pmVersion('pnpm', args.timeout) ? 'pnpm' : 'npm');

  const originals = new Map();
  const manifests = new Map();

  for (const pkg of [target, ...closure]) {
    const outDir = join(work, 'tarballs', slug(pkg.name));
    const packed = packTarball(root, pkg.dir, outDir, packManager, args.timeout);
    const manifest = readPackedManifest(packed.tarball, args.timeout);
    originals.set(pkg.name, packed.tarball);
    manifests.set(pkg.name, manifest ?? pkg.raw);
  }

  const localDir = join(work, 'local');
  const finalPaths = new Map(
    [target, ...closure].map(pkg => [
      pkg.name,
      join(localDir, `${slug(pkg.name)}.tgz`),
    ]),
  );

  const rewritten = new Map();
  for (const pkg of [target, ...closure]) {
    rewritten.set(
      pkg.name,
      rewriteTarball({
        original: originals.get(pkg.name),
        destination: finalPaths.get(pkg.name),
        internalPaths: finalPaths,
        timeout: args.timeout,
      }),
    );
  }

  const targetTarball = rewritten.get(target.name).tarball;
  const packedFiles = listPackedFiles(targetTarball, args.timeout);
  const packedCheck = checkPackedFiles(packedFiles, entries);

  const internalSpecs = closure.map(pkg => rewritten.get(pkg.name).tarball);

  const externalPeers = new Map();
  for (const pkg of [target, ...closure]) {
    const manifest = manifests.get(pkg.name) ?? {};
    for (const [name, spec] of Object.entries(manifest.peerDependencies ?? {})) {
      if (byName.has(name)) continue;
      if (typeof spec !== 'string') continue;
      if (spec.startsWith('catalog:') || spec.startsWith('workspace:')) continue;
      externalPeers.set(name, spec);
    }
  }

  const fullExternalPeers = expandExternalPeers(
    externalPeers,
    root,
    byName,
    args.timeout,
  );
  const externalSpecs = [...fullExternalPeers].map(
    ([name, spec]) => `${name}@${spec}`,
  );
  // Install every external peer up front so missing peers cannot surface as
  // import errors. This includes required transitive peers such as `vite` for
  // `vitest`.
  const installSpecs = [targetTarball, ...internalSpecs, ...externalSpecs];

  const pms = {};

  for (const pm of args.pms) {
    const version = pmVersion(pm, args.timeout);

    if (!version) {
      pms[pm] = { available: false };
      continue;
    }

    const install = runScenario({
      pm,
      stage: 'install',
      dir: join(work, pm),
      specs: installSpecs,
      target: { ...target, entries },
      timeout: args.timeout,
    });

    pms[pm] = { available: true, version, install };
  }

  const failures = [];
  const failureDetails = [];
  const warnings = [];
  const warningDetails = [];

  const addIssue = (severity, scope, message, details = []) => {
    const line = `${scope}: ${message}`;

    if (severity === 'failure') {
      failures.push(line);
      failureDetails.push({ scope, message, details });
    } else {
      warnings.push(line);
      warningDetails.push({ scope, message, details });
    }
  };

  for (const item of missingSources) {
    addIssue('warning', 'source', `missing ${item.target} (${item.subpath})`);
  }

  for (const item of packedCheck.missing) {
    addIssue('failure', 'tarball', `missing ${item.target} (${item.subpath})`);
  }

  for (const [pm, data] of Object.entries(pms)) {
    if (!data.available) continue;

    const scenario = data.install;
    const prefix = `${pm}/install`;

    if (!scenario.installOk) addIssue('failure', prefix, 'install failed');

    if (!scenario.installed) {
      addIssue('failure', prefix, 'package not in node_modules');
    }

    for (const failure of scenario.runtimeFailures) {
      addIssue(
        'failure',
        prefix,
        `${failure.subpath} ${failure.kind} -> ${failure.code || failure.message}`,
        [failure.message],
      );
    }

    if (scenario.peerWarnings.length) {
      addIssue(
        'warning',
        prefix,
        `${scenario.peerWarnings.length} peer warning(s)`,
        scenario.peerWarnings,
      );
    }
  }

  const verdict = failures.length
    ? 'FAIL'
    : warnings.length
      ? 'PASS_WITH_WARNINGS'
      : 'PASS';

  const report = {
    name: target.name,
    dir: target.dir,
    version: target.version,
    generatedAt: new Date().toISOString(),
    root,
    verdict,
    entries,
    typeOnly: entries.filter(entry => entry.typeOnly).map(entry => entry.subpath),
    missingSources,
    packedCheck,
    internalClosure: closure.map(pkg => pkg.name),
    rewrittenInternals: [...rewritten]
      .filter(([, value]) => value.rewritten)
      .map(([name]) => name),
    externalPeers: Object.fromEntries(fullExternalPeers),
    tarball: targetTarball,
    pms,
    failures,
    failureDetails,
    warnings,
    warningDetails,
  };

  const reportPath = join(pkgOut, 'report.json');
  report.reportJson = reportPath;

  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  if (args.jsonOnly) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`Package: ${target.name} (${target.dir}) v${target.version ?? '?'}`);
    console.log(
      `Exports: ${entries.length} total, ${runtimeEntries.length} runtime, ${report.typeOnly.length} type-only`,
    );
    console.log(`Internal closure: ${closure.length} package(s)`);
    console.log(`External peers: ${fullExternalPeers.size}`);

    if (missingSources.length) {
      console.log(
        `\nMissing source targets (build first): ${missingSources.length}`,
      );
      for (const item of missingSources)
        console.log(`  - ${item.target} (${item.subpath})`);
    }

    for (const [pm, data] of Object.entries(pms)) {
      if (!data.available) {
        console.log(`\n${pm}: not installed, skipped`);
        continue;
      }

      const scenario = data.install;
      const failed = scenario.runtimeFailures.length;
      console.log(`\n${pm} ${data.version}`);
      console.log(
        `  install=${scenario.installOk ? 'ok' : 'FAIL'} imports=${scenario.results.length - failed}/${scenario.results.length} peerWarnings=${scenario.peerWarnings.length}`,
      );
      for (const failure of scenario.runtimeFailures.slice(0, 5)) {
        console.log(
          `    ! ${failure.subpath} ${failure.kind}: ${failure.code || failure.message}`,
        );
      }
    }

    if (failures.length) {
      console.log(`\nFailures (${failures.length}):`);
      for (const failure of failures) console.log(`  - ${failure}`);
    }

    if (warnings.length) {
      console.log(`\nWarnings (${warnings.length}):`);
      for (const warning of warnings.slice(0, 30)) console.log(`  - ${warning}`);
    }

    console.log(`\nVerdict: ${verdict}`);
    console.log(`Report: ${reportPath}`);
  }

  if (args.clean) rmSync(work, { recursive: true, force: true });

  if (verdict === 'FAIL') process.exit(1);
};

main();
