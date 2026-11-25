# `@bemedev/app-options`

Contract-driven option helpers for [`@bemedev/app`](https://github.com/chlbri/app).

`@bemedev/app-options` builds the object returned by `machine.createOptions` straight
from a [`@bemedev/app-contract`](../contract) contract. No machine instance is
needed: the contract already carries the JSON config and the type schemas, which is
everything the helpers require.

The package exposes two APIs:

- `createOptions` builds the object returned by `machine.createOptions`;
- `buildHelpers` builds the helper surface shared by `createOptions` and the
  machine/interpreter option callbacks.

Plugins are chained with `use`: there is no library-level registry, so two calls
never leak utilities into each other. The utilities are created with
`createUtilities` from `@bemedev/app-plugins`, which also owns the `Addons` map of
the default helpers.

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

## Breaking changes

`createUtility` and its builder (`add`, `use`, `build`, `resolve`) are removed. The
default helpers are implemented by `createOptions` itself, and plugins are applied
there; `createUtilities` from `@bemedev/app-plugins` is the only utility factory. The
`UtilityPlugin`, `UtilityBuilder`, `UtilityBuilderContext`, `UtilityInstance` and
`UtilityContext` types are gone: plugins use `OptionsPlugin`.

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
  actions: { increment: assign('count', ({ context }) => context.count + 1) },
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

- guards: `isValue`, `isNotValue`, `isDefined`, `isNotDefined`, `guardBatch`
- actions: `assign`, `action`, `batch`, `_for`, `_while`, `_doWhile`, `filter`,
  `erase`, `sendTo`, `resend`, `forceSend`
- activities and timers: `pauseActivity`, `resumeActivity`, `stopActivity`,
  `pauseTimer`, `resumeTimer`, `stopTimer`

Asynchronous helpers additionally accept the `max`, `then` and `catch` options on
`assign`, `action` and `sendTo`.

The `swap` helper is no longer a default helper: install
[`@bemedev/app-bemedev-plugins`](../plugins/bemedev) and opt in with
`createOptions(contract).use(plugin)`.

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

A plugin is defined with `createUtilities`: its builder receives the contract (when
passed in the context) and the utilities built so far — including every built-in
helper (`assign`, `filter`, `guardBatch`, …) — and returns the utility map it adds.

```typescript
import { createUtilities, same } from '@bemedev/app-options';

export const retryPlugin = createUtilities({}, () => ({
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
}));
```

Everything else (configuration, event names, legacy options) is derivable from the
contract, so it is not injected at plugin level. A plugin can therefore build on
another one — or on an inner helper — without importing it:

```typescript
export const logPlugin = createUtilities({}, ({ utilities }) => ({
  log: same((message: string) =>
    utilities.retry.sync(1, () => console.log(message)),
  ),
}));
```

Plugins are applied in the order they are given, so `logPlugin` must be passed after
`retryPlugin`. A utility declared later replaces an earlier plugin utility with the
same name; a plugin can never replace a default addon (`assign`, `filter`, …) — that
throws at build time.

### Applying plugins

Plugins are chained with `use`:

```typescript
const options = createOptions(contract).use(retryPlugin).use(logPlugin)(
  ({ retry }) => ({ actions: { load: retry(3, loadUser) } }),
);

// or in a single call
createOptions(contract).use(retryPlugin, logPlugin);
```

`use` also accepts an inline builder receiving the contract and the utilities built
so far — default helpers and previous plugins:

```typescript
createOptions(contract)
  .use(retryPlugin)
  .use(({ contract, utilities }) => ({
    logRetry: same((message: string) =>
      utilities.retry.sync(1, () => console.log(contract, message)),
    ),
  }));
```

At machine level, pass `plugins` in the type schema object:

```typescript
const machine = createMachine(config, { sync: true, plugins: [retryPlugin] });

machine.createOptions(({ retry }) => ({ actions: { load: retry(3, loadUser) } }));
```

`plugins` is extracted from the type schemas and attached to the machine, so `renew`,
`provideOptions`, `addOptions` and interpreters keep it.

### Precedence

Later plugins win over earlier ones, but the default helpers stay protected:

```typescript
createOptions(contract).use(retryPlugin, tripleRetryPlugin); // tripleRetry wins
createOptions(contract).use(assignPlugin); // throws: default `assign` is protected
```

**Typing note**: the plugin tuple types the helper surface, so a helper is only
visible where its plugin is passed. The default helpers come from `Addons`.

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

| Export                | Kind | Description                                                   |
| --------------------- | ---- | ------------------------------------------------------------- |
| `createOptions`       | Fn   | Curried contract options factory.                             |
| `CreateOptions_F`     | Type | Function signature of `createOptions`.                        |
| `CreateOptionsWith`   | Type | Curried callable carrying the applied plugins.                |
| `Addons`              | Type | Built-in helper map, re-exported from `@bemedev/app-plugins`. |
| `OptionsHelpers`      | Type | Helper surface of a contract and a plugin tuple.              |
| `UseBuilder`          | Type | Inline builder accepted by `use`.                             |
| `UseHelpers`          | Type | Utilities received by an inline `use` builder.                |
| `SyncOptionsHelpers`  | Type | Helper surface injected for a `sync: true` contract.          |
| `AsyncOptionsHelpers` | Type | Helper surface injected for an asynchronous contract.         |
| `OptionsHelper`       | Type | Callback signature, selected from the contract `sync` flag.   |
| `AsyncOptions`        | Type | `max`, `then` and `catch` options of async helpers.           |
| `LegacyOptions`       | Type | `_legacy` accessor passed as the second callback argument.    |
| `buildHelpers`        | Fn   | Builds the helper surface of a contract and its plugins.      |
| `same`                | Fn   | Declares one implementation for both modes.                   |
| `createUtilities`     | Fn   | Re-exported from `@bemedev/app-plugins`; defines plugins.     |
| `OptionsPlugin`       | Type | Plugin contributing utilities, typed by the contract.         |
| `PluginAddons`        | Type | Utilities added by a tuple of plugins.                        |
| `UtilityPair`         | Type | Synchronous and asynchronous variants of one utility.         |
| `UtilityMap`          | Type | Map of utility names to descriptors.                          |
| `UtilityMode`         | Type | `'sync'` or `'async'`.                                        |
| `ResolveUtilities`    | Type | Projects a descriptor map to one mode.                        |
| _contract exports_    | All  | Every export of `@bemedev/app-contract`, re-exported as-is.   |

## License

MIT
