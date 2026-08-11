import type { TransitionsConfig } from '../../types';
import { isActors } from './actors';
import { isAfter } from './after';
import { isAlways } from './always';
import { isOn } from './on';

/**
 * Type guard for checking if a value is a valid transitions configuration object.
 *
 * @template {string[]} T - Path keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` if type {@linkcode TransitionsConfig}, `false` otherwise.
 */
export const isTransitionsConfig = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is TransitionsConfig<T[number]> => {
  const _value: any = value;
  const on = _value.on;
  const always = _value.always;
  const actors = _value.actors;
  const after = _value.after;
  if (!isOn.orUndefined(on, ...keys)) return false;
  if (!isAlways.orUndefined(always, ...keys)) return false;
  if (!isActors.orUndefined(actors, ...keys)) return false;
  return isAfter.orUndefined(after, ...keys);
};
