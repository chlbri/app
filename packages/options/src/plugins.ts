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
import type { UtilityMap, UtilityPlugin } from '@bemedev/app-utility';

export type {
  PluginUnion as PluginAddons,
  ResolveUtilities,
  UtilityContext,
  UtilityMap,
  UtilityPair,
  UtilityPlugin,
  PluginUtilities,
} from '@bemedev/app-utility';
export { same } from '@bemedev/app-utility';

/**
 * Plugin type accepted by the options engine.
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

/** Plugin objects already registered through {@linkcode registerOptionPlugins}. */
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
export const configureOptions = <const T extends OptionsPlugin<any, any>[]>(
  ...plugins: T
) => {
  GLOBAL_PLUGINS = [...plugins];
  applied = new WeakSet();
  version++;
};

export const configure = configureOptions;

/**
 * Appends a plugin to the global list, once per plugin object.
 *
 * @param plugin - Plugin to register.
 *
 * @returns The registered plugin, so a library can export the call result.
 */
export const registerPlugins = <const P extends OptionsPlugin<any, any>[]>(
  ...plugins: P
) => {
  plugins.forEach(plugin => {
    if (!applied.has(plugin)) {
      applied.add(plugin);
      GLOBAL_PLUGINS = [...GLOBAL_PLUGINS, plugin];
      version++;
    }
  });

  return plugins;
};

export const register = registerPlugins;

export const remove = (name: string) => {
  const prevLen = GLOBAL_PLUGINS.length;
  GLOBAL_PLUGINS = GLOBAL_PLUGINS.filter(p => p.name !== name);
  return GLOBAL_PLUGINS.length - prevLen > 0;
};

/**
 * Reads the current global plugin list.
 *
 * @returns Tregisterugins.
 */
export const getGlobalPlugins = () => GLOBAL_PLUGINS;

/**
 * Reads the registry version used by the helper cache.
 *
 * @returns A monotonically increasing version number.
 */
export const getPluginsVersion = () => version;
