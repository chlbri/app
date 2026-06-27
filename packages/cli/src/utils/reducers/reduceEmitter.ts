import { reduceTransitions } from './reduceTransitions';
import {
  toArray,
  type EmitterConfig,
  type TransitionConfig,
} from '@bemedev/app';

export const reduceEmitter = (emitter: EmitterConfig) => {
  const completes = toArray<TransitionConfig>(emitter.complete);
  const nexts = toArray<TransitionConfig>(emitter.next);
  const errors = toArray<TransitionConfig>(emitter.error);
  const transitions = [...completes, ...nexts, ...errors];
  return reduceTransitions(...transitions);
};
