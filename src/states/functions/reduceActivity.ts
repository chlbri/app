import toArray from '#bemedev/features/arrays/castings/toArray';
import { reduceTransitions } from '#transitions';
import { pipe } from '@bemedev/pipe';
import { fromDescriber, isDescriber } from '~types';
import type { ActivityConfig } from '../types';

export const reduceActivity = (activity: ActivityConfig) => {
  const actions = new Set<string>();
  const guards = new Set<string>();
  const delays = new Set<string>();

  const pipeOn = pipe(
    (value: ActivityConfig) => Object.entries(value),

    values => {
      return values.map(([key, value]) => {
        delays.add(key);
        return [key, value] as const;
      });
    },

    values => values.map(([, value]) => value),
    values => toArray.typed(values),
    values => values.flat(),

    values => {
      return values.map(activity => {
        if (typeof activity === 'string' || isDescriber(activity)) {
          actions.add(fromDescriber(activity));
        } else {
          const result = reduceTransitions(activity);
          result.actions.forEach(actions.add.bind(actions));
          result.guards.forEach(guards.add.bind(guards));
        }
      });
    },
  );

  pipeOn(activity);

  return {
    actions,
    guards,
    delays,
  };
};
