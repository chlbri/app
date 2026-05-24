import toArray from '#bemedev/features/arrays/castings/toArray';
import { reduceTransitions } from '#transitions';
import { createBetterSet } from '@bemedev/better-set';
import { pipe } from '@bemedev/pipe';
import { fromDescriber, isDescriber } from '~types';
import type { ActivityConfig } from '../types';
import { tap } from '@bemedev/pipe/extensions';

export const reduceActivity = (activity: ActivityConfig) => {
  const actions = createBetterSet<string>();
  const guards = createBetterSet<string>();
  const delays = createBetterSet<string>();

  const piped = pipe(
    () => activity,
    value => Object.entries(value),
    v => {
      return v.forEach(
        pipe(
          v => v,
          tap(([key]) => delays.add(key)),
          ([, value]) => value,
          toArray.typed,
          v => v.flat(),
          v => {
            return v.forEach(
              pipe(
                v => v,
                v => {
                  if (typeof v === 'string' || isDescriber(v)) {
                    actions.add(fromDescriber(v));
                  } else {
                    const result = reduceTransitions(v);
                    actions.add(...result.actions);
                    guards.add(...result.guards);
                  }
                },
              ),
            );
          },
        ),
      );
    },
  );

  piped();

  return {
    actions,
    guards,
    delays,
  };
};
