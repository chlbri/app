import type { DelayedTransitions } from '../../types';
import { isSingleOrArrayT } from './transition';

export const isAfter = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is DelayedTransitions<T[number]> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;

  const valueKeys = Object.keys(value);
  return valueKeys.every(v => isSingleOrArrayT<T>(v, ...keys));
};

isAfter.orUndefined = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is DelayedTransitions<T[number]> | undefined => {
  if (value === undefined) return true;
  return isAfter(value, ...keys);
};
