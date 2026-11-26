# @bemedev/app-plugins

Plugin runtime and built-in addons for [`@bemedev/app-options`](../options) and
[`@bemedev/app`](../../app).

A plugin is the lazy map returned by `createUtilities`. The map is resolved against
the addons supplied by `createOptions`, so a plugin only adds utilities on top of the
default helpers and never runs its builder eagerly.

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

## Installation

```bash
pnpm add @bemedev/app-plugins
```

---

## Defining a plugin

```ts
import { createUtilities, same } from '@bemedev/app-plugins';

export const retryPlugin = createUtilities({}, () => ({
  retry: same((count: number, action: () => unknown) => action),
}));
```

Attach the plugin with `createOptions`:

```ts
import { createOptions } from '@bemedev/app-options';
import { retryPlugin } from './retry.plugin';

const options = createOptions(contract).use(retryPlugin)(({ retry }) => ({
  actions: { load: retry(3, fetchAction) },
}));
```

Plugins are applied in the order they are given: a later plugin replaces an earlier
utility with the same name, while the default addons (`assign`, `filter`, …) can
never be replaced.

### Contract-aware builders

Pass a contract to type the builder arguments. `utilities` contains the default
helpers merged with every plugin applied before the current one:

```ts
import { createUtilities, same } from '@bemedev/app-plugins';

const logPlugin = createUtilities({ contract }, ({ contract, utilities }) => ({
  log: same((message: string) =>
    utilities.retry.sync(1, () => console.log(message)),
  ),
}));
```

---

## API

| Export            | Kind | Description                                                    |
| ----------------- | ---- | -------------------------------------------------------------- |
| `createUtilities` | Fn   | Builds the lazy plugin map of a utility module.                |
| `same`            | Fn   | Declares one implementation for both `sync` and `async` modes. |
| `RESOLVE`         | Sym  | Resolves the whole utility map eagerly and synchronously.      |
| `Addons`          | Type | Built-in helper map injected by `createOptions`.               |
| `SyncAddons`      | Type | Synchronous helper surface resolved from `Addons`.             |
| `AsyncAddons`     | Type | Asynchronous helper surface resolved from `Addons`.            |
| `UtilityPair`     | Type | Synchronous and asynchronous variants of one utility.          |
| `UtilityMap`      | Type | Map of utility names to their implementations.                 |
| `UtilityMode`     | Type | `'sync'` or `'async'`.                                         |
| `PluginPair`      | Type | Synchronous and asynchronous factories of one plugin utility.  |
| `PluginMap`       | Type | Map of plugin utility names to their factories.                |
| `AnyMachine`      | Type | Machine surface with contract-derived properties.              |
| `MachineType`     | Type | Machine classification: `'sync'` or `'async'`.                 |

### Resolving the whole map

Some consumers need to enumerate the utilities instead of reading a known key. Use
the `RESOLVE` symbol to build the map once, synchronously:

```ts
import { RESOLVE } from '@bemedev/app-plugins';

const utilities = retryPlugin[RESOLVE](addons);
```

---

## Subpath exports

| Subpath                          | Content                                          |
| -------------------------------- | ------------------------------------------------ |
| `@bemedev/app-plugins/addons`    | Addon types and helpers injected into options.   |
| `@bemedev/app-plugins/bemedev`   | Re-exports of `@bemedev/app-utils-bemedev`.      |
| `@bemedev/app-plugins/decompose` | Re-exports of `@bemedev/decompose`.              |
| `@bemedev/app-plugins/internal`  | Internal helpers kept out of the public surface. |
| `@bemedev/app-plugins/same`      | The `same` helper only.                          |
| `@bemedev/app-plugins/types`     | Utility and plugin types only.                   |
| `@bemedev/app-plugins/typings`   | Re-exports of `@bemedev/typings`.                |

---

## License

MIT
