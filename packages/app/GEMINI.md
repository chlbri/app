# Project Overview

**@bemedev/app** is a TypeScript library for building finite state machines
with a fully type-safe, declarative API. It models states, transitions,
context, asynchronous operations, and reactive streams through a unified
actors model. The core philosophy is to write machines as pure data, wire
implementations separately, and generate types automatically.

## Main Technologies

- **Language**: TypeScript (≥ 6.0)
- **Runtime**: Node.js (≥ 24)
- **Package Manager**: pnpm
- **Testing**: Vitest
- **Linting/Formatting**: oxlint, oxfmt
- **Bundler**: Rolldown

## Building and Running

The project uses `pnpm` as its package manager. Common tasks are defined in
the `package.json` scripts:

- **Install Dependencies**: `pnpm install` (or `pnpm run config`)
- **Build**: `pnpm run build` (cleans the `lib` directory and runs
  `rolldown`)
- **Test**: `pnpm run test` (runs tests with coverage using `vitest`)
  - Run without typechecking: `pnpm run test:no-type`
  - Watch mode: `pnpm run test:watch`
  - UI mode: `pnpm run test:ui`
- **Lint**: `pnpm run lint` (runs `oxfmt` and `oxlint --fix`)
  - Watch mode: `pnpm run lint:watch`
- **Format**: `pnpm run fmt` (runs `oxfmt`)
- **Generate Types (CLI)**: `pnpm run generate` or `npx app-ts generate`
  (generates `app.gen.ts`)
  - Watch mode: `pnpm run generate:watch` or `npx app-ts watch`

## Development Conventions

- **Code Style**: The project uses `oxlint` and `oxfmt` for strict linting
  and formatting. Ensure you run `pnpm run lint` before committing.
- **Testing**: The project uses `vitest`. Tests should be written alongside
  or near the code they test, or in the `__tests__` directory as seen in
  `src/__tests__`. Ensure good test coverage.
- **Code Generation**: The library relies heavily on generating typings
  from machine configurations. When adding or modifying machines
  (`*.machine.ts` or `*.fsm.ts`), ensure you run the code generation tool
  to keep `app.gen.ts` up to date.
- **Machine Design**: Follow the established pattern of separating machine
  configuration (pure data) from interpreter implementation (options like
  actions, guards, delays). Use string names for references in the
  configuration.
- **Type Safety**: Leverage the custom `typings()` DSL to ensure state
  machines are fully typed.
