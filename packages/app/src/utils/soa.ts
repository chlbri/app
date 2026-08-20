import { partialCall } from '@bemedev/app-utils-bemedev';
import type { SoA } from '@bemedev/typings';

/**
 * Type guard that checks if an entry is a Single-or-Array (SoA) of type `T`.
 *
 * @template T - The element type, defaults to `any`.
 * @param check - Predicate function to check individual elements.
 * @param entry - The candidate value or array of values.
 *
 * @returns `true` if entry is a single `T` or array of `T`, `false` otherwise.
 */
export const isSoa = <T = any>(
  check: (value: unknown) => value is T,
  entry: unknown,
): entry is SoA<T> => {
  if (Array.isArray(entry)) return entry.every(check);
  else return check(entry);
};

/**
 * Type guard for checking if a value is a string or array of strings.
 * Includes property {@linkcode checkSoAString.orUndefined}.
 *
 * @param value - The value to validate.
 *
 * @returns `true` if value is a string or an array of strings.
 */
export const checkSoAString = partialCall(isSoa, str => typeof str === 'string') as {
  (value: unknown): value is SoA<string>;

  orUndefined: (value: unknown) => value is SoA<string> | undefined;
};

/**
 * Type guard for checking if a value is a string, array of strings, or undefined.
 *
 * @param value - The value to validate.
 *
 * @returns `true` if value is undefined, a string, or an array of strings.
 */
checkSoAString.orUndefined = (value: unknown): value is SoA<string> | undefined => {
  if (value === undefined) return true;
  return checkSoAString(value);
};
