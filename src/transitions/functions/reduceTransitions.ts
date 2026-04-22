import toArray from '#bemedev/features/arrays/castings/toArray';
import { reduceGuards } from '#guards';
import { reduceDescribers } from '#utils';
import { pipe } from '@bemedev/pipe';
import type { _TransitionConfig } from '../types';

/**
 *  Extracts the target, actions, guards, and description from a transition configuration.
 *
 * @param transitions
 * @returns An array of objects containing the target, actions, guards, and description for each transition configuration.
 *
 * @see {@linkcode TransitionConfig}
 * @see {@linkcode reduceGuards}
 * @see {@linkcode reduceDescribers}
 */
export const reduceTransitions = (...transitions: _TransitionConfig[]) => {
  const actions = new Set<string>();
  const guards = new Set<string>();
  const targets = new Set<string>();

  transitions.forEach(trans => {
    if (typeof trans === 'string') {
      targets.add(trans);
    } else {
      type TT = Exclude<_TransitionConfig, string>;
      const target = trans.target;
      if (target) targets.add(target);

      const pipeA = pipe(
        (actions?: TT['actions']) => toArray.typed(actions),
        actions => reduceDescribers(...actions),
        _actions => _actions.forEach(actions.add.bind(actions)),
      );

      const pipeG = pipe(
        (guards?: TT['guards']) => toArray.typed(guards),
        guards => guards.map(g => reduceGuards(g)),
        guards => guards.flat(),
        guards => reduceDescribers(...guards),
        _guards => _guards.forEach(guards.add.bind(guards)),
      );

      pipeA(trans.actions);
      pipeG(trans.guards);
    }
  });

  return { targets, actions, guards };
};
