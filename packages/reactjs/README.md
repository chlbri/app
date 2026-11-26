# @bemedev/app-reactjs

ReactJS state hook binding for `@bemedev/app` state machines.

`@bemedev/app-reactjs` provides a lightweight hook to track and select state from a
`@bemedev/app` interpreter service inside ReactJS component trees.

> [!WARNING]
> **Upcoming 4.0.0 — breaking changes across the whole `@bemedev/app` family,
> `@bemedev/app-contract` included.** The release focuses on AI agents and removes
> `description` from **every** token — **actions included** — in contracts and
> machines alike. The `{ name, description }` (`Describer`) form is no longer
> accepted: reference actions and guards by their plain string name, while states,
> actors, activities and transitions lose the field outright. Descriptions for any
> token are added with the new `describe` method, available on both contracts and
> machines. See the
> [@bemedev/app roadmap](https://github.com/chlbri/app/blob/main/packages/app/README.md#upcoming-400).

<br/>

## Demo

Check out the live interactive demo on Vercel:
[https://bemedev-app-reactjs.vercel.app](https://bemedev-app-reactjs.vercel.app)

<br/>

## Installation

```bash
npm install @bemedev/app-reactjs
# or
pnpm add @bemedev/app-reactjs
```

> **Requirements:** Node.js ≥ 24 · `@bemedev/app` ≥ 2.0.0 · React ≥ 18.0.0

<br/>

## Quick Start

```typescript
import { interpret } from '@bemedev/app';
import { useService } from '@bemedev/app-reactjs';
import { myMachine } from './my.machine';

const service = interpret(myMachine, { context: { count: 0 } });
service.start();

function MyComponent() {
  // `useService` returns the `state`, `can` and `isInside` helpers.
  const hooks = useService(service);

  // 1. Select a specific slice of context
  const count = hooks.state({ selector: s => s.context.count });

  // 2. Or track the active state value
  const stateValue = hooks.state({ selector: s => s.value });

  // 3. Or track the whole state object
  const state = hooks.state();

  // 4. Reactive event and state hierarchy queries
  const canStart = hooks.can('START');
  const isInsideIdle = hooks.isInside('idle');

  return (
    <div>
      <p>Count: {count}</p>
      <p>State: {JSON.stringify(stateValue)}</p>
      <p>Can start: {String(canStart)}</p>
      <p>Inside idle: {String(isInsideIdle)}</p>
    </div>
  );
}
```

<br/>

## Available Hooks

The package also exports `useState`, `useCan`, and `useIsInside`. They accept the
same service object as `useService`:

```typescript
import { useCan, useIsInside, useState } from '@bemedev/app-reactjs';

const count = useState(service, { selector: state => state.context.count });
const canIncrement = useCan(service)('INCREMENT');
const isInside = useIsInside(service)('some.state');
```

`useCan` and `useIsInside` return a callable helper exposing `.or` and `.and`:

```typescript
const canLoad = useCan(service).or('FETCH', 'RETRY');
const insideLoading = useIsInside(service).and('authenticated', 'loading');
```

<br/>

## API Reference

### `useService(service)`

Creates the service helpers that re-render whenever the interpreter transitions,
using deep comparison to prevent unnecessary renders.

| Property   | Type                               | Description                                                              |
| ---------- | ---------------------------------- | ------------------------------------------------------------------------ |
| `state`    | `(options?: UseStateOptions) => T` | Selects machine state or a context slice.                                |
| `can`      | `(...events: string[]) => boolean` | Checks whether the given event(s) can be accepted (`can.or`, `can.and`). |
| `isInside` | `(...states: string[]) => boolean` | Checks whether the machine is inside the given state hierarchies.        |

### `UseStateOptions`

| Option        | Type                  | Description                                                                                                   |
| ------------- | --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `selector`    | `(state: State) => T` | Optional selector function projecting machine state into a sub-state slice.                                   |
| `equals`      | `Dequal_F<T>`         | Optional equality comparator function comparing previous and next selected state (defaults to `deepEqual`).   |
| `stateEquals` | `Dequal_F<State>`     | Optional equality comparator function comparing raw machine state before selection (defaults to `deepEqual`). |

<br/>

## License

MIT
