# `@bemedev/app-options`

Contract-driven option helpers for [`@bemedev/app`](https://github.com/chlbri/app).

`@bemedev/app-options` builds the object returned by `machine.createOptions` straight
from a [`@bemedev/app-contract`](../contract) contract. No machine instance is
needed: the contract already carries the JSON config and the type schemas, which is
everything the helpers require.

The package exposes a single function, `createOptions`. Both machine flavors are
covered by the same entry point; the contract's `sync` flag selects the synchronous
or the asynchronous helper surface.

Every export of `@bemedev/app-contract` is also re-exported from the package root, so
consumers only need to depend on `@bemedev/app-options`.

## Installation

```bash
pnpm add @bemedev/app-options
```

## Breaking changes in v3.0.0

The delay types re-exported from `@bemedev/app-contract` are unified across both
machine flavors:

- `SyncDelayFunction3` and `AsyncDelayFunction3` → `DelayFunction3`
- `SyncDelayFunction2` and `AsyncDelayFunction2` → `DelayFunction2`

Annotate your `delays` callbacks with `DelayFunction3` / `DelayFunction2` instead of
the removed flavor-suffixed names.

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

`create` receives the configuration, the event names, the contract when available,
the current legacy options, and the utilities built so far. A plugin can therefore
build on another one without importing it:

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
createOptions(contract).use(retryPlugin).useAll([logPlugin]);
```

At machine level, pass `plugins` in the type schema object:

```typescript
const machine = createMachine(config, { sync: true, plugins: [retryPlugin] });

machine.createOptions(({ retry }) => ({ actions: { load: retry(3, loadUser) } }));
```

`plugins` is extracted from the type schemas and attached to the machine, so `renew`,
`provideOptions`, `addOptions` and interpreters keep it.

### Registering at library level

```typescript
import { configureOptions, registerOptionsPlugin } from '@bemedev/app-options';
import { retryPlugin, logPlugin } from '@my/lib';

configureOptions([retryPlugin, logPlugin]);
// or append once
registerOptionsPlugin(retryPlugin);
```

Global plugins are merged with per-call ones, the per-call plugin winning on shared
names. `configureOptions([])` resets the registry, which is the recommended setup for
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

| Export                  | Kind | Description                                                 |
| ----------------------- | ---- | ----------------------------------------------------------- |
| `createOptions`         | Fn   | Curried contract options factory.                           |
| `CreateOptions_F`       | Type | Function signature of `createOptions`.                      |
| `CreateOptionsWith`     | Type | Curried callable carrying the applied plugins.              |
| `OptionsHelpers`        | Type | Helper surface of a contract and a plugin tuple.            |
| `AugmentedAddons`       | Type | Remaps the extra `Addons` keys onto a machine surface.      |
| `SyncOptionsHelpers`    | Type | Helper surface injected for a `sync: true` contract.        |
| `AsyncOptionsHelpers`   | Type | Helper surface injected for an asynchronous contract.       |
| `OptionsHelper`         | Type | Callback signature, selected from the contract `sync` flag. |
| `AsyncOptions`          | Type | `max`, `then` and `catch` options of async helpers.         |
| `LegacyOptions`         | Type | `_legacy` accessor passed as the second callback argument.  |
| `configureOptions`      | Fn   | Replaces the global plugin registry.                        |
| `registerOptionsPlugin` | Fn   | Appends a plugin to the global registry, once.              |
| `buildHelpers`          | Fn   | Builds a helper surface for a config, mode and plugins.     |
| `OptionsPlugin`         | Type | Plugin accepted by the options engine.                      |
| `UtilityPlugin`         | Type | Low-level plugin type from `@bemedev/app-utility`.          |
| _contract exports_      | All  | Every export of `@bemedev/app-contract`, re-exported as-is. |

## License

MIT
