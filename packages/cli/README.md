# `@bemedev/app-cli`

CLI tool and AST `parseTree` parser for
[`@bemedev/app`](https://github.com/chlbri/app).

## Installation

```bash
pnpm add -D @bemedev/app-cli
```

Or using npm / yarn:

```bash
npm install -D @bemedev/app-cli
# or
yarn add -D @bemedev/app-cli
```

---

## CLI Usage

The CLI binary `app-cli` scans your workspace for machine definition files
(`*.machine.ts` and `*.fsm.ts`), parses their configurations using AST traversal, and
automatically generates ambient type definitions into `app.gen.ts` to register
machine types into `@bemedev/app`'s `Register` interface.

```bash
npx app-cli <command> [options]
```

### 1. `generate`

Performs a one-time generation of `app.gen.ts` by discovering and parsing all machine
files in the workspace.

#### How it works:

1. **Discovery**: Searches for all files matching `*.machine.ts` and `*.fsm.ts`
   (ignoring excluded directories such as `node_modules`, `dist`, `lib`).
2. **Extraction & AST Analysis**: Uses `ts-morph` and the internal `parseTree`
   utility to extract machine names, initial states, target paths, events, options,
   and context types (`pContext`).
3. **Type Emission**: Generates a strongly typed module declaration in `app.gen.ts`
   augmenting `@bemedev/app`'s `Register` interface.
4. **Cleanup**: Automatically removes `app.gen.ts` if all machine files are deleted
   or no valid machines are found.

#### Options:

| Option                 | Short | Description                                                                  | Default                                     |
| ---------------------- | ----- | ---------------------------------------------------------------------------- | ------------------------------------------- |
| `--cwd <path>`         | `-c`  | The directory where machine files are searched.                              | Current working directory (`process.cwd()`) |
| `--excludes <dirs...>` | `-e`  | List of directories or glob patterns to ignore during file discovery.        | `['node_modules', 'dist', 'lib']`           |
| `--dry-run`            | `-d`  | Prints the generated module declaration to `stdout` without writing to disk. | `false`                                     |

#### Examples:

```bash
# One-time generation in current directory
npx app-cli generate

# Custom working directory
npx app-cli generate -c ./src

# Exclude additional folders
npx app-cli generate -e temp coverage

# Dry-run inspection
npx app-cli generate --dry-run
```

---

### 2. `watch` (Alias: `dev`)

Starts a persistent file watcher that monitors machine files and dynamically
regenerates `app.gen.ts` whenever changes occur.

#### How it works:

1. **Initial Build**: Executes an initial full generation on launch.
2. **File Monitoring**: Uses `node-watch` to recursively monitor `*.machine.ts` and
   `*.fsm.ts` files in real-time.
3. **Debounced Regeneration**: Debounces changes (300ms delay) to handle file saving
   sequences smoothly.
4. **Auto-Scaffolding**: Automatically populates newly created empty `.machine.ts` or
   `.fsm.ts` files with starter boilerplate code (`createMachine(...)`).
5. **Clean Shutdown**: Listens for `SIGINT` (`Ctrl+C`) to terminate the watcher
   gracefully.

#### Options:

| Option                 | Short | Description                                            | Default                                     |
| ---------------------- | ----- | ------------------------------------------------------ | ------------------------------------------- |
| `--cwd <path>`         | `-c`  | The directory to watch for machine file modifications. | Current working directory (`process.cwd()`) |
| `--excludes <dirs...>` | `-e`  | List of directories to exclude from watcher events.    | `['node_modules', 'dist', 'lib']`           |

#### Examples:

```bash
# Start watch mode during development
npx app-cli watch

# Use the dev alias
npx app-cli dev

# Watch a specific directory
npx app-cli watch -c ./packages/feature
```

---

## Programmatic API

In addition to CLI commands, `@bemedev/app-cli` exports AST parser utilities for
programmatic integration:

```typescript
import { parseTree } from '@bemedev/app-cli';
import type { ParseTree_F, ConfigPaths, ParseTreeContext } from '@bemedev/app-cli';

// Extract state paths, targets, and structure from machine config AST nodes
const tree = parseTree(configNode);
```

---

## License

[MIT](./LICENSE)
