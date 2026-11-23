import type { Contract, ContractOptions } from '@bemedev/app-contract';

import type { UtilityMap } from './types';

/**
 * Access to previously defined options.
 *
 * @template | {@linkcode Contract} `Ct` - Contract type.
 */
export type LegacyOptions<Ct extends Contract = Contract> = {
  /** Previously defined options, empty for a freshly built contract. */
  readonly _legacy: ContractOptions<Ct>;
};

/**
 * A plugin contributing utilities to the options helpers.
 *
 * A plugin is the value returned by `createUtilities` from
 * `@bemedev/app-plugins`: the lazy map it exposes is resolved against the
 * addons supplied by `createOptions`. The default helpers are injected by
 * `createOptions` itself, so a plugin only adds utilities on top of them.
 *
 * Plugins are applied in the order they are given: a utility declared later
 * replaces an earlier plugin utility with the same name, while the default
 * addons can never be replaced.
 *
 * @template | {@linkcode UtilityMap} `Adds` - Utilities added by the plugin.
 * @template | {@linkcode Contract} `Ct` - Contract type used when defining it.
 */
export type OptionsPlugin<
  Adds extends UtilityMap = UtilityMap,
  Ct extends Contract = Contract,
> = Ct extends Contract ? Adds : never;

/** Union of the keys added by a tuple of plugins. */
type PluginKeys<Ps extends readonly OptionsPlugin<any, any>[]> =
  Ps[number] extends infer P ? (P extends object ? keyof P : never) : never;

/** Value of one key added by a tuple of plugins. */
type PluginValue<
  Ps extends readonly OptionsPlugin<any, any>[],
  K extends PropertyKey,
> = Ps[number] extends infer P
  ? P extends object
    ? K extends keyof P
      ? P[K]
      : never
    : never
  : never;

/**
 * Utilities added by a tuple of plugins, merged into one object map.
 *
 * The mapped form keeps every plugin key, including when the tuple is empty.
 *
 * @template `Ps` - Tuple of plugin types.
 */
export type PluginAddons<Ps extends readonly OptionsPlugin<any, any>[]> = {
  [K in PluginKeys<Ps>]: PluginValue<Ps, K>;
};
