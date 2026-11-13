# Changelog

## CHANGELOG

<details>
<summary>

## **[2.8.1] - 13/11/2026** => _17:41_

</summary>

### Features

- **Contract Factory**: Add `createContract(config, types?)` and its named
  `createContract('auth', config, types?)` form. Both return a frozen
  `{ config, types }` object and never expose option implementations.
- **Typed Surface**: Infer events, event arguments, contexts, actors and state
  paths from the same schema types accepted by `createMachine`.
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

- Add JSDoc to the full public surface: factory, signatures, contract types,
  registry entries, vendored types and their template parameters.
- Add a README covering installation, unnamed and named usage, type extraction,
  machine integration, CLI compatibility and the export table.

### Build

- Add the `publish:first` script and `publishConfig` required for the first
  public release of `@bemedev/app-contract`.

- <u>Test coverage **_100%_**</u>

</details>

<br/>
