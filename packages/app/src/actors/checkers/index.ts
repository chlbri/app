import type { ActorConfig } from '#actor';
import { isChildConfig } from './children';
import { isEmitterConfig, isFinallyConfig } from './emitter';

export { isChildConfig, isEmitterConfig, isFinallyConfig };

export const isActor = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is ActorConfig<T[number]> => {
  return isChildConfig(value, ...keys) || isEmitterConfig(value, ...keys);
};
