# `@bemedev/app-utility`

Typed sync/async utility maps and plugins for
[`@bemedev/app`](https://github.com/chlbri/app).

A _utility_ is a single helper declared with one implementation per execution mode.
Keeping both flavors in the same descriptor removes the drift between two
hand-maintained surfaces and lets one plugin serve synchronous and asynchronous
machines.

The package is dependency-free: it knows nothing about machines, contracts or
options.

## Installation

```bash
pnpm add @bemedev/app-utility
```

## Usage

```typescript
import { createUtility, same } from '@bemedev/app-utility';

const utilities = createUtility()
  .add(
    'noop',
    same(() => () => ({})),
  )
  .add('delay', {
    sync: (value: number) => value,
    async: async (value: number) => value,
  })
  .build();

const sync = utilities.resolve('sync');
const async = utilities.resolve('async');
```

## Plugins

```typescript
import { createUtility, same, type UtilityPlugin } from '@bemedev/app-utility';

const doublePlugin = {
  name: 'double',
  create: () => ({ double: same((value: number) => value * 2) }),
} satisfies UtilityPlugin;

const quadruplePlugin = {
  name: 'quadruple',
  requires: ['double'],
  create: ({ utilities }) => ({
    quadruple: same((value: number) =>
      utilities.double.sync(utilities.double.sync(value)),
    ),
  }),
} satisfies UtilityPlugin;

const sync = createUtility()
  .useAll([quadruplePlugin, doublePlugin])
  .build()
  .resolve('sync');
```

`create` receives the contract, the configuration, the event names, the legacy
options and the utilities built so far. `requires` is resolved with a topological
sort; missing dependencies and cycles throw, duplicate utility keys throw unless the
plugin sets `override: true`.

## API

| Export                | Kind | Description                                                |
| --------------------- | ---- | ---------------------------------------------------------- |
| `createUtility`       | Fn   | Creates a typed builder (`add`, `use`, `useAll`, `build`). |
| `same`                | Fn   | Declares one implementation for both modes.                |
| `mergeUtilities`      | Fn   | Merges two descriptor maps with the duplicate policy.      |
| `orderPlugins`        | Fn   | Sorts plugins by `requires`.                               |
| `UtilityPair`         | Type | Synchronous and asynchronous variants of one utility.      |
| `UtilityMap`          | Type | Map of utility names to descriptors.                       |
| `UtilityMode`         | Type | `'sync'` or `'async'`.                                     |
| `UtilityPlugin`       | Type | Plugin contributing utilities.                             |
| `UtilityContext`      | Type | Context received by a plugin `create` function.            |
| `ResolveUtilities`    | Type | Projects a descriptor map to one mode.                     |
| `PluginUtilities`     | Type | Utilities added by a plugin type.                          |
| `PluginUnion`         | Type | Utilities added by a tuple of plugins.                     |
| `MergeUtilityMaps`    | Type | Merges two maps, the second one winning.                   |
| `UnionToIntersection` | Type | Local copy of the standard helper.                         |

## License

MIT
