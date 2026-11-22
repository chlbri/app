# `@bemedev/app-options`

Contract-driven option helpers for [`@bemedev/app`](https://github.com/chlbri/app).

`@bemedev/app-options` builds the object returned by `machine.createOptions` straight
from a [`@bemedev/app-contract`](../contract) contract. No machine instance is
needed: the contract already carries the JSON config and the type schemas, which is
everything the helpers require.

The package exposes three APIs:

- `createOptions` builds the object returned by `machine.createOptions`;
- `createUtility` builds the contract-aware utility map behind those helpers;
- `configureOptions` / `registerPlugins` maintain the library-level plugin registry.

Both machine flavors are covered by the same API; the contract's `sync` flag selects
the synchronous or the asynchronous surface.

Every export of `@bemedev/app-contract` is also re-exported from the package root, so
a single import path covers the options and the contract surface.

## Installation

```bash
pnpm add @bemedev/app-options @bemedev/app-contract
```

`@bemedev/app-contract` is a peer dependency, because contracts are shared between
libraries and the package re-exports its runtime.

## Breaking changes in v3.1.0

The former `@bemedev/app-utility` package is merged into `@bemedev/app-options`. Move
`createUtility`, `same`, the utility types and the plugin types to imports from
`@bemedev/app-options`, and drop the direct dependency on `@bemedev/app-utility`.

`createUtility` now requires a `{ contract }` context —
`createUtility({ contract })`. The execution mode, the configuration and the event
names are derived from the contract, so the former separate config and mode inputs
are gone. `buildHelpers` follows the same rule and accepts
`{ contract, plugins, legacy }`.

---

## Usage

```typescript
// counter.contract.ts
import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

export const counterContract = createContract(
  { initial: 'idle', states: { idle: { on: { INC: '/idle' } } } },
  {
    context: type({ count: 'number' }),
    eventsMap: type({ INC: 'never' }),
    sync: true,
  },
);
```

```typescript
// counter.options.ts
import { createOptions } from '@bemedev/app-options';
import { counterContract } from './counter.contract';

export const counterOptions = createOptions(counterContract)(({ assign }) => ({
  actions: {
    increment: assign('context.count', ({ context }) => context.count + 1),
  },
}));
```

`createOptions` is curried: `createOptions(contract)` returns the options callback
binder, exactly like `machine.createOptions(helper)`.

### Sync versus async

The `sync` flag declared in the contract `types` decides which surface is injected:

| Contract             | Injected helpers      | Options type                |
| -------------------- | --------------------- | --------------------------- |
| `sync: true`         | `SyncOptionsHelpers`  | `SyncSimpleMachineOptions`  |
| absent / `undefined` | `AsyncOptionsHelpers` | `AsyncSimpleMachineOptions` |

Both surfaces expose the same helper names as the machine:

- guards: `isValue`, `isNotValue`, `isDefined`, `isNotDefined`, `guardBatch`, `swap`
- actions: `assign`, `action`, `batch`, `_for`, `_while`, `_doWhile`, `filter`,
  `erase`, `sendTo`, `resend`, `forceSend`
- activities and timers: `pauseActivity`, `resumeActivity`, `stopActivity`,
  `pauseTimer`, `resumeTimer`, `stopTimer`

Asynchronous helpers additionally accept the `max`, `then` and `catch` options on
`assign`, `action` and `sendTo`.

### Applying the options

The produced object is the machine options surface, so it can be attached to a
machine created from the same contract:

```typescript
import { createMachine } from '@bemedev/app';
import { counterContract } from './counter.contract';
import { counterOptions } from './counter.options';

const machine = createMachine(counterContract);
machine.addOptions(() => counterOptions);
```

---

## Plugins

Every option helper is a _utility_: a descriptor carrying a synchronous and an
asynchronous implementation. Plugins add utilities to `createOptions`, to
`machine.createOptions`, to `machine.addOptions` / `machine.provideOptions` and to
`interpreter.addOptions`.

### Writing a plugin

```typescript
import { same, type UtilityPlugin } from '@bemedev/app-options';

export const retryPlugin = {
  name: 'retry',
  create: () => ({
    retry: same((times: number, action: () => unknown) => () => {
      let last: unknown;

      for (let index = 0; index < times; index++) {
        try {
          return action();
        } catch (error) {
          last = error;
        }
      }

      throw last;
    }),
  }),
} satisfies UtilityPlugin;
```

`create` receives the contract, its configuration, the event names derived from
`contract.config`, the current legacy options, and the utilities built so far —
including every built-in helper (`assign`, `filter`, `guardBatch`, …). A plugin can
therefore build on another one — or on an inner helper — without importing it:

```typescript
export const logPlugin = {
  name: 'log',
  requires: ['retry'],
  create: ({ utilities }) => ({
    log: same((message: string) =>
      utilities.retry.sync(1, () => console.log(message)),
    ),
  }),
} satisfies UtilityPlugin;
```

`requires` is resolved with a topological sort. Missing dependencies and cycles
throw, duplicate utility keys throw unless the plugin sets `override: true`.

### Applying plugins

At call level:

```typescript
const options = createOptions(
  contract,
  retryPlugin,
)(({ retry }) => ({ actions: { load: retry(3, loadUser) } }));

// or chained
createOptions(contract).use(retryPlugin, logPlugin);
```

At machine level, pass `plugins` in the type schema object:

```typescript
const machine = createMachine(config, { sync: true, plugins: [retryPlugin] });

machine.createOptions(({ retry }) => ({ actions: { load: retry(3, loadUser) } }));
```

`plugins` is extracted from the type schemas and attached to the machine, so `renew`,
`provideOptions`, `addOptions` and interpreters keep it.

### Standalone utilities

`createUtility` exposes the same engine without building machine options. The context
is required and carries the contract; the mode, the configuration and the event list
are derived from it. The built-in helpers are always present, and the globally
registered plugins are applied automatically.

```typescript
import { createContract } from '@bemedev/app-contract';
import { createUtility, same } from '@bemedev/app-options';

const contract = createContract(
  { initial: 'idle', states: { idle: { on: { INC: '/idle' } } } },
  { sync: true },
);

const utilities = createUtility({ contract })
  .add(
    'noop',
    same(() => () => ({})),
  )
  .build();

const sync = utilities.resolve('sync');
sync.assign('context.count', ({ context }) => context.count + 1);
```

Per-call plugins are passed after the context and win over registered ones with the
same name:

```typescript
const utilities = createUtility({ contract }, retryPlugin, logPlugin);
```

### Registering at library level

```typescript
import { configureOptions, registerPlugins } from '@bemedev/app-options';
import { retryPlugin, logPlugin } from '@my/lib';

configureOptions(retryPlugin, logPlugin);
// or append without duplicating plugin objects
registerPlugins(retryPlugin);
```

Global plugins are merged with per-call ones, the per-call plugin winning on shared
names. `configureOptions()` resets the registry, which is the recommended setup for
tests and SSR.

**Typing note**: registering at runtime does not change types. To make a helper
visible in every callback, a plugin package can augment `Addons`:

```typescript
declare module '@bemedev/app-options' {
  interface Addons<Ct> {
    retry: UtilityPair<RetryHelper, RetryHelper>;
  }
}
```

The plugin must still be registered at runtime; augmentation only changes types. The
remapping applies to `createOptions` and to every machine surface (`createOptions`,
`addOptions`, `provideOptions`) without passing the plugin to `createMachine`.

---

## Subpath exports

The runtime dependencies of the helpers are re-exported, so consumers of
`createOptions` do not need to install them directly:

| Subpath                                  | Re-exports                   |
| ---------------------------------------- | ---------------------------- |
| `@bemedev/app-options/contract`          | `@bemedev/app-contract`      |
| `@bemedev/app-options/bemedev`           | `@bemedev/app-utils-bemedev` |
| `@bemedev/app-options/decompose`         | `@bemedev/decompose`         |
| `@bemedev/app-options/function-swap`     | `@bemedev/function-swap`     |
| `@bemedev/app-options/boolean-recursive` | `@bemedev/boolean-recursive` |
| `@bemedev/app-options/better-promise`    | `@bemedev/better-promise`    |

---

## Exports

| Export                  | Kind | Description                                                  |
| ----------------------- | ---- | ------------------------------------------------------------ |
| `createOptions`         | Fn   | Curried contract options factory.                            |
| `createUtility`         | Fn   | Contract-aware utility builder (`add`, `use`, `build`).      |
| `CreateOptions_F`       | Type | Function signature of `createOptions`.                       |
| `CreateOptionsWith`     | Type | Curried callable carrying the applied plugins.               |
| `OptionsHelpers`        | Type | Helper surface of a contract and a plugin tuple.             |
| `AugmentedAddons`       | Type | Remaps the extra `Addons` keys onto a machine surface.       |
| `SyncOptionsHelpers`    | Type | Helper surface injected for a `sync: true` contract.         |
| `AsyncOptionsHelpers`   | Type | Helper surface injected for an asynchronous contract.        |
| `OptionsHelper`         | Type | Callback signature, selected from the contract `sync` flag.  |
| `AsyncOptions`          | Type | `max`, `then` and `catch` options of async helpers.          |
| `LegacyOptions`         | Type | `_legacy` accessor passed as the second callback argument.   |
| `configureOptions`      | Fn   | Replaces the global plugin registry.                         |
| `registerPlugins`       | Fn   | Appends plugins to the global registry, once per object.     |
| `buildHelpers`          | Fn   | Builds the helper surface of a contract and its plugins.     |
| `same`                  | Fn   | Declares one implementation for both modes.                  |
| `OptionsPlugin`         | Type | Plugin accepted by the options engine.                       |
| `UtilityPlugin`         | Type | Plugin contributing utilities, typed by the contract.        |
| `UtilityContext`        | Type | Contract, config, events, legacy and built utilities.        |
| `UtilityBuilderContext` | Type | Required `{ contract, legacy? }` context of `createUtility`. |
| `UtilityBuilder`        | Type | Typed accumulator returned by `createUtility`.               |
| `UtilityInstance`       | Type | Built descriptor map with `resolve(mode)`.                   |
| `UtilityPair`           | Type | Synchronous and asynchronous variants of one utility.        |
| `UtilityMap`            | Type | Map of utility names to descriptors.                         |
| `UtilityMode`           | Type | `'sync'` or `'async'`.                                       |
| `ResolveUtilities`      | Type | Projects a descriptor map to one mode.                       |
| `PluginUnion`           | Type | Utilities added by a tuple of plugins.                       |
| `PluginUtilities`       | Type | Utilities added by one plugin.                               |
| `MergeUtilityMaps`      | Type | Merges two maps, the second one winning.                     |
| _contract exports_      | All  | Every export of `@bemedev/app-contract`, re-exported as-is.  |

## License

MIT
