import type { ActorConfig } from '#actor';
import type { RecordS } from '~types';
import { reduceEmitter } from './reduceEmitter';
import { reduceChild } from './reduceChild';

export const reduceActors = (actor: RecordS<ActorConfig>) => {
  const actions = new Set<string>();
  const guards = new Set<string>();
  const targets = new Set<string>();
  const pContextKeys = new Set<string>();
  const emitters = new Set<string>();
  const children = new Set<string>();
  const entries = Object.entries(actor);

  entries.forEach(([key, config]) => {
    if ('next' in config) {
      const result = reduceEmitter(config);
      result.actions.forEach(actions.add.bind(actions));
      result.guards.forEach(guards.add.bind(guards));
      result.targets.forEach(targets.add.bind(targets));
      emitters.add(key);
    } else {
      const result = reduceChild(config);
      result.actions.forEach(actions.add.bind(actions));
      result.guards.forEach(guards.add.bind(guards));
      result.targets.forEach(targets.add.bind(targets));
      result.pContextKeys.forEach(pContextKeys.add.bind(pContextKeys));
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
