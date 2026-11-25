import type { Contract } from '@bemedev/app-contract';
import type { Addons, Fn } from './addons';
import type { UtilityPair } from './addons/types';
export type * from './addons';

/** Execution mode a utility can be resolved for. */
export type UtilityMode = 'sync' | 'async';

/**
 * Projects a descriptor map to one execution mode.
 *
 * @template `U` - Descriptor map to project.
 * @template | {@linkcode UtilityMode} `M` - Execution mode to project on.
 */
export type ResolveUtilities<U, M extends UtilityMode> = {
  [K in keyof U]: U[K] extends Record<M, infer R> ? R : never;
};

/**
 * Removes `null` and `undefined` from `T`.
 *
 * @template `T` - Type to narrow.
 */
export type NoU<T> = NonNullable<T>;

/**
 * Map of utility names to their synchronous and asynchronous implementations.
 *
 * @see -- type {@linkcode UtilityPair}
 */
export type UtilityMap = Record<string, UtilityPair>;

/**
 * Synchronous and asynchronous factories of a single plugin utility.
 *
 * Both factories receive the addons resolved by the options library and return
 * the implementation of the utility.
 *
 * @see -- type {@linkcode Addons}, -- type {@linkcode Fn}
 */
export type PluginPair = { sync: (args: Addons) => Fn; async: (args: Addons) => Fn };

/**
 * Map of plugin utility names to their factories.
 *
 * @see -- type {@linkcode PluginPair}
 */
export type PluginMap = Record<string, PluginPair>;

/**
 * Projects a utility pair to the plugin factories exposing it.
 *
 * @template | {@linkcode UtilityPair} `U` - Utility pair to project.
 *
 * @see -- type {@linkcode Addons}
 */
export type Utility_to_Plugin<U extends UtilityPair> = {
  sync: (args: Addons) => U['sync'];
  async: (args: Addons) => U['async'];
};

/**
 * Projects a utility map to the plugin map exposing every utility.
 *
 * @template | {@linkcode UtilityMap} `U` - Utility map to project.
 *
 * @see -- type {@linkcode Utility_to_Plugin}
 */
export type Utility_to_Plugin_Map<U extends UtilityMap> = {
  [K in keyof U]: Utility_to_Plugin<U[K]>;
};

/**
 * Casts `T` to `U` when it is assignable, otherwise falls back to `U`.
 *
 * @template `T` - Type to cast.
 * @template `U` - Fallback type.
 */
export type Cast<T, U> = T extends U ? T : U;

/** Empty object type used when a utility map is absent. */
export type EmptyO = NoU<unknown>;

/**
 * Contract and utilities already known when building a plugin map.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template | {@linkcode UtilityMap} `U` - Utilities declared by the
 * caller.
 */
export type Context<
  Ct extends Contract = Contract,
  U extends UtilityMap = NoU<unknown>,
> = { contract?: Ct; utilities?: U };

/**
 * Merges a utility map with the built-in addons.
 *
 * @template | {@linkcode UtilityMap} `U` - Utility map to merge.
 *
 * @see -- type {@linkcode Addons}
 */
export type Merge<U extends UtilityMap> = U & Addons;

/**
 * Arguments received by the builder of a plugin map.
 *
 * When a contract is known, `contract` is mandatory; otherwise only the merged
 * utilities are passed.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template | {@linkcode UtilityMap} `U` - Utilities declared by the
 * caller.
 *
 * @see -- type {@linkcode Merge}
 */
export type BuilderArgs<
  Ct extends Contract = never,
  U extends UtilityMap = EmptyO,
> = Ct extends never
  ? { utilities: Merge<U> }
  : { utilities: Merge<U>; contract: Ct };
