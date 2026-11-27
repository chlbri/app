import { toArray } from '@bemedev/app';
import type { EmitterConfig, TransitionConfig } from '@bemedev/app/types';
import { reduceTransitions } from './reduceTransitions';

/**
 * Reduces an emitter configuration (complete, next, error handlers) into transition symbol sets.
 *
 * @param emitter - Emitter configuration object of type {@linkcode EmitterConfig}.
 *
 * @returns Reduced transition symbol sets object.
 */
export const reduceEmitter = (emitter: EmitterConfig) => {
  const completes = toArray<TransitionConfig>(emitter.complete);
  const nexts = toArray<TransitionConfig>(emitter.next);
  const errors = toArray<TransitionConfig>(emitter.error);
  const transitions = [...completes, ...nexts, ...errors];
  return reduceTransitions(...transitions);
};
