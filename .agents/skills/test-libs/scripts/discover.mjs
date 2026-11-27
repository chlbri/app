#!/usr/bin/env node
/**
 * Discover the repository's exported libraries and maintain `packages.json`.
 *
 * Usage:
 *   node discover.mjs [--root <dir>] [--all] [--list] [--json]
 *   node discover.mjs --update [--all] [--yes]
 */
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  REGISTRY_FILE,
  discover,
  findRepoRoot,
  readJson,
  readRegistry,
  writeRegistry,
} from './lib.mjs';

const SCRIPT_PATH = fileURLToPath(import.meta.url);

const USAGE = `Usage:
  discover.mjs [--root <dir>] [--all] [--list] [--json]
  discover.mjs --update [--all] [--yes]

Without --update, print the packages the skill would register.
With --update, compare the registry with the current repository and report
new or removed exported libraries. --yes writes the merged result.

Options:
  --root <dir>  Repository root (defaults to the nearest workspace/git root)
  --all         Also include publishable packages outside the dominant
                version family (independently versioned helper libraries)
  --list        Print the registered packages, then exit
  --update      Re-check the repository for new exported libraries
  --yes         Confirm writing packages.json (requires --update)
  --json        Print machine-readable JSON
  -h, --help    Show this help`;

const fail = message => {
  console.error(`Error: ${message}`);
  process.exit(1);
};

const parseArgs = argv => {
  const args = { all: false, list: false, update: false, yes: false, json: false };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];

    if (arg === '-h' || arg === '--help') args.help = true;
    else if (arg === '--root') args.root = argv[++index];
    else if (arg === '--all') args.all = true;
    else if (arg === '--list') args.list = true;
    else if (arg === '--update' || arg === '--recheck') args.update = true;
    else if (arg === '--yes') args.yes = true;
    else if (arg === '--json') args.json = true;
    else fail(`unknown option: ${arg}`);
  }

  if (args.yes && !args.update) fail('--yes can only be used with --update');
  if (args.list && (args.update || args.yes || args.all)) {
    fail('--list cannot be combined with --update, --yes or --all');
  }

  return args;
};

const packageLabel = pkg => `${pkg.name}  ${pkg.dir}  ${pkg.version ?? '?'}`;

const printPackages = packages => {
  if (!packages.length) {
    console.log('  (none)');
    return;
  }

  const nameWidth = Math.max(...packages.map(pkg => pkg.name.length));
  const dirWidth = Math.max(...packages.map(pkg => pkg.dir.length));

  for (const pkg of packages) {
    console.log(
      `  ${pkg.name.padEnd(nameWidth)}  ${pkg.dir.padEnd(dirWidth)}  ${pkg.version ?? '?'}`,
    );
  }
};

const normalizeEntry = entry => ({
  name: typeof entry.name === 'string' ? entry.name : undefined,
  dir: entry.dir,
});

const resolveRegistry = (root, registered) => {
  const discovered = new Map();
  for (const pkg of discover(root).workspace) discovered.set(pkg.dir, pkg);

  return registered.map(entry => {
    const found = discovered.get(entry.dir);
    let name = entry.name ?? found?.name ?? entry.dir;

    if (!found) {
      const packagePath = join(root, entry.dir, 'package.json');
      if (existsSync(packagePath)) {
        try {
          const pkg = readJson(packagePath);
          if (typeof pkg.name === 'string') name = pkg.name;
        } catch {
          // Keep the registered name.
        }
      }
    }

    return { name, dir: entry.dir, version: found?.version ?? null };
  });
};

const listRegistered = (root, asJson) => {
  const registry = readRegistry();
  if (!registry) {
    fail(
      `no ${relative(root, REGISTRY_FILE)} found — run \`node discover.mjs --update\` first`,
    );
  }

  const packages = resolveRegistry(root, registry.packages).map(pkg => ({
    ...pkg,
    version: pkg.version ?? '?',
  }));

  if (asJson) {
    console.log(JSON.stringify({ packages }, null, 2));
    return;
  }

  console.log(`${packages.length} registered package(s):`);
  printPackages(packages);
};

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(USAGE);
    return;
  }

  const root = findRepoRoot(args.root ?? process.cwd());

  if (args.list) {
    listRegistered(root, args.json);
    return;
  }

  const discovery = discover(root);
  const candidates = args.all ? discovery.all : discovery.main;
  const registry = readRegistry();

  if (!registry) {
    if (args.json) {
      console.log(
        JSON.stringify(
          {
            root,
            dominantVersion: discovery.dominantVersion,
            main: discovery.main,
            auxiliary: discovery.auxiliary,
            candidates,
            written: false,
          },
          null,
          2,
        ),
      );
    } else {
      console.log(
        `No ${relative(root, REGISTRY_FILE)} yet. Discovered ${discovery.all.length} publishable package(s).`,
      );
      console.log(
        `\nMain version family: ${discovery.dominantVersion ?? '(none)'} (${discovery.main.length})`,
      );
      printPackages(discovery.main);

      if (discovery.auxiliary.length) {
        console.log(
          `\nAuxiliary packages outside that family (${discovery.auxiliary.length}) — not registered unless --all is used:`,
        );
        printPackages(discovery.auxiliary);
      }

      console.log(
        `\nConfirm this list with the user, then run:\n  node ${relative(root, SCRIPT_PATH)} --update --yes`,
      );
    }

    if (!args.update || !args.yes) return;

    writeRegistry(candidates.map(pkg => ({ name: pkg.name, dir: pkg.dir })));
    console.log(
      `\nSaved ${candidates.length} package(s) to ${relative(root, REGISTRY_FILE)}`,
    );
    return;
  }

  const registeredDirs = new Set(registry.packages.map(entry => entry.dir));
  const discoveredDirs = new Set(
    (args.all ? discovery.all : discovery.main).map(pkg => pkg.dir),
  );

  const newMain = discovery.main.filter(pkg => !registeredDirs.has(pkg.dir));
  const newAuxiliary = discovery.auxiliary.filter(
    pkg => !registeredDirs.has(pkg.dir),
  );
  const added = args.all ? [...newMain, ...newAuxiliary] : newMain;
  const removed = registry.packages.filter(entry => {
    const exists = existsSync(join(root, entry.dir, 'package.json'));
    return !exists || (args.all ? !discoveredDirs.has(entry.dir) : false);
  });

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          root,
          dominantVersion: discovery.dominantVersion,
          added: added.map(pkg => ({ name: pkg.name, dir: pkg.dir })),
          addedMain: newMain.map(pkg => ({ name: pkg.name, dir: pkg.dir })),
          addedAuxiliary: newAuxiliary.map(pkg => ({
            name: pkg.name,
            dir: pkg.dir,
          })),
          removed,
          upToDate:
            newMain.length === 0 &&
            newAuxiliary.length === 0 &&
            removed.length === 0,
          written: args.update && args.yes,
        },
        null,
        2,
      ),
    );
  } else {
    console.log(
      `Registry: ${relative(root, REGISTRY_FILE)} (${registry.packages.length} package(s))`,
    );

    if (newMain.length) {
      console.log(
        `\nNew exported package(s) in the main version family (${newMain.length}):`,
      );
      printPackages(newMain);
    }

    if (newAuxiliary.length) {
      console.log(
        `\nUnregistered auxiliary package(s) outside the main family (${newAuxiliary.length}) — use --all to register them:`,
      );
      printPackages(newAuxiliary);
    }

    if (removed.length) {
      console.log(
        `\nRegistered package(s) that no longer exist (${removed.length}):`,
      );
      for (const entry of removed)
        console.log(`  ${entry.name ?? entry.dir}  ${entry.dir}`);
    }

    if (!newMain.length && !newAuxiliary.length && !removed.length) {
      console.log('\nRegistry is up to date.');
    }
  }

  if (!args.update) return;

  if (!args.yes) {
    if (added.length || removed.length) {
      console.log('\nNothing saved. Re-run with --update --yes to apply.');
    } else if (newAuxiliary.length) {
      console.log(
        '\nNothing saved. Re-run with --update --yes --all to also register the auxiliary packages.',
      );
    }
    return;
  }

  const merged = new Map(registry.packages.map(entry => [entry.dir, entry]));
  for (const pkg of added) merged.set(pkg.dir, { name: pkg.name, dir: pkg.dir });
  for (const entry of removed) merged.delete(entry.dir);

  const next = [...merged.values()].map(normalizeEntry);
  writeRegistry(next);
  console.log(
    `\nSaved ${next.length} package(s) to ${relative(root, REGISTRY_FILE)}`,
  );
};

main();
