# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<br/>

<details>
<summary>

## **[2.0.0] - 21/08/2026** => _17:25_

</summary>

### Breaking Changes

- **State Merging (`merge2`)**: Replaced direct and external object merging
  (`deepmerge-ts`) with `@bemedev/decompose`-backed `merge2` across `assign`,
  `filter`, `erase`, `batch`, and interpreter state reconcilers.
- **Interpreter Lifecycle Enforcement**: Enforced strict ready-state verification
  (`isReady`) preventing event emission and dispatch before `service.start()` has
  completed.

### Features

- **`guardBatch`**: Add `guardBatch` combiner supporting recursive boolean evaluation
  (`and`, `or`, nested closures, negation) across synchronous and asynchronous
  machines.
- **`merge2.multiple`**: Introduce multi-path sequential deep merge utility.
- **`ActionResult`**: Upgrade action return contracts to structured `ActionResult`
  with granular `mergers` and `ExtendedActionsParams`.

### Refactor

- **`CommonMachine`**: Standardize `CommonMachine` typing hierarchy, getters, and
  option bindings.
- **`JSDoc`**: Comprehensive JSDoc type-linking standardisation across actions,
  machines, and interpreters.
- **Dependencies**: Remove `deepmerge-ts` dependency in favor of
  `@bemedev/decompose`.

### Dependencies

- **Workspace Dependencies**: Bump version to 2.0.0 across all workspace packages.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.11.0] - 18/08/2026** => _11:15_

</summary>

### Features

- **`filter`**: Enhance `filter` action to support event-keyed function maps
  (`FnMapFilterArray` and `FnMapFilterObject`) with event payload access and `else`
  fallback handlers.
- **`reduceFnMap`**: Introduce `reduceFnMapFilterArray` and `reduceFnMapFilterObject`
  reducers to compile filter function maps.
- **`bemedev`**: Re-export additional utility types from `@bemedev/typings`.

### Refactor

- **`SyncMachine` / `AsyncMachine`**: Update action option type definitions
  `SyncFilterAction_F` and `AsyncFilterAction_F` to accept `FnMap` structures.

### Dependencies

- **Workspace Dependencies**: Bump version to align with the 1.11.0 workspace
  release.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.10.0] - 11/08/2026** => _10:27_

</summary>

### Docs

- **`JSDoc`**: Add comprehensive JSDoc annotations and `{@linkcode}` references
  across source files.

### Dependencies

- **Workspace Dependencies**: Bump version to align with the 1.10.0 workspace
  release.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.9.4] - 03/08/2026** => _21:09_

</summary>

### Features

- **`CommonInterpreter`**: Add `reset()` and `softReset()` methods to reset service
  state to its initial configuration.
- **`canEvents`**: Replace `canEvent` with `canEvents` to support variadic event
  capability checking.

### Refactor

- **`SyncInterpreter`**: Preserve `mode` and `exact` options when calling `renew`.
- **`CommonMachine`**: Refine `eventsList` typing for better event key extraction.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.9.3] - 02/08/2026** => _21:50_

</summary>

### Dependencies

- **Workspace Dependencies**: Bump version to align with the 1.9.3 workspace release.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.9.1] - 01/08/2026** => _17:20_

</summary>

### Dependencies

- **Workspace Dependencies**: Bump version to align with `@bemedev/app` `1.9.1`.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.9.0] - 30/07/2026** => _17:30_

</summary>

### Refactor

- **Valibot Migration**: Extract Valibot schemas and validation helpers into
  `@bemedev/app-valibot` package.
- **State Schemas**: Streamline machine configuration and interpreter state
  validation.

### Dependencies

- **Workspace Dependencies**: Add `@bemedev/app-valibot` dependency.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.8.1] - 30/07/2026** => _02:40_

</summary>

### Features

- **Swap Helper**: Document and expand `swap` helper integration to showcase usage
  inside `assign`, `guards`, `delays`, and standalone options.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.8.0] - 30/07/2026** => _02:15_

</summary>

### Features

- **Assign Helper**: Add support for multi-variable assignments in state machine
  actions.
- **State Machine Core**: Introduce synchronous (`SyncMachine`) and asynchronous
  (`AsyncMachine`) interpreters with unified `interpret` interface.
- **Async Actions**: Enhance async actions with error handling, timeout options, and
  error propagation (`errorFn`).

### Refactor

- **Machine Actions**: Refactor machine actions to utilize `@bemedev/function-swap`.
- **Node Config**: Streamline `isNodeConfig` checks and state resolution logic.
- **Decompose Integration**: Update `@bemedev/decompose` integration across machine
  type definitions and schemas.

### Dependencies

- **Dependencies**: Update `@bemedev/function-swap` to `^0.2.5` and upgrade
  `rolldown` to `1.2.1`.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.7.0] - 02/07/2026** => _10:39_

</summary>

### Features

- **Package Metadata**: Add `homepage` key to `package.json` referencing
  documentation links.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.6.0] - 02/07/2026** => _10:11_

</summary>

### Dependencies

- **Workspace Dependencies**: Bump version to `1.6.0` to align with the core release.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.5.0] - 26/06/2026** => _20:20_

</summary>

### Features

- **Multi-variable assignment**: Support array of keys in `assign` helper for both
  sync and async machines to allow multi-variable assignments.

### Refactor

- **Simplify assign logic**: Remove `expandFnMap` utility and refactor the `assign`
  implementation to use `reduceFnMap` directly.
- **Rename interpreter export**: Rename the internal `interpret` from `#interpreter`
  to `interpretAsync` for consistency with async-specific machine logic.

- <u>Test coverage **_99.86%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.4.0] - 25/06/2026** => _12:05_

</summary>

### Features

- **Atomic state machine verification**: Add support for atomic state machine
  verification and edge cases testing.
- **`any` type validator helper**: Add `any` type validator helper to `typings`.

### Fixes

- **Initial config check**: Handle null/undefined values in initial configuration
  parsing.

### Refactor

- **Simplify test configuration**: Simplify test config by replacing custom TS
  aliases plugin with native `resolve.tsconfigPaths` in `vitest.config.ts`.
- **Remove type assertion**: Remove unnecessary type assertion in
  `valueToNodeConfig`.

- <u>Test coverage **_99.58%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.3.0] - 17/06/2026** => _18:45_

</summary>

### Breaking Changes

- **Update options type parameters**: Rename `error` parameter to `catch` in option
  parameter schemas for `assign`, `voidAction`, and `sendTo` helpers, aligning it
  with the native Promise `.catch` syntax.
- **Refactor engine structure**: Move engine implementation from `src/machine/` to
  `src/asyncMachine/` and update internal exports.

### Features

- **Add `then` chaining support**: Implement the `then` option in `assign` and
  `voidAction` helper options to support executing sequential actions after a promise
  resolves.

### Refactor

- **Update path mappings**: Re-point path aliases `#machine` and `#machines` in
  `tsconfig.json` to the new `src/asyncMachine/` directory and update related
  imports.

- <u>Test coverage **_99.82%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.2.5] - 15/06/2026** => _00:58_

</summary>

### Features

- **Async Predicate Evaluation**: Guards can now return `Promise<boolean>` in
  addition to `boolean`. The `AsyncInterpreter` evaluates all predicates sequentially
  using `await`, enabling async data fetches, token validation, and other async
  checks directly in guard functions
- **`toPredicate.async`**: Expose `_toPredicate.async` and `toPredicate.async`
  variants via `expandFn`, allowing async AND/OR guard composition with full
  error-safety (rejected promises resolve to `false`)
- **`MaybePromise<boolean>` in types**: `AsyncPredicateS`, `AsyncPredicateS3`, and
  `AsyncPerformPredicate_F` now accept `MaybePromise<boolean>` instead of `boolean`,
  aligning the type surface with runtime behaviour

### Refactor

- **Error Handler Signatures**: `errorFn` in async machine actions now follows a
  two-step curried signature — `errorFn(error)` returns an action function
  `(state) => Promise<result>`, making error handlers composable and consistent with
  the action pipeline
- **`#performPredicates` made async**: The private predicate runner in
  `AsyncInterpreter` is now `async` and short-circuits on the first `false` result
  (fail-fast semantics)
- **`__performFinally` made async**: The finally handler in `AsyncInterpreter` now
  properly `await`s actions and predicate checks
- **`toPredicateFn` override**: `AsyncInterpreter` overrides `toPredicateFn` to use
  `toPredicate.async` instead of the sync variant

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.2.4] - 09/06/2026** => _19:38_

</summary>

### Features

- **Machine Property**: Add `machine` getter to `CommonInterpreter` class returning
  the underlying machine instance

### Refactor

- **Centralized Constants**: Move `TIME_TO_RINIT_SELF_COUNTER` constant from
  interpreter modules to centralized `packages/app/src/constants/numbers.ts` file
- **Interpreter Generics**: Refactor `constructTests` utility signature in fixtures
  to accept `SyncInterpreter` or `AsyncInterpreter` with explicit type parameters,
  improving type safety and inference

- <u>Test coverage **_99.89%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.2.2] - 08/06/2026** => _22:15_

</summary>

### Features

- **Strict Schema Verification**: Update `Config_Schema` and `NodeConfig_Schema` to
  use stricter `NodeConfig2` type mapping
- **Strict Parsing Context**: Update `ParseTreeContext` type definitions to use the
  new `NodeConfig3` type to align with stricter validation constraints
- **Export Stricter Config Types**: Add `NodeConfig2`, `NodeConfig3` and
  `CommonConfig2`, `CommonConfig3` exports to the package root

### Fixes

- **CLI Binary Permissions**: Update build script to execute
  `chmod +x lib/cli/index.js` to ensure CLI binary has execution permissions

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.2.1] - 08/06/2026** => _21:44_

</summary>

### Dependencies

- **Workspace Protocols**: Update workspace protocols to use range specifiers
  (`workspace:^`) for workspace-managed packages

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.2.0] - 08/06/2026** => _21:30_

</summary>

### Features

- **betterTimeout**: Add custom timeout utility that rejects with a specific
  `MAX_EXCEEDED` error or custom error handler
- **NoExtraKeysConfig**: Implement compile-time type validation enforcing strict
  object shape constraints on state machine configurations
- **Valibot Schemas**: Integrate `valibot` schema definitions for runtime validation
  of states, transitions, actions, and guards
- **Asynchronous Delays**: Add asynchronous delay options support to the interpreter

### Refactor

- **Simplified Machine Types**: Remove generic events and actors maps from root
  machine and interpreter definitions to simplify type hierarchy and internals
- **Standardized Schemas**: Align naming conventions for internal transition and
  state validation schemas

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.1.5] - 01/06/2026** => _22:04_

</summary>

- Breaking: Rename async machine helper types to explicit `Async*` names and remove
  legacy aliases from exported type surface
- Add: Re-export core utility helpers (`expandFn`, `switchValue`, `toArray`,
  `tupleOf`, and related helpers) from the package root entrypoint
- Update: Expand exported type utilities for events, guards, delays, emitters,
  transitions, actions, and interpreter internals
- Refactor: Move shared `ByKey_F` typing helper to common types and align internal
  imports to shared machine/common modules
- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.1.4] - 01/06/2026** => _20:05_

</summary>

- Dependencies: Update Vitest stack to `4.1.8` (`vitest`, `@vitest/ui`,
  `@vitest/coverage-v8`)
- Dependencies: Update Ox tooling (`oxfmt` to `0.53.0`, `oxlint` to `1.68.0`)
- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.1.3] - 01/06/2026** => _06:14_

</summary>

- Fix: Add explicit module entry points (main, types, module fields) in package.json
  for improved module resolution
- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.1.2] - 31/05/2026** => _19:26_

</summary>

- Refactor: Migrate interpreter and machine types to common module exports for
  improved accessibility
- Refactor: Rename internal CollectedService to CommonCollectedService for
  consistency
- Refactor: Update PrimitiveObject type imports to use @bemedev/typings
- Fix: Adjust build script formatting
- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.1.1] - 31/05/2026** => _17:20_

</summary>

- Fix module declaration to use `~types` instead of `@bemedev/app`
- Adjust build scripts to ensure type declaration generation in pretest phase
- Update TypeScript configuration for proper module resolution
- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>
## **[1.1.0] - 31/05/2026** => _14:30_

</summary>

### Features

- **CLI Binary**: Package now includes executable CLI entry point (`bin` field),
  allowing direct invocation via `npx @bemedev/app` or global installation
- **CLI Commands**: Introduce `generate` and `watch` commands for machine files with
  fast-glob pattern matching
- **Sync Interpreter**: Implement synchronous interpreter for state machine
  interpretation
- **Sync Machine**: Add synchronous machine implementation for sync-only state
  management
- **Expression Evaluation**: Support spread operators and enhance expression
  evaluation capabilities
- **API Methods**: Enhance `addOptions` and `provideOptions` methods across
  interpreters and machines

### Fixes

- **Error Handler**: Fixed error handler for unhandledRejection in Vitest
  configuration
- **Package Manager**: Fixed package manager initialization and import handling in
  CLI generator
- **CLI Paths**: Fixed file exclusion paths for CLI files in Vitest configuration

### Refactoring

- **Tests**: Reorganized test structure with separate `async/` and `sync/` test
  directories
- **Examples**: Removed `examples/tan-solid/` directory for simplified project
  maintenance
- **CLI Constants**: Refactored to use centralized `LIB` variable for consistency

### Documentation

- **DevContainer**: Enhanced container configuration with improved settings
- **Types**: Updated type definitions and improved type safety for pContext

### Dependencies

- **fast-glob**: Added for advanced pattern matching in CLI commands
- **Typings**: Updated @bemedev/typings dependency

- <u>Test coverage **_99.89%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.0.0] - 29/05/2026** => _22:26_

</summary>

### Features

- **Interpreter**: Implement unified interpret function for sync and async contexts.
- **Sync**: Introduce `SyncMachine` and related types for synchronous state
  management.
- **Actions**: Enhance `expandFnMap` to support synchronous actions.
- **Hooks**: Add utility hooks for scroll, sleep, and window management.
- **State Management**: Add interpreter and subscriber types for enhanced state
  management, and `ScheduledData` type.
- **Documentation**: Add project overview and conventions in `GEMINI.md`.
- **Environment**: Enhance devcontainer configuration with increased CPU, additional
  extensions, and optimized type checks.

### Updates

- **Typings**: Update `@bemedev/typings` to version 1.2.0 and adjust CI scripts.

### Refactors

- **Machine**: Streamline machine class by removing deprecated properties and
  methods, rename private methods to protected.
- **Interpreter**: Clean up imports and remove deprecated methods in
  `SyncInterpreter`.
- **Checks**: Simplify `isNodeConfig` and related checks, remove unused strict and
  `__longRuns` properties.
- **Guards**: Update `isAfter` function to use `Object.values` for key checks.
- **Utilities**: Reorganize async utilities and tests.

- <u>Test coverage **_95.09%_**</u>

</details>

<br/>

<details>
<summary>

## **[0.1.5] - 24/05/2026** => _14:30_

</summary>

> 🚀 **Stable release** — CLI extraction, test infrastructure upgrade, and enhanced
> developer experience.

### Breaking Changes

- **CLI Removal**: Remove embedded CLI commands from core package; use external
  `@bemedev/app-cli` package instead (`generate` and `generate:watch` scripts now use
  `pnpm dlx @bemedev/app-cli`).

### Features

- **Error Handling**: Add `unhandledRejection` utility to fixtures for robust
  unhandled promise rejection tracking in tests.

### Updates

- **Test Infrastructure**: Upgrade Vitest from `3.2.4` to `4.1.7` and
  `@vitest/coverage-v8`, `@vitest/ui` to `4.1.7` for enhanced testing capabilities.
- **Build Tools**: Update `oxfmt` to `0.51.0` and `oxlint` to `1.66.0` for improved
  code formatting and linting.
- **Development Experience**: Enhance devcontainer configuration with optimized
  extension handling and CI/admin scripts refinement.
- **Dependencies**: Update `typescript` to `6.0.3`, `tsx` to `4.22.3`, `@types/node`
  to `25.9.1`, `rolldown` to `1.0.2`, and typings utilities for consistency.

### Refactors

- **CLI Migration**: Move generate/watch functionality to external `@bemedev/app-cli`
  package.
- **Scripts**: Refactor CI and admin scripts for cleaner separation of concerns.
- **Type Exports**: Consolidate registry implementation into `registry.types.ts`.

### Dependencies

- **Added**: `@bemedev/app-cli@^0.2.2`, `@bemedev/better-set@^0.2.1`,
  `@bemedev/pipe@^1.6.1`, `cmd-ts@^0.15.0`, `valibot@^1.4.0`.
- **Updated**: All core and dev dependencies to latest stable versions.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[0.1.4-canary] - 22/05/2026** => _11:44_

</summary>

> ⚠️ **Canary update** — unstable release with package exports and typing
> improvements.

### Features

- **Exports**: Add new public exports from `src/index.ts` and `src/types/index.ts`
  for `EventArgObject`, `EventObject`, `EventsMap`, `AllEvent`, `InitEvent`,
  `MAX_EXCEEDED_EVENT_TYPE`, state/node config types, emitter helpers, and guard
  predicate utilities.
- **Type utilities**: Export `inferSh` from `@bemedev/typings` through
  `src/utils/typings.ts`.

### Updates

- **Package exports**: Expose `./constants` in `package.json` to support package-wide
  `constants` imports.

</details>

<br/>

<details>
<summary>

## **[0.1.3-canary] - 21/05/2026** => _22:11_

</summary>

> ⚠️ **Canary update** — unstable release with package, export and tooling
> improvements.

### Features

- **Public Exports**: Add public type exports in `src/index.ts` to expose `Action2`,
  `ActorsConfigMap`, `ToEventObject`, `ToEvents`, `DelayFunction2`,
  `EmitterFunction2`, and `PredicateS` to package consumers.
- **Devcontainer**: Add a development container configuration
  (`.devcontainer/devcontainer.json`) for seamless out-of-the-box development
  environments.

### Fixes

- **Repository URL**: Fix repository URL in `package.json` pointing to correct repo
  (`github.com/chlbri/app`).
- **Build Script**: Remove `generate` command execution from the main `build` script
  in `package.json` for a cleaner, faster build pipeline.

### Refactors

- **Migration**: Migrate configuration files and documentation from `.claude/` to
  `.agents/` directory structure.
- **Verification**: Enhance development workflows with a spacing verification
  utility.
- **Tooling**: Streamline devcontainer specs for increased memory/CPU allocation and
  optimize VSCode configuration settings.

### Dependencies

- **Package Manager**: Update workspace to explicitly declare and use `pnpm` as the
  package manager.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[0.1.2-canary] - 21/05/2026** => _17:16_

</summary>

> ⚠️ **Canary update** — unstable release with package and tooling improvements.

### Refactors

- **parseTree**: adopt new `@bemedev/pipe` Monad APIs (`monad`, `toggleMonad`) in
  `src/utils/parseTree.helpers.ts`

### Dependencies

- **Dependencies**: update `@bemedev/better-set` to `^0.2.1`, `@bemedev/pipe` to
  `^1.6.1`, `@bemedev/typings` to `^0.5.5`, `nanoid` to `^5.1.11`
- **Dev tooling**: update `rolldown` to `1.0.2`, `vitest` to `^4.1.7`, `oxlint` to
  `^1.66.0`, `oxfmt` to `^0.51.0`, `@types/node` to `^25.9.1`, and other developer
  utilities

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[0.1.1-canary] - 24/04/2026** => _10:00_

</summary>

> ⚠️ **Canary update** — unstable release with package and tooling improvements.

### Updates

- **Version**: bumped from `0.1.0-canary` to `0.1.1-canary`
- **Package**: added modern `exports` map and improved `generate` script support
- **Dependencies**: updated `@bemedev/dev-utils`, `@vitest/coverage-v8`,
  `@vitest/ui`, `vitest`, `@bemedev/pipe`
- **Add**: `@bemedev/app-cli` and `@bemedev/better-set`
- **Note**: CLI helpers and type-generation tooling are delivered via the companion
  `@bemedev/app-cli` package, a complementary library for better typing similar to
  TanStack Start
- **Dev tooling**: align build/test tooling with the rewritten package structure

</details>

<br/>

<details>
<summary>

## **[0.1.0-canary] - 23/04/2026** => _10:00_

</summary>

> ⚠️ **Complete rewrite** — unstable canary version intended for testers. Do not use
> in production.

### Breaking Changes

- **Rename**: package renamed from `app-ts` to `@bemedev/app`
- **Version**: reset to `0.1.0-canary` (new version line)
- **Node.js**: minimum version raised from ≥ 22 to ≥ 24
- **TypeScript**: upgraded to TypeScript 6.x (≥ 6.0.3)
- **Removed** `src/actor.types.ts` — types merged into `src/actors/types.ts`
- **Removed** `src/machine/registry.ts` — replaced by `src/registry.ts`
- **Test convention**: machine fixtures are now in `*.machine.ts` files separate from
  `*.test.ts` files

### New Features

- **`registry.ts`**: global machine registry exported from the package —
  `registerMachine`, `getMachine`, `MACHINES`, `Register` interface (augmentable via
  `declare module`)
- **`actors/` module**: `reduceActors`, `reduceChild`, `reduceEmitter` — reduces
  actor configurations (emitters and children) into sets of actions, guards and
  targets
- **`utils/parseTree.ts`**: full traversal of a machine config — extracts all paths,
  actions, guards, emitters, children, delays, events, tags and pContext keys in a
  single call
- **`utils/set.ts`**: `BetterSet<T>` class — enhanced Set with custom equality,
  iterable, extended API (`add`, `has`, `values`, `size`, `isEmpty`, `toArray`,
  `map`, `filter`)
- **`utils/reduceDescribers.ts`**: `reduceDescribers` utility to flatten describer
  configurations without duplicates
- **`guards/helpers/reduceGuards.ts`**: `reduceGuards` — recursively flattens AND/OR
  guard unions into a flat array of `WithDescriber[]`, without duplicates
- **`transitions/functions/reduceTransitions.ts`**: `reduceTransitions` — extracts
  targets, actions and guards from a list of transition configurations
- **`transitions/functions/reduceTransitionsConfig.ts`**: `reduceTransitionsConfig` —
  reduces a transition map by event
- **`states/functions/reduceActivity.ts`**: `reduceActivity` — reduces the activity
  configurations of a state
- **CLI**: `--dry-run` flag on the `generate` command — prints output without writing
  to disk
- **CLI**: `dev` alias for the `watch` command
- **CLI**: machine detection pattern extended — `*.machine.ts` and `*.fsm.ts`

### Refactors

- `cli/core/generator.ts` fully rebuilt around `parseTree` for more reliable and
  complete type extraction
- `flatMap` (states) refactored via `expandFn` — centralised logic
- `Machine` class: enriched generic parameters (`AllPaths`, `Eo`)
- `Interpreter`: event and actor type handling refined
- `transitions/` module reorganised with modular reduction logic
- `utils` exports simplified: `buildPaths` now exported directly from
  `src/utils/index.ts`
- `typings` helpers rewired for stricter `actorsMap` inference and cleaner type
  utilities in `src/utils/typings.ts`

### Dependencies

- **Update**: `rolldown` 1.0.0-rc.16 → 1.0.0-rc.17
- **Update**: `typescript` ^5.x → ^6.0.3
- **Add**: `rimraf` ^6.1.3 (dev)
- **Update**: `@types/node` → ^25.6.0
- **Update**: `oxlint` → ^1.61.0, `oxfmt` → ^0.46.0

- <u>Test coverage **_100%_**</u>

</details>

<br/>

## License

MIT

<br/>

## Author

chlbri (bri_lvi@icloud.com)

[My GitHub](https://github.com/chlbri?tab=repositories)

[<svg width="98" height="96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>](https://github.com/chlbri?tab=repositories)

<br/>

## Links

- [Documentation](https://github.com/chlbri/app/blob/main/packages/reactjs/README.md)
