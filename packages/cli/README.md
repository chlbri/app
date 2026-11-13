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
(`*.machine.ts`, `*.fsm.ts`) and, with `--contract`, for contract files
(`*.contract.ts`), parses their configurations using AST traversal, and generates
ambient type definitions registering them into `@bemedev/app`'s `Register` interface.
Machine types are written to `app.gen.ts`, while contract types are written to
`app.contract.gen.ts` and register into `@bemedev/app-contract`'s `Register`
interface. Machine and contract generation are separate passes: a given run handles
either machines or contracts, never both.

```bash
npx app-cli <command> [options]
```

### 1. `generate`

Performs a one-time generation of `app.gen.ts` by discovering and parsing all machine
files in the workspace. With `--contract`, it generates `app.contract.gen.ts` from
contract files instead.

#### How it works:

1. **Discovery**: Searches for all files matching `*.machine.ts` and `*.fsm.ts`
   (ignoring excluded directories such as `node_modules`, `dist`, `lib`). With
   `--contract`, it searches `*.contract.ts` files instead.
2. **Extraction & AST Analysis**: Uses `ts-morph` and the internal `parseTree`
   utility to extract machine names, initial states, target paths, events, options,
   and context types (`pContext`).
3. **Type Emission**: Generates a strongly typed module declaration in `app.gen.ts`
   augmenting `@bemedev/app`'s `Register` interface (or in `app.contract.gen.ts`
   augmenting `@bemedev/app-contract`'s `Register` interface with `--contract`).
4. **Cleanup**: Automatically removes the generated file (`app.gen.ts` or
   `app.contract.gen.ts`) if all scanned files are deleted or no valid entries are
   found.

#### Options:

| Option                 | Short | Description                                                                                   | Default                                     |
| ---------------------- | ----- | --------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `--cwd <path>`         | `-c`  | The directory where machine files are searched.                                               | Current working directory (`process.cwd()`) |
| `--excludes <dirs...>` | `-e`  | List of directories or glob patterns to ignore during file discovery.                         | `['node_modules', 'dist', 'lib']`           |
| `--contract`           |       | Generate types for `*.contract.ts` files into `app.contract.gen.ts` instead of machine files. | `false`                                     |
| `--dry-run`            | `-d`  | Prints the generated module declaration to `stdout` without writing to disk.                  | `false`                                     |

#### Examples:

```bash
# One-time generation in current directory
npx app-cli generate

# Custom working directory
npx app-cli generate -c ./src

# Exclude additional folders
npx app-cli generate -e temp coverage

# Generate contract types only, into app.contract.gen.ts
npx app-cli generate --contract

# Dry-run inspection
npx app-cli generate --dry-run
```

---

### 2. `watch` (Alias: `dev`)

Starts a persistent file watcher that monitors machine and contract files and
dynamically regenerates their type declarations (`app.gen.ts` or
`app.contract.gen.ts` with `--contract`) whenever changes occur.

#### How it works:

1. **Initial Build**: Executes an initial full generation on launch.
2. **File Monitoring**: Uses `node-watch` to recursively monitor `*.machine.ts`,
   `*.fsm.ts` and `*.contract.ts` files in real-time. Generation stays exclusive:
   `--contract` regenerates `app.contract.gen.ts` only, otherwise `app.gen.ts` only.
3. **Debounced Regeneration**: Debounces changes (300ms delay) to handle file saving
   sequences smoothly.
4. **Auto-Scaffolding**: Automatically populates newly created empty `.machine.ts`,
   `.fsm.ts` or `.contract.ts` files with starter boilerplate code
   (`createMachine(...)` or `createContract(...)`).
5. **Clean Shutdown**: Listens for `SIGINT` (`Ctrl+C`) to terminate the watcher
   gracefully.

#### Options:

| Option                 | Short | Description                                                                                   | Default                                     |
| ---------------------- | ----- | --------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `--cwd <path>`         | `-c`  | The directory to watch for machine file modifications.                                        | Current working directory (`process.cwd()`) |
| `--excludes <dirs...>` | `-e`  | List of directories to exclude from watcher events.                                           | `['node_modules', 'dist', 'lib']`           |
| `--contract`           |       | Generate types for `*.contract.ts` files into `app.contract.gen.ts` instead of machine files. | `false`                                     |

#### Examples:

```bash
# Start watch mode during development
npx app-cli watch

# Use the dev alias
npx app-cli dev

# Watch a specific directory
npx app-cli watch -c ./packages/feature

# Generate contract types only, into app.contract.gen.ts
npx app-cli watch --contract
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
