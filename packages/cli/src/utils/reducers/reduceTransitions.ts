import { reduceGuards } from './reduceGuards';
import { reduceDescribers } from './reduceDescribers';
import { toArray } from '@bemedev/app';
import { createBetterSet } from '@bemedev/better-set';
import { pipe } from '@bemedev/pipe';
import { voidAction } from '@bemedev/pipe/extensions/common';
import type { _TransitionConfig } from '@bemedev/app/transitions';

export const reduceTransitions = (...transitions: _TransitionConfig[]) => {
  const actions = createBetterSet<string>();
  const guards = createBetterSet<string>();
  const targets = createBetterSet<string>();

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

        voidAction(v => actions.add(...v.actions)),
        v => reduceDescribers(...v.guards),
        g => guards.add(...g),
      );

      piped();
    }
  });

  return { targets, actions, guards };
};
