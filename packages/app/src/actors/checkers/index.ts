import type { ActorConfig } from '#actor';
import { isChildConfig } from './children';
import { isEmitterConfig, isFinallyConfig } from './emitter';

export { isChildConfig, isEmitterConfig, isFinallyConfig };

/**
 * Type guard function to check if a given value is an actor configuration object.
 *
 * @template `T` - State keys string array type.
 * @param value - The value to check.
 * @param keys - List of valid state keys.
 *
 * @returns `true` if `value` is a child or emitter configuration, `false` otherwise.
 */
export const isActor = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is ActorConfig<T[number]> => {
  return isChildConfig(value, ...keys) || isEmitterConfig(value, ...keys);
};
