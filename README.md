# @bemedev/app

> [!WARNING] **v1.0.0 — Stable release.** This is a stable version; please
> report issues and suggest improvements.

A TypeScript library for building **finite state machines** with a fully
type-safe, declarative API. It models states, transitions, context,
asynchronous operations, and reactive streams through a unified **actors**
model.

The core idea: **write machines as pure data, wire implementations
separately, generate types automatically.**

<br/>

## Philosophy

<details>
<summary>Expand</summary>

### The machine defines _what can happen_. The interpreter _makes it happen_.

A machine is **purely declarative**. Its configuration is plain data: state
names, transitions, guard names, action names. It never calls external
code, never imports side-effects. You can serialise, clone, inspect, and
test it in complete isolation.

```
Machine config           provideOptions / addOptions
─────────────            ────────────────────────────
states: {                actions: {
  idle: {                  fetchUser: assign(...),
    on: {                  canFetch: ({ context }) => ...,
      FETCH: {           }
        guards: 'canFetch',
        target: 'loading',
        actions: 'fetchUser',
      }
    }
  }
}
```

The **interpreter** receives the machine and brings it to life at runtime.
It holds context, processes events, schedules timers, and subscribes to
actors.

### Names, not references

Every action, guard, delay, and actor is referred to by a **string name**
in the config. This is intentional:

- The machine config is serialisable (JSON-friendly)
- Implementations are swappable without touching the config
- Tests can verify the config shape independently of side-effects
- The CLI code generator can statically extract all names and produce
  accurate TypeScript types

### Actors — two kinds of external work

| Actor type | Shape                    | Direction                        | Control      |
| ---------- | ------------------------ | -------------------------------- | ------------ |
| `emitters` | `() => Pausable<T>`      | **Source → Machine** (read-only) | None         |
| `children` | `() => Interpreter<...>` | **Bidirectional**                | `sendTo` API |

An **emitter** is a pausable stream the machine _listens to_. It never
receives events from the machine. A **child** is a nested interpreter the
parent can _talk to_.

</details>

## Installation

```bash
npm install @bemedev/app
# or
pnpm add @bemedev/app
```

> **Requirements:** Node.js ≥ 24 · TypeScript ≥ 6.0

<br/>

## Quick Start

```typescript
import { createMachine, interpret, typings } from '@bemedev/app';

// 1. Declare the machine (pure data)
const machine = createMachine(
  {
    initial: 'idle',
    states: {
      idle: { on: { START: '/running' } },
      running: { on: { STOP: '/idle' } },
    },
  },
  typings({ eventsMap: { START: 'primitive', STOP: 'primitive' } }),
);

// 2. Create and start an interpreter
const service = interpret(machine);
service.start();

// 3. Send events and read state
console.log(service.value); // 'idle'
service.send('START');
console.log(service.value); // 'running'
service.send('STOP');
console.log(service.value); // 'idle'

// 4. Dispose cleanly
await service[Symbol.asyncDispose]();
```

<br/>

## Table of Contents

- [Philosophy](#philosophy)
  - [The machine defines what can happen. The interpreter makes it happen.](#the-machine-defines-what-can-happen-the-interpreter-makes-it-happen)
  - [Names, not references](#names-not-references)
  - [Actors — two kinds of external work](#actors--two-kinds-of-external-work)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [1. Machine Configuration](#1-machine-configuration)
  - [`createConfig(config)`](#createconfigconfig)
  - [Synchronous vs Asynchronous Machines](#synchronous-vs-asynchronous-machines)
- [2. Typings System](#2-typings-system)
  - [Primitives](#primitives)
  - [Object schemas](#object-schemas)
  - [Collections](#collections)
  - [Advanced types](#advanced-types)
  - [Full machine typings example](#full-machine-typings-example)
- [3. Interpreter](#3-interpreter)
  - [Adding options at runtime](#adding-options-at-runtime)
- [4. State Subscriptions](#4-state-subscriptions)
  - [Subscribe to all state changes](#subscribe-to-all-state-changes)
  - [Subscribe to specific events](#subscribe-to-specific-events)
- [5. Actions](#5-actions)
  - [5.1 assign](#51-assign)
  - [5.2 voidAction](#52-voidaction)
  - [5.3 batch](#53-batch)
  - [5.4 filter & erase](#54-filter--erase)
  - [5.5 resend & forceSend](#55-resend--forcesend)
  - [5.6 Async actions & errorFn](#56-async-actions--errorfn)
- [6. Guards](#6-guards)
  - [Using guards in config](#using-guards-in-config)
  - [AND/OR guard composition](#andor-guard-composition)
- [7. Transitions: on, after, always](#7-transitions-on-after-always)
  - [`on` — event-driven](#on--event-driven)
  - [`after` — timed / delayed](#after--timed--delayed)
  - [`always` — immediate / eventless](#always--immediate--eventless)
- [8. Activities](#8-activities)
- [9. Actors: Emitters](#9-actors-emitters)
  - [9.1 Lifecycle](#91-lifecycle)
  - [9.2 Simple emitter — accumulating values](#92-simple-emitter--accumulating-values)
  - [9.3 Error handling](#93-error-handling)
  - [9.4 State-scoped emitters](#94-state-scoped-emitters)
  - [9.5 Emitters vs Children](#95-emitters-vs-children)
- [10. Actors: Children](#10-actors-children)
  - [10.1 Sending events to a child](#101-sending-events-to-a-child)
  - [10.2 Context mapping (child → parent `pContext`)](#102-context-mapping-child--parent-pcontext)
- [11. Tags](#11-tags)
  - [Tags in action callbacks](#tags-in-action-callbacks)
- [12. Registry & Code Generation](#12-registry--code-generation)
  - [12.1 Machine file convention](#121-machine-file-convention)
  - [12.2 CLI: generate](#122-cli-generate)
  - [12.3 CLI: watch / dev](#123-cli-watch--dev)
  - [12.4 `app.gen.ts` and the `Register` interface](#124-appgents-and-the-register-interface)
  - [12.5 `registerMachine` & `getMachine`](#125-registermachine--getmachine)
- [13. Legacy Options (`_legacy`)](#13-legacy-options-_legacy)
  - [Composing on a Machine](#composing-on-a-machine)
  - [Composing on an Interpreter](#composing-on-an-interpreter)
  - [`_legacy` properties](#_legacy-properties)
- [14. Internal Utilities](#14-internal-utilities)
  - [14.1 `BetterSet<T>`](#141-bettersett)
  - [14.2 `parseTree`](#142-parsetree)
  - [14.3 `reduceGuards`](#143-reduceguards)
- [15. API Reference](#15-api-reference)
  - [Machine creation](#machine-creation)
    - [`createMachine(config, types?)`](#createmachineconfig-types)
    - [`createConfig(config)`](#createconfigconfig-1)
  - [Machine methods](#machine-methods)
  - [`interpret(machine, options?)`](#interpretmachine-options)
  - [Interpreter properties](#interpreter-properties)
  - [Interpreter methods](#interpreter-methods)
  - [State configuration shape](#state-configuration-shape)
  - [Transition configuration](#transition-configuration)
  - [`Pausable<T>` interface](#pausablet-interface)
  - [Typings utilities](#typings-utilities)
  - [CLI](#cli)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

<br/>

---

## 1. Machine Configuration

<details>
<summary>Expand</summary>

`createMachine(config, types?)` is the entry point. The first argument is
the machine config; the second is optional type information.

```typescript
import { createMachine, typings } from '@bemedev/app';

const machine = createMachine(
  {
    // The state the machine starts in
    initial: 'idle',

    // Root-level actors (emitters/children) shared across all states
    actors: {
      /* optional */
    },

    // All states
    states: {
      idle: {
        // Entry/exit side-effects (by name)
        entry: 'onEnterIdle',
        exit: 'onExitIdle',

        // Event-driven transitions
        on: { FETCH: '/loading' },

        // Recurring timed action while this state is active
        activities: { POLL: 'refreshToken' },
      },

      loading: {
        // Automatic transition after a delay
        after: { TIMEOUT: '/error' },

        // Unconditional transitions evaluated on entry
        always: [{ guards: 'isDone', target: '/success' }, '/error'],

        on: {
          SUCCESS: { actions: 'storeData', target: '/success' },
          ERROR: '/error',
        },
      },

      success: {},
      error: {},
    },
  },
  typings({
    context: {
      data: typings.array('string'),
      error: typings.maybe('string'),
    },
    eventsMap: {
      FETCH: 'primitive',
      SUCCESS: { data: typings.array('string') },
      ERROR: { message: 'string' },
    },
  }),
);
```

### `createConfig(config)`

Share a typed config object without creating a full machine:

```typescript
import { createConfig } from '@bemedev/app';

export const myConfig = createConfig({
  initial: 'idle',
  states: { idle: {}, done: {} },
});
```

### Synchronous vs Asynchronous Machines

By default, machines are asynchronous (all transitions and actions are wrapped in promises to naturally support async operations). If you require strict synchronous execution (e.g., for performance or integration with synchronous UI frameworks), you can opt into a synchronous machine via the `sync` typings configuration:

```typescript
const syncMachine = createMachine(
  {
    initial: 'idle',
    states: { idle: {} }
  },
  // Setting sync to 'sync' forces synchronous execution
  typings({ sync: 'sync' })
);
```

Synchronous machines throw a type error if you attempt to use async configurations. The `interpret` function automatically detects and runs synchronous machines without creating promises.

<br/>

</details>

---

## 2. Typings System

<details>
<summary>Expand</summary>

TypeScript cannot always infer complex generic types from nested object
literals alone. `@bemedev/app` ships a lightweight **typings DSL** (similar
in spirit to Valibot schemas) that lets you describe any TypeScript type as
a plain value the machine can read at build time.

The `typings(...)` call is the standard way to attach types to a machine:

```typescript
import { createMachine, typings, inferT } from '@bemedev/app';

const machine = createMachine(config, typings({ ... }));
```

### Primitives

```typescript
typings({ context: 'string' }); // context: string
typings({ context: 'number' }); // context: number
typings({ context: 'boolean' }); // context: boolean
typings({ context: 'primitive' }); // events with no payload
```

### Object schemas

```typescript
const user = typings.any({
  name: 'string',
  age: 'number',
  email: typings.maybe('string'), // string | undefined
});
type User = inferT<typeof user>;
// { name: string; age: number; email?: string }
```

### Collections

```typescript
typings.array('string'); // string[]
typings.tuple('number', 'string'); // [number, string]
typings.record('number'); // Record<string, number>
typings.record('boolean', 'a', 'b'); // { a: boolean; b: boolean }
```

### Advanced types

```typescript
// Literal union
typings.litterals('idle', 'loading', 'done');
// → 'idle' | 'loading' | 'done'

// Union
typings.union('string', 'number');
// → string | number

// Intersection
typings.intersection({ a: 'string' }, { b: 'number' });
// → { a: string } & { b: number }

// Discriminated union
typings.discriminatedUnion(
  'type',
  { type: typings.litterals('circle'), radius: 'number' },
  { type: typings.litterals('rect'), width: 'number', height: 'number' },
);

// All fields optional
typings.partial({ name: 'string', age: 'number' });
// → { name?: string; age?: number }

// Single-or-array
typings.soa('string');
// → string | string[]

// Escape hatch — any TypeScript type
typings.custom<MyComplexType>();

// StateValue
typings.sv;
// → resolves to StateValue (the type of service.value)
```

### Full machine typings example

```typescript
const machine = createMachine(
  {
    /* config */
  },
  typings({
    // Public context (exposed via service.context)
    context: {
      items: typings.array('string'),
      error: typings.maybe('string'),
      count: 'number',
    },

    // Private context (not exposed to subscribers)
    pContext: { token: typings.maybe('string') },

    // All events the machine can receive
    eventsMap: {
      FETCH: 'primitive',
      SUCCESS: { data: typings.array('string') },
      ERROR: { message: 'string', code: 'number' },
    },

    // Actor type maps
    actorsMap: {
      emitters: {
        dataStream: { next: 'string', error: 'string' },
      },
      children: {
        authService: { LOGIN: 'primitive', LOGOUT: 'primitive' },
      },
    },
  }),
);
```

<br/>

</details>

---

## 3. Interpreter

<details>
<summary>Expand</summary>

The interpreter is the runtime engine. It receives a configured machine,
holds state and context, processes events, schedules timers, and manages
actor subscriptions.

```typescript
import { interpret } from '@bemedev/app';

const service = interpret(machine, {
  // Initial public context (must satisfy the declared type)
  context: { items: [], error: undefined, count: 0 },

  // Initial private context (optional)
  pContext: { token: undefined },

  // 'strict' (default) — throws on unknown events/options
  // 'normal' — silently ignores unknown events
  mode: 'strict',

  // Use exact interval timing (default: true)
  exact: true,
});

// Must call start() before sending events
service.start();

// Send events — string shorthand or full event object
service.send('FETCH');
service.send({ type: 'SUCCESS', payload: { data: ['a', 'b'] } });

// Read state
service.value; // current state value
service.context; // current public context
service.status; // 'idle' | 'working' | 'stopped'
service.state; // full snapshot
service.config; // current state node config
service.tags; // active tags for the current state
service.mode; // 'strict' | 'normal'

// Pause / resume all timers and activities
service.pause();
service.resume();

// Stop the service (async — waits for all promises)
await service[Symbol.asyncDispose]();
// or synchronously:
service.dispose();
```

### Adding options at runtime

`addOptions` **mutates** the service (useful for dynamic wiring):

```typescript
service.addOptions(({ assign }) => ({
  actions: {
    storeData: assign('context.items', ({ event }) => event.payload.data),
  },
}));
```

`provideOptions` returns a **new** service (immutable):

```typescript
const enrichedService = service.provideOptions(({ voidAction }) => ({
  actions: {
    log: voidAction(() => console.log('state changed')),
  },
}));
```

<br/>

</details>

---

## 4. State Subscriptions

<details>
<summary>Expand</summary>

### Subscribe to all state changes

The subscriber receives `(previousState, currentState)` on every
transition:

```typescript
const sub = service.subscribe((prev, curr) => {
  console.log(`${prev.value} → ${curr.value}`);
  console.log('New context:', curr.context);
});

// Later:
sub.unsubscribe();
```

### Subscribe to specific events

React only to named events with an object subscriber:

```typescript
const sub = service.subscribe({
  SUCCESS: ({ payload }) => {
    console.log('Got data:', payload.data);
  },
  ERROR: ({ payload }) => {
    console.error('Failed:', payload.message);
  },
  // Catch-all for any other event
  else: () => console.log('Other transition'),
});

sub.close();
```

<br/>

</details>

---

## 5. Actions

<details>
<summary>Expand</summary>

Actions are **side-effects** that run during transitions. They are always
declared by name in the config and implemented in `provideOptions` /
`addOptions`. The library provides a set of **action helpers** that cover
the most common patterns.

All helpers are injected as parameters of the `provideOptions` callback:

```typescript
machine.provideOptions(({
  assign, voidAction, batch, filter, erase,
  resend, forceSend, isValue, isNotValue,
  pauseActivity, resumeActivity, stopActivity,
  sendTo,
}) => ({
  actions:  { ... },
  guards:   { ... },
  delays:   { ... },
  actors:   { ... },
}));
```

### 5.1 assign

Updates context values using decomposed dot-notation paths.

```typescript
actions: {
  // Set a leaf value
  increment: assign(
    'context.count',
    ({ context }) => context.count + 1,
  ),

  // Replace the entire context
  reset: assign('context', () => ({
    items: [],
    error: undefined,
    count: 0,
  })),

  // Scoped to an actor event — runs only when that actor emits
  storeData: assign('context.items', {
    'dataStream::next':  ({ payload }) => [payload],
    'dataStream::error': () => [],
  }),
}
```

The path follows `@bemedev/decompose` conventions: `'context'`,
`'context.field'`, `'context.nested.deep'`.

### 5.2 voidAction

Side-effect only — returns nothing, never modifies context.

```typescript
actions: {
  logTransition: voidAction(({ event }) => {
    console.log('Event received:', event.type);
  }),

  // Scoped to an actor event
  handleStreamError: voidAction({
    'dataStream::error': ({ payload }) => {
      Sentry.captureException(payload);
    },
  }),
}
```

### 5.3 batch

Groups multiple actions into a single named action. Useful when a
transition needs to perform several operations atomically.

```typescript
actions: {
  clearForm: batch(
    erase('context.name'),
    erase('context.email'),
    erase('context.age'),
  ),

  // Compose existing actions via _legacy
  doubleIncrement: batch(
    _legacy.actions.increment!,
    _legacy.actions.increment!,
  ),
}
```

### 5.4 filter & erase

**`filter`** — removes elements from arrays, object arrays, or records
stored in context:

```typescript
actions: {
  // Keep only even numbers
  keepEvens:    filter('context.numbers', (n: number) => n % 2 === 0),

  // Keep active users
  keepActive:   filter('context.users', ({ active }) => active === true),

  // Keep high-scoring entries in a record
  keepTopScores: filter('context.scores', score => score >= 90),
}
```

**`erase`** — sets a context property to `undefined`:

```typescript
actions: {
  clearError: erase('context.error'),
  clearToken: erase('context.pContext.token'),

  clearAll: batch(
    erase('context.items'),
    erase('context.error'),
  ),
}
```

### 5.5 resend & forceSend

Re-dispatch events from within an action.

- **`resend(event)`** — only dispatches if the machine is not in a blocked
  state (e.g. `'stopped'`).
- **`forceSend(event)`** — always dispatches, regardless of machine state.

```typescript
actions: {
  retryFetch:      resend('FETCH'),
  alwaysIncrement: forceSend('INCREMENT'),
}
```

### 5.6 Async actions & errorFn

All action helpers accept `async` functions. The interpreter's action
pipeline is fully async and awaits each step sequentially.

An optional `errorFn` handles rejections inline — if absent, errors flow to
the internal `_addError` channel (no uncaught rejection):

```typescript
actions: {
  // Async assign — context is updated after the promise resolves
  loadUser: assign<'user', User, ApiError>(
    'context.user',
    async ({ event }) => {
      const res = await fetch(`/api/users/${event.payload.id}`);
      return res.json();
    },
    // errorFn: merge the error into context instead of throwing
    (err, state) => ({
      context: { ...state.context, error: err.message },
    }),
  ),

  // Async void — no errorFn → error goes to _addError
  trackAnalytics: voidAction(
    async ({ context }) => {
      await analytics.track('state_change', { userId: context.userId });
    },
  ),
}
```

<br/>

</details>

---

## 6. Guards

<details>
<summary>Expand</summary>

Guards are **pure predicates** that gate transitions. They receive the
current state snapshot and return a boolean.

```typescript
machine.provideOptions(({ isValue, isNotValue }) => ({
  guards: {
    // Built-in helpers — compare a context path to a value
    isEmpty: isValue('context.items', []),
    hasToken: isNotValue('context.pContext.token', undefined),

    // Custom predicate
    isAuthenticated: ({ context }) =>
      context.token !== undefined && !isExpired(context.token),

    // Predicate with event payload
    isValidInput: ({ event }) =>
      event.type === 'SUBMIT' && event.payload.value.length > 0,
  },
}));
```

### Using guards in config

Guards are referenced by name in `on`, `after`, and `always`:

```typescript
states: {
  idle: {
    on: {
      // Single guard
      FETCH: { guards: 'isAuthenticated', target: '/loading' },

      // Multiple candidates — first match wins (OR semantics)
      SUBMIT: [
        { guards: 'isValid',   target: '/success' },
        { guards: 'hasErrors', target: '/error' },
        '/fallback',  // no guard → always matches (catch-all)
      ],
    },
    always: [
      { guards: 'isEmpty', target: '/empty' },
    ],
  },
}
```

### AND/OR guard composition

Guards can be composed with `and` / `or` objects directly in the config:

```typescript
on: {
  SUBMIT: {
    guards: { and: ['isAuthenticated', 'isValid'] },
    target: '/success',
  },
  RECOVER: {
    guards: { or: ['isAdmin', 'hasRetries'] },
    target: '/retry',
  },
}
```

<br/>

</details>

---

## 7. Transitions: on, after, always

<details>
<summary>Expand</summary>

### `on` — event-driven

```typescript
on: {
  // Simple target
  CANCEL: '/idle',

  // With guard + actions
  SUBMIT: {
    guards:  'canSubmit',
    actions: 'validateForm',
    target:  '/loading',
  },

  // Multiple candidates — evaluated top-to-bottom, first match wins
  RESPOND: [
    { guards: 'isOk',    target: '/success' },
    { guards: 'isRetry', target: '/loading' },
    '/error',   // fallback — no guard
  ],
}
```

### `after` — timed / delayed

The transition fires automatically after the named delay elapses. If
multiple delays are defined, the **shortest one whose guard passes** wins.

```typescript
// Simple: fixed number (ms)
const machine = createMachine(
  {
    initial: 'idle',
    states: {
      idle: { after: { POLL: '/refreshing' } },
      refreshing: { on: { DONE: '/idle' } },
    },
  },
  defaultT,
).provideOptions(() => ({
  delays: { POLL: 5000 },
}));
// → transitions to 'refreshing' after 5 s
```

```typescript
// Dynamic: function of current state
delays: {
  RETRY_DELAY: ({ context }) => context.retryCount * 1000,
}
```

```typescript
// Multiple delays — shortest passing guard wins
states: {
  waiting: {
    after: {
      FAST: { guards: 'networkAvailable', target: '/online' },
      SLOW: '/offline',
    },
  },
}
delays: { FAST: 2000, SLOW: 10000 }
// If 'networkAvailable' is true → FAST fires at 2 s
// Otherwise → SLOW fires at 10 s
```

### `always` — immediate / eventless

Evaluated every time the state is entered, before any event is processed.
First matching guard wins. No match → nothing happens.

```typescript
states: {
  gate: {
    always: [
      { guards: 'isAdmin',    target: '/adminDashboard' },
      { guards: 'isLoggedIn', target: '/dashboard' },
      '/login',   // catch-all fallback
    ],
  },
}
```

> **Order matters.** `always` is evaluated synchronously on entry. Circular
> chains (A always → B always → A) are treated as no-ops.

<br/>

</details>

---

## 8. Activities

<details>
<summary>Expand</summary>

An **activity** is an action that fires **repeatedly** on a named interval
while the state is active. It supports **pause**, **resume**, and **stop**
controls.

```typescript
const machine = createMachine(
  {
    initial: 'polling',
    states: {
      polling: {
        // 'refresh' action fires every POLL ms
        activities: { POLL: 'refresh' },
        on: {
          PAUSE: { actions: 'pausePoll' },
          RESUME: { actions: 'resumePoll' },
          STOP: { actions: 'stopPoll' },
        },
      },
    },
  },
  typings({
    context: { data: typings.maybe('string') },
    eventsMap: {
      PAUSE: 'primitive',
      RESUME: 'primitive',
      STOP: 'primitive',
    },
  }),
).provideOptions(
  ({ assign, pauseActivity, resumeActivity, stopActivity }) => ({
    actions: {
      refresh: assign(
        'context.data',
        async () => (await fetchData()).value,
      ),
      // The path '/polling::POLL' identifies the activity (state::delay)
      pausePoll: pauseActivity('/polling::POLL'),
      resumePoll: resumeActivity('/polling::POLL'),
      stopPoll: stopActivity('/polling::POLL'),
    },
    delays: { POLL: 3000 },
  }),
);
```

The activity `refresh` runs every 3 000 ms. `PAUSE` freezes it (timer
stopped, context preserved), `RESUME` restarts the timer, `STOP` terminates
it permanently for the current state visit.

<br/>

</details>

---

## 9. Actors: Emitters

<details>
<summary>Expand</summary>

> **Core principle — emitters are NEVER touched during the flow.**

An emitter is a **pausable stream source** that the machine subscribes to
on state entry and unsubscribes from on state exit. The machine **only
reacts** to its emissions. It never sends events _to_ the emitter.

### 9.1 Lifecycle

```
┌─────────────────────┐   next/error/complete   ┌───────────────┐
│  Pausable<T>        │ ───────────────────────► │  Machine      │
│  (your RxJS obs,   │                           │  handlers     │
│   websocket, etc.) │ ◄── nothing              │               │
└─────────────────────┘                           └───────────────┘
        ▲                                                │
        │  subscribe + start  on state entry             │ stop on exit / re-entry
        └────────────────────────────────────────────────┘
```

1. **Config** — declare the emitter name and its handlers:

   ```typescript
   actors: {
     dataStream: {
       next:     { actions: ['appendData'] },
       error:    { actions: ['handleStreamError'] },
       complete: { actions: ['onStreamDone'] },
     },
   }
   ```

2. **Implementation** — provide a factory `() => Pausable<T>`:

   ```typescript
   .provideOptions(() => ({
     actors: {
       emitters: {
         dataStream: () => createPausable(myObservable$),
       },
     },
   }))
   ```

   > `Pausable<T>` is a framework-agnostic interface exported by this
   > library. Any object satisfying
   > `{ subscribe, start, stop, pause, resume }` qualifies. Use
   > `createPausable` from `@bemedev/rx-pausable` to wrap RxJS observables
   > — it is **not** a required dependency.

3. **Runtime** — the interpreter manages everything automatically:
   - State entry → factory called → `subscribe()` + `start()`
   - Each emission → routed to the matching handler
   - State exit or service stop → `stop()`
   - **Re-entering** the state → **new** `Pausable` from scratch

### 9.2 Simple emitter — accumulating values

```typescript
import { createMachine, typings, interpret } from '@bemedev/app';
import { createPausable } from '@bemedev/rx-pausable';
import { interval, map, take } from 'rxjs';

const machine = createMachine(
  {
    initial: 'active',
    actors: {
      ticker: {
        next: { actions: ['accumulate'] },
        complete: { actions: ['onDone'] },
      },
    },
    states: { active: {} },
  },
  typings({
    context: 'number',
    actorsMap: {
      emitters: { ticker: { next: 'number', error: 'never' } },
    },
  }),
).provideOptions(({ assign, voidAction }) => ({
  actions: {
    accumulate: assign('context', {
      'ticker::next': ({ payload, context }) => context + payload,
    }),
    onDone: voidAction(() => console.log('Stream complete')),
  },
  actors: {
    emitters: {
      ticker: () =>
        createPausable(
          interval(200).pipe(
            take(5),
            map(i => (i + 1) * 5),
          ),
        ),
    },
  },
}));

const service = interpret(machine, { context: 0 });
service.start();
// Emissions: 5, 10, 15, 20, 25
// context after all 5 emissions: 75
```

### 9.3 Error handling

When the source emits an error, the `error` handler fires. The machine
remains healthy — it simply routes the error value to the declared actions.

```typescript
actors: {
  live: {
    next:  { actions: ['store'] },
    error: { actions: ['logError'] },
  },
}
// ...
actions: {
  logError: voidAction({
    'live::error': ({ payload }) => console.error('Stream error:', payload),
  }),
}
```

### 9.4 State-scoped emitters

Emitters declared **inside a specific state** only run while that state is
active. Exiting unsubscribes; re-entering creates a fresh subscription.

```typescript
states: {
  idle:      { on: { START: '/streaming' } },
  streaming: {
    actors: {
      feed: { next: { actions: ['buffer'] } },
    },
    on: { STOP: '/idle' },
  },
}
// feed is only active while in 'streaming'.
// Entering 'idle' → unsubscribed.
// Re-entering 'streaming' → new Pausable created from scratch.
```

### 9.5 Emitters vs Children

| Aspect          | Emitters                    | Children                            |
| --------------- | --------------------------- | ----------------------------------- |
| Direction       | Source → Machine only       | Bidirectional (parent ↔ child)      |
| Machine control | **None** — strictly passive | `sendTo` sends events to the child  |
| Lifecycle       | `subscribe` / `stop`        | `interpret(...)` / interpreter stop |
| Pause / Resume  | Via `Pausable` protocol     | Via child interpreter               |
| Re-entry        | New `Pausable` from scratch | Existing or new interpreter         |

<br/>

</details>

---

## 10. Actors: Children

<details>
<summary>Expand</summary>

A **child actor** is a nested interpreter. The parent can send events to it
via `sendTo`, and the child's events bubble up via declared `on` handlers.
Context can be mapped from child to parent (`pContext`).

### 10.1 Sending events to a child

```typescript
const child = createMachine(
  {
    initial: 'idle',
    states: {
      idle: { on: { PING: '/pong' } },
      pong: {},
    },
  },
  typings({ eventsMap: { PING: 'primitive' } }),
);

const parent = createMachine(
  {
    actors: {
      worker: {
        // When the child emits PONG, run 'notify' in the parent
        on: { PONG: { actions: ['notify'] } },
      },
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          // Forward PING to the child when the parent receives it
          PING: { actions: ['forwardPing'] },
        },
      },
    },
  },
  typings({
    eventsMap: { PING: 'primitive' },
    actorsMap: { children: { worker: { PING: 'primitive' } } },
  }),
).provideOptions(({ sendTo, voidAction }) => ({
  actions: {
    notify: voidAction(() => console.log('child reached pong')),
    forwardPing: sendTo(child)(() => ({ to: 'worker', event: 'PING' })),
  },
  actors: {
    children: { worker: () => interpret(child) },
  },
}));
```

### 10.2 Context mapping (child → parent `pContext`)

```typescript
actors: {
  authService: {
    // Map child's entire context ('.') to parent.pContext.auth
    contexts: { '.': 'auth' },
  },
}
// Whenever authService.context changes, parent.pContext.auth is updated.
// Mapping is one-way — parent reads, never writes.
```

<br/>

</details>

---

## 11. Tags

<details>
<summary>Expand</summary>

Tags are **metadata labels** on states. They let consumers ask "what
category is the machine in?" without hard-coding state names. A state can
carry multiple tags.

```typescript
const machine = createMachine(
  {
    initial: 'idle',
    states: {
      idle: { tags: ['idle', 'ready'] },
      loading: { tags: ['busy'] },
      error: { tags: ['failed'] },
      success: { tags: ['done'] },
    },
  },
  typings({ eventsMap: {} }),
);

const service = interpret(machine);
service.start();

service.tags; // ['idle', 'ready']
service.send('FETCH');
service.tags; // ['busy']
```

### Tags in action callbacks

Tag literals are propagated into `provideOptions` callbacks as a **typed
union** — enabling narrowing inside actions:

```typescript
.provideOptions(({ voidAction }) => ({
  actions: {
    renderUI: voidAction(({ tags }) => {
      // tags: 'idle' | 'ready' | 'busy' | 'failed' | 'done' | undefined
      if (tags === 'busy')   showSpinner();
      if (tags === 'failed') showErrorBanner();
    }),
  },
}))
```

<br/>

</details>

---

## 12. Registry & Code Generation

<details>
<summary>Expand</summary>

`@bemedev/app` ships a **CLI and a type-level registry** that together give
you **full compile-time types for every machine in your project** — paths,
events, options, context — with zero manual annotation.

The CLI helpers are provided by the companion package `@bemedev/app-cli`, a
complementary library for better typing and CLI-driven code generation,
similar in purpose to TanStack Start.

The pattern is inspired by TanStack Router's `declare module` augmentation.

### 12.1 Machine file convention

Name your machine files with the `.machine.ts` (or `.fsm.ts`) suffix:

```
src/
  auth/
    auth.machine.ts       ← discovered by the CLI
  checkout/
    checkout.machine.ts   ← discovered by the CLI
  app.gen.ts              ← generated — do not edit manually
```

Inside a machine file, call `registerMachine` to enroll the machine in the
global registry:

```typescript
// src/auth/auth.machine.ts
import { createMachine, registerMachine, typings } from '@bemedev/app';

const machine = createMachine(
  {
    /* config */
  },
  typings({
    /* types */
  }),
);

registerMachine('./src/auth/auth.machine.ts', machine);

export { machine };
```

### 12.2 CLI: generate

Run once to scan all machine files and produce `app.gen.ts`:

```bash
# Default — writes to app.gen.ts at project root
npx app-ts generate

# Custom output path
npx app-ts generate --output src/app.gen.ts

# Exclude additional directories
npx app-ts generate --excludes temp build coverage

# Preview output without writing to disk
npx app-ts generate --dry-run | less
```

Or use the npm script defined in `package.json`:

```bash
pnpm run generate:test
```

### 12.3 CLI: watch / dev

Long-running watcher that regenerates `app.gen.ts` automatically on every
machine file change. Ideal during development:

```bash
npx app-ts watch
# or the alias:
npx app-ts dev

# Alongside a dev server
pnpm run dev &
pnpm run generate:watch
```

**Behaviour:**

1. Performs a full initial generation on startup.
2. Watches all `*.machine.ts` and `*.fsm.ts` files (excludes
   `node_modules`, `lib`, `dist` by default).
3. Debounces 300 ms of filesystem stability before regenerating (handles
   editor auto-saves and git checkouts gracefully).
4. Logs every detected change to stderr.
5. Responds to Ctrl+C with a clean watcher shutdown.

### 12.4 `app.gen.ts` and the `Register` interface

`app.gen.ts` is a TypeScript module augmentation file. It declares:

```typescript
declare module '@bemedev/app' {
  interface Register {
    './src/auth/auth.machine.ts': {
      paths: { map: { '/idle': ..., '/loading': ... }; all: string };
      events: 'LOGIN' | 'LOGOUT' | 'REFRESH';
      options: {
        actions: 'setUser' | 'clearUser';
        guards:  'isLoggedIn';
        delays:  never;
        // ...
      };
      pContext?: { token: string | undefined };
      tags?: 'authenticated' | 'guest';
    };
    // ... one entry per discovered machine
  }
}
```

**Import `app.gen.ts` once at your app entry point** and every
`getMachine`, `registerMachine`, and state path will be fully typed
throughout the codebase:

```typescript
// main.ts
import './app.gen';
```

### 12.5 `registerMachine` & `getMachine`

```typescript
import { registerMachine, getMachine, MACHINES } from '@bemedev/app';

// Register a machine under a path key
registerMachine('./src/auth/auth.machine.ts', machine);

// Retrieve a machine by path key (fully typed via Register)
const authMachine = getMachine('./src/auth/auth.machine.ts');
// authMachine is typed to the exact shape declared in Register

// Access all registered machines (Record<string, AnyMachine>)
console.log(Object.keys(MACHINES));
```

<br/>

</details>

---

## 13. Legacy Options (\_legacy)

<details>
<summary>Expand</summary>

Both `provideOptions` and `addOptions` receive a second parameter
`{ _legacy }` containing **all options defined in previous calls**. This
enables safe composition without manual cross-referencing.

### Composing on a Machine

```typescript
const machine = createMachine(config, types)
  .provideOptions(({ assign }) => ({
    actions: {
      increment: assign(
        'context.count',
        ({ context }) => context.count + 1,
      ),
    },
  }))
  .provideOptions(({ batch }, { _legacy }) => ({
    actions: {
      // Reuse 'increment' defined above — no import, no circular reference
      doubleIncrement: batch(
        _legacy.actions.increment!,
        _legacy.actions.increment!,
      ),
    },
  }));
```

### Composing on an Interpreter

```typescript
const service = interpret(machine, { context: 0 });

service.addOptions(({ assign }) => ({
  actions: { add5: assign('context', ({ context }) => context + 5) },
}));

service.addOptions(({ batch }, { _legacy }) => ({
  actions: {
    add10: batch(_legacy.actions.add5!, _legacy.actions.add5!),
  },
}));
```

### `_legacy` properties

| Property           | Content                             |
| ------------------ | ----------------------------------- |
| `_legacy.actions`  | All previously defined actions      |
| `_legacy.guards`   | All previously defined guards       |
| `_legacy.delays`   | All previously defined delays       |
| `_legacy.machines` | All previously defined child actors |
| `_legacy.emitters` | All previously defined emitters     |

**Key guarantees:**

- **Frozen** — `_legacy` is immutable; mutations throw at runtime.
- **Cumulative** — each call sees options from _all_ previous calls, not
  just the immediately preceding one.
- **Type-safe** — fully typed; IntelliSense completes option names.

<br/>

</details>

---

## 14. Internal Utilities

<details>
<summary>Expand</summary>

These lower-level building blocks are used by the library internally. They
are exported for advanced use cases such as building tooling, custom
generators, or extending the framework.

### 14.1 `BetterSet<T>`

An enhanced `Set` with optional custom equality, extra collection
operations (`union`, `intersection`, `difference`, `symmetricDifference`),
and a richer API:

```typescript
import { createBetterSet } from '@bemedev/app';

const s = createBetterSet<string>();
s.add('a', 'b', 'c');
s.has('b'); // true
s.isEmpty; // false
s.toArray; // ['a', 'b', 'c']
s.size; // 3

// Set algebra
const other = createBetterSet<string>();
other.add('b', 'd');

const common = (a: string, b: string) => a === b;
s.intersection(other, common).toArray; // ['b']
s.difference(other, common).toArray; // ['a', 'c']

// Custom equality (deduplicate by id)
const byId = createBetterSet<{ id: number }>((a, b) => a.id === b.id);
byId.add({ id: 1 }, { id: 1 }); // deduplicated — size = 1
```

### 14.2 `parseTree`

Traverses a machine's `NodeConfig` and returns a complete structural
analysis in a single pass:

```typescript
import { parseTree } from '@bemedev/app';

const result = parseTree(machine.config);

result.paths.all; // string[] — all state paths ('/idle', '/loading', ...)
result.paths.map; // typed map: path → NodeConfig
result.actions; // BetterSet<string> — all action names
result.guards; // BetterSet<string> — all guard names
result.delays; // BetterSet<string> — all delay names
result.emitters; // BetterSet<string> — all emitter names
result.children; // BetterSet<string> — all child actor names
result.events; // BetterSet<string> — all event names
result.tags; // BetterSet<string> — all tag values
result.pContextKeys; // BetterSet<string> — pContext mapping keys
result.flat; // flat record: path → NodeConfig
```

`parseTree` powers the CLI generator — it extracts everything the type
generator needs from the machine config without executing any runtime code.

### 14.3 `reduceGuards`

Flattens nested AND/OR guard unions into a deduplicated flat array:

```typescript
import { reduceGuards } from '@bemedev/app';

reduceGuards(
  { and: ['isLoggedIn', 'isAdmin'] },
  { or: ['hasRole', 'isOwner'] },
  'isActive',
);
// → ['isLoggedIn', 'isAdmin', 'hasRole', 'isOwner', 'isActive']
```

<br/>

</details>

---

## 15. API Reference

<details>
<summary>Expand</summary>

### Machine creation

#### `createMachine(config, types?)`

| Parameter | Description                                                                             |
| --------- | --------------------------------------------------------------------------------------- |
| `config`  | Machine configuration — `initial`, `states`, `actors?`                                  |
| `types`   | Type definitions via `typings(...)` — `context`, `eventsMap`, `actorsMap?`, `pContext?` |

Returns a `Machine` instance. Chainable via `.provideOptions(...)`.

#### `createConfig(config)`

Returns a typed config object (no `Machine` instance created).

### Machine methods

| Method                | Mutates | Returns        | Description                        |
| --------------------- | ------- | -------------- | ---------------------------------- |
| `.provideOptions(cb)` | No      | New `Machine`  | Wire implementations (immutable)   |
| `.addOptions(cb)`     | **Yes** | Options object | Add / overwrite options at runtime |
| `.clone()`            | No      | New `Machine`  | Deep clone the machine             |

### `interpret(machine, options?)`

| Option     | Default     | Description               |
| ---------- | ----------- | ------------------------- |
| `context`  | —           | Initial public context    |
| `pContext` | `undefined` | Initial private context   |
| `mode`     | `'strict'`  | `'strict'` \| `'normal'`  |
| `exact`    | `true`      | Use exact interval timing |

### Interpreter properties

| Property  | Type                               | Description                       |
| --------- | ---------------------------------- | --------------------------------- |
| `value`   | `StateValue`                       | Current state (string or nested)  |
| `context` | `Tc`                               | Current public context            |
| `status`  | `'idle' \| 'working' \| 'stopped'` | Lifecycle status                  |
| `state`   | `StateExtended`                    | Full state snapshot               |
| `config`  | `NodeConfig`                       | Current state node configuration  |
| `mode`    | `'strict' \| 'normal'`             | Current execution mode            |
| `tags`    | `string[]`                         | Active tags for the current state |

### Interpreter methods

| Method                                 | Description                                      |
| -------------------------------------- | ------------------------------------------------ |
| `start()`                              | Start the service and process entry actions      |
| `send(event)`                          | Send an event (string or `{ type, payload }`)    |
| `subscribe(subscriber)`                | Subscribe to state changes                       |
| `pause()`                              | Pause activities and timers                      |
| `resume()`                             | Resume after pause                               |
| `stop()`                               | Stop the service                                 |
| `addOptions(cb)`                       | Mutate the service with new options              |
| `provideOptions(cb)`                   | Return a **new** service with additional options |
| `dispose()`                            | Synchronous disposal                             |
| `await service[Symbol.asyncDispose]()` | Async disposal (waits for in-flight promises)    |

### State configuration shape

```typescript
{
  type?:       'atomic' | 'compound' | 'parallel' | 'final';
  initial?:    string;
  tags?:       string[];
  entry?:      ActionConfig;
  exit?:       ActionConfig;
  on?:         Record<string, TransitionConfig>;
  after?:      Record<string, TransitionConfig>;
  always?:     TransitionConfig | TransitionConfig[];
  activities?: Record<string, ActionConfig>;
  actors?:     Record<string, ActorConfig>;
  states?:     Record<string, StateDefinition>;
}
```

### Transition configuration

```typescript
type TransitionConfig =
  | string // Target path
  | {
      target?: string;
      guards?: GuardConfig;
      actions?: ActionConfig;
    }
  | TransitionConfig[]; // Array — first match wins
```

### `Pausable<T>` interface

```typescript
type Pausable<T> = {
  subscribe: (observer: EmitterObserver<T>) => void;
  start: () => void; // begin consuming source
  stop: () => void; // stop and clean up
  pause: () => void; // buffer incoming values
  resume: () => void; // replay buffer then resume
};

type EmitterObserver<T> = {
  next: (value: T) => void;
  error: (err: any) => void;
  complete: () => void;
};
```

### Typings utilities

| Utility                                | Produces                            |
| -------------------------------------- | ----------------------------------- |
| `typings.litterals(...values)`         | Literal union                       |
| `typings.union(...types)`              | Union type                          |
| `typings.array(type)`                  | Array type                          |
| `typings.tuple(...types)`              | Tuple type                          |
| `typings.any(schema)`                  | Object schema                       |
| `typings.record(type, ...keys?)`       | Record type                         |
| `typings.intersection(...schemas)`     | Intersection type                   |
| `typings.discriminatedUnion(key, ...)` | Discriminated union                 |
| `typings.maybe(type)`                  | `T \| undefined`                    |
| `typings.partial(schema)`              | All fields optional                 |
| `typings.custom<T>()`                  | Escape hatch — any TypeScript type  |
| `typings.soa(type)`                    | `T \| T[]`                          |
| `typings.sv`                           | `StateValue`                        |
| `inferT<Schema>`                       | Extract TypeScript type from schema |

### Advanced Exported Types

These advanced helper and registry types are exported from `@bemedev/app`
for strict compile-time checks, tooling integration, or typing extension
points:

| Type                                | Purpose                                                                                                                    |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `Action2<E, Pc, Tc, T>`             | Standard function signature for an action callback (takes `StateExtended` and returns a sync or async `ActionResult`).     |
| `ActorsConfigMap`                   | Core type representing the entire actors registry map (consisting of `children`, `emitters`, and `promisees` definitions). |
| `ToEventObject<T>`                  | Utility type that converts event configurations into a unified `EventObject` interface.                                    |
| `ToEvents<E, A>`                    | Combines and maps standard events, child actors, emitters, and promisees into a unified, flat event map.                   |
| `DelayFunction2<E, Pc, Tc, T>`      | The signature for delayed transition functions (resolves to a `number` or a context-aware function returning a `number`).  |
| `EmitterFunction2<E, Pc, Tc, T, R>` | Type for emitter sources (takes `StateExtended` and returns a framework-agnostic `Pausable<R>` instance).                  |
| `PredicateS<E, Tc, T>`              | Type signature for guard predicate functions (takes a reduced state `State<E, Tc, T>` and returns `boolean`).              |

### CLI

```bash
app-ts generate [--output path] [--excludes dirs...] [--dry-run]
app-ts watch    [--output path] [--excludes dirs...]
app-ts dev      [--output path] [--excludes dirs...]   # alias for watch
```

<br/>

</details>

---

## Changelog

[View CHANGELOG.md](https://github.com/chlbri/app-ts/blob/main/CHANGELOG.md)

<br/>

## Contributing

Contributions are welcome! Please open an issue or pull request on
[GitHub](https://github.com/chlbri/app-ts).

<br/>

## License

MIT

<br/>

## Author

**chlbri** — [bri_lvi@icloud.com](mailto:bri_lvi@icloud.com)

[GitHub profile](https://github.com/chlbri?tab=repositories) ·
[Website](https://bemedev.vercel.app)
