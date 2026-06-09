# @bemedev/app-vitest

Declarative test sequence generator for `@bemedev/app` state machines
inside **Vitest**.

`@bemedev/app-vitest` allows you to write state machine integration tests
as a list of sequentially run, declarative test assertions, removing the
boilerplate of manual await-tick-assert cycles.

<br/>

## Installation

```bash
npm install @bemedev/app-vitest --save-dev
# or
pnpm add @bemedev/app-vitest -D
```

> **Requirements:** Node.js ≥ 24 · `@bemedev/app` ≥ 1.2.0 · Vitest ≥ 4.0.0

<br/>

## Quick Start

```typescript
import { interpret } from '@bemedev/app';
import { constructTests } from '@bemedev/app-vitest';
import { describe, test, vi } from 'vitest';
import { myMachine } from './my.machine';

describe('My Machine Integration', () => {
  const service = interpret(myMachine, { context: { count: 0 } });

  // 1. Initialize the declarative helpers
  const { start, useStateValue, send, stop } = constructTests(vi, service);

  // 2. Define sequence tests by spreading the generated tuples
  test(...start());
  test(...useStateValue('idle'));
  test(...send('INCREMENT'));
  test(...useStateValue('active'));
  test(...stop());
});
```

<br/>

## API Reference

### `constructTests(vi, service, helper?, startIndex?)`

| Parameter    | Type          | Description                                                                                   |
| ------------ | ------------- | --------------------------------------------------------------------------------------------- |
| `vi`         | `VitestUtils` | The Vitest `vi` utility object (required for fake timer management).                          |
| `service`    | `Interpreter` | The interpreter service instance under test (Sync or Async).                                  |
| `helper`     | `Function`    | Optional callback to define custom helpers (e.g. context assertions or custom event senders). |
| `startIndex` | `number`      | Optional starting sequence index (defaults to `0`).                                           |

Returns an object containing built-in assertions and any custom helpers
returned by the `helper` callback.

#### Built-in Assertion Helpers

Every function returns a `TestArr` (tuple of
`[inviteString, testCallback]`) designed to be spread directly into
Vitest's `test(...)` function:

- **`start(index?)`**: Starts the service and awaits initial task
  settlement.
- **`stop(index?)`**: Stops the service cleanly.
- **`dispose(index?)`**: Alias for `stop(index?)`.
- **`pause(index?)`**: Pauses the interpreter service activities and
  timers.
- **`resume(index?)`**: Resumes the interpreter service.
- **`send(event, index?)`**: Sends an event to the service and awaits
  transition settlement.
- **`useStateValue(value, index?)`**: Asserts that the current active state
  value matches `value`.
- **`useTags(...tags)`**: Asserts that the current state carries the
  specified active tags.
- **`useWarnings(...warnings)`**: Asserts that the service has logged the
  specified warning messages in its warning collector.
- **`useErrors(...errors)`**: Asserts that the service has logged the
  specified error messages in its error collector.
- **`changeIndex(fn)`**: Modifies the running test sequence index
  dynamically.
- **`unhandledRejection(testFn, error, timeout?)`**: Asserts that running
  `testFn` rejects with the expected `error` message (setup for
  `unhandledRejection` and `uncaughtException`).

---

### Custom Option Helpers

The third argument `helper` receives a configuration object exposing helper
factories to create customized, type-safe assertions:

```typescript
const { wait, sendFetch, checkCount } = constructTests(
  vi,
  service,
  ({ waiter, sender, contexts, service }) => ({
    // 1. A custom delay helper (automatically advances fake timers if active)
    wait: waiter(500),

    // 2. A strongly-typed event sender
    sendFetch: sender('FETCH'),

    // 3. A custom context selector assertion
    checkCount: contexts(({ context }) => context.count, 'count'),
  }),
);
```

#### Helper Factories:

- **`service`**: The underlying interpreter service instance (Sync or
  Async) under test.
- **`waiter(defaultDelay?)`**: Returns a function to wait for a delay in
  milliseconds. If Vitest fake timers are active, it automatically advances
  them using `vi.advanceTimersByTimeAsync()`.
- **`sender(eventType)`**: Returns a function to send a specific event type
  with its payload arguments.
- **`contexts(selector?, name?)`**: Returns a function asserting that the
  resolved value from the selector matches the expected value.

<br/>

## Advanced Example (with Fake Timers)

```typescript
import { interpret } from '@bemedev/app';
import { constructTests } from '@bemedev/app-vitest';
import { describe, test, vi, afterAll } from 'vitest';
import { timerMachine } from './timer.machine';

vi.useFakeTimers();

describe('Timer Machine tests', () => {
  const service = interpret(timerMachine, { context: { duration: 1000 } });

  const { start, useStateValue, wait, send } = constructTests(
    vi,
    service,
    ({ waiter }) => ({
      waitSecond: waiter(1000),
    }),
  );

  test(...start());
  test(...useStateValue('idle'));
  test(...send('START'));
  test(...useStateValue('running'));

  // Automatically advances Vitest fake timers by 1000ms
  test(...waitSecond());
  test(...useStateValue('completed'));
});

afterAll(() => vi.useRealTimers());
```

<br/>

## License

MIT
