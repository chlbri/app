#!/usr/bin/env node
/**
 * Shared helpers for the `test-libs` skill.
 *
 * No external dependency is used on purpose: the skill must run in any
 * repository, before (or without) installing the workspace.
 */
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);

export const SKILL_DIR = dirname(dirname(SCRIPT_PATH));
export const REGISTRY_FILE = join(SKILL_DIR, 'packages.json');

/** Directory names that are never workspace packages. */
export const IGNORED_SEGMENTS = new Set([
  'node_modules',
  '.git',
  '.hg',
  '.svn',
  '.turbo',
  '.next',
  '.nuxt',
  '.output',
  '.cache',
  '.coverage',
  'coverage',
  'dist',
  'build',
  'out',
  'lib',
  'tmp',
  'temp',
  '.venv',
  'venv',
  '__tests__',
  '__mocks__',
  '__snapshots__',
  'fixtures',
  '__fixtures__',
  'examples',
  'example',
  'demo',
  'docs',
]);

const isIgnored = path =>
  path.split('/').some(segment => IGNORED_SEGMENTS.has(segment));

export const readJson = path => JSON.parse(readFileSync(path, 'utf8'));

const stripQuotes = value => value.replace(/^["']|["']$/g, '').trim();

/**
 * Walk up from `start` until a workspace marker or a git root is found.
 *
 * @param {string} [start] - Directory to start from.
 * @returns {string} Absolute repository root.
 */
export const findRepoRoot = (start = process.cwd()) => {
  let dir = resolve(start);

  while (true) {
    for (const marker of [
      'pnpm-workspace.yaml',
      'pnpm-workspace.yml',
      'lerna.json',
      'rush.json',
    ]) {
      if (existsSync(join(dir, marker))) return dir;
    }

    const packagePath = join(dir, 'package.json');
    if (existsSync(packagePath)) {
      try {
        const pkg = readJson(packagePath);
        if (pkg.workspaces) return dir;
      } catch {
        // Ignore malformed package.json and keep walking up.
      }
    }

    if (existsSync(join(dir, '.git'))) return dir;

    const parent = dirname(dir);
    if (parent === dir) return resolve(start);
    dir = parent;
  }
};

/**
 * Parse the simple `packages:` list of a pnpm workspace file.
 *
 * @param {string} text - File contents.
 * @returns {string[]} Workspace globs.
 */
const parseYamlPackages = text => {
  const globs = [];
  let inPackages = false;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\s+#.*$/, '');
    if (!line.trim()) continue;

    const top = line.match(/^([A-Za-z0-9_.-]+)\s*:\s*(.*)$/);
    if (top) {
      inPackages = top[1] === 'packages';
      if (inPackages) {
        const inline = top[2].trim();
        if (inline.startsWith('[')) {
          inline
            .replace(/^\[|\]$/g, '')
            .split(',')
            .map(stripQuotes)
            .filter(Boolean)
            .forEach(entry => globs.push(entry));
          inPackages = false;
        }
      }
      continue;
    }

    if (!inPackages) continue;

    const item = line.match(/^\s*-\s*(.+)$/);
    if (item) globs.push(stripQuotes(item[1]));
    else if (!/^\s/.test(line)) inPackages = false;
  }

  return globs;
};

/**
 * Read the workspace globs declared by the repository.
 *
 * @param {string} root - Repository root.
 * @returns {string[]} Workspace globs, possibly empty.
 */
export const getWorkspaceGlobs = root => {
  for (const file of ['pnpm-workspace.yaml', 'pnpm-workspace.yml']) {
    const path = join(root, file);
    if (!existsSync(path)) continue;
    const globs = parseYamlPackages(readFileSync(path, 'utf8'));
    if (globs.length) return globs;
  }

  const packagePath = join(root, 'package.json');
  if (existsSync(packagePath)) {
    try {
      const pkg = readJson(packagePath);
      const workspaces = pkg.workspaces;
      if (Array.isArray(workspaces) && workspaces.length) return workspaces;
      if (
        workspaces &&
        Array.isArray(workspaces.packages) &&
        workspaces.packages.length
      ) {
        return workspaces.packages;
      }
    } catch {
      // Fall through to lerna.json.
    }
  }

  const lernaPath = join(root, 'lerna.json');
  if (existsSync(lernaPath)) {
    try {
      const lerna = readJson(lernaPath);
      if (Array.isArray(lerna.packages) && lerna.packages.length)
        return lerna.packages;
    } catch {
      // No usable lerna configuration.
    }
  }

  return [];
};

const escapeRegExp = value => value.replace(/[.+^${}()|[\]\\]/g, '\\$&');

/**
 * Convert a workspace glob to a regular expression matched against a
 * repo-relative directory path (forward slashes).
 *
 * @param {string} glob - Workspace glob such as `packages/*`.
 * @returns {RegExp} Matching expression.
 */
const globToRegExp = glob => {
  const normalized = glob
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/\/+$/, '');
  if (normalized === '' || normalized === '.') return /^\.?$/;

  let pattern = '';

  for (let index = 0; index < normalized.length; index++) {
    const char = normalized[index];

    if (char === '*') {
      if (normalized[index + 1] === '*') {
        index += 1;
        if (normalized[index + 1] === '/') {
          index += 1;
          pattern += '(?:.*/)?';
        } else {
          pattern += '.*';
        }
      } else {
        pattern += '[^/]*';
      }
      continue;
    }

    if (char === '?') {
      pattern += '[^/]';
      continue;
    }

    pattern += escapeRegExp(char);
  }

  return new RegExp(`^${pattern}$`);
};

const walkDirs = (base, output, depth = 0, maxDepth = 8) => {
  if (depth > maxDepth) return;

  let entries;
  try {
    entries = readdirSync(base, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.') || IGNORED_SEGMENTS.has(entry.name)) continue;

    const dir = join(base, entry.name);
    output.push(dir);
    walkDirs(dir, output, depth + 1, maxDepth);
  }
};

const literalPrefix = glob => {
  const parts = glob.replace(/^\.\//, '').split('/');
  const kept = [];

  for (const part of parts) {
    if (/[*?]/.test(part)) break;
    kept.push(part);
  }

  return kept.join('/');
};

/**
 * Expand workspace globs into repo-relative directories.
 *
 * @param {string} root - Repository root.
 * @param {string[]} globs - Workspace globs.
 * @returns {string[]} Repo-relative directory paths.
 */
export const expandGlobs = (root, globs) => {
  const dirs = new Set();

  for (const glob of globs) {
    const regex = globToRegExp(glob);
    const prefix = literalPrefix(glob);
    const base = prefix ? join(root, prefix) : root;

    if (!existsSync(base) || !statSync(base).isDirectory()) continue;

    const candidates = [];

    if (!/[*?]/.test(glob)) {
      candidates.push(base);
    } else {
      if (prefix === '') candidates.push(root);
      walkDirs(base, candidates);
    }

    for (const dir of candidates) {
      const rel = relative(root, dir).split(sep).join('/') || '.';
      if (regex.test(rel)) dirs.add(rel);
    }
  }

  return [...dirs];
};

const hasEntryPoint = pkg =>
  pkg.exports !== undefined ||
  typeof pkg.main === 'string' ||
  typeof pkg.module === 'string' ||
  pkg.bin !== undefined;

const infoFrom = (root, dir, pkg) => ({
  name: pkg.name,
  dir,
  version: typeof pkg.version === 'string' ? pkg.version : null,
  private: pkg.private === true,
  hasExports: pkg.exports !== undefined,
  dependencies: pkg.dependencies ?? {},
  optionalDependencies: pkg.optionalDependencies ?? {},
  peerDependencies: pkg.peerDependencies ?? {},
  peerDependenciesMeta: pkg.peerDependenciesMeta ?? {},
  bundledDependencies: [
    ...(pkg.bundledDependencies ?? []),
    ...(pkg.bundleDependencies ?? []),
  ],
  bin: pkg.bin ?? null,
  raw: pkg,
});

/**
 * Discover workspace packages.
 *
 * `all` contains every publishable package (no `private: true` and at least one
 * entry point). `main` is the dominant version family, which is what the skill
 * registers by default so that independently versioned helper packages are not
 * pulled in unless requested. `workspace` contains every named package,
 * including private ones, and is used to resolve internal dependencies.
 *
 * @param {string} root - Repository root.
 * @returns {{
 *   root: string,
 *   globs: string[],
 *   all: object[],
 *   main: object[],
 *   auxiliary: object[],
 *   dominantVersion: string | null,
 *   workspace: object[],
 * }} Discovery result.
 */
export const discover = root => {
  const globs = getWorkspaceGlobs(root);
  let dirs;

  if (globs.length) {
    dirs = expandGlobs(root, globs);
  } else {
    const found = [];
    walkDirs(root, found);
    dirs = ['.', ...found.map(dir => relative(root, dir).split(sep).join('/'))];
  }

  const workspace = [];
  const seen = new Set();

  for (const dir of dirs) {
    const absolute = join(root, dir);
    const packagePath = join(absolute, 'package.json');
    if (!existsSync(packagePath)) continue;

    let pkg;
    try {
      pkg = readJson(packagePath);
    } catch {
      continue;
    }

    if (!pkg || typeof pkg.name !== 'string' || !pkg.name) continue;

    const rel = relative(root, absolute).split(sep).join('/') || '.';
    if (isIgnored(rel) || seen.has(rel)) continue;
    seen.add(rel);

    workspace.push(infoFrom(root, rel, pkg));
  }

  workspace.sort((left, right) => left.dir.localeCompare(right.dir));

  const all = workspace.filter(pkg => !pkg.private && hasEntryPoint(pkg.raw));

  const counts = new Map();
  for (const pkg of all) {
    const version = pkg.version ?? 'unknown';
    counts.set(version, (counts.get(version) ?? 0) + 1);
  }

  let dominantVersion = null;
  let max = -1;
  for (const [version, count] of counts) {
    if (count > max) {
      max = count;
      dominantVersion = version;
    }
  }

  const main = all.filter(pkg => (pkg.version ?? 'unknown') === dominantVersion);
  const auxiliary = all.filter(
    pkg => (pkg.version ?? 'unknown') !== dominantVersion,
  );

  return { root, globs, all, main, auxiliary, dominantVersion, workspace };
};

const IMPORT_CONDITIONS = ['import', 'node', 'default'];
const REQUIRE_CONDITIONS = ['require', 'node', 'default'];
const TYPE_CONDITIONS = ['types'];

const findTarget = (value, conditions) => {
  if (typeof value === 'string') return value;

  if (Array.isArray(value)) {
    for (const item of value) {
      const target = findTarget(item, conditions);
      if (target) return target;
    }
    return null;
  }

  if (!value || typeof value !== 'object') return null;

  for (const condition of conditions) {
    if (Object.prototype.hasOwnProperty.call(value, condition)) {
      const target = findTarget(value[condition], conditions);
      if (target) return target;
    }
  }

  return null;
};

/**
 * Normalize the `exports` field into runtime/type-only entries.
 *
 * @param {unknown} exportsField - Raw `exports` value.
 * @param {{ main?: string, module?: string }} [fallback] - Legacy entry points.
 * @returns {Array<{
 *   subpath: string,
 *   importTarget: string | null,
 *   requireTarget: string | null,
 *   typeTarget: string | null,
 *   hasImport: boolean,
 *   hasRequire: boolean,
 *   typeOnly: boolean,
 * }>} Export entries.
 */
export const exportEntries = (exportsField, fallback = {}) => {
  if (exportsField === undefined || exportsField === null) {
    const importTarget = fallback.module ?? fallback.main ?? null;
    const requireTarget = fallback.main ?? null;

    return [
      {
        subpath: '.',
        importTarget,
        requireTarget,
        typeTarget: null,
        hasImport: typeof importTarget === 'string',
        hasRequire: typeof requireTarget === 'string',
        typeOnly:
          typeof importTarget !== 'string' && typeof requireTarget !== 'string',
      },
    ];
  }

  let map;

  if (typeof exportsField === 'string' || Array.isArray(exportsField)) {
    map = { '.': exportsField };
  } else {
    const keys = Object.keys(exportsField);
    const subpathStyle = keys.some(key => key === '.' || key.startsWith('./'));
    map = subpathStyle ? exportsField : { '.': exportsField };
  }

  return Object.entries(map).map(([subpath, value]) => {
    const importTarget = findTarget(value, IMPORT_CONDITIONS);
    const requireTarget = findTarget(value, REQUIRE_CONDITIONS);
    const typeTarget = findTarget(value, TYPE_CONDITIONS);
    const typeOnly = !importTarget && !requireTarget;

    return {
      subpath,
      importTarget,
      requireTarget,
      typeTarget,
      hasImport: Boolean(importTarget),
      hasRequire: Boolean(requireTarget),
      typeOnly,
    };
  });
};

/**
 * Build the import specifier for an export subpath.
 *
 * @param {string} name - Package name.
 * @param {string} subpath - Export subpath (`.` or `./foo`).
 * @returns {string} Import specifier.
 */
export const exportSpec = (name, subpath) =>
  subpath === '.' || subpath === '' ? name : `${name}${subpath.slice(1)}`;

/**
 * Filesystem-safe slug for a package name or directory.
 *
 * @param {string} value - Package name or path.
 * @returns {string} Slug.
 */
export const slug = value =>
  value
    .replace(/^@/, '')
    .replace(/[\\/]+/g, '-')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Read the registry (`packages.json`), tolerating the legacy string form.
 *
 * @returns {null | { buildCommand: string | null, packages: Array<{ name?: string, dir: string }> }}
 */
export const readRegistry = () => {
  if (!existsSync(REGISTRY_FILE)) return null;

  let data;
  try {
    data = readJson(REGISTRY_FILE);
  } catch {
    return null;
  }

  const list = Array.isArray(data) ? data : data.packages;
  if (!Array.isArray(list)) return null;

  return {
    buildCommand: typeof data.buildCommand === 'string' ? data.buildCommand : null,
    packages: list
      .map(entry =>
        typeof entry === 'string'
          ? { dir: entry }
          : { name: entry.name, dir: entry.dir },
      )
      .filter(entry => typeof entry.dir === 'string' && entry.dir.length > 0),
  };
};

/**
 * Write the registry, preserving unknown fields already present.
 *
 * @param {Array<{ name?: string, dir: string }>} packages - Packages to register.
 * @param {Record<string, unknown>} [extras] - Extra top-level fields.
 */
export const writeRegistry = (packages, extras = {}) => {
  const current = existsSync(REGISTRY_FILE) ? readJson(REGISTRY_FILE) : {};
  const sorted = [...packages]
    .sort((left, right) => left.dir.localeCompare(right.dir))
    .map(entry => ({ name: entry.name, dir: entry.dir }));
  const content = { ...current, ...extras, packages: sorted };

  writeFileSync(REGISTRY_FILE, `${JSON.stringify(content, null, 2)}\n`);
};
