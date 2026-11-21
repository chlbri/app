/**
 * Core descriptor types of `@bemedev/app-utility`.
 *
 * A utility is a single helper declared with one implementation per execution
 * mode. The same descriptor map feeds synchronous and asynchronous consumers,
 * which removes the drift between two hand-maintained surfaces.
 *
 * @module types
 */

/**
 * Generic function type signature.
 *
 * @template `Args` - Tuple of the argument types accepted by the function.
 * @template `R` - Return type of the function.
 */
export type UtilityFn<Args extends any[] = any[], R = any> = (...args: Args) => R;

/** Execution mode a utility can be resolved for. */
export type UtilityMode = 'sync' | 'async';

/**
 * Synchronous and asynchronous variants of a single utility.
 *
 * @template `S` - Synchronous implementation type.
 * @template `A` - Asynchronous implementation type.
 */
export type UtilityPair<S = UtilityFn, A = UtilityFn> = { sync: S; async: A };

/**
 * Map of utility names to their descriptor.
 *
 * Plugins return (and receive) this shape, so a utility can be declared once
 * and projected to the mode actually used by the consumer.
 */
export type UtilityMap = Record<string, UtilityPair<any, any>>;

/** Empty utility map used as the seed of a builder. */
export type EmptyUtilities = Record<never, UtilityPair<any, any>>;

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
 * Merges two object maps, the second one winning on shared keys.
 *
 * @template `A` - Base map.
 * @template `B` - Overriding map.
 */
export type MergeUtilityMaps<A extends object, B extends object> = Omit<A, keyof B> &
  B;

/**
 * Standard `UnionToIntersection` helper.
 *
 * It is declared locally so the package stays dependency-free.
 *
 * @template `U` - Union to turn into an intersection.
 */
export type UnionToIntersection<U> = (
  U extends any ? (arg: U) => void : never
) extends (arg: infer I) => void
  ? I
  : never;
