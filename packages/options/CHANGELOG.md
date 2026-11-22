# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<details>
<summary>

## **[3.1.0] - 22/11/2026** => _00:34_

</summary>

### Breaking changes

- **Utility package merged**: `@bemedev/app-utility` is merged into
  `@bemedev/app-options`; the utility package is removed. Import `createUtility`,
  `same`, utility types and plugin types from `@bemedev/app-options`.
- **Required builder context**: `createUtility(context, ...plugins)` now requires a
  `{ contract }` context; the former optional `Partial` context is gone.
- **Contract-driven helpers**: `buildHelpers` accepts
  `{ contract, plugins, legacy }`; `config` and `mode` are derived from the contract.
- **Contract-typed utilities**: `UtilityContext.contract` and
  `UtilityPlugin<Adds, Ct>` are typed from `@bemedev/app-contract`.

### Features

- **Plugins**: `createOptions(contract, ...plugins)`, `.use()` and `.useAll()` add
  helpers to the option surface with full type inference.
- **Global registry**: `configureOptions` and `registerPlugins` apply plugins to
  every build at library level.
- **Engine**: `buildHelpers({ contract, plugins, legacy })` is the single builder
  behind every derived API. The execution mode and the event list are derived from
  the contract.
- **Utilities**: helper surfaces are derived from one descriptor map per mode, so
  synchronous and asynchronous helpers no longer drift.
- **`createUtility`**: contract-aware utility builder. The context (`{ contract }`)
  is required, the built-in helpers are always seeded, and registered plugins are
  applied automatically. Utility plugins receive the contract, its config, the
  derived events, the legacy options and the built utilities.
- **Cache**: resolved helpers are cached by contract and plugin signature; the
  registry version invalidates the cache.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[3.0.3] - 17/11/2026** => _13:00_

</summary>

### Dependencies

- **Build Externals**: `@bemedev/app-utils-bemedev` is declared in the package build
  `externals`, so the bundled utilities are resolved from the bundled dependency
  instead of being inlined in the published bundle.
- **Dev Utils**: Bump `@bemedev/dev-utils` to `^1.5.4`.
- **Workspace Dependencies**: Bump version to 3.0.3 to align with the workspace
  release.

</details>

<br/>

<details>
<summary>

## **[3.0.2] - 15/11/2026** => _21:37_

</summary>

### Dependencies

- **Bundled Utilities**: `@bemedev/app-utils-bemedev` is declared in
  `devDependencies` again while staying in `bundledDependencies`, so it is installed
  for the build and packed into the published tarball without becoming a runtime
  dependency of the package.
- **Workspace Dependencies**: Bump version to 3.0.2 to align with the workspace
  release.

</details>

<br/>

<details>
<summary>

## **[3.0.1] - 15/11/2026** => _20:22_

</summary>

### Build

- **npm Publication**: `@bemedev/app-options` is now built and published by the
  release workflow, with its artifacts pre-staged alongside the other packages before
  upload.

### Dependencies

- **Bundled Utilities**: `@bemedev/app-utils-bemedev` becomes a direct `dependencies`
  entry instead of an injected dev dependency, so the bundled copy survives a fresh
  install and `pnpm pack` follows the workspace link.
- **Workspace Dependencies**: Bump version to 3.0.1 to align with the workspace
  release.

</details>

<br/>

<details>
<summary>

## **[3.0.0] - 15/11/2026** => _17:57_

</summary>

### Breaking Changes

- **Unified Delay Types**: `@bemedev/app-contract` renames the delay types it
  re-exports. `SyncDelayFunction3` and `AsyncDelayFunction3` become `DelayFunction3`,
  while `SyncDelayFunction2` and `AsyncDelayFunction2` become `DelayFunction2`.
  Synchronous and asynchronous machines share the same delay signature, so the
  flavor-suffixed names no longer exist.

### Dependencies

- **Workspace Dependencies**: Bump version to 3.0.0 to align with the workspace
  release.

</details>

<br/>

<details>
<summary>

## **[2.8.3] - 14/11/2026** => _19:44_

</summary>

### Features

- **Initial Release**: Publish `@bemedev/app-options`, the contract-driven option
  package extracted from `@bemedev/app-utils-bemedev`. `createOptions(contract)`
  builds the object returned by `machine.createOptions` without a machine instance,
  the contract's `sync` flag selecting the synchronous or asynchronous surface.
- **Contract Re-exports**: Re-export every `@bemedev/app-contract` export from the
  package root, so consumers only depend on `@bemedev/app-options`.
- **Internal Entry**: Expose the shared runtime helpers (`merge2`, `expandFn`,
  `reduceFnMap`, the checkers and `nothing`) from `@bemedev/app-options/internal`.

### Fixes

- **Filters**: Preserve defined values when filtering object contexts, ignoring
  `undefined` and `null` entries instead of treating them as objects.
- **Action Checks**: Turn `checkAction` into a type guard narrowing to `string` or
  `Describer`.

### Docs

- Document the package, its option surfaces and every internal checker.

</details>

<br/>
