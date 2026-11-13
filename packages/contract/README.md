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
  'auth',
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

The signature mirrors `createMachine('name', config, types)` from `@bemedev/app`, but
the `types` argument only accepts `context`, `pContext`, `eventsMap`, `actorsMap` and
`sync`. There is no `options` argument.

### Reading the contract types

```typescript
import type {
  ContractContext,
  ContractEventArg,
  ContractEvents,
  ContractName,
  ContractPaths,
  ContractPContext,
} from '@bemedev/app-contract';
import { authContract } from './auth.contract';

type Name = ContractName<typeof authContract>; // 'auth'
type Paths = ContractPaths<typeof authContract>;
// '/' | '/idle' | '/authenticated' | '/authenticated/loading'

type Context = ContractContext<typeof authContract>; // { count: number }
type PrivateContext = ContractPContext<typeof authContract>; // { token: string }

type Events = ContractEvents<typeof authContract>;
type EventArg = ContractEventArg<typeof authContract>;
```

The returned object is frozen and has the shape `{ name, config, types }`. It does
not expose any machine runtime, option implementation, or interpreter.

### Using a contract from a machine

The `config` and `types` properties can be passed directly to `createMachine`:

```typescript
import { createMachine } from '@bemedev/app';
import { authContract } from './auth.contract';

export const authMachine = createMachine(
  authContract.name,
  authContract.config,
  authContract.types,
).createOptions(({ action }) => ({ actions: { login: action(() => {}) } }));
```

---

## CLI compatibility

`@bemedev/app-cli` discovers `*.contract.ts` files in addition to `*.machine.ts` and
`*.fsm.ts` files. A default-exported `createContract(...)` call is parsed exactly
like `createMachine(...)` and registered in the generated `Register` interface:

```bash
npx app-cli generate
```

Creating a new empty `*.contract.ts` file while `app-cli watch` is running scaffolds
it with a `createContract` starter.

---

## Exports

| Export              | Kind | Description                                                       |
| ------------------- | ---- | ----------------------------------------------------------------- |
| `createContract`    | Fn   | Registers a JSON config plus types and returns a frozen contract. |
| `StatePaths`        | Type | Resolves every state path declared by a config.                   |
| `Contract`          | Type | Contract shape.                                                   |
| `CreateContract_F`  | Type | Function signature of `createContract`.                           |
| `ContractOf`        | Type | Resolved typing surface of a contract.                            |
| `ContractName`      | Type | Contract identifier.                                              |
| `ContractConfig`    | Type | Machine JSON config.                                              |
| `ContractTypesOf`   | Type | Raw type schemas.                                                 |
| `ContractEvents`    | Type | Union of typed event objects.                                     |
| `ContractEventType` | Type | Union of event names.                                             |
| `ContractEventArg`  | Type | Accepted arguments when sending an event.                         |
| `ContractEventsMap` | Type | Raw events map.                                                   |
| `ContractActorsMap` | Type | Raw actors map.                                                   |
| `ContractContext`   | Type | Public context.                                                   |
| `ContractPContext`  | Type | Private context.                                                  |
| `ContractPaths`     | Type | Union of state paths.                                             |
| `ContractSync`      | Type | Sync execution flag.                                              |

The vendored machine types are exported from the same entry point: `CommonConfig2`,
`NodeConfig2`, `TransitionsConfig`, `EventObject`, `EventsMap`, `ActorsConfigMap`,
`PrimitiveObject`, `StandardOutput`, `inferT`, and their supporting helper types.
Import them from `@bemedev/app-contract` — no `@bemedev/app` installation is
required.

## License

MIT
