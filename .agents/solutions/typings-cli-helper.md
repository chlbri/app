# Solution: CLI Helper for Machine Typings — v2 (parseTree + ts-morph)

## Problem

`createMachine` currently relies heavily on the TypeScript language server
to infer complex generic types at authoring time. The deep nesting of
conditional types (`TransformPrimitiveObject`, `TransformConfigDef`,
`NoExtraKeysConfig`, `FlatMapN`, etc.) causes the TS server to slow down
significantly on larger machines.

Additionally, the existing `app.gen.ts` generation uses the opaque
`MachineEntry<Events, Children, Emitters, PContext, Tags>` helper type —
which leaves `options.actions`, `options.guards`, and `options.delays`
typed as the loose `string`. This means the compiler cannot constrain those
identifiers at call-sites.

**Goals of this rewrite**:

1. Offload ALL type computation to a CLI tool.
2. Eliminate `MachineEntry<>` from generated files — emit **fully inlined
   raw types** so every string literal union is explicit.
3. Use `parseTree` (the library's own runtime function) as the single
   source of truth for extracting all symbol sets from a config.
4. Use `ts-morph` for proper TypeScript AST extraction instead of fragile
   regex heuristics.
5. CLI built on `cmd-ts` + `chokidar`, following the same patterns used in
   `@bemedev/codebase` and `@bemedev/core`.

---

## What Changes vs. the Previous Plan

| Aspect                  | Old plan                                 | New plan (this doc)                       |
| ----------------------- | ---------------------------------------- | ----------------------------------------- |
| Config extraction       | Regex bracket-matching                   | `ts-morph` AST static evaluation          |
| Symbol extraction       | Custom tree walker (`parseStateTree`)    | `parseTree()` from the library itself     |
| Helper type in gen file | `MachineEntry<E, C, Em, Pc, Ta>`         | **No helper — raw inline type**           |
| `options.actions`       | `string` (untyped)                       | `'action1' \| 'action2'` (literal union)  |
| `options.guards`        | `string` (untyped)                       | `'guard1' \| 'guard2'` (literal union)    |
| `options.delays`        | `string` (untyped)                       | `'delay1'` (literal union)                |
| `paths.map`             | Reconstructed with `__targets` heuristic | Serialized from `parseTree` runtime value |
| `paths.all`             | Array of strings                         | String literal union type                 |
| `pContext`              | `any`                                    | Inline object type from `typings` arg     |

---

## Tool Stack

| Tool        | Role                                                         |
| ----------- | ------------------------------------------------------------ |
| `cmd-ts`    | CLI command definitions (`generate`, `watch`)                |
| `chokidar`  | File system watching for `*.machine.ts` / `*.fsm.ts`         |
| `ts-morph`  | TypeScript AST parsing — config extraction + typings parsing |
| `parseTree` | Runtime analysis of `NodeConfig` → all symbol sets           |
| `glob`      | Initial file discovery                                       |

---

## Architecture Overview

```
User writes *.machine.ts / *.fsm.ts
          │
          ▼
  ┌──────────────────────────────────────────┐
  │   PHASE 1 — ts-morph AST Extraction      │
  │                                          │
  │  • Find createMachine(name, cfg, typ?)   │
  │  • Extract name  → string literal        │
  │  • Evaluate cfg  → NodeConfig object     │
  │  • Extract typ   → pContext type string  │
  └───────────────────┬──────────────────────┘
                      │
                      ▼
  ┌──────────────────────────────────────────┐
  │   PHASE 2 — parseTree Runtime Analysis   │
  │                                          │
  │  parseTree(config) → {                   │
  │    paths.map, paths.all,                 │
  │    events, actions, guards, delays,      │
  │    emitters, children, tags,             │
  │    pContextKeys                          │
  │  }                                       │
  └───────────────────┬──────────────────────┘
                      │
                      ▼
  ┌──────────────────────────────────────────┐
  │   PHASE 3 — Raw Type Serialization       │
  │                                          │
  │  BetterSet<string> → 'a' | 'b' | never   │
  │  string[]          → '/' | '/idle'       │
  │  ConfigPaths       → inline type literal │
  │  pContextShape     → { data: string }    │
  └───────────────────┬──────────────────────┘
                      │
                      ▼
  ┌──────────────────────────────────────────┐
  │   PHASE 4 — app.gen.ts Emission          │
  │                                          │
  │  declare module '...' {                  │
  │    interface Register {                  │
  │      'path': { /* raw inline type */ }   │
  │    }                                     │
  │  }                                       │
  └──────────────────────────────────────────┘
          │                      │
          ▼                      ▼
   cmd-ts generate          cmd-ts watch
   (one-shot)           (chokidar watcher)
```

**Single output file**: `app.gen.ts` at the project root (or at `rootDir`
from `tsconfig.json` if present). No per-machine `*.gen.ts` files.

---

## File Convention

**Convention**: `*.fsm.ts` or `*.machine.ts`, one
`export default createMachine(...)` per file.

```ts
// src/__tests__/interpreters/tags/tags.machine.ts
import { createMachine } from '#machine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/tags/tags.machine',
  {
    initial: 'idle',
    states: {
      idle: { tags: ['idle'], on: { NEXT: '/working' } },
      working: {
        tags: ['working', 'busy'],
        on: { NEXT: '/final', PREV: '/idle' },
      },
      final: {},
    },
  },
  { eventsMap: type({ NEXT: 'never', PREV: 'never' }) },
);
```

Rules:

- **Arg 1**: string literal — the machine's register key (relative path, no
  extension).
- **Arg 2**: the config `NodeConfig` object literal. Must be statically
  evaluable by ts-morph (pure object literal or locally-resolvable
  `const`).
- **Arg 3** (optional): typings object — used **only** to extract
  `pContext` and `context` type shapes. Event and actor symbol keys are
  extracted from the config itself via `parseTree` and need not be repeated
  here.

---

## Phase 1 — ts-morph AST Extraction

### 1.1 Open the Project

```ts
import { Project } from 'ts-morph';

const project = new Project({
  tsConfigFilePath: resolve(cwd, 'tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});
```

A single `Project` instance is created once per `generateAppGen` call and
shared across all source files. This avoids parsing `tsconfig.json` once
per file and reuses the type checker.

### 1.2 Locate the `createMachine` Call

For each `*.machine.ts` / `*.fsm.ts` file, add the source file to ts-morph
and navigate to the `export default createMachine(...)` call expression:

```
SourceFile
  └─ ExportAssignment  (export default ...)
       └─ CallExpression   (callee identifier === 'createMachine')
            ├─ Arg [0]  StringLiteral              → machine name / register key
            ├─ Arg [1]  ObjectLiteralExpression    → config
            └─ Arg [2]  ObjectLiteralExpression    → typings (optional)
```

### 1.3 Evaluate the Config AST → `NodeConfig`

The config argument is an `ObjectLiteralExpression`. ts-morph is used to
**statically evaluate** it into a plain JavaScript `NodeConfig` object:

- `StringLiteral` / `NumericLiteral` → plain value.
- `ArrayLiteralExpression` → array (elements evaluated recursively).
- `ObjectLiteralExpression` → plain object (properties evaluated
  recursively).
- `Identifier` or `PropertyAccessExpression` → resolve the binding via
  ts-morph's symbol API, then evaluate.
- Anything non-resolvable (function calls, imports from external packages,
  spread operators) → **skip the file with a warning**.

> **Why not `eval()` / dynamic `import()`?** Importing the file at CLI time
> would require a runtime environment matching the project's module aliases
> (`#machine`, `#states`, etc.) and could execute side effects. Static AST
> evaluation via ts-morph is hermetic, alias-independent, and safe.

### 1.4 Extract `pContext` Type from the Typings Arg

The optional third argument may contain a `pContext` field built with the
`@bemedev/typings` `type()` helper:

```ts
{
  pContext: type({ data: 'string', count: 'number' });
}
```

ts-morph is used to find the `pContext` property inside the typings
`ObjectLiteralExpression`, then:

1. If the value is a `CallExpression` to `type(...)`, extract its first
   argument and recursively convert primitive type strings to TS notation:
   `'string'` → `string`, `'number'` → `number`, `'boolean'` → `boolean`,
   `'never'` → `never`, nested objects → recurse.
2. If absent or `undefined` → emit `undefined`.

This produces an inline type string such as
`{ data: string; count: number }`.

---

## Phase 2 — `parseTree` Runtime Analysis

Once Phase 1 produces a plain `NodeConfig` object, the CLI calls the
library's own `parseTree` function directly:

```ts
import { parseTree } from '../../utils/parseTree';

const tree = parseTree(config); // NodeConfig → Output
```

`tree` contains every symbol set needed to populate a `Register` entry:

| `tree` field   | Type                          | Maps to `Register` field           |
| -------------- | ----------------------------- | ---------------------------------- |
| `paths.all`    | `string[]`                    | `paths.all` → string literal union |
| `paths.map`    | `NoExtraKeysConfigPaths<...>` | `paths.map` → inline type literal  |
| `events`       | `BetterSet<string>`           | `events` → string literal union    |
| `actions`      | `BetterSet<string>`           | `options.actions` → literal union  |
| `guards`       | `BetterSet<string>`           | `options.guards` → literal union   |
| `delays`       | `BetterSet<string>`           | `options.delays` → literal union   |
| `emitters`     | `BetterSet<string>`           | `options.emitters` → literal union |
| `children`     | `BetterSet<string>`           | `options.children` → literal union |
| `tags`         | `BetterSet<string>`           | `options.tags` + `tags?` → union   |
| `pContextKeys` | `BetterSet<string>`           | informational (for pContext type)  |

`parseTree` traverses the entire nested state tree recursively, so the CLI
contains **no custom tree walker**. Symbol extraction is 100% delegated.

---

## Phase 3 — Raw Type Serialization

### 3.1 `BetterSet<string>` → string literal union

```ts
function setToUnion(set: BetterSet<string>): string {
  const values = [...set];
  if (values.length === 0) return 'never';
  return values.map(v => `'${v}'`).join(' | ');
}
// {'NEXT', 'PREV'} → "'NEXT' | 'PREV'"
// {}               → "never"
```

### 3.2 `string[]` (paths.all) → string literal union

```ts
function pathsToUnion(paths: string[]): string {
  if (paths.length === 0) return 'never';
  return paths.map(p => `'${p}'`).join(' | ');
}
// ['/', '/idle', '/working'] → "'/' | '/idle' | '/working'"
```

### 3.3 `ConfigPaths` (paths.map) → inline type object

`parseTree`'s `paths.map` is a runtime `ConfigPaths` value:

```ts
type ConfigPaths = {
  targets: string[];
  initial?: string;
  states?: Record<string, ConfigPaths>;
};
```

Serialization recurses over the runtime value and emits an inline
TypeScript type literal:

```ts
function configPathsToType(cp: ConfigPaths, indent = 0): string {
  const pad = ' '.repeat(indent);
  const targets = cp.targets.map(t => `'${t}'`).join(' | ') || 'never';
  const lines: string[] = [`{ targets: (${targets})[];`];

  if (cp.initial) {
    const childNames = Object.keys(cp.states ?? {})
      .map(k => `'${k}'`)
      .join(' | ');
    lines.push(`${pad}  initial?: ${childNames};`);
  }

  if (cp.states && Object.keys(cp.states).length > 0) {
    const stateLines = Object.entries(cp.states).map(
      ([k, v]) => `${pad}  '${k}': ${configPathsToType(v, indent + 2)};`,
    );
    lines.push(`${pad}  states?: {`, ...stateLines, `${pad}  };`);
  }

  lines.push(`${pad}}`);
  return lines.join('\n' + pad);
}
```

### 3.4 `pContext` type string

The type string produced in Phase 1.4 is used verbatim. If absent, emit
`undefined`.

---

## Phase 4 — Raw Inline Type Emission (No `MachineEntry`)

Each machine produces one raw inline type block. No helper type
(`MachineEntry`, `MachineTypeDef`, etc.) is imported or referenced in the
generated file. Every field is an explicit literal union.

### Target shape per Register entry

```ts
'<machine-name>': {
  paths: {
    map: <configPathsToType(tree.paths.map)>;
    all: <pathsToUnion(tree.paths.all)>;
  };
  events: <setToUnion(tree.events)>;
  options: {
    children: <setToUnion(tree.children)>;
    emitters: <setToUnion(tree.emitters)>;
    tags:     <setToUnion(tree.tags)>;
    actions:  <setToUnion(tree.actions)>;
    delays:   <setToUnion(tree.delays)>;
    guards:   <setToUnion(tree.guards)>;
  };
  pContext?: <pContextType>;
  tags?: <setToUnion(tree.tags)>;
};
```

### Full example — tags machine

Given:

```ts
export default createMachine(
  'src/__tests__/interpreters/tags/tags.machine',
  {
    initial: 'idle',
    states: {
      idle: { tags: ['idle'], on: { NEXT: '/working' } },
      working: {
        tags: ['working', 'busy'],
        on: { NEXT: '/final', PREV: '/idle' },
      },
      final: {},
    },
  },
  { eventsMap: type({ NEXT: 'never', PREV: 'never' }) },
);
```

`parseTree` returns:

- `paths.all` = `['/', '/idle', '/working', '/final']`
- `events` = `{'NEXT', 'PREV'}`, `actions` = `{}`, `guards` = `{}`
- `delays` = `{}`, `emitters` = `{}`, `children` = `{}`
- `tags` = `{'idle', 'working', 'busy'}`

Generated Register entry (no helper, no import needed):

```ts
'src/__tests__/interpreters/tags/tags.machine': {
  paths: {
    map: {
      targets: ('/' | '/idle' | '/working' | '/final')[];
      initial?: 'idle' | 'working' | 'final';
      states?: {
        '/idle':    { targets: ('/' | '/working' | '/final')[] };
        '/working': { targets: ('/' | '/idle'    | '/final')[] };
        '/final':   { targets: ('/' | '/idle'    | '/working')[] };
      };
    };
    all: '/' | '/idle' | '/working' | '/final';
  };
  events: 'NEXT' | 'PREV';
  options: {
    children: never;
    emitters: never;
    tags:     'idle' | 'working' | 'busy';
    actions:  never;
    delays:   never;
    guards:   never;
  };
  pContext?: undefined;
  tags?: 'idle' | 'working' | 'busy';
};
```

### Full example — complex machine with actions / guards / delays / pContext

Given:

```ts
export default createMachine(
  'src/__tests__/interpreters/complex/machine1.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: { START: { target: '/checking', actions: 'provideAsset' } },
      },
      checking: {
        after: {
          CHECK_DELAY: { target: '/working', guards: 'assetIsDefined' },
        },
        on: { RESET: '/idle' },
      },
      working: {
        initial: 'idle',
        entry: 'addIntermediary',
        states: {
          idle: {
            on: {
              ADD_INTERMEDIARY: {
                target: '/working/adding',
                guards: 'intermediariesAreNotFull',
              },
            },
          },
          adding: { on: { RESET: '/idle' } },
        },
      },
    },
  },
  {
    pContext: type({ asset: { id: 'string', value: 'number' } }),
    eventsMap: type({
      START: 'never',
      ADD_INTERMEDIARY: 'never',
      RESET: 'never',
    }),
  },
);
```

Generated Register entry:

```ts
'src/__tests__/interpreters/complex/machine1.machine': {
  paths: {
    map: {
      targets: (
        | '/'
        | '/idle'
        | '/checking'
        | '/working'
        | '/working/idle'
        | '/working/adding'
      )[];
      initial?: 'idle' | 'checking' | 'working';
      states?: {
        '/idle': {
          targets: ('/' | '/checking' | '/working' | '/working/idle' | '/working/adding')[];
        };
        '/checking': {
          targets: ('/' | '/idle' | '/working' | '/working/idle' | '/working/adding')[];
        };
        '/working': {
          targets: ('/' | '/idle' | '/checking')[];
          initial?: 'idle' | 'adding';
          states?: {
            '/working/idle': {
              targets: ('/' | '/idle' | '/checking' | '/working' | '/working/adding')[];
            };
            '/working/adding': {
              targets: ('/' | '/idle' | '/checking' | '/working' | '/working/idle')[];
            };
          };
        };
      };
    };
    all:
      | '/'
      | '/idle'
      | '/checking'
      | '/working'
      | '/working/idle'
      | '/working/adding';
  };
  events: 'START' | 'ADD_INTERMEDIARY' | 'RESET';
  options: {
    children: never;
    emitters: never;
    tags:    never;
    actions: 'provideAsset' | 'addIntermediary';
    delays:  'CHECK_DELAY';
    guards:  'assetIsDefined' | 'intermediariesAreNotFull';
  };
  pContext?: { asset: { id: string; value: number } };
  tags?: never;
};
```

---

## Generated `app.gen.ts` File Structure

```ts
/**
 * This file is auto-generated by the @bemedev/app CLI.
 * Do not edit manually. Re-run `app-ts generate` or restart `app-ts watch`.
 *
 * Regenerated: 2026-04-23T10:00:00.000Z
 */

declare module '@bemedev/app' {
  interface Register {
    // ── actions ──────────────────────────────────────────────────────────
    'src/__tests__/actions/actions.1.machine': {
      paths: {
        map: {
          targets: ('/' | '/idle' | '/working')[];
          initial?: 'idle' | 'working';
          states?: {
            '/idle': { targets: ('/' | '/working')[] };
            '/working': { targets: ('/' | '/idle')[] };
          };
        };
        all: '/' | '/idle' | '/working';
      };
      events: 'NEXT';
      options: {
        children: never;
        emitters: never;
        tags: never;
        actions: never;
        delays: never;
        guards: never;
      };
      pContext?: undefined;
      tags?: never;
    };

    // ... one entry per *.machine.ts / *.fsm.ts (sorted alphabetically)
  }
}

export {};
```

Key rules:

- **No imports** — the generated file has zero `import` statements. All
  types are inline. No `MachineEntry`, no `type`, no `@bemedev/typings`.
- One `declare module` block targeting the correct module specifier
  (`'@bemedev/app'` for a project-level gen file; `'../index'` for a
  test-scoped gen file like `src/__tests__/app.gen.ts`).
- Entries sorted **alphabetically** by machine name for deterministic
  diffs.
- A **timestamp comment** at the top makes stale gen files easy to spot.

---

## CLI Command Design (`cmd-ts`)

### Package entry: `src/cli/index.ts`

```ts
import { run, subcommands } from 'cmd-ts';
import { generateCmd } from './commands/generate';
import { watchCmd } from './commands/watch';

const app = subcommands({
  name: 'app-ts',
  cmds: { generate: generateCmd, watch: watchCmd },
});

run(app, process.argv.slice(2));
```

### `generate` command

```ts
import { command, option, optional, string, flag } from 'cmd-ts';
import { generateAppGen } from '../core/generator';

export const generateCmd = command({
  name: 'generate',
  description: 'Scan all *.machine.ts / *.fsm.ts and emit app.gen.ts',
  args: {
    output: option({
      type: optional(string),
      long: 'output',
      short: 'o',
      description: 'Output file path (default: app.gen.ts)',
    }),
    cwd: option({
      type: optional(string),
      long: 'cwd',
      description: 'Working directory (default: process.cwd())',
    }),
    dryRun: flag({
      long: 'dry-run',
      description: 'Print output without writing to disk',
    }),
    excludes: option({
      type: optional(string),
      long: 'exclude',
      description: 'Comma-separated glob patterns to exclude',
    }),
  },
  handler: async ({ output, cwd, dryRun, excludes }) => {
    await generateAppGen({
      output,
      cwd,
      dryRun,
      excludes: excludes?.split(','),
    });
  },
});
```

### `watch` command

```ts
import { command, option, optional, string } from 'cmd-ts';
import { watchMachines } from '../core/watcher';

export const watchCmd = command({
  name: 'watch',
  description:
    'Watch *.machine.ts / *.fsm.ts and regenerate app.gen.ts on change',
  args: {
    output: option({ type: optional(string), long: 'output', short: 'o' }),
    cwd: option({ type: optional(string), long: 'cwd' }),
  },
  handler: async ({ output, cwd }) => {
    await watchMachines({ output, cwd });
  },
});
```

---

## Watch Mode (`chokidar`)

`src/cli/core/watcher.ts`:

```ts
import chokidar from 'chokidar';
import { resolve } from 'node:path';
import { generateAppGen } from './generator';

export async function watchMachines(options: {
  output?: string;
  cwd?: string;
}): Promise<void> {
  const cwd = resolve(options.cwd ?? process.cwd());

  // Full generation before entering the watch loop
  await generateAppGen({ ...options, cwd });

  const watcher = chokidar.watch(['**/*.machine.ts', '**/*.fsm.ts'], {
    cwd,
    ignored: [
      '**/node_modules/**',
      '**/dist/**',
      '**/lib/**',
      options.output ?? 'app.gen.ts',
    ],
    persistent: true,
    ignoreInitial: true,
  });

  // Debounce: batch rapid changes (e.g. git checkout, bulk save)
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  const regenerate = (event: string, filePath: string) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      console.log(`[app-ts] ${event}: ${filePath} — regenerating…`);
      try {
        await generateAppGen({ ...options, cwd });
        console.log('[app-ts] app.gen.ts updated.');
      } catch (err) {
        console.error('[app-ts] Generation failed:', err);
      }
    }, 150);
  };

  watcher
    .on('add', p => regenerate('add', p))
    .on('change', p => regenerate('change', p))
    .on('unlink', p => regenerate('unlink', p));

  console.log('[app-ts] Watching for machine file changes…');
  await new Promise(() => {}); // keep process alive
}
```

---

## Core Generator (`src/cli/core/generator.ts`)

Skeleton — no custom tree walker, no regex config parser:

```ts
import { glob } from 'glob';
import { writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { Project } from 'ts-morph';
import { parseTree } from '../../utils/parseTree';
import type { NodeConfig } from '#states';
import type { ConfigPaths } from '../../utils/parseTree.types';

// ── PHASE 1: ts-morph extraction ──────────────────────────────────────

/**
 * For a given source file use ts-morph to:
 *  1. Find createMachine(name, config, typings?) call.
 *  2. Statically evaluate the config ObjectLiteralExpression → NodeConfig.
 *  3. Extract the pContext inline type string from the typings arg.
 *
 * Returns null if no recognisable createMachine call is found,
 * or if the config is not statically evaluable.
 */
function extractMachineInfo(
  sourceFilePath: string,
  project: Project,
): { name: string; config: NodeConfig; pContextType: string } | null {
  /* ... */
}

/**
 * Recursively convert an ObjectLiteralExpression into a plain JS object.
 * Resolves const identifier bindings via ts-morph symbol resolution.
 * Returns null if any part is not statically evaluable.
 */
function evaluateObjectLiteral(node: any, sourceFile: any): any | null {
  /* ... */
}

/**
 * Convert the `pContext` property inside the typings argument into an
 * inline TypeScript type string, handling the @bemedev/typings `type()`
 * pattern: 'string' → string, 'number' → number, nested objects → recurse.
 * Returns 'undefined' if the field is absent.
 */
function extractPContextType(typingsNode: any): string {
  /* ... */
}

// ── PHASE 2: parseTree delegation ─────────────────────────────────────
//  No custom walker. parseTree covers all symbol extraction.

// ── PHASE 3: serialization helpers ────────────────────────────────────

function setToUnion(set: { values(): Iterable<string> }): string {
  /* ... */
}
function pathsToUnion(paths: string[]): string {
  /* ... */
}
function configPathsToType(cp: ConfigPaths, indent?: number): string {
  /* ... */
}

// ── PHASE 4: per-machine entry emitter ────────────────────────────────

function emitRegisterEntry(
  name: string,
  tree: ReturnType<typeof parseTree>,
  pContextType: string,
): string {
  return [
    `    '${name}': {`,
    `      paths: {`,
    `        map: ${configPathsToType(tree.paths.map, 8)};`,
    `        all: ${pathsToUnion(tree.paths.all)};`,
    `      };`,
    `      events: ${setToUnion(tree.events)};`,
    `      options: {`,
    `        children: ${setToUnion(tree.children)};`,
    `        emitters: ${setToUnion(tree.emitters)};`,
    `        tags:     ${setToUnion(tree.tags)};`,
    `        actions:  ${setToUnion(tree.actions)};`,
    `        delays:   ${setToUnion(tree.delays)};`,
    `        guards:   ${setToUnion(tree.guards)};`,
    `      };`,
    `      pContext?: ${pContextType};`,
    `      tags?: ${setToUnion(tree.tags)};`,
    `    };`,
  ].join('\n');
}

// ── Public API ────────────────────────────────────────────────────────

export async function generateAppGen(options: {
  output?: string;
  excludes?: string[];
  cwd?: string;
  dryRun?: boolean;
}): Promise<void> {
  const cwd = resolve(options.cwd ?? process.cwd());
  const outputPath = resolve(cwd, options.output ?? 'app.gen.ts');

  const files = await glob('**/*.{machine,fsm}.ts', {
    cwd,
    ignore: [
      ...(options.excludes ?? []),
      '**/node_modules/**',
      '**/dist/**',
      '**/lib/**',
    ],
    absolute: true,
  });

  // Single Project instance for all files (one parse pass)
  const project = new Project({
    tsConfigFilePath: resolve(cwd, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  });
  for (const f of files) project.addSourceFileAtPath(f);

  const entries: string[] = [];
  for (const f of files.sort()) {
    const info = extractMachineInfo(f, project);
    if (!info) {
      console.warn(
        `[app-ts] Skipping (not statically evaluable): ${relative(cwd, f)}`,
      );
      continue;
    }
    const tree = parseTree(info.config);
    entries.push(emitRegisterEntry(info.name, tree, info.pContextType));
  }

  const content = [
    `/**`,
    ` * Auto-generated by @bemedev/app CLI. Do not edit manually.`,
    ` * Regenerated: ${new Date().toISOString()}`,
    ` */`,
    ``,
    `declare module '@bemedev/app' {`,
    `  interface Register {`,
    ``,
    entries.join('\n\n'),
    ``,
    `  }`,
    `}`,
    ``,
    `export {};`,
    ``,
  ].join('\n');

  if (options.dryRun) {
    process.stdout.write(content);
  } else {
    writeFileSync(outputPath, content, 'utf-8');
    console.log(
      `[app-ts] Written: ${relative(cwd, outputPath)} (${entries.length} machines)`,
    );
  }
}
```

---

## `parseTree` as the Authoritative Source

### Why `parseTree` and not a custom walker

The previous `generator.ts` (v1) re-implemented tree traversal with a
private `parseStateTree`, `extractActionsFromNode`, `collectActionKeys`,
etc. set of helpers. These duplicated logic that already lives — and is
already tested — inside `parseTree`.

With v2:

- `parseTree` is the **single, tested** source of truth for symbol
  extraction.
- Any future change to how the library interprets configs (new `always`
  handling, new actor emitter types, new `pContextKeys` semantics) is
  automatically reflected in the generated file on the next save.
- The CLI carries **zero knowledge** of the internal config schema — it
  calls `parseTree` and serializes what comes back.

### What `parseTree` gives us (and what it does not)

`parseTree` operates on the **runtime `NodeConfig` object** and extracts
symbol **keys** — the string identifiers that appear as action names, guard
names, delay names, event names, emitter keys, child keys, and tag names.

It does **not** extract:

- TypeScript payload types for each event (shape of `eventsMap`).
- TypeScript type shape of `pContext`.
- TypeScript type shape of `context`.

These come from the `typings` argument (Phase 1.4). For the current
`Register` shape, only `pContext` requires type extraction from the typings
arg. All string literal unions come purely from `parseTree`.

---

## Register Shape Alignment

The `Register` interface in `src/registry.ts` defines what each entry must
satisfy. Each generated inline type is built to exactly match that shape:

```ts
// From src/registry.ts
{
  paths: {
    map: NoExtraKeysConfigDef<ConfigDef>;  // ← configPathsToType(tree.paths.map)
    all: string;                           // ← pathsToUnion(tree.paths.all)
  };
  events: string;                          // ← setToUnion(tree.events)
  options: {
    children: string;                      // ← setToUnion(tree.children)
    emitters: string;                      // ← setToUnion(tree.emitters)
    tags:     string;                      // ← setToUnion(tree.tags)
    actions:  string;  // ★ NOW SPECIFIC   // ← setToUnion(tree.actions)
    delays:   string;  // ★ NOW SPECIFIC   // ← setToUnion(tree.delays)
    guards:   string;  // ★ NOW SPECIFIC   // ← setToUnion(tree.guards)
  };
  pContext?: any;                          // ← extractPContextType(typings)
  tags?: string;                           // ← setToUnion(tree.tags)
}
```

The key improvement over `MachineEntry<>` is that **`options.actions`,
`options.delays`, and `options.guards` become exact string literal unions**
instead of the loose `string`. This allows the machine's `addOptions` and
related APIs to reject unknown identifiers at compile time.

---

## Edge Cases and Constraints

### Dynamically computed configs

If the config argument contains expressions that ts-morph cannot resolve
statically (spread `...baseConfig`, function calls, variables imported from
external packages), the file is **skipped with a warning**. Machine configs
must be pure object literals or reference only locally-resolvable `const`
bindings.

### Multiple machines per file

Not supported. Convention: one `export default createMachine(...)` per
`*.machine.ts` / `*.fsm.ts` file. If multiple call expressions are found,
the CLI uses the first `export default` call and warns about the rest.

### Missing `name` arg (legacy 2-arg form)

If `createMachine(config, typings?)` is detected (no name string as first
argument), the file is skipped. The 3-arg form is required for CLI-driven
generation.

### `never` vs absent union

An empty `BetterSet` serializes to `never`. This is intentional:
`options.actions: never` is a stronger signal than
`options.actions: string` — it tells the compiler this machine truly
defines no user-facing action keys.

---

## Summary of Removed Artifacts

After this plan is implemented, the following are **deleted or
superseded**:

| Artifact                              | Reason                                       |
| ------------------------------------- | -------------------------------------------- |
| `MachineEntry<>` type                 | Replaced by raw inline types in the gen file |
| Custom `parseStateTree()` in CLI      | Replaced by `parseTree()` from the library   |
| `extractActionsFromNode()` in CLI     | `tree.actions` from `parseTree` covers this  |
| `extractGuardsFromNode()` in CLI      | `tree.guards` from `parseTree` covers this   |
| `extractConfigFromSource()` (regex)   | Replaced by ts-morph AST evaluation          |
| `parseConfigString()` (regex)         | Replaced by ts-morph AST evaluation          |
| `collectActionKeys()` etc. in CLI     | All covered by `parseTree` BetterSet fields  |
| `import type { MachineEntry }` in gen | No imports allowed in the generated file     |
| Per-machine `*.gen.ts` files          | Never generated — single `app.gen.ts` only   |
