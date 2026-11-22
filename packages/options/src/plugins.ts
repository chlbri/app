/**
 * Library-level plugin registry of `@bemedev/app-options`.
 *
 * Registration is explicit on purpose: the package declares
 * `"sideEffects": false`, so mutating a global registry from a bare import
 * would be dropped by bundlers.
 *
 * @module plugins
 */

import type { Contract } from '@bemedev/app-contract';
import type { BaseAddons } from './addons';
import { createAsyncUtilities } from './internal/async';
import { createCommonHelpers } from './internal/common';
import { createSyncUtilities } from './internal/sync';
import { mergePlugins, mergeUtilities, orderPlugins } from './utility';

import type {
  EmptyUtilities,
  LegacyOptions,
  MergeUtilityMaps,
  PluginUnion,
  ResolveUtilities,
  UtilityMap,
  UtilityMode,
  UtilityPair,
  UtilityPlugin,
} from './utility';

/** Utilities added by a tuple of plugins. */
export type PluginAddons<Ps extends readonly UtilityPlugin<any, any>[]> =
  PluginUnion<Ps>;

/**
 * Plugin type accepted by the options engine.
 *
 * It is an alias of {@linkcode UtilityPlugin}, kept for consumers that name
 * their plugins after the options API.
 *
 * @template | {@linkcode UtilityMap} `Adds` - Utilities added by the plugin.
 * @template | {@linkcode Contract} `Ct` - Contract type.
 */
export type OptionsPlugin<
  Adds extends UtilityMap = UtilityMap,
  Ct extends Contract = Contract,
> = UtilityPlugin<Adds, Ct>;

/** Plugins applied to every build, in registration order. */
let GLOBAL_PLUGINS: readonly OptionsPlugin<any, any>[] = [];

/** Plugin objects already registered through {@linkcode registerPlugins}. */
let applied = new WeakSet<object>();

/** Incremented whenever the global registry changes, invalidating caches. */
let version = 0;

/**
 * Replaces the global plugin list.
 *
 * Calling it with an empty list is the supported reset for tests and SSR.
 *
 * @param plugins - Plugins to apply to every build.
 */
export const configureOptions = <
  const Ct extends Contract = Contract,
  const T extends readonly OptionsPlugin<any, Ct>[] = readonly OptionsPlugin<
    any,
    Ct
  >[],
>(
  ...plugins: T
): T => {
  GLOBAL_PLUGINS = [...plugins];
  applied = new WeakSet();
  version++;

  return plugins;
};

/** Short alias of {@linkcode configureOptions}. */
export const configure = configureOptions;

/**
 * Appends a plugin to the global list, once per plugin object.
 *
 * @param plugin - Plugin to register.
 *
 * @returns The registered plugin, so a library can export the call result.
 */
export const registerPlugins = <
  const Ct extends Contract = Contract,
  const T extends readonly OptionsPlugin<any, Ct>[] = readonly OptionsPlugin<
    any,
    Ct
  >[],
>(
  ...plugins: T
): T => {
  plugins.forEach(plugin => {
    if (!applied.has(plugin)) {
      applied.add(plugin);
      GLOBAL_PLUGINS = [...GLOBAL_PLUGINS, plugin];
      version++;
    }
  });

  return plugins;
};

/** Short alias of {@linkcode registerPlugins}. */
export const register = registerPlugins;

/**
 * Removes every plugin with the given name.
 *
 * @param name - Plugin name to remove.
 *
 * @returns `true` when at least one plugin was removed.
 */
export const remove = (name: string) => {
  const previousLength = GLOBAL_PLUGINS.length;

  GLOBAL_PLUGINS = GLOBAL_PLUGINS.filter(plugin => plugin.name !== name);

  const removed = GLOBAL_PLUGINS.length !== previousLength;

  if (removed) version++;

  return removed;
};

/**
 * Reads the current global plugin list.
 *
 * @returns The registered plugins.
 */
export const getGlobalPlugins = () => GLOBAL_PLUGINS;

/**
 * Reads the registry version used by the helper cache.
 *
 * @returns A monotonically increasing version number.
 */
export const getPluginsVersion = () => version;

/**
 * Required context accepted by {@linkcode createUtility}.
 *
 * The contract is the single source of truth: the configuration, the execution
 * mode and the event list are all derived from it. `legacy` is optional and
 * defaults to empty options.
 *
 * `utilities` is not part of the input: the builder always seeds it with the
 * built-in helpers before applying any plugin.
 *
 * @template | {@linkcode Contract} `Ct` - Contract type.
 */
export type UtilityBuilderContext<Ct extends Contract = Contract> = {
  /** Contract the utilities are built for. */
  readonly contract: Ct;
  /** Current legacy options handed to plugins. */
  readonly legacy?: LegacyOptions<Ct>;
};

/**
 * Built utilities: the descriptor map plus a mode projection helper.
 *
 * @template | {@linkcode UtilityMap} `U` - Descriptor map.
 */
export type UtilityInstance<U extends object = EmptyUtilities> = U & {
  /**
   * Projects the built map to one execution mode.
   *
   * @param mode - Execution mode to project on.
   */
  resolve<const M extends UtilityMode>(mode: M): ResolveUtilities<U, M>;
};

/**
 * Typed accumulator returned by {@linkcode createUtility}.
 *
 * @template | {@linkcode UtilityMap} `U` - Descriptor map built so far.
 * @template | {@linkcode Contract} `Ct` - Contract type.
 */
export type UtilityBuilder<
  U extends object = EmptyUtilities,
  Ct extends Contract = Contract,
> = {
  /** Declares a new utility, throwing when the name already exists. */
  add<const K extends string, S, A>(
    name: K,
    impl: UtilityPair<S, A>,
  ): UtilityBuilder<U & { [P in K]: UtilityPair<S, A> }, Ct>;

  /** Applies plugins in `requires` order, extending the accumulated map. */
  use<const Ps extends readonly UtilityPlugin<any, Ct>[]>(
    ...plugins: Ps
  ): UtilityBuilder<MergeUtilityMaps<U, PluginUnion<Ps>>, Ct>;

  /** Freezes the accumulated map and returns it with `resolve`. */
  build(): UtilityInstance<U>;

  /** Projects the accumulated map to one execution mode. */
  resolve<const M extends UtilityMode>(mode: M): ResolveUtilities<U, M>;
};

/**
 * Creates a contract-aware utility builder.
 *
 * The builder starts with the built-in option helpers (`assign`, `filter`,
 * `guardBatch`, …) resolved for the contract mode, then applies the globally
 * registered plugins and finally the plugins passed to this call. Per-call
 * plugins win on shared names, so a consumer can override a library default.
 *
 * Plugins receive a frozen snapshot of the utilities built so far, including
 * the built-ins, and can therefore build on helpers they did not import.
 *
 * @param context - Contract (and optional legacy options) to build for.
 * @param plugins - Per-call plugins, applied after the registered ones.
 *
 * @returns A typed builder supporting `add`, `use`, `build` and `resolve`.
 *
 * @example
 * ```ts
 * import { createContract } from '@bemedev/app-contract';
 * import { createUtility, same } from '@bemedev/app-options';
 *
 * const contract = createContract(
 *   { initial: 'idle', states: { idle: { on: { INC: '/idle' } } } },
 *   { sync: true },
 * );
 *
 * const utilities = createUtility({ contract })
 *   .add('noop', same(() => () => ({})))
 *   .build();
 *
 * const sync = utilities.resolve('sync');
 * sync.assign('context.count', ({ context }) => context.count + 1);
 * ```
 */
export const createUtility = <
  const Ct extends Contract,
  const Ps extends readonly UtilityPlugin<any, Ct>[] = [],
>(
  context: UtilityBuilderContext<Ct>,
  ...plugins: Ps
): UtilityBuilder<MergeUtilityMaps<BaseAddons<Ct>, PluginUnion<Ps>>, Ct> => {
  const { contract } = context;

  if (!contract) {
    throw new Error('createUtility requires a context with a contract');
  }

  const config = contract.config;
  const mode: UtilityMode = contract.types?.sync === true ? 'sync' : 'async';

  const common = createCommonHelpers(contract);
  const modeUtilities =
    mode === 'sync'
      ? createSyncUtilities(contract, common)
      : createAsyncUtilities(contract, common);

  const utilities: UtilityMap = { ...modeUtilities };
  const applied = new Set<string>();

  const legacy =
    context.legacy ??
    ({ _legacy: Object.freeze({}) } as unknown as LegacyOptions<Ct>);

  const snapshot = () => Object.freeze({ ...utilities });

  const project = (target: UtilityMap, projection: UtilityMode) =>
    Object.freeze(
      Object.fromEntries(
        Object.entries(target).map(([name, descriptor]) => [
          name,
          descriptor[projection],
        ]),
      ),
    );

  const resolve = <const M extends UtilityMode>(projection: M) =>
    project(utilities, projection);

  const apply = (plugin: UtilityPlugin<any, Ct>) => {
    const created = plugin.create({
      contract,
      config,
      eventsList: common.eventsList,
      legacy,
      utilities: snapshot() as any,
    });

    mergeUtilities(utilities, created, {
      override: plugin.override,
      plugin: plugin.name,
    });

    applied.add(plugin.name);
  };

  const builder = {
    add(name: string, impl: UtilityPair) {
      if (Object.hasOwn(utilities, name)) {
        throw new Error(`Utility "${name}" already exists`);
      }

      mergeUtilities(utilities, { [name]: impl });
      return builder;
    },

    use(...more: readonly UtilityPlugin<any, any>[]) {
      for (const plugin of orderPlugins(more, applied)) apply(plugin);
      return builder;
    },

    build() {
      const built: UtilityMap = { ...utilities };

      Object.defineProperty(built, 'resolve', {
        value: (projection: UtilityMode) => project(built, projection),
        enumerable: false,
      });

      return Object.freeze(built);
    },

    resolve,
  };

  builder.use(...mergePlugins(getGlobalPlugins(), plugins));

  return builder as unknown as UtilityBuilder<
    MergeUtilityMaps<BaseAddons<Ct>, PluginUnion<Ps>>,
    Ct
  >;
};

export type { UtilityPlugin };
export { same, type UtilityContext } from './utility';
