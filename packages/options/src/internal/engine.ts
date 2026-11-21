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
import {
  createUtility,
  orderPlugins,
  type UtilityMap,
  type UtilityMode,
  type UtilityPlugin,
} from '@bemedev/app-utility';

import { getGlobalPlugins, getPluginsVersion, type OptionsPlugin } from '../plugins';
import { createAsyncUtilities } from './async';
import { createCommonHelpers } from './common';
import { createSyncUtilities } from './sync';

/**
 * Options accepted by {@linkcode buildHelpers}.
 *
 * @template | {@linkcode Contract} `Ct` - Contract type.
 */
export type BuildHelpersOptions<Ct extends Contract = Contract> = {
  /** Contract machine configuration. */
  config: unknown;
  /** Execution mode to project the utilities on. */
  mode: UtilityMode;
  /** Per-call plugins, applied after the global ones. */
  plugins?: readonly UtilityPlugin<any, Ct>[];
  /** Contract carried by the consumer, when available. */
  contract?: Ct;
  /** Current legacy options handed to plugins. */
  legacy?: unknown;
};

/** Resolved helper surface. */
type Helpers = Record<string, any>;

/** Cache keyed by the contract (or the configuration) and a build signature. */
const CACHE = new WeakMap<object, Map<string, Helpers>>();

/** Stable identity for plugin objects, used in cache keys. */
const PLUGIN_IDS = new WeakMap<object, number>();

let nextPluginId = 0;

const pluginId = (plugin: object) => {
  const current = PLUGIN_IDS.get(plugin);

  if (current !== undefined) return current;

  const id = ++nextPluginId;
  PLUGIN_IDS.set(plugin, id);
  return id;
};

/**
 * Merges global and per-call plugins, per-call plugins winning on shared
 * names.
 *
 * @param globals - Registered plugins.
 * @param locals - Per-call plugins.
 *
 * @returns The effective plugin list.
 */
const mergePluginLists = (
  globals: readonly OptionsPlugin<any, any>[],
  locals: readonly OptionsPlugin<any, any>[],
) => {
  if (globals.length === 0) return [...locals];

  const byName = new Map<string, OptionsPlugin<any, any>>();

  for (const plugin of globals) byName.set(plugin.name, plugin);
  for (const plugin of locals) byName.set(plugin.name, plugin);

  return [...byName.values()];
};

const createModeUtilities = (config: unknown, mode: UtilityMode): UtilityMap =>
  mode === 'sync' ? createSyncUtilities(config) : createAsyncUtilities(config);

/**
 * Builds the helper surface of one execution mode.
 *
 * Global plugins are merged with per-call ones, ordered by `requires`, then
 * applied on top of the built-in utilities. Results are cached by contract,
 * mode and plugin signature; configure or register a plugin to invalidate.
 *
 * @param options - Configuration, mode and optional plugins.
 *
 * @returns The resolved helper object of the requested mode.
 */
export const buildHelpers = <Ct extends Contract = Contract>({
  config,
  mode,
  plugins,
  contract,
  legacy,
}: BuildHelpersOptions<Ct>): Helpers => {
  const effective = mergePluginLists(getGlobalPlugins(), plugins ?? []);
  const ordered = orderPlugins(effective);

  const cacheOwner = (contract ?? config) as object | undefined;
  const cacheable = !!cacheOwner && typeof cacheOwner === 'object';

  const signature = [getPluginsVersion(), mode, ...ordered.map(pluginId)].join('|');

  if (cacheable) {
    const cached = CACHE.get(cacheOwner)?.get(signature);
    if (cached) return cached;
  }

  const common = createCommonHelpers(config);
  const base: UtilityMap = {
    ...common.utilities,
    ...createModeUtilities(config, mode),
  };

  const builder = createUtility(base, {
    contract,
    config,
    eventsList: common.eventsList,
    legacy,
  });

  for (const plugin of ordered) builder.use(plugin);

  const helpers = builder.resolve(mode) as Helpers;

  if (cacheable) {
    const bucket = CACHE.get(cacheOwner) ?? new Map<string, Helpers>();
    bucket.set(signature, helpers);
    CACHE.set(cacheOwner, bucket);
  }

  return helpers;
};
