import { checkGuards } from '#guards';
import type { AlwaysConfig } from '../../types';
import {
  isTransitionConfigMapTarget,
  isTransitionConfigTarget,
} from './transition';

/**
 * Type guard for checking always transition configuration.
 *
 * @template {string[]} T - Path keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` if type {@linkcode AlwaysConfig}, `false` otherwise.
 */
export const isAlways = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is AlwaysConfig<T[number]> => {
  if (Array.isArray(value)) {
    const _value = [...value];
    const pop = _value.pop();
    if (!pop) return false;
    const check1 = isTransitionConfigTarget(pop, ...keys);
    if (!check1) return false;

    const out = _value.every(v => {
      const check2 = isTransitionConfigMapTarget(v, ...keys);
      if (!check2) return false;
      return checkGuards(v.guards);
    });

    return out;
  }

  return isTransitionConfigTarget(value, ...keys);
};

isAlways.orUndefined = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is AlwaysConfig<T[number]> | undefined => {
  if (value === undefined) return true;
  return isAlways(value, ...keys);
};
