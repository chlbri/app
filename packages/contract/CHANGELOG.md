# Changelog

## CHANGELOG

<details>
<summary>

## **[3.2.0] - 25/11/2026** => _04:14_

</summary>

### Features

- **Subpath exports**: add `@bemedev/app-contract/bemedev`,
  `@bemedev/app-contract/internal`, `@bemedev/app-contract/registry`,
  `@bemedev/app-contract/typings` and `@bemedev/app-contract/types`.
- **Register interface**: expose `Register` as an augmentable interface, matching the
  TanStack Start pattern used by the CLI-generated `app.contract.gen.ts`.

### Refactor

- **Internal split**: contract, options, events and edge helpers move to focused
  `internal` modules, and `machine.ts` becomes `machine.types.ts`.
- **Centralized typings**: the `typings` entry re-exports `@bemedev/typings` and its
  `helpers` namespace from a single module.

### Dependencies

- Bundle `@bemedev/app-utils-bemedev` and add `@bemedev/typings` as a dependency.
- Adopt the pnpm catalog for every dependency.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[3.0.3] - 17/11/2026** => _13:00_

</summary>

### Dependencies

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

- **Workspace Dependencies**: Bump version to 3.0.2 to align with the workspace
  release.

</details>

<br/>

<details>
<summary>

## **[3.0.1] - 15/11/2026** => _20:22_

</summary>

### Dependencies

- **Workspace Dependencies**: Bump version to 3.0.1 to align with the workspace
  release.

</details>

<br/>

<details>
<summary>

## **[3.0.0] - 15/11/2026** => _17:57_

</summary>

### Breaking Changes

- **Unified Delay Types**: Replace `SyncDelayFunction3` and `AsyncDelayFunction3`
  with `DelayFunction3`, and `SyncDelayFunction2` and `AsyncDelayFunction2` with
  `DelayFunction2`. Synchronous and asynchronous machines share the same delay
  signature, so the flavor-suffixed names are removed from `SyncMachineOptions2`,
  `AsyncMachineOptions2`, `SyncSimpleMachineOptions` and `AsyncSimpleMachineOptions`.

### Docs

- Document the unified delay types, shared by both machine flavors, on the option
  shapes.

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

- **Contract Tags**: Add `tags` to the contract types and expose the
  `ContractTags<C>` helper to extract the union of tags declared by a contract.

### Refactor

- **Vendored Types**: Consolidate the machine configuration types in
  `internal/machine.ts` and reuse a single `TargetDef` definition for the registry.

### Docs

- Document the contract-driven options workflow and the `tags` type in the README.

### Dependencies

- **Workspace Dependencies**: Bump version to 2.8.3 to align with the workspace
  release.

</details>

<br/>

<details>
<summary>

## **[2.8.2] - 13/11/2026** => _19:22_

</summary>

### Docs

- Complete the JSDoc surface across the factory, contract helpers and vendored
  machine types: document every template parameter with kind-prefixed `{@linkcode}`
  constraints, fill missing `@param`/`@returns`/`@throws`, add the missing `Tags`
  template and document the factory implementation.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[2.8.1] - 13/11/2026** => _17:41_

</summary>

### Features

- **Contract Factory**: Add `createContract(config, types?)` and its named
  `createContract('auth', config, types?)` form. Both return a frozen
  `{ config, types }` object and never expose option implementations.
- **Typed Surface**: Infer events, event arguments, contexts, actors and state paths
  from the same schema types accepted by `createMachine`.
- **State Paths**: Add `StatePaths` to resolve the union of every declared state
  path, including the root and nested paths.
- **Contract Helpers**: Export `ContractConfig`, `ContractTypesOf`,
  `ContractOptions`, `ContractEvents`, `ContractEventType`, `ContractEventArg`,
  `ContractEventsMap`, `ContractActorsMap`, `ContractContext`, `ContractPContext`,
  `ContractPaths` and `ContractSync`.
- **Options Selection**: Resolve the options surface from the `sync` flag:
  `SyncMachineOptions2` / `SyncSimpleMachineOptions` when `sync` is `true`,
  `AsyncMachineOptions2` / `AsyncSimpleMachineOptions` otherwise.
- **Self-Contained Types**: Vendor the machine config, event, actor, option and
  primitive types so contracts never import `@bemedev/app`.
- **CLI Discovery**: Parse default-exported named contracts from `*.contract.ts`
  files and register them in the generated `Register` interface.

### Docs

- Add JSDoc to the full public surface: factory, signatures, contract types, registry
  entries, vendored types and their template parameters.
- Add a README covering installation, unnamed and named usage, type extraction,
  machine integration, CLI compatibility and the export table.

### Build

- Add the `publish:first` script and `publishConfig` required for the first public
  release of `@bemedev/app-contract`.

- <u>Test coverage **_100%_**</u>

</details>

<br/>
