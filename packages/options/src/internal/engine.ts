/**
 * Single engine building the helpers injected into option callbacks.
 *
 * Default options are implemented here, at build time: the built-in helpers
 * are projected for the contract mode and the plugins are then applied through
 * the lazy `createUtilities` proxy of `@bemedev/app-plugins`.
 *
 * @module engine
 */

import type { Contract } from '@bemedev/app-contract';
import { createUtilities, RESOLVE, type Addons } from '@bemedev/app-plugins';

import type { UtilityMap, UtilityMode } from '@bemedev/app-plugins/types';
import type { OptionsPlugin } from '../utility';
import { createAsyncUtilities } from './async';
import { createCommonHelpers } from './common';
import { createSyncUtilities } from './sync';

/**
 * Options accepted by {@linkcode buildHelpers}.
 *
 * The contract is the single source of truth: the configuration and the
 * execution mode are read from it, and the event list is collected from
 * `contract.config`.
 *
 * @template | {@linkcode Contract} `Ct` - Contract type.
 */
export type BuildHelpersOptions<Ct extends Contract = Contract> = {
  /** Contract carried by the consumer. */
  contract: Ct;
  /** Plugins applied to this build. */
  plugins?: readonly OptionsPlugin<any, any>[];
};

/** Resolved helper surface. */
type Helpers = Record<string, any>;

/** Cache keyed by the contract and a build signature. */
const CACHE = new WeakMap<object, Map<string, Helpers>>();

/** Stable identity for plugin objects, used in cache keys. */
const PLUGIN_IDS = new WeakMap<object, number>();

/** Last numeric identity allocated to a plugin object. */
let nextPluginId = 0;

/**
 * Reads, or lazily allocates, the stable numeric identity of a plugin.
 *
 * The identity only feeds the helper cache signature, so a given plugin object
 * always maps to the same key.
 *
 * @param plugin - Plugin object to identify.
 *
 * @returns The stable numeric identity of the plugin.
 */
const pluginId = (plugin: object) => {
  const current = PLUGIN_IDS.get(plugin);
  if (current !== undefined) return current;

  const id = ++nextPluginId;
  PLUGIN_IDS.set(plugin, id);
  return id;
};

/**
 * Projects a descriptor map to one execution mode.
 *
 * @param target - Descriptor map to project.
 * @param mode - Execution mode to project on.
 *
 * @returns A frozen map of the selected implementations.
 */
const project = (target: UtilityMap, mode: UtilityMode) =>
  Object.freeze(
    Object.fromEntries(
      Object.entries(target).map(([name, descriptor]) => [name, descriptor[mode]]),
    ),
  ) as Helpers;

/**
 * Implements the default options and applies the plugins on top of them.
 *
 * The built-in helpers are the addons of the `createUtilities` builder: they
 * do not depend on any plugin, so they are computed first and merged after the
 * plugin utilities are materialized through the proxy.
 *
 * Plugins are the lazy maps returned by `createUtilities`. They are resolved in
 * the order they are given, each one receiving the utilities built so far as
 * its addons: a utility declared later replaces an earlier plugin utility with
 * the same name, while the default addons can never be replaced.
 *
 * @param contract - Contract the helpers are built for.
 * @param plugins - Plugins to apply, in order.
 * @param mode - Execution mode to resolve.
 *
 * @returns The resolved helper surface of the mode.
 */
const build = (
  contract: Contract,
  plugins: readonly OptionsPlugin<any, any>[],
  mode: UtilityMode,
): Helpers => {
  const common = createCommonHelpers(contract);

  const modeUtilities =
    mode === 'sync'
      ? createSyncUtilities(contract, common)
      : createAsyncUtilities(contract, common);

  const defaults = { ...common.utilities, ...modeUtilities } as Addons;

  const utilities = createUtilities({ contract, utilities: defaults }, args => {
    const map: UtilityMap = {};

    for (const plugin of plugins) {
      const addons = { ...args.utilities, ...map } as any;

      // The plugin map is lazy: resolve it once for these addons.
      const resolved = (plugin as any)[RESOLVE](addons) as UtilityMap;

      for (const [name, entry] of Object.entries(resolved)) {
        if (Object.hasOwn(defaults, name)) {
          throw new Error(`A plugin cannot override the default utility "${name}"`);
        }

        map[name] = { sync: entry.sync, async: entry.async };
      }
    }

    return map;
  });

  // Resolve the outer map eagerly: its keys are only enumerable once built.
  const added = (utilities as any)[RESOLVE](defaults) as UtilityMap;

  return project({ ...defaults, ...added }, mode);
};

/**
 * Builds the helper surface of one execution mode.
 *
 * The contract drives everything: mode, configuration and event list. The
 * default options are implemented here, then plugins are applied in order on
 * top of them through `createUtilities`. Results are cached by contract and
 * plugin signature.
 *
 * @param options - Contract and optional plugins.
 *
 * @returns The resolved helper object of the contract mode.
 */
export const buildHelpers = <Ct extends Contract = Contract>({
  contract,
  plugins = [],
}: BuildHelpersOptions<Ct>): Helpers => {
  const mode: UtilityMode = contract.types?.sync === true ? 'sync' : 'async';
  const cacheOwner = contract as object;
  const signature = [mode, ...plugins.map(pluginId)].join('|');
  const cached = CACHE.get(cacheOwner)?.get(signature);
  if (cached) return cached;

  const helpers = build(contract, plugins, mode);

  const bucket = CACHE.get(cacheOwner) ?? new Map<string, Helpers>();
  bucket.set(signature, helpers);
  CACHE.set(cacheOwner, bucket);
  return helpers;
};
