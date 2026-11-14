# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
