# @bemedev/app-solidjs

SolidJS reactive signal binding for `@bemedev/app` state machines.

`@bemedev/app-solidjs` provides a lightweight integration to track and
select state from a `@bemedev/app` interpreter service inside SolidJS
reactive contexts.

<br/>

## Installation

```bash
npm install @bemedev/app-solidjs
# or
pnpm add @bemedev/app-solidjs
```

> **Requirements:** Node.js ≥ 24 · `@bemedev/app` ≥ 1.2.0 · SolidJS ≥ 1.9.0

<br/>

## Quick Start

```typescript
import { interpret } from '@bemedev/app';
import { useService } from '@bemedev/app-solidjs';
import { createRoot } from 'solid-js';
import { myMachine } from './my.machine';

const service = interpret(myMachine, { context: { count: 0 } });
service.start();

createRoot(dispose => {
  // 1. Select a specific slice of context reactively
  const count = useService(service, { selector: s => s.context.count });

  // 2. Or track the active state value reactively
  const stateValue = useService(service, { selector: s => s.value });

  // 3. Or track the whole state object
  const state = useService(service);

  // Example consumption in SolidJS
  console.log(count()); // -> 0
  console.log(stateValue()); // -> "idle"

  dispose();
});
```

<br/>

## API Reference

### `useService(service, options?)`

Creates a SolidJS signal that updates whenever the interpreter transitions,
using deep comparison to prevent unnecessary reactive notifications.

| Parameter | Type                | Description                                                                         |
| --------- | ------------------- | ----------------------------------------------------------------------------------- |
| `service` | `Interpreter`       | The `@bemedev/app` interpreter service instance.                                    |
| `options` | `UseServiceOptions` | Optional object containing `selector` and/or custom `equality` comparison function. |

Returns a SolidJS `Accessor<T>` containing the selected state or slice.

<br/>

## License

MIT
