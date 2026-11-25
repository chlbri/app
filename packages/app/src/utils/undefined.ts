import type { NotUndefined } from '@bemedev/app-utils-bemedev';

/**
 * Casts a value of type `T` to type `NotUndefined<T>`.
 *
 * @template `T` - The input value type.
 * @param value - The value to cast.
 *
 * @returns The casted value of type `NotUndefined<T>`.
 */
export const notUndefined = <T>(value: T) => value as NotUndefined<T>;

/**
 * Alias for function {@linkcode notUndefined}.
 */
export const notU = notUndefined;
