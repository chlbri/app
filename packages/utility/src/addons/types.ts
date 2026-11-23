/**
 * Generic function type signature.
 *
 * @template `Args` - Tuple of the argument types accepted by the function.
 * @template `R` - Return type of the function.
 */
export type Fn<Args extends any[] = any[], R = any> = (...args: Args) => R;

/**
 * Synchronous and asynchronous variants of a single utility.
 *
 * @template `S` - Synchronous implementation type.
 * @template `A` - Asynchronous implementation type.
 */
export type UtilityPair<S = Fn, A = Fn> = { sync: S; async: A };
