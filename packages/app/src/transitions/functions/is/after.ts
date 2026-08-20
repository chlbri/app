import type { DelayedTransitions } from '../../types';
import { isSingleOrArrayT } from './transition';

/**
 * Type guard for checking delayed transitions configuration map.
 *
 * @template `T` - Path keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` if type {@linkcode DelayedTransitions}, `false` otherwise.
 */
export const isAfter = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is DelayedTransitions<T[number]> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;

  const values = Object.values(value);
  return values.every(v => isSingleOrArrayT<T>(v, ...keys));
};

isAfter.orUndefined = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is DelayedTransitions<T[number]> | undefined => {
  if (value === undefined) return true;
  return isAfter(value, ...keys);
};
