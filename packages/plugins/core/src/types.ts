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

export type NoU<T> = NonNullable<T>;

export type UtilityMap = Record<string, UtilityPair>;
export type PluginPair = { sync: (args: Addons) => Fn; async: (args: Addons) => Fn };
export type PluginMap = Record<string, PluginPair>;
export type Utility_to_Plugin<U extends UtilityPair> = {
  sync: (args: Addons) => U['sync'];
  async: (args: Addons) => U['async'];
};

export type Utility_to_Plugin_Map<U extends UtilityMap> = {
  [K in keyof U]: Utility_to_Plugin<U[K]>;
};

export type Cast<T, U> = T extends U ? T : U;

export type EmptyO = NoU<unknown>;

export type Context<
  Ct extends Contract = Contract,
  U extends UtilityMap = NoU<unknown>,
> = { contract?: Ct; utilities?: U };

export type Merge<U extends UtilityMap> = U & Addons;

export type BuilderArgs<
  Ct extends Contract = never,
  U extends UtilityMap = EmptyO,
> = Ct extends never
  ? { utilities: Merge<U> }
  : { utilities: Merge<U>; contract: Ct };
