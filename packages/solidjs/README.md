# @bemedev/app-solidjs

SolidJS reactive signal and primitive bindings for `@bemedev/app` state machines.

`@bemedev/app-solidjs` provides lightweight SolidJS primitives to track, select, and
query state from a `@bemedev/app` interpreter service inside SolidJS reactive
contexts.

<br/>

## Demo

Check out the live interactive demo on Vercel:
[https://app-solidjs.vercel.app](https://app-solidjs.vercel.app)

<br/>

## Installation

```bash
npm install @bemedev/app-solidjs
# or
pnpm add @bemedev/app-solidjs
```

> **Requirements:** Node.js ≥ 24 · `@bemedev/app` ≥ 2.5.0 · SolidJS ≥ 1.9.0

<br/>

## Quick Start

```typescript
import { interpret } from '@bemedev/app';
import { createService } from '@bemedev/app-solidjs';
import { createRoot } from 'solid-js';
import { myMachine } from './my.machine';

const service = interpret(myMachine, { context: { count: 0 } });
service.start();

createRoot(dispose => {
  const hooks = createService(service);

  // 1. Select a specific slice of context reactively
  const count = hooks.state({ selector: s => s.context.count });

  // 2. Or track the active state value reactively
  const stateValue = hooks.state({ selector: s => s.value });

  // 3. Or track the whole state object
  const state = hooks.state();

  // 4. Reactive event and state hierarchy queries
  const canStart = hooks.can('START');
  const isInsideIdle = hooks.isInside('idle');

  // Example consumption in SolidJS
  console.log(count()); // -> 0
  console.log(stateValue()); // -> "idle"
  console.log(canStart()); // -> true
  console.log(isInsideIdle()); // -> true

  dispose();
});
```

<br/>

## Available Primitives

The package also exports standalone primitives `createState`, `createCan`, and
`createIsInside`:

```typescript
import { createState, createCan, createIsInside } from '@bemedev/app-solidjs';

const count = createState(service, { selector: state => state.context.count });
const canIncrement = createCan(service)('INCREMENT');
const isInside = createIsInside(service)('some.state');
```

<br/>

## API Reference

### `createService(service)`

Creates a service helper object containing reactive primitives (`state`, `can`,
`isInside`) bound to the interpreter service.

| Property          | Type                                            | Description                                                                                         |
| ----------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `state(options?)` | `(options?: CreateStateOptions) => Accessor<T>` | Creates a reactive signal selecting machine state or context slices with deep equality comparators. |
| `can`             | `(...events: string[]) => Accessor<boolean>`    | Returns reactive signal checking if given event(s) can be accepted (`can.or`, `can.and`).           |
| `isInside`        | `(...states: string[]) => Accessor<boolean>`    | Returns reactive signal checking if the machine is inside active state hierarchies.                 |

### `CreateStateOptions`

| Option        | Type                  | Description                                                                                                   |
| ------------- | --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `selector`    | `(state: State) => T` | Optional selector function projecting machine state into a sub-state slice.                                   |
| `equals`      | `Dequal_F<T>`         | Optional equality comparator function comparing previous and next selected state (defaults to `deepEqual`).   |
| `stateEquals` | `Dequal_F<State>`     | Optional equality comparator function comparing raw machine state before selection (defaults to `deepEqual`). |

<br/>

## License

MIT
