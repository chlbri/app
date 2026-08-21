# @bemedev/app-reactjs

ReactJS state hook binding for `@bemedev/app` state machines.

`@bemedev/app-reactjs` provides a lightweight hook to track and select state from a
`@bemedev/app` interpreter service inside ReactJS component trees.

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
  // 1. Select a specific slice of context
  const count = useService(service, { selector: s => s.context.count });

  // 2. Or track the active state value
  const stateValue = useService(service, { selector: s => s.value });

  // 3. Or track the whole state object
  const state = useService(service);

  return (
    <div>
      <p>Count: {count}</p>
      <p>State: {JSON.stringify(stateValue)}</p>
    </div>
  );
}
```

<br/>

## Available Hooks

The package also exports `useState`, `useCan`, and `useIsInside` for common state
selection patterns:

```typescript
const count = useState(service, state => state.context.count);
const canIncrement = useCan(service, 'INCREMENT');
const isInside = useIsInside(service, 'some.state');
```

These helpers are designed to work with the same interpreter service and provide a
lightweight way to subscribe to state slices, transition permissions, and nested
state location checks.

<br/>

## API Reference

### `useService(service, options?)`

Creates a React state hook that updates whenever the interpreter transitions, using
deep comparison to prevent unnecessary renders.

| Parameter | Type                | Description                                                                         |
| --------- | ------------------- | ----------------------------------------------------------------------------------- |
| `service` | `Interpreter`       | The `@bemedev/app` interpreter service instance.                                    |
| `options` | `UseServiceOptions` | Optional object containing `selector` and/or custom `equality` comparison function. |

Returns the selected state or slice.

<br/>

## License

MIT
