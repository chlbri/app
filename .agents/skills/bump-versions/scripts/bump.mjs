#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const SKILL_DIR = dirname(dirname(SCRIPT_PATH));
const REGISTRY_FILE = join(SKILL_DIR, 'packages.json');

const MODES = ['patch', 'minor', 'major', 'pre-release'];
const CHANNELS = ['latest', 'main', 'alpha', 'beta', 'canary'];
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?$/;

const usage = `Usage:
  bump.mjs <patch|minor|major|pre-release> [-b <branch>] [-o <version>]
  bump.mjs --recheck [--yes] [<mode>] [-b <branch>] [-o <version>]
  bump.mjs --list

Modes:
  patch        increment the patch version      (2.7.1 -> 2.7.2)
  minor        increment the minor version      (2.7.1 -> 2.8.0)
  major        increment the major version      (2.7.1 -> 3.0.0)
  pre-release  bump the pre-release counter     (2.7.1 -> 2.7.2-rc.0)

Options:
  -b, --branch <branch>     Append -<branch> to the version.
                            latest|main -> no tail (2.7.2)
                            alpha        -> 2.7.2-alpha
                            beta         -> 2.7.2-beta
                            canary       -> 2.7.2-canary
  -o, --override <version>  Set every registered package to this exact version
                            (takes precedence over the bump mode)
  --recheck                 Re-discover the main packages. Without --yes the
                            result is only printed, never saved
  --yes                     Confirm saving the discovered packages to
                            packages.json (requires --recheck)
  --list                    Print the registered packages and their versions
  -h, --help                Show this help

Examples:
  bump.mjs patch
  bump.mjs patch --branch beta
  bump.mjs pre-release -b canary
  bump.mjs major -b latest
  bump.mjs -o 2.7.1 -b alpha
  bump.mjs --recheck
  bump.mjs --recheck --yes patch`;

const fail = message => {
  console.error(`Error: ${message}`);
  process.exit(1);
};

const findRepoRoot = () => {
  let dir = dirname(SCRIPT_PATH);
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml'))) return dir;
    dir = dirname(dir);
  }
  fail('could not locate the repository root (pnpm-workspace.yaml not found)');
};

const parseArgs = argv => {
  let mode;
  let override;
  let branch;
  let recheck = false;
  let yes = false;
  let list = false;
  let help = false;

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];

    if (arg === '-h' || arg === '--help') {
      help = true;
      continue;
    }

    if (arg === '-o' || arg === '--override') {
      override = argv[++index];
      if (!override) fail(`${arg} requires a version argument`);
      continue;
    }

    if (arg === '-b' || arg === '--branch') {
      const value = argv[++index];
      if (!value) fail(`${arg} requires a branch argument`);
      if (!CHANNELS.includes(value)) {
        fail(`invalid branch "${value}" (expected: ${CHANNELS.join(', ')})`);
      }
      branch = value === 'main' ? 'latest' : value;
      continue;
    }

    if (arg === '--recheck') {
      recheck = true;
      continue;
    }

    if (arg === '--yes') {
      yes = true;
      continue;
    }

    if (arg === '--list') {
      list = true;
      continue;
    }

    if (arg.startsWith('-')) fail(`unknown option: ${arg}`);

    const normalized = arg === 'prerelease' ? 'pre-release' : arg;
    if (!MODES.includes(normalized)) {
      fail(`invalid mode "${arg}" (expected: ${MODES.join(', ')})`);
    }
    if (mode) {
      fail(`only one bump mode is allowed (got "${mode}" and "${arg}")`);
    }
    mode = normalized;
  }

  if (help) return { help };

  if (yes && !recheck) fail('--yes can only be used with --recheck');
  if (list && (recheck || yes || mode || override || branch)) {
    fail('--list cannot be combined with other arguments');
  }
  if (branch && !mode && !override) {
    fail('--branch requires a bump mode or -o <version>');
  }
  if (override && !SEMVER.test(override)) {
    fail(`invalid version "${override}" (expected a semver like 2.7.1)`);
  }
  if (!recheck && !list && !mode && !override) {
    fail(`missing argument\n\n${usage}`);
  }

  return { mode, override, branch, recheck, yes, list, help };
};

const isStableBranch = branch => !branch || branch === 'latest';

const core = version => {
  const [, major, minor, patch] = SEMVER.exec(version);
  return `${major}.${minor}.${patch}`;
};

const applyBranch = (version, branch) => {
  if (isStableBranch(branch)) return core(version);
  return `${core(version)}-${branch}`;
};

const bump = (version, mode) => {
  const [, major, minor, patch, prerelease] = SEMVER.exec(version);
  const maj = Number(major);
  const min = Number(minor);
  const pat = Number(patch);

  switch (mode) {
    case 'major':
      return `${maj + 1}.0.0`;
    case 'minor':
      return `${maj}.${min + 1}.0`;
    case 'patch':
      return `${maj}.${min}.${pat + 1}`;
    case 'pre-release': {
      if (!prerelease) return `${maj}.${min}.${pat + 1}-rc.0`;
      const parts = prerelease.split('.');
      const last = parts.length - 1;
      if (/^\d+$/.test(parts[last])) {
        parts[last] = String(Number(parts[last]) + 1);
      } else {
        parts.push('0');
      }
      return `${maj}.${min}.${pat}-${parts.join('.')}`;
    }
  }
};

const computeNext = (current, { mode, override, branch }) => {
  if (override) return branch ? applyBranch(override, branch) : override;

  const base = bump(current, mode);
  if (!branch) return base;

  const [, , , , prerelease] = SEMVER.exec(current);
  const [currentBranch, ...rest] = (prerelease ?? '').split('.').filter(Boolean);

  // Repeated pre-release runs on the same branch increment its counter.
  if (
    mode === 'pre-release' &&
    !isStableBranch(branch) &&
    currentBranch === branch
  ) {
    const last = rest.at(-1);
    const numbered = last !== undefined && /^\d+$/.test(last);
    const counter = numbered ? Number(last) + 1 : 0;
    const middle = numbered ? rest.slice(0, -1) : rest;
    return [`${core(current)}-${branch}`, ...middle, String(counter)].join('.');
  }

  return applyBranch(base, branch);
};

const discoverPackages = root => {
  const packagesDir = join(root, 'packages');
  if (!existsSync(packagesDir)) fail('no packages/ directory found');

  return readdirSync(packagesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => `packages/${entry.name}`)
    .filter(
      dir =>
        !dir.split('/').some(part => part.startsWith('.') || part === '__tests__') &&
        existsSync(join(root, dir, 'package.json')),
    )
    .sort();
};

const readPackage = (root, dir) => {
  const path = join(root, dir, 'package.json');
  if (!existsSync(path)) fail(`missing ${dir}/package.json`);
  const text = readFileSync(path, 'utf8');
  const json = JSON.parse(text);
  if (typeof json.version !== 'string' || !SEMVER.test(json.version)) {
    fail(`${dir}/package.json has an invalid version "${json.version}"`);
  }
  return { dir, path, text, name: json.name, version: json.version };
};

const printPackages = packages => {
  const nameWidth = Math.max(...packages.map(pkg => pkg.name.length));
  const dirWidth = Math.max(...packages.map(pkg => pkg.dir.length));
  for (const pkg of packages) {
    console.log(
      `  ${pkg.name.padEnd(nameWidth)}  ${pkg.dir.padEnd(dirWidth)}  ${pkg.version}`,
    );
  }
};

const readRegistry = root => {
  if (!existsSync(REGISTRY_FILE)) {
    const script = relative(root, SCRIPT_PATH);
    const discovered = discoverPackages(root);
    console.error('No packages.json found — the skill has not been initialized.\n');
    console.error(`Discovered ${discovered.length} main package(s):`);
    printPackages(discovered.map(dir => readPackage(root, dir)));
    console.error(
      `\nConfirm this list with the user, then run:\n  node ${script} --recheck --yes`,
    );
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(readFileSync(REGISTRY_FILE, 'utf8'));
  } catch (error) {
    fail(`cannot parse ${relative(root, REGISTRY_FILE)}: ${error.message}`);
  }

  const packages = data.packages;
  if (!Array.isArray(packages) || packages.length === 0) {
    fail(
      `${relative(root, REGISTRY_FILE)} must contain a non-empty "packages" array`,
    );
  }

  const seen = new Set();
  for (const entry of packages) {
    if (typeof entry !== 'string' || entry.length === 0) {
      fail(
        `invalid entry in ${relative(root, REGISTRY_FILE)}: expected a path string`,
      );
    }
    if (seen.has(entry)) {
      fail(`duplicate entry in ${relative(root, REGISTRY_FILE)}: "${entry}"`);
    }
    seen.add(entry);
  }

  return packages;
};

const writeRegistry = (root, packages) => {
  const content = `${JSON.stringify({ packages }, null, 2)}\n`;
  writeFileSync(REGISTRY_FILE, content);
  console.log(
    `\nSaved ${packages.length} package(s) to ${relative(root, REGISTRY_FILE)}`,
  );
};

const writeVersion = (pkg, version) => {
  const pattern = /("version"\s*:\s*")[^"]*(")/;
  if (!pattern.test(pkg.text)) fail(`no "version" field in ${pkg.dir}`);
  const text = pkg.text.replace(pattern, `$1${version}$2`);
  writeFileSync(pkg.path, text);
};

const main = () => {
  const { mode, override, branch, recheck, yes, list, help } = parseArgs(
    process.argv.slice(2),
  );

  if (help) {
    console.log(usage);
    return;
  }

  const root = findRepoRoot();

  if (recheck) {
    const discovered = discoverPackages(root);
    const packages = discovered.map(dir => readPackage(root, dir));

    console.log(`Discovered ${packages.length} main package(s):`);
    printPackages(packages);

    if (!yes) {
      const script = relative(root, SCRIPT_PATH);
      console.log(
        `\nNothing saved. Confirm this list with the user, then run:\n` +
          `  node ${script} --recheck --yes${mode ? ` ${mode}` : ''}${
            branch ? ` --branch ${branch}` : ''
          }`,
      );
      return;
    }

    writeRegistry(root, discovered);
    if (!mode && !override) return;
  }
  if (list) {
    const registered = readRegistry(root);
    const packages = registered.map(dir => readPackage(root, dir));
    console.log(`${packages.length} registered package(s):`);
    printPackages(packages);
    return;
  }

  const registered = readRegistry(root);
  const packages = registered.map(dir => readPackage(root, dir));

  const versions = new Set(packages.map(pkg => pkg.version));
  if (!override && versions.size !== 1) {
    fail(
      `the registered packages have different versions (${[...versions].join(
        ', ',
      )}); use -o <version> to align them`,
    );
  }

  const current = packages[0].version;
  const next = computeNext(current, { mode, override, branch });

  if (next === current) {
    console.log(
      `All ${packages.length} registered packages are already at ${next}. Nothing to do.`,
    );
    return;
  }

  packages.forEach(pkg => writeVersion(pkg, next));

  const nameWidth = Math.max(...packages.map(pkg => pkg.name.length));
  console.log(`Registered packages version: ${current} -> ${next}\n`);
  for (const pkg of packages) {
    console.log(`  ${pkg.name.padEnd(nameWidth)}  ${pkg.version} -> ${next}`);
  }
};

main();
