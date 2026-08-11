import type { ActorConfig } from '#actor';
import type { RecordS } from '~types';
import { isActor } from '#actors';

/**
 * Type guard for checking actors map configuration object.
 *
 * @template {string[]} T - Path keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` if record of actor configs, `false` otherwise.
 */
export const isActors = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is RecordS<ActorConfig<T[number]>> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const values = Object.values(value);
  return values.every(v => isActor(v, ...keys));
};

isActors.orUndefined = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is RecordS<ActorConfig<T[number]>> | undefined => {
  if (value === undefined) return true;
  return isActors(value, ...keys);
};
