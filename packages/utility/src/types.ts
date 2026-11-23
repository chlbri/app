import type { Contract } from '@bemedev/app-contract';
import type { Addons, Fn, UtilityPair } from './addons';

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

export type EmptyO = NoU<unknown>;

export type Context<
  Ct extends Contract = never,
  U extends UtilityMap = NoU<unknown>,
> = { contract?: Ct; utilities?: U };

export type Merge<U extends UtilityMap> = U & Addons;

export type BuilderArgs<
  Ct extends Contract = never,
  U extends UtilityMap = EmptyO,
> = Ct extends never ? { utilties: Merge<U> } : { utilties: Merge<U>; contract: Ct };
