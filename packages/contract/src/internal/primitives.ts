/**
 * String-keyed record.
 *
 * @template `T` - Value type.
 */
export type RecordS<T = unknown> = Record<string, T>;

/**
 * Single value or a non-empty array of values.
 *
 * @template `T` - Value type.
 */
export type SingleOrArrayL<T> = T | readonly [...(readonly T[]), T];
