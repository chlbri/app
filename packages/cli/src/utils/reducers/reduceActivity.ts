import { toArray } from '@bemedev/app/bemedev';
import type { ActivityConfig } from '@bemedev/app/types';
import { createBetterSet } from '@bemedev/better-set';
import { pipe } from '@bemedev/pipe';
import { tap } from '@bemedev/pipe/extensions/common';
import { reduceTransitions } from './reduceTransitions';

/**
 * Reduces activity configuration into sets of extracted actions, guards, and delays.
 *
 * @param activity - Activity configuration object of type {@linkcode ActivityConfig}.
 *
 * @returns Object containing `actions`, `guards`, and `delays` sets.
 */
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
                  if (typeof v === 'string') {
                    actions.add(v);
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

  return { actions, guards, delays };
};
