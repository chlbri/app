import type { ActorConfig } from '#actor';
import type { RecordS } from '~types';
import { reduceEmitter } from './reduceEmitter';
import { reduceChild } from './reduceChild';
import { createBetterSet } from '#utils';

export const reduceActors = (actor: RecordS<ActorConfig>) => {
  const actions = createBetterSet<string>();
  const guards = createBetterSet<string>();
  const targets = createBetterSet<string>();
  const pContextKeys = createBetterSet<string>();
  const emitters = createBetterSet<string>();
  const children = createBetterSet<string>();
  const entries = Object.entries(actor);

  entries.forEach(([key, config]) => {
    if ('next' in config) {
      const result = reduceEmitter(config);
      actions.add(...result.actions);
      guards.add(...result.guards);
      targets.add(...result.targets);
      emitters.add(key);
    } else {
      const result = reduceChild(config);
      actions.add(...result.actions);
      guards.add(...result.guards);
      targets.add(...result.targets);
      pContextKeys.add(...result.pContextKeys);
      children.add(key);
    }
  });

  return {
    actions,
    guards,
    targets,
    pContextKeys,
    emitters,
    children,
  };
};
