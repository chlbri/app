import type { EmitterConfig } from '#actor';
import { reduceTransitions, type TransitionConfig } from '#transitions';
import { toArray } from '@bemedev/app-utils-bemedev';

export const reduceEmitter = (emitter: EmitterConfig) => {
  const completes = toArray<TransitionConfig>(emitter.complete);
  const nexts = toArray<TransitionConfig>(emitter.next);
  const errors = toArray<TransitionConfig>(emitter.error);
  const transitions = [...completes, ...nexts, ...errors];
  return reduceTransitions(...transitions);
};
