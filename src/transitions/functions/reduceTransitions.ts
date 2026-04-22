import toArray from '#bemedev/features/arrays/castings/toArray';
import { reduceGuards } from '#guards';
import { reduceDescribers } from '#utils';
import { pipe } from '@bemedev/pipe';
import type { _TransitionConfig } from '../types';
import { voidAction } from '@bemedev/pipe/extensions/common';

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
      const target = trans.target;
      if (target) targets.add(target);

      const piped = pipe(
        () => trans,
        ({ actions, guards }) => ({ actions, guards }),

        v => ({
          actions: toArray.typed(v.actions),
          guards: toArray.typed(v.guards),
        }),

        v => ({
          actions: reduceDescribers(...v.actions),
          guards: reduceGuards(...v.guards),
        }),

        voidAction(v => v.actions.forEach(actions.add.bind(actions))),
        v => reduceDescribers(...v.guards),
        v => v.forEach(guards.add.bind(guards)),
      );

      piped();
    }
  });

  return { targets, actions, guards };
};
