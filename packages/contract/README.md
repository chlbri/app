# `@bemedev/app-contract`

Lightweight machine contracts for [`@bemedev/app`](https://github.com/chlbri/app).

A contract registers a state machine's JSON config and its types only. It never
contains option implementations (actions, guards, delays, actors), so it can be
shared with API layers and other consumers that only need the machine's typing
surface.

The package is self-contained: every type it needs is vendored inside
`@bemedev/app-contract`, and it does not import or re-export anything from
`@bemedev/app`.

## Installation

```bash
pnpm add @bemedev/app-contract
```

---

## Usage

```typescript
// auth.contract.ts
import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

export const authContract = createContract(
  {
    initial: 'idle',
    states: {
      idle: { on: { LOGIN: '/authenticated' } },
      authenticated: { initial: 'loading', states: { loading: {} } },
    },
  },
  {
    context: type({ count: 'number' }),
    pContext: type({ token: 'string' }),
    eventsMap: type({ LOGIN: 'undefined' }),
  },
);
```

The signature mirrors `createMachine(config, types)` from `@bemedev/app`, but the
`types` argument only accepts `context`, `pContext`, `eventsMap`, `actorsMap` and
`sync`. There is no `options` argument.

A named form is also available: `createContract('auth', config, types)`. The name is
type-level only — it selects the matching `Register` entry and is not part of the
returned object.

### Reading the contract types

```typescript
import type {
  ContractContext,
  ContractEventArg,
  ContractEvents,
  ContractOptions,
  ContractPaths,
  ContractPContext,
} from '@bemedev/app-contract';
import { authContract } from './auth.contract';

type Paths = ContractPaths<typeof authContract>;
// '/' | '/idle' | '/authenticated' | '/authenticated/loading'

type Context = ContractContext<typeof authContract>; // { count: number }
type PrivateContext = ContractPContext<typeof authContract>; // { token: string }

type Events = ContractEvents<typeof authContract>;
type EventArg = ContractEventArg<typeof authContract>;
type Options = ContractOptions<typeof authContract>; // MachineOptions
```

The returned object is frozen and has the shape `{ config, types }`. It does not
expose any machine runtime, option implementation, or interpreter.

A contract type carries three things: the `config`, the inferred `types` (`events`,
`eventMap`, `actorsMap`, `context`, `pContext`, `paths`, `sync`) and the type-only
`options` surface returned by `createOptions` (nothing is emitted at runtime).

The options surface follows the `sync` flag:

- `sync: true` → `SyncMachineOptions2` (named) or `SyncSimpleMachineOptions`
  (unnamed).
- otherwise → `AsyncMachineOptions2` (named) or `AsyncSimpleMachineOptions`
  (unnamed).

Named contracts narrow the option keys with the `Register` entry (`actions`,
`guards`, `delays`, `children`, `emitters`).

### Using a contract from a machine

The `config` and `types` properties can be passed directly to `createMachine`:

```typescript
import { createMachine } from '@bemedev/app';
import { authContract } from './auth.contract';

export const authMachine = createMachine(
  'auth',
  authContract.config,
  authContract.types,
).createOptions(({ action }) => ({ actions: { login: action(() => {}) } }));
```

---

## CLI compatibility

`@bemedev/app-cli` discovers `*.contract.ts` files in addition to `*.machine.ts` and
`*.fsm.ts` files. A default-exported named `createContract('name', ...)` call is
parsed exactly like `createMachine(...)` and registered in the generated `Register`
interface. The unnamed form is not discoverable, because it carries no name:

```bash
npx app-cli generate
```

Creating a new empty `*.contract.ts` file while `app-cli watch` is running scaffolds
it with a `createContract` starter.

---

## Exports

| Export                      | Kind | Description                                                       |
| --------------------------- | ---- | ----------------------------------------------------------------- |
| `createContract`            | Fn   | Registers a JSON config plus types and returns a frozen contract. |
| `StatePaths`                | Type | Resolves every state path declared by a config.                   |
| `Contract`                  | Type | Contract shape.                                                   |
| `CreateContract_F`          | Type | Function signature of `createContract`.                           |
| `CreateContractNamed_F`     | Type | Named signature, resolved through `Register`.                     |
| `CreateContractNoName_F`    | Type | Unnamed signature, resolved from the config.                      |
| `Register`                  | Type | Registry augmented with pre-resolved contract types.              |
| `RegisterOptions`           | Type | Option identifiers available for a registry entry.                |
| `TargetDef`                 | Type | Registry path tree node.                                          |
| `ContractSchemas`           | Type | Schema map accepted by `createContract`.                          |
| `ContractTypes`             | Type | Inferred typing surface shape.                                    |
| `MachineOptions`            | Type | Union of async and sync machine options.                          |
| `AnyMachineOptions`         | Type | Base shape satisfied by every machine options surface.            |
| `SimpleMachineOptions`      | Type | Union of async and sync simple machine options.                   |
| `AsyncMachineOptions2`      | Type | Registered async machine options.                                 |
| `SyncMachineOptions2`       | Type | Registered sync machine options.                                  |
| `AsyncSimpleMachineOptions` | Type | Loose async machine options.                                      |
| `SyncSimpleMachineOptions`  | Type | Loose sync machine options.                                       |
| `ContractConfig`            | Type | Machine JSON config.                                              |
| `ContractTypesOf`           | Type | Inferred types.                                                   |
| `ContractOptions`           | Type | Machine options surface.                                          |
| `ContractEvents`            | Type | Union of typed event objects.                                     |
| `ContractEventType`         | Type | Union of event names.                                             |
| `ContractEventArg`          | Type | Accepted arguments when sending an event.                         |
| `ContractEventsMap`         | Type | Raw events map.                                                   |
| `ContractActorsMap`         | Type | Raw actors map.                                                   |
| `ContractContext`           | Type | Public context.                                                   |
| `ContractPContext`          | Type | Private context.                                                  |
| `ContractPaths`             | Type | Union of state paths.                                             |
| `ContractSync`              | Type | Sync execution flag.                                              |

The vendored machine types are exported from the same entry point: `CommonConfig2`,
`NodeConfig2`, `TransitionsConfig`, `EventObject`, `EventsMap`, `ActorsConfigMap`,
`PrimitiveObject`, `StandardOutput`, `inferT`, and their supporting helper types.
Import them from `@bemedev/app-contract` — no `@bemedev/app` installation is
required.

## License

MIT
