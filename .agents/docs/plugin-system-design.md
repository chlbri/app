# Unified Utilities + Plugin System for `createOptions`

> Design document (read-only, no source files changed).
>
> Scope: `@bemedev/app-options`, `@bemedev/app`, and a new dependency-free core
> package (`@bemedev/app-utility`). Goal: stop duplicating option helpers, make every
> helper a _utility_, and allow libraries to register plugins that extend
> `createOptions` and everything derived from it.
>
> **Current evolution**: `@bemedev/app-utility` was merged into
> `@bemedev/app-options`. `createUtility(context, ...plugins)` is contract-aware,
> seeds the built-in helpers, applies the global registry, and exposes the contract
> to plugins. The sections below record the original design and are kept for
> historical context.

---

## 1. Goals and non-goals

### Goals

1. **One source of truth** for the helpers injected into option callbacks.
2. **Plugin system** usable at two levels:
   - **Library level** (a package ships a plugin and registers it once).
   - **Call level** (`createOptions(contract, plugin)` / `.use(plugin)`).
3. **Fully typed augmentation**: after adding a plugin, `({ retry }) => ...`
   type-checks, and unknown helpers are a compile error.
4. **One engine** behind every derived API:
   - `createOptions(contract)`
   - `machine.createOptions(fn)`
   - `machine.addOptions(fn)`
   - `machine.provideOptions(fn)`
   - `interpreter.addOptions(fn)`
   - machine factories (`createMachine`)
5. **New lib `@bemedev/app-utility`** exposing `createUtility()`, with `.add(...)`,
   `.use(...)`, `.build(...)`, `.resolve(mode)`.
6. Keep the current public API and behavior working.

### Non-goals

- Changing `ContractOptions` (the _result_ of options). Plugins add **helpers**, not
  new option categories; the resulting actions/guards still land in `actions`,
  `guards`, `delays`, `actors`.
- Making `@bemedev/app-options` depend on `@bemedev/app` (that would create a cycle).
  The dependency direction stays `app -> app-options -> app-utility -> app-contract`.
- Runtime auto-registration through bare imports (breaks `sideEffects: false` and
  tree-shaking; see §11).

---

## 2. Current state — where the duplication lives

| Concern                     | Current location                                                              | Problem                                                               |
| --------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Runtime sync helpers        | `packages/options/src/internal/sync.ts:22`                                    | Hand-maintained copy of the async surface                             |
| Runtime async helpers       | `packages/options/src/internal/async.ts:24`                                   | Hand-maintained copy of the sync surface                              |
| Shared runtime helpers      | `packages/options/src/internal/common.ts:27`                                  | Mixed into both copies                                                |
| Public helper types         | `packages/options/src/addons/index.ts:41` (`Addons`)                          | Declared once, good base                                              |
| Second public helper types  | `packages/options/src/types.ts` (`SyncOptionsHelpers`, `AsyncOptionsHelpers`) | Duplicates `SyncAddons` / `AsyncAddons`; drifts                       |
| Projection types            | `packages/options/src/addons/index.ts:195` (`SyncAddons`, `AsyncAddons`)      | Correct idea, not used as the runtime contract                        |
| Builder                     | `packages/options/src/createOptions.ts:67`                                    | Only picks `sync` vs `async`, no extension point                      |
| Machine sync                | `packages/app/src/sync/machine/machine.ts:87`                                 | Builds helpers directly via `createSyncHelpers(this.config)`          |
| Machine async               | `packages/app/src/asyncMachine/machine.ts:102`                                | Builds helpers directly via `createAsyncHelpers(this.config)`         |
| Internal helper copies      | `packages/options/src/internal/{objects,merge2,checkers,...}.ts`              | Duplicated from `@bemedev/app`                                        |
| Shared utils package        | `packages/utils/bemedev` (`@bemedev/app-utils-bemedev`)                       | Bundled into `app-options`, re-exported through `app-options/bemedev` |
| Lib-level extension pattern | `packages/contract/src/registry.types.ts:16` (`Register`)                     | Already uses `declare module` augmentation — reuse the pattern        |

Three definitions of the same surface (`Addons`, `SyncOptionsHelpers`, the runtime
return of `createSyncHelpers`) are the root cause. The plugin system must collapse
them into **one descriptor map**.

---

## 3. Target architecture

```
            +-------------------------------+
            |   @bemedev/app-utility        |   new, dependency-free
            |   createUtility / plugins     |
            +---------------+---------------+
                            |
              utilities map {sync, async}
                            |
            +---------------v---------------+
            |   @bemedev/app-options        |
            |   buildHelpers(config, mode)  |   single engine
            |   createOptions(contract, ...)|
            |   configureOptions(...)       |
            +---------------+---------------+
                            |
            +---------------v---------------+
            |   @bemedev/app                |
            |   machine.createOptions       |
            |   addOptions / provideOptions |
            |   interpreter.addOptions      |
            |   createMachine(..., { plugins })
            +-------------------------------+
```

### Three layers

1. **`@bemedev/app-utility`** — knows nothing about machines or contracts.
   - `UtilityPair`, `UtilityMap`, `UtilityPlugin`.
   - `createUtility()` builder with typed accumulation.
   - `resolveUtilities(map, mode)`.
2. **`@bemedev/app-options`** — knows contracts and option helpers.
   - Base utility map = today's `Addons<Ct>`.
   - `buildHelpers(config, mode, plugins)`.
   - `createOptions(contract, ...plugins)` + `.use(plugin)`.
   - `configureOptions({ plugins })` for library-level registration.
3. **`@bemedev/app`** — consumes only `buildHelpers` and re-exports the public plugin
   types. No new logic, no duplication.

---

## 4. Package layout

Create:

```
packages/utility/                        -> @bemedev/app-utility
  package.json
  src/index.ts
  src/types.ts                           UtilityPair, UtilityMap, ResolveUtilities
  src/plugin.ts                          UtilityPlugin, PluginUtilities
  src/createUtility.ts                   builder
  src/merge.ts                           merge + duplicate policy
```

Keep and refactor:

```
packages/options/src/
  addons/index.ts                        becomes BaseAddons + descriptor map
  internal/sync.ts                       returns descriptor map, not loose object
  internal/async.ts                      returns descriptor map, not loose object
  internal/engine.ts                     NEW: buildHelpers(config, mode, plugins)
  createOptions.ts                       thin wrapper around engine
  plugins/index.ts                       NEW: OptionsPlugin, configureOptions, registry
  types.ts                               delete SyncOptionsHelpers/AsyncOptionsHelpers
```

No changes to `packages/contract`, `reactjs`, `solidjs`, `valibot` are required at
first; they only consume `@bemedev/app`.

---

## 5. Core types (`@bemedev/app-utility`)

### 5.1 Utility descriptor

A utility always has a sync and an async flavor, exactly like `_Addons`.

```ts
import type { Fn } from '@bemedev/app-contract';

export type UtilityPair<S = Fn, A = Fn> = { sync: S; async: A };

export type UtilityMap = Record<string, UtilityPair<any, any>>;
```

For helpers whose implementation is mode-independent (e.g. `pauseTimer`, `erase`),
provide a `same()` normalization so plugin authors do not duplicate:

```ts
export const same = <F>(fn: F): UtilityPair<F, F> => ({ sync: fn, async: fn });
```

### 5.2 Projection by mode

```ts
export type ResolveUtilities<U extends UtilityMap, M extends 'sync' | 'async'> = {
  [K in keyof U]: U[K][M];
};
```

`ResolveUtilities<BaseAddons<Ct>, 'sync'>` must be structurally identical to the
existing `SyncAddons<Ct>`. That equality is the migration safety net.

### 5.3 Plugin type

```ts
export type UtilityContext<Ct extends Contract = Contract> = {
  readonly contract: Ct;
  readonly config: unknown;
  readonly eventsList: readonly string[];
  /** Already-built utilities, including built-ins. */
  readonly utilities: UtilityMap;
  /** Current legacy options (actions/guards/delays/actors). */
  readonly legacy: unknown;
};

export type UtilityPlugin<
  Adds extends UtilityMap = UtilityMap,
  Ct extends Contract = Contract,
> = {
  /** Stable identifier used for de-duplication and diagnostics. */
  name: string;
  /** Other plugin names that must be applied first. */
  requires?: readonly string[];
  /** Set to `true` to allow replacing an existing utility key. */
  override?: boolean;
  create: (ctx: UtilityContext<Ct>) => Adds;
};

export type PluginUtilities<P> = P extends UtilityPlugin<infer A, any> ? A : never;
```

### 5.4 Builder

```ts
export type UtilityBuilder<U extends UtilityMap = {}> = {
  add<const K extends string, S, A>(
    name: K,
    impl: UtilityPair<S, A>,
  ): UtilityBuilder<U & { [P in K]: UtilityPair<S, A> }>;

  use<const Ps extends readonly UtilityPlugin<any, any>[]>(
    ...plugins: Ps,
  ): UtilityBuilder<U & UnionToIntersection<PluginUtilities<Ps[number]>>>;

  build(): U;

  resolve<const M extends 'sync' | 'async'>(mode: M): ResolveUtilities<U, M>;
};
```

`UnionToIntersection` already exists in `@bemedev/app-utils-bemedev`; move a copy
into `app-utility` (it must stay dependency-free) or import only the type from
`app-contract` if it is re-exported there.

### 5.5 Runtime builder

```ts
export const createUtility = <U extends UtilityMap = {}>(
  seed?: U,
): UtilityBuilder<U> => {
  const utilities: UtilityMap = { ...(seed ?? {}) };

  const builder = {
    add(name: string, impl: UtilityPair) {
      if (name in utilities) throw new Error(`Utility "${name}" already exists`);
      utilities[name] = impl;
      return builder as never;
    },
    use(plugin: UtilityPlugin) {
      if (plugin.name in applied) return builder;
      applied.add(plugin.name);
      utilities.merge(plugin.create(ctx));
      return builder as never;
    },
    build: () => utilities,
    resolve: (mode: 'sync' | 'async') =>
      Object.fromEntries(Object.entries(utilities).map(([k, v]) => [k, v[mode]])),
  };

  return builder as never;
};
```

Key detail: `create` receives `ctx.utilities`, so a plugin can build on helpers that
already exist without importing them.

---

## 6. `@bemedev/app-options` engine

### 6.1 Base utilities

Refactor `Addons<Ct>` from an interface of loose entries into the **base descriptor
map**:

```ts
// addons/index.ts
export type BaseAddons<Ct extends Contract> = {
  isDefined: ValueDefined<Ct>;
  isNotDefined: ValueDefined<Ct>;
  isValue: ValueIs<Ct>;
  isNotValue: ValueIs<Ct>;
  guardBatch: { sync: ...; async: ... };
  swap: UtilityPair<Swap<Ct>>;
  assign: { sync: SyncAssign<Ct>; async: AsyncAssign<Ct> };
  batch: { sync: ...; async: ... };
  // ...
};

export type Addons<Ct extends Contract> = BaseAddons<Ct> & UtilityMap;
```

`SyncAddons` / `AsyncAddons` become:

```ts
export type SyncAddons<Ct extends Contract = Contract> = ResolveUtilities<
  BaseAddons<Ct>,
  'sync'
>;
export type AsyncAddons<Ct extends Contract = Contract> = ResolveUtilities<
  BaseAddons<Ct>,
  'async'
>;
```

This preserves the public names while making them derived, not duplicated.

### 6.2 Runtime: one descriptor map per mode

Today `createSyncHelpers` and `createAsyncHelpers` each return a finished object.
Change them to return `UtilityMap` fragments; the engine merges them with plugins and
projects once.

```ts
// internal/engine.ts
export type BuildHelpersOptions<Ct extends Contract> = {
  config: unknown;
  mode: 'sync' | 'async';
  plugins?: readonly UtilityPlugin<any, Ct>[];
};

export const buildHelpers = <Ct extends Contract>({
  config,
  mode,
  plugins = GLOBAL_PLUGINS,
}: BuildHelpersOptions<Ct>) => {
  const contract = undefined as unknown as Ct; // context only
  const common = createCommonHelpers(config);
  const base: UtilityMap = {
    ...common.utilities,
    ...createModeUtilities(config, mode),
  };

  const builder = createUtility(base);
  for (const plugin of order(plugins)) {
    builder.use({
      ...plugin,
      create: ctx =>
        plugin.create({ ...ctx, config, eventsList: common.eventsList }),
    });
  }

  return builder.resolve(mode);
};
```

`createModeUtilities(config, mode)` contains only the genuinely different helpers
(`assign`, `batch`, `_for`, `_while`, `_doWhile`, `action`, `sendTo`, `guardBatch`).
Everything else (`isValue`, `erase`, `filter`, `swap`, time actions, `resend`,
`forceSend`) is shared and declared once with `same()`.

### 6.3 `createOptions`

Keep the curried callable shape and add `.use`:

```ts
type CreateOptionsWith<C extends Contract, Ps extends readonly any[]> = {
  <const O extends ContractOptions<C>>(helper: OptionsHelperOf<C, Ps, O>): O;
  use<const Qs extends readonly UtilityPlugin<any, C>[]>(
    ...plugins: Qs,
  ): CreateOptionsWith<C, [...Ps, ...Qs]>;
};

export const createOptions = <
  const C extends Contract,
  const Ps extends readonly UtilityPlugin<any, C>[] = [],
>(
  contract: C,
  ...plugins: Ps
): CreateOptionsWith<C, Ps> => {
  const mode = contract.types?.sync === true ? 'sync' : 'async';

  const callable = (helper: (option: any, legacy: any) => any) =>
    helper(buildHelpers({ config: contract.config, mode, plugins }), legacy);

  return Object.assign(callable, {
    use: (...more: any[]) => createOptions(contract, ...plugins, ...more),
  }) as never;
};
```

Existing usage is unchanged:

```ts
createOptions(contract)(({ assign }) => ({ ... }));          // still works
createOptions(contract, retryPlugin)(({ retry }) => ({ ... })); // new
createOptions(contract).use(retryPlugin)(({ retry }) => ({ ... }));
```

### 6.4 `types.ts`

Delete `SyncOptionsHelpers` and `AsyncOptionsHelpers`. Replace with:

```ts
export type OptionsHelpers<
  C extends Contract,
  M extends 'sync' | 'async',
  Ps extends readonly UtilityPlugin<any, C>[] = [],
> = ResolveUtilities<
  BaseAddons<C> & UnionToIntersection<PluginUtilities<Ps[number]>>,
  M
>;

export type OptionsHelper<
  C extends Contract,
  O = ContractOptions<C>,
  Ps extends readonly any[] = [],
> =
  ContractSync<C> extends true
    ? (option: OptionsHelpers<C, 'sync', Ps>, legacy: LegacyOptions<C>) => O
    : (option: OptionsHelpers<C, 'async', Ps>, legacy: LegacyOptions<C>) => O;
```

This removes the largest drift risk in the package.

---

## 7. Library-level registration

### 7.1 Explicit registration (recommended)

`@bemedev/app-options` owns a small registry:

```ts
let GLOBAL_PLUGINS: readonly UtilityPlugin<any, any>[] = [];
let applied = new WeakSet<object>();

export const configureOptions = (plugins: readonly UtilityPlugin<any, any>[]) => {
  GLOBAL_PLUGINS = plugins;
};

export const registerOptionsPlugin = <P extends UtilityPlugin<any, any>>(
  plugin: P,
) => {
  if (!applied.has(plugin)) {
    applied.add(plugin);
    GLOBAL_PLUGINS = [...GLOBAL_PLUGINS, plugin];
  }
  return plugin;
};
```

A plugin library ships:

```ts
// @bemedev/app-options-retry
import { registerOptionsPlugin } from '@bemedev/app-options';

export const retryPlugin = {
  name: 'retry',
  create: ({ assign }) => ({
    retry: same((...args) => /* ... */),
  }),
} satisfies UtilityPlugin;

registerOptionsPlugin(retryPlugin);
```

The consuming application opts in once:

```ts
// app bootstrap
import '@bemedev/app-options-retry'; // registers
```

or explicitly, which is safer for SSR/tests:

```ts
configureOptions([retryPlugin, logPlugin]);
```

### 7.2 Type-only augmentation (no runtime)

For consumers who want the helper in the callback type in every module, a plugin
package can also augment `Addons` (pattern already used by `Register` in
`packages/contract/src/registry.types.ts:16`):

```ts
declare module '@bemedev/app-options' {
  interface Addons<Ct> {
    retry: UtilityPair<RetryHelper<Ct>>;
  }
}
```

Important: **augmentation only changes types**. The plugin must still be registered
at runtime. Document this explicitly, otherwise users get a runtime
`undefined is not a function` while the compiler is happy.

### 7.3 Why not auto-registration on import

`packages/options/package.json` declares `"sideEffects": false`. A bare import that
mutates a global registry violates that contract and can be dropped by bundlers. If
auto-registration is required, the plugin package must declare
`"sideEffects": ["./register.js"]` and expose a dedicated side-effect entry.

---

## 8. Integration of every derived API

The rule: **nothing calls `createSyncHelpers` directly anymore**. Everything calls
`buildHelpers`.

| API                               | File                                               | Change                                                                                   |
| --------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `createOptions`                   | `packages/options/src/createOptions.ts`            | delegates to `buildHelpers`                                                              |
| `machine.createOptions`           | `packages/app/src/sync/machine/machine.ts:87`      | `helper => helper(buildHelpers({config, mode:'sync', plugins: machinePlugins}), legacy)` |
| `machine.createOptions`           | `packages/app/src/asyncMachine/machine.ts:102`     | same with `'async'`                                                                      |
| `machine.addOptions`              | both machine classes                               | unchanged; it already consumes `createOptions`-shaped callbacks                          |
| `machine.provideOptions`          | both machine classes                               | unchanged                                                                                |
| `interpreter.addOptions`          | `packages/app/src/interpreters/interpreter.ts:755` | build options with `buildHelpers` once                                                   |
| `createMachine`                   | `packages/app/src/exports/createMachine.ts`        | optional `{ plugins }` in the types argument (overload, backward compatible)             |
| `reactjs` / `solidjs` / `valibot` | —                                                  | consume `@bemedev/app`; no change                                                        |

Machine-level plugin plumbing:

```ts
export type CreateMachineConfig<C extends Contract> = {
  plugins?: readonly UtilityPlugin<any, C>[];
};

export const createMachine = (
  nameOrConfig: any,
  configOrTypes?: any,
  typesOrConfig?: any,
) => {
  const { plugins, ...types } = typesOrConfig ?? {};
  // store plugins on the machine instance / class scope
};
```

Because `machine.createOptions` only has `this.config` (the contract is type-only at
runtime), the engine must accept `config` + `mode`, not a `Contract` object. That is
why `buildHelpers` lives below `createOptions`.

---

## 9. Example plugins

### 9.1 `retry`

```ts
import { same, type UtilityPlugin } from '@bemedev/app-utility';

export const retryPlugin = {
  name: 'retry',
  create: () => ({
    retry: same((times: number, action: any) => async (state: any) => {
      let last: any;
      for (let i = 0; i < times; i++) {
        try {
          return await action(state);
        } catch (e) {
          last = e;
        }
      }
      throw last;
    }),
  }),
} satisfies UtilityPlugin;
```

### 9.2 `log` (depends on `action`)

```ts
export const logPlugin = {
  name: 'log',
  requires: ['retry'],
  create: ({ utilities }) => ({
    log: same((message: string) => {
      const action = utilities.action.sync;
      return action(() => console.log(message));
    }),
  }),
} satisfies UtilityPlugin;
```

`requires` guarantees `utilities.retry` exists when `create` runs; the engine
performs a topological sort and throws a clear error on cycles or missing
dependencies.

### 9.3 Using `createUtility` standalone (the requested "app-utility" lib)

```ts
import { createUtility, same } from '@bemedev/app-utility';

const utilities = createUtility()
  .add(
    'noop',
    same(() => () => ({})),
  )
  .use(logPlugin)
  .build();

const sync = utilities.resolve('sync'); // typed { noop, log }
```

`createOptions` is just one consumer of this builder, so any future "create
something" API (`createActor`, `createInterpreter`) can reuse it.

---

## 10. Merge policy, ordering and caching

- **Duplicate keys**: throw by default. A plugin that intentionally overrides must
  set `override: true`; the engine then logs/records the replacement.
- **Reserved keys**: reject `assign`, `batch`, `action`, `sendTo`, `erase`, `filter`,
  `swap`, `guardBatch`, `isValue`, `isNotValue`, `isDefined`, `isNotDefined`, and the
  timer/activity helpers unless `override` is set.
- **Ordering**: topological sort from `requires`; stable order otherwise.
  Deterministic output is required by the existing snapshot-ish tests.
- **Caching**: `WeakMap<object, Map<string, unknown>>` keyed by `config` then
  plugin-name signature. `createOptions` currently rebuilds helpers on every call;
  caching removes that cost and is safe because helpers are pure at creation time.
- **Immutability**: freeze the resolved helper object (`Object.freeze`) before
  handing it to the user callback, consistent with the existing frozen legacy object.

---

## 11. Risks and mitigations

| Risk                                                                   | Impact                            | Mitigation                                                                                                                              |
| ---------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `Addons` index signature `Record<string, ...>` hides typos             | Wrong helper names compile        | Plugins augment a separate `PluginAddons` interface; keep `BaseAddons` closed, add an index signature only to the merged type if needed |
| Type augmentation without runtime registration                         | Compiles, crashes at runtime      | Document; expose `assertPluginRegistered` in dev; plugin packages export both the augmentation and the plugin object                    |
| `sideEffects: false` vs auto-registration                              | Plugin silently dropped           | Explicit `configureOptions`; side-effect entry if auto-registration is desired                                                          |
| Sync/async duplication                                                 | Plugin works sync but fails async | `UtilityPair` requires both; `same()` for identical implementations; type tests force both                                              |
| `app-options` importing `app`                                          | Cycle / broken build              | Engine stays in `app-options`; `app` only imports `buildHelpers`                                                                        |
| Global registry leaks between tests/requests                           | Non-deterministic helpers         | Reset function (`configureOptions([])`); per-call plugins take precedence; SSR recommendation: no global mutation                       |
| `bundleDependencies` / size-limit                                      | Package size grows                | `app-utility` is tiny and dependency-free; `app-options` bundles one extra file                                                         |
| Overloaded helper types (`assign`, `action`) lost through mapped types | Broken inference                  | `ResolveUtilities` maps the _type_ and preserves call signatures; add `expectTypeOf` tests for `assign`, `action`, `sendTo`             |
| Plugin ordering changes behavior                                       | Subtle regressions                | Explicit `requires`; no implicit ordering except registration order                                                                     |
| `Register` pattern conflicts                                           | Two augmentation systems          | Keep `Register` for option identifiers; plugins augment `Addons` only                                                                   |

---

## 12. Migration plan (phased, each step green)

### Phase 0 — characterization

- Add tests asserting the current helper names and behavior
  (`packages/__tests__/options/src/`), including type assertions with `expectTypeOf`.
- Snapshot `Object.keys(createSyncHelpers(config))` and the async equivalent.

### Phase 1 — extract `@bemedev/app-utility`

- New package, no dependency on `app`/`app-options`.
- Implement `UtilityPair`, `UtilityMap`, `ResolveUtilities`, `UtilityPlugin`,
  `createUtility`, `merge`, `same`.
- Unit tests only; nothing consumes it yet.

### Phase 2 — unify runtime in `app-options`

- Convert `createSyncHelpers` / `createAsyncHelpers` into descriptor-map producers.
- Add `buildHelpers`.
- Replace `createOptions` internals.
- Delete `SyncOptionsHelpers` / `AsyncOptionsHelpers`; keep `SyncAddons` /
  `AsyncAddons` as derived aliases.
- Verify the Phase 0 snapshots are unchanged.

### Phase 3 — plugins

- Add `plugins/` with `UtilityPlugin` re-export, `configureOptions`,
  `registerOptionsPlugin`.
- Add `createOptions(contract, ...plugins)` and `.use`.
- Add an internal test plugin (`log`) exercised in sync and async machines.

### Phase 4 — `app` integration

- `machine.createOptions` uses `buildHelpers`.
- `interpreter.addOptions` uses `buildHelpers`.
- `createMachine` accepts `{ plugins }` (additive overload).
- React/Solid/Valibot need no changes; add one smoke test each.

### Phase 5 — documentation and release

- README sections: "Writing a plugin", "Registering at library level", "Sync vs async
  utilities".
- CHANGELOG entries; this is a **minor** bump (`feat`), not breaking, because every
  existing overload remains valid.
- If `Addons` is converted from `interface` to `type`, that is potentially breaking
  for consumers doing `declare module` augmentation — keep it an `interface` to
  preserve augmentation compatibility.

---

## 13. Proposed file blueprint

```
packages/utility/
  package.json                        @bemedev/app-utility
  src/index.ts                        re-exports
  src/types.ts                        UtilityPair, UtilityMap, ResolveUtilities
  src/plugin.ts                       UtilityPlugin, PluginUtilities, same
  src/createUtility.ts                builder + merge policy
  src/merge.ts                        topological sort, duplicates

packages/options/src/
  addons/index.ts                     BaseAddons, Addons, SyncAddons, AsyncAddons
  internal/sync.ts                    createSyncUtilities(config): UtilityMap
  internal/async.ts                   createAsyncUtilities(config): UtilityMap
  internal/common.ts                  createCommonUtilities(config): UtilityMap
  internal/engine.ts                  buildHelpers({ config, mode, plugins })
  plugins/index.ts                    OptionsPlugin, configureOptions, registry
  createOptions.ts                    callable + .use
  types.ts                            OptionsHelpers, OptionsHelper (derived)
  index.ts                            export plugin types

packages/app/src/
  sync/machine/machine.ts             use buildHelpers
  asyncMachine/machine.ts             use buildHelpers
  interpreters/interpreter.ts         use buildHelpers
  exports/createMachine.ts            optional { plugins }
  registry.types.ts                   unchanged
```

---

## 14. Verification strategy

1. **Behavioral**: existing tests in `packages/__tests__/options` and
   `packages/__tests__/async` must pass unchanged.
2. **Type-level**:
   - `ResolveUtilities<BaseAddons<Ct>, 'sync'>` equals `SyncAddons<Ct>`.
   - `createOptions(contract).use(logPlugin)` exposes `log`.
   - Unknown helper is a `@ts-expect-error`.
   - Overloaded `assign` / `action` / `sendTo` keep their overloads.
3. **Plugin mechanics**:
   - duplicate key throws;
   - `override: true` replaces;
   - missing `requires` throws with the plugin name;
   - cyclic `requires` throws;
   - order is deterministic.
4. **Sync/async parity**: the same plugin test runs against both modes.
5. **Size**: run `size-limit` for `app-options` / `app` after Phase 4.

---

## 15. Open questions to decide before implementation

1. Package name: `@bemedev/app-utility` vs `@bemedev/app-utilities` — existing
   package `@bemedev/app-utils-bemedev` already occupies a similar name.
2. Should `configureOptions` be in `app-options` or `app`? Recommendation:
   `app-options`, re-exported by `app`.
3. Should plugins be able to add **option categories** (new top-level keys in the
   options result), not just helpers? Out of scope here; the current
   `ContractOptions` type would make it a larger breaking change.
4. Should `createOptions` cache by contract? Recommendation: cache by `config` +
   plugin signature inside `buildHelpers`.
5. Is `override: true` ever allowed for built-in helper names? Recommendation: only
   for third-party helper names, never for `assign`/`batch`/guards.
