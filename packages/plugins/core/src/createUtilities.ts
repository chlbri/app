import type { Contract } from '@bemedev/app-contract';
import type { Addons } from './addons';
import type { BuilderArgs, Cast, Context, EmptyO, UtilityMap } from './types';

/**
 * Symbol resolving the whole utility map eagerly.
 *
 * The map is lazy by design: `sync`/`async` entries only run the builder on
 * their first access. Consumers that need to enumerate the map, instead of
 * reading a known key, use this symbol to build it once, synchronously.
 */
export const RESOLVE = Symbol('@bemedev/app-plugins/resolve');

/**
 * Signature of {@linkcode createUtilities}.
 *
 * Builds the plugin map of a utility module from a context and a builder.
 *
 * @template | {@linkcode Context} `Ct` - Known contract and utilities.
 * @template | {@linkcode UtilityMap} `R` - Utilities produced by the
 * builder.
 *
 * @param context - Contract and utilities already known by the caller.
 * @param builder - Builds the utilities from the deferred addons.
 *
 * @returns A plugin map resolving every utility against the supplied addons.
 */
export type CreateUtilities_F = <
  const Ct extends Context,
  R extends UtilityMap = EmptyO,
>(
  context: Ct,
  builder: (
    args: BuilderArgs<
      Cast<Ct['contract'], Contract>,
      Cast<Ct['utilities'], UtilityMap>
    >,
  ) => R,
) => R;

/**
 * Creates the plugin map of a utility module.
 *
 * The builder is not run immediately: each returned `sync`/`async` entry is a
 * factory that receives the `Addons` built by `@bemedev/app-options`. The
 * builder therefore runs once, the first time the options library connects the
 * utilities to its helpers, and the result is reused afterwards.
 *
 * This keeps the addon implementations out of this package: they only need to
 * exist at the connection point with the options library.
 *
 * @param context - Contract and utilities already known by the caller.
 * @param builder - Builds the utilities from the deferred addons.
 *
 * @returns A plugin map resolving every utility against the supplied addons.
 *
 * @see -- type {@linkcode CreateUtilities_F}
 */
export const createUtilities: CreateUtilities_F = (context, builder) => {
  const { contract, utilities } = context;
  const cache = new WeakMap<Addons, UtilityMap>();
  let built: UtilityMap | undefined;

  const build = (addons: Addons) => {
    const cached = cache.get(addons);
    if (cached) return (built = cached);

    // Resolved addons win over the declared ones: the caller may pass a plugin
    // map whose entries are still resolvers rather than implementations.
    const result = builder({
      contract,
      utilities: { ...utilities, ...addons },
    } as any);

    cache.set(addons, result);
    return (built = result);
  };

  const factory = (name: string) => ({
    sync: (addons: Addons) => build(addons)[name]?.sync,
    async: (addons: Addons) => build(addons)[name]?.async,
  });

  return new Proxy({} as any, {
    get: (_target, name) => {
      if (name === RESOLVE) return build;

      // `then` must stay undefined, otherwise the map is treated as a thenable.
      if (typeof name !== 'string' || name === 'then') return;
      if (built && !(name in built)) return;

      return factory(name);
    },
    has: (_target, name) => typeof name === 'string' && !!built && name in built,
    ownKeys: () => (built ? Reflect.ownKeys(built) : []),
    getOwnPropertyDescriptor: (_target, name) =>
      built && typeof name === 'string' && name in built
        ? {
            configurable: true,
            enumerable: true,
            value: factory(name),
            writable: false,
          }
        : undefined,
  }) as any;
};

// #sym:plugins delete it, all plugins must be inject be .use (#sym:use ). ALso use will be double type, first like now, just the pluginsMap, and second, a function will all default utilities and previous utilities and the contract, like (use(args:{contract, utitlities}))
