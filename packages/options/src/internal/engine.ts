/**
 * Single engine building the helpers injected into option callbacks.
 *
 * Every derived API (`createOptions`, machine options and interpreter
 * options) goes through {@linkcode buildHelpers}; no caller builds helpers
 * directly.
 *
 * @module engine
 */

import type { Contract } from '@bemedev/app-contract';

import { createUtility } from '../plugins';
import { getGlobalPlugins, getPluginsVersion } from '../plugins';
import {
  mergePlugins,
  orderPlugins,
  type LegacyOptions,
  type UtilityMode,
  type UtilityPlugin,
} from '../utility';

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
  /** Per-call plugins, applied after the registered ones. */
  plugins?: readonly UtilityPlugin<any, any>[];
  /** Current legacy options handed to plugins. */
  legacy?: LegacyOptions<Ct>;
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
 * Builds the helper surface of one execution mode.
 *
 * The contract drives everything: mode, configuration and event list. Global
 * plugins are merged with per-call ones, ordered by `requires`, then applied on
 * top of the built-in utilities. Results are cached by contract and plugin
 * signature; configure, register or remove a plugin to invalidate the cache.
 *
 * @param options - Contract and optional per-call plugins.
 *
 * @returns The resolved helper object of the contract mode.
 */
export const buildHelpers = <Ct extends Contract = Contract>({
  contract,
  plugins = [],
  legacy,
}: BuildHelpersOptions<Ct>): Helpers => {
  const mode: UtilityMode = contract.types?.sync === true ? 'sync' : 'async';
  const effective = mergePlugins(getGlobalPlugins(), plugins);
  const ordered = orderPlugins(effective);
  const cacheOwner = contract as object;
  const signature = [getPluginsVersion(), mode, ...ordered.map(pluginId)].join('|');
  const cached = CACHE.get(cacheOwner)?.get(signature);
  if (cached) return cached;

  const helpers = createUtility({ contract, legacy }, ...plugins).resolve(
    mode,
  ) as Helpers;

  const bucket = CACHE.get(cacheOwner) ?? new Map<string, Helpers>();
  bucket.set(signature, helpers);
  CACHE.set(cacheOwner, bucket);
  return helpers;
};
