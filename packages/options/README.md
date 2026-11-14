# `@bemedev/app-options`

Contract-driven option helpers for [`@bemedev/app`](https://github.com/chlbri/app).

`@bemedev/app-options` builds the object returned by `machine.createOptions` straight
from a [`@bemedev/app-contract`](../contract) contract. No machine instance is
needed: the contract already carries the JSON config and the type schemas, which is
everything the helpers require.

The package exposes a single function, `createOptions`. Both machine flavors are
covered by the same entry point; the contract's `sync` flag selects the synchronous
or the asynchronous helper surface.

## Installation

```bash
pnpm add @bemedev/app-options
```

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

## Subpath exports

The runtime dependencies of the helpers are re-exported, so consumers of
`createOptions` do not need to install them directly:

| Subpath                                  | Re-exports                   |
| ---------------------------------------- | ---------------------------- |
| `@bemedev/app-options/contract`          | `@bemedev/app-contract`      |
| `@bemedev/app-options/decompose`         | `@bemedev/decompose`         |
| `@bemedev/app-options/function-swap`     | `@bemedev/function-swap`     |
| `@bemedev/app-options/boolean-recursive` | `@bemedev/boolean-recursive` |
| `@bemedev/app-options/better-promise`    | `@bemedev/better-promise`    |

---

## Exports

| Export                | Kind | Description                                                 |
| --------------------- | ---- | ----------------------------------------------------------- |
| `createOptions`       | Fn   | Curried contract options factory.                           |
| `CreateOptions_F`     | Type | Function signature of `createOptions`.                      |
| `SyncOptionsHelpers`  | Type | Helper surface injected for a `sync: true` contract.        |
| `AsyncOptionsHelpers` | Type | Helper surface injected for an asynchronous contract.       |
| `OptionsHelper`       | Type | Callback signature, selected from the contract `sync` flag. |
| `AsyncOptions`        | Type | `max`, `then` and `catch` options of async helpers.         |
| `LegacyOptions`       | Type | `_legacy` accessor passed as the second callback argument.  |

## License

MIT
