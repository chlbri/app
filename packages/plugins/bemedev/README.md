# @bemedev/app-bemedev-plugins

Optional utilities for [`@bemedev/app`](../../app), delivered as
[options plugins](../../options). They are not part of the default helpers: opt in
explicitly with `use`.

## Installation

```bash
pnpm add @bemedev/app-bemedev-plugins
```

## `swap`

`swap` remaps the parameters of a standard function into machine-selector arguments
using decomposed paths. It works with actions, `assign`, guards, delays, and any
other location accepting a selector.

### As a plugin

```ts
import { createOptions } from '@bemedev/app-options';
import { swapPlugin } from '@bemedev/app-bemedev-plugins';

const options = createOptions(contract).use(swapPlugin)(({ swap, assign }) => ({
  actions: {
    setInput: assign(
      'context.input',
      swap((value: string) => value.trim(), 'WRITE')({ '[0]': '[0].payload.value' }),
    ),
  },
  guards: {
    isAdult: swap((age: number) => age >= 18)({ '[0]': '[0].context.user.age' }),
  },
}));
```

On a machine, attach the plugin through its types:

```ts
import { createMachine } from '@bemedev/app';
import { swapPlugin } from '@bemedev/app-bemedev-plugins';

const machine = createMachine(
  config,
  { plugins: [swapPlugin] },
).provideOptions(({ swap }) => ({ ... }));
```

### As a standalone function

```ts
import { swap } from '@bemedev/app-bemedev-plugins';

const readAge = swap((age: number) => age)({ '[0]': '[0].context.age' });
```
