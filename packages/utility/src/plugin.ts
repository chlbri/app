import type { UtilityMap } from './types';

/**
 * Execution context handed to plugins.
 *
 * @template `Ct` - Contract type, kept opaque by this package.
 */
export type UtilityContext<Ct = unknown> = {
  /** Contract carried by the consumer, when one is available. */
  readonly contract: Ct;
  /** Configuration the utilities are built from. */
  readonly config: unknown;
  /** Event names collected from the configuration. */
  readonly eventsList: readonly string[];
  /** Already-built utilities, including built-ins. */
  readonly utilities: UtilityMap;
  /**
   * Current legacy options (actions, guards, delays, actors).
   *
   * Prefer {@linkcode utilities} when a helper already exists: a cached build
   * may reuse the legacy object captured by its first build.
   */
  readonly legacy: unknown;
};

/**
 * A plugin contributing utilities.
 *
 * @template | {@linkcode UtilityMap} `Adds` - Utilities added by the plugin.
 * @template `Ct` - Contract type, kept opaque by this package.
 */
export type UtilityPlugin<Adds extends UtilityMap = UtilityMap, Ct = unknown> = {
  /** Stable identifier used for de-duplication and diagnostics. */
  name: string;
  /** Other plugin names that must be applied first. */
  requires?: readonly string[];
  /** Set to `true` to allow replacing an existing utility key. */
  override?: boolean;
  /** Builds the utilities added by this plugin. */
  create: (ctx: UtilityContext<Ct>) => Adds;
};

/** Utilities added by a plugin type. */
export type PluginUtilities<P> =
  P extends UtilityPlugin<infer Adds, any> ? Adds : never;

/**
 * Utilities added by a tuple of plugins, merged into one object map.
 *
 * The mapped form keeps every plugin key, including when the tuple is empty,
 * and avoids the `unknown` fallback of `UnionToIntersection` on generic
 * tuples.
 *
 * @template `Ps` - Tuple of plugin types.
 */
export type PluginUnion<Ps extends readonly UtilityPlugin<any, any>[]> = {
  [K in PluginKeys<Ps>]: PluginValue<Ps, K>;
};

/** Union of the keys added by a tuple of plugins. */
type PluginKeys<Ps extends readonly UtilityPlugin<any, any>[]> =
  Ps[number] extends infer P
    ? P extends UtilityPlugin<infer Adds, any>
      ? keyof Adds
      : never
    : never;

/** Value of one key added by a tuple of plugins. */
type PluginValue<
  Ps extends readonly UtilityPlugin<any, any>[],
  K extends PropertyKey,
> = Ps[number] extends infer P
  ? P extends UtilityPlugin<infer Adds, any>
    ? K extends keyof Adds
      ? Adds[K]
      : never
    : never
  : never;
