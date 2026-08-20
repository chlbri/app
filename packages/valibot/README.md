# @bemedev/app-valibot

Runtime validation library powered by [Valibot](https://valibot.dev/) for
`@bemedev/app` state machine configurations.

`@bemedev/app-valibot` ensures that state machine definitions adhere to strict
structural integrity, valid target paths, correct state node types (`atomic`,
`compound`, `parallel`), valid transition arrays, and properly structured actions,
guards, and actor configurations before machine instantiation.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Validation API](#validation-api)
  - [`validate` / `validateMachine`](#validate--validatemachine)
  - [`validateMachine.safe`](#validatemachinesafe)
  - [`getTargetsFromConfig`](#gettargetsfromconfig)
- [Schema Architecture](#schema-architecture)
  - [1. Machine & State Hierarchy (`Config_Schema`, `NodeConfig_Schema`)](#1-machine--state-hierarchy-config_schema-nodeconfig_schema)
  - [2. Transitions & Edges (`Transitions_Schema`, `TransitionConfig_Schema`)](#2-transitions--edges-transitions_schema-transitionconfig_schema)
  - [3. Actions (`ActionConfig_Schema`)](#3-actions-actionconfig_schema)
  - [4. Guards & Logical Trees (`GuardConfig_Schema`, `UnionGuard_Schema`)](#4-guards--logical-trees-guardconfig_schema-unionguard_schema)
  - [5. Actors & Emitters (`ActorConfig_Schema`, `ChildConfig_Schema`, `EmitterConfig_Schema`)](#5-actors--emitters-actorconfig_schema-childconfig_schema-emitterconfig_schema)
- [License](#license)

---

## Installation

```bash
pnpm add @bemedev/app-valibot valibot
```

---

## Quick Start

```typescript
import { validateMachine } from '@bemedev/app-valibot';

const machineConfig = {
  initial: 'idle',
  states: {
    idle: { on: { FETCH: 'loading' } },
    loading: { on: { SUCCESS: 'success', FAILURE: 'failure' } },
    success: {},
    failure: {},
  },
};

// 1. Throws ValiError if invalid
const validConfig = validateMachine(machineConfig);

// 2. Safe parse returning success status and issues
const result = validateMachine.safe(machineConfig);
if (result.success) {
  console.log('Machine configuration is valid!');
} else {
  console.error('Validation issues:', result.issues);
}
```

---

## Validation API

### `validate` / `validateMachine`

```typescript
function validateMachine<T>(config: unknown): NodeConfig2;
```

Extracts all valid state targets from the configuration tree, constructs a
target-constrained `Config_Schema`, and validates the input using `v.parse`. Throws a
`ValiError` if validation fails. `validate` is exported as an alias for
`validateMachine`.

### `validateMachine.safe`

```typescript
function validateMachine.safe(config: unknown): SafeParseResult
```

Same as `validateMachine`, but uses `v.safeParse`. Returns
`{ success: true, output }` or `{ success: false, issues }`.

### `getTargetsFromConfig`

```typescript
function getTargetsFromConfig(node: NodeConfig2): BetterSet<string>;
```

Recursively inspects a state machine configuration tree and returns a `BetterSet` of
all valid slash-separated target path strings (e.g., `'/'`, `'/idle'`, `'/loading'`,
`'/auth/login'`). These path strings are passed to transition schemas to ensure all
transition target references exist within the machine tree.

---

## Schema Architecture

### 1. Machine & State Hierarchy (`Config_Schema`, `NodeConfig_Schema`)

The root configuration schema validates top-level machine properties and recursive
child state nodes:

- **Node Types (`checkNodeType`)**:
  - `atomic`: Must NOT define `states` or `initial`.
  - `compound`: Must define both `states` and `initial`.
  - `parallel`: Must define `states` and MUST NOT define `initial`.
- **Properties**:
  - `initial`: Optional string key of the initial state for compound nodes.
  - `states`: Optional map of state keys to nested `NodeConfig_Schema` definitions
    (evaluated lazily via `v.lazy()`).
  - `entry` / `exit`: Single or array of action configurations.
  - `tags`: Single string or array of strings.
  - `activities`: Record of activity names to activity configurations.
  - `description`: Human-readable summary string.
  - `strict`: Optional boolean to enforce strict configuration rules.

---

### 2. Transitions & Edges (`Transitions_Schema`, `TransitionConfig_Schema`)

Transitions represent state changes triggered by events, timers, or transient
conditions:

- **Event Transitions (`on`)**: Map of event names to single transitions or arrays of
  conditional transitions (`SingleOrArrayT_Schema`).
- **Delayed Transitions (`after`)**: Map of delay durations or delay keys to
  transitions.
- **Eventless Transitions (`always`)**: Array or single transition evaluated
  immediately upon entering a state (`AlwaysConfig_Schema`).
- **Transition Object Validation**:
  - `target`: Target path string. Must match one of the valid targets collected by
    `getTargetsFromConfig`.
  - `actions`: Executed upon transition traversal.
  - `cond` / `guards`: Predicates that must evaluate to `true` for the transition to
    take place.
- **Ordered Guard Rules (`ArrayTransitions_Schema`)**:
  - Validates array transition orders, ensuring that fallback transitions (without
    guards) are placed last in transition arrays.

---

### 3. Actions (`ActionConfig_Schema`)

Validates action specifications in `entry`, `exit`, and transition `actions`:

- **String Action**: Name referencing an action registered in machine options.
- **Describer Object**: Object containing an execution handler and optional metadata:
  ```typescript
  {
    exec: (state, event) => { ... },
    description: 'Updates user profile'
  }
  ```

---

### 4. Guards & Logical Trees (`GuardConfig_Schema`, `UnionGuard_Schema`)

Guards control whether a transition can trigger:

- **Named Guard**: String key corresponding to a guard function in machine options.
- **Describer Guard**: Object with `cond` predicate function and description.
- **Logical Guard Trees**: Recursive boolean logic schemas:
  - `and`: Array of guards that must all evaluate to `true`.
  - `or`: Array of guards where at least one must evaluate to `true`.
  - `not`: Inverts the result of an inner guard.

---

### 5. Actors & Emitters (`ActorConfig_Schema`, `ChildConfig_Schema`, `EmitterConfig_Schema`)

Validates invoked actors and stream emitters attached to state nodes:

- **`ChildConfig_Schema`**: Spawns sub-state machines with context mappings
  (`contexts`) and event handlers (`on`).
- **`EmitterConfig_Schema`**: Manages observables/reactive streams with `next`
  emission handlers, `error` failure handlers, and `complete` (`FinallyConfigSchema`)
  completion handlers.
- **`FinallyConfigSchema`**: Validates final action and guard pipelines executed upon
  actor completion.

---

## License

MIT
