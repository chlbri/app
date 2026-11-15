# `@bemedev/interval3`

<br/>

A cancellable interval for Node.js whose delay is **recomputed on every pass**.
Instead of scheduling a native `setInterval` once and for all, `@bemedev/interval3`
runs a `while` loop: it calls the `interval` function, sleeps for the returned number
of milliseconds, then performs the action.

<br/>

## Installation

```bash
# Using npm
npm install @bemedev/interval3
```

```bash
# Using bun
bun add @bemedev/interval3
```

```bash
# Using pnpm
pnpm add @bemedev/interval3
```

```bash
# Using yarn
yarn add @bemedev/interval3
```

<br/>

## Difference with `@bemedev/interval2`

| Concern    | `@bemedev/interval2`                   | `@bemedev/interval3`                           |
| ---------- | -------------------------------------- | ---------------------------------------------- |
| `interval` | A `number` of milliseconds             | A `() => number` function                      |
| Scheduling | `setInterval` handle                   | `while` loop with `sleep(interval())`          |
| Delay      | Fixed once at creation                 | Recomputed on every pass                       |
| Pause      | Clears the handle, keeps the remainder | Stops the loop, the pending sleep is discarded |

Because the delay is computed just before each sleep, the interval can follow a
changing environment (backoff, adaptive polling, a signal, metrics, …).

<br/>

## Usage

```typescript
import { createInterval3 } from '@bemedev/interval3';

const random = () => Math.ceil(Math.random() * 1_000);

const interval = createInterval3({
  id: 'my-interval',
  // Called on every pass, right before sleeping.
  interval: random,
  callback: () => {
    console.log('Interval executed');
  },
});

interval.start();
interval.pause();
interval.resume();

const renewed = interval.renew({ interval: () => 2_000 });

interval.dispose();
```

<br/>

## API Reference

### `createInterval3(params)` / `createInterval(params)` / `create(params)`

All three names reference the same factory.

#### `IntervalParams`

- **`id`** (`string`, mandatory): unique identifier of the instance.
- **`callback`** (`Cb`, mandatory): action performed after each sleep.
- **`interval`** (`IntervalFn`, mandatory): function returning the delay in
  milliseconds, invoked on every pass.
- **`maxTicks`** (`number`, optional): maximum tick count before an automatic pause,
  defaults to `10_000` and is clamped to at least `1`.
- **`pauser`** (`PauserListener`, optional): predicate `(state, ticks) => boolean`,
  returning `true` pauses the interval.

#### Instance members

- **`start()`**: starts or resumes the loop, returns the current `TimerState`.
- **`pause()`**: pauses the loop, returns the current `TimerState`. The pass
  currently sleeping is not interrupted, it is discarded when it wakes up.
- **`resume()`**: alias for `start()`.
- **`renew(params: RenewIntervalParams)`**: returns a new instance, only `id` is
  required and the other options default to the current ones.
- **`subscribe(listener: IntervalListener)`**: listens to `(state, ticks)` changes
  and returns an unsubscribe function.
- **`dispose()`** / **`[Symbol.dispose]()`** / **`[Symbol.asyncDispose]()`**: marks
  the instance as `'disposed'` and clears subscribers.
- **`state`**: `'idle' | 'active' | 'paused' | 'disposed'`.
- **`ticks`**: number of executed callbacks.
- **`interval`**: the current delay computer.
- **`maxTicks`**: the configured tick limit.
- **`pauser`**: the configured pauser, if any.
- **`subscribed`**: `true` when at least one listener is registered.

<br/>

## Package exports

| Export Subpath                | Content                                                    |
| ----------------------------- | ---------------------------------------------------------- |
| `@bemedev/interval3`          | Interval factory and types                                 |
| `@bemedev/interval3/interval` | `createInterval3`, `createInterval`, `create`, `Interval3` |
| `@bemedev/interval3/timer`    | Abstract base class `Timer3`                               |
| `@bemedev/interval3/types`    | TypeScript type definitions                                |
| `@bemedev/interval3/helpers`  | Re-export of `@bemedev/sleep`                              |

<br/>

## Licence

MIT

<br/>

## Author

chlbri (bri_lvi@icloud.com)

[My github](https://github.com/chlbri?tab=repositories)
