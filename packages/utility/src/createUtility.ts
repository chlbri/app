import { mergeUtilities, orderPlugins } from './merge';
import type { PluginUnion, UtilityContext, UtilityPlugin } from './plugin';
import type {
  EmptyUtilities,
  MergeUtilityMaps,
  ResolveUtilities,
  UtilityMap,
  UtilityMode,
  UtilityPair,
} from './types';

/**
 * Static context accepted by the builder and forwarded to every plugin.
 *
 * @template `Ct` - Contract type, kept opaque by this package.
 */
export type UtilityBuilderContext<Ct = unknown> = Partial<
  Omit<UtilityContext<Ct>, 'utilities'>
>;

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
 * Typed accumulator returned by `createUtility`.
 *
 * @template | {@linkcode UtilityMap} `U` - Descriptor map built so far.
 */
export type UtilityBuilder<U extends object = EmptyUtilities> = {
  /** Declares a new utility, throwing when the name already exists. */
  add<const K extends string, S, A>(
    name: K,
    impl: UtilityPair<S, A>,
  ): UtilityBuilder<U & { [P in K]: UtilityPair<S, A> }>;

  /** Applies plugins in `requires` order, extending the accumulated map. */
  use<const Ps extends readonly UtilityPlugin<any, any>[]>(
    ...plugins: Ps
  ): UtilityBuilder<MergeUtilityMaps<U, PluginUnion<Ps>>>;

  /** Freezes the accumulated map and returns it with `resolve`. */
  build(): UtilityInstance<U>;

  /** Projects the accumulated map to one execution mode. */
  resolve<const M extends UtilityMode>(mode: M): ResolveUtilities<U, M>;
};

/**
 * Creates a utility builder.
 *
 * The seed is copied, so the source map is never mutated. Plugins receive a
 * frozen snapshot of the utilities built so far and can therefore build on
 * helpers they did not import.
 *
 * @param seed - Utilities already known to the builder.
 * @param context - Static context forwarded to plugin `create` functions.
 *
 * @returns A typed builder supporting `add`, `use`, `useAll`, `build` and
 * `resolve`.
 *
 * @example
 * ```ts
 * const utilities = createUtility()
 *   .add('noop', same(() => () => ({})))
 *   .use(logPlugin)
 *   .build();
 *
 * const sync = utilities.resolve('sync');
 * ```
 */
export const createUtility = <U extends UtilityMap = EmptyUtilities>(
  seed?: U,
  context: UtilityBuilderContext = {},
): UtilityBuilder<U> => {
  const utilities: UtilityMap = { ...(seed ?? {}) };
  const applied = new Set<string>();

  const snapshot = () => Object.freeze({ ...utilities });

  const apply = (plugin: UtilityPlugin<any, any>) => {
    if (applied.has(plugin.name)) return;

    // const missing = (plugin.requires ?? []).filter(dep => !applied.has(dep));

    // if (missing.length > 0) {
    //   const names = missing.map(name => `"${name}"`).join(', ');
    //   throw new Error(
    //     `Cannot apply plugin "${plugin.name}": missing required plugin(s) ${names}.`,
    //   );
    // }

    const created = plugin.create({
      contract: context.contract,
      config: context.config,
      eventsList: context.eventsList ?? [],
      legacy: context.legacy,
      utilities: snapshot(),
    });

    mergeUtilities(utilities, created, {
      override: plugin.override,
      plugin: plugin.name,
    });

    applied.add(plugin.name);
  };

  const resolve = (mode: UtilityMode) =>
    Object.freeze(
      Object.fromEntries(
        Object.entries(utilities).map(([name, descriptor]) => [
          name,
          descriptor[mode],
        ]),
      ),
    );

  const builder = {
    add(name: string, impl: UtilityPair) {
      if (Object.hasOwn(utilities, name)) {
        throw new Error(`Utility "${name}" already exists`);
      }

      mergeUtilities(utilities, { [name]: impl });
      return builder;
    },

    use(...plugins: readonly UtilityPlugin[]) {
      for (const plugin of orderPlugins(plugins, applied)) apply(plugin);
      return builder;
    },

    build() {
      const built: any = { ...utilities };
      Object.defineProperty(built, 'resolve', { value: resolve, enumerable: false });
      return Object.freeze(built) as unknown as UtilityInstance<any>;
    },

    resolve,
  };

  return builder as unknown as UtilityBuilder<U>;
};
