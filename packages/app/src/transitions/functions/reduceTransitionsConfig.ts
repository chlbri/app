import { toArray } from '@bemedev/app-utils-bemedev';
import { createBetterSet, type BetterSet } from '@bemedev/better-set';
import { pipe } from '@bemedev/pipe';
import { tap } from '@bemedev/pipe/extensions/common';
import { reduceActors } from '../../actors/reduceActors';
import type { _TransitionsConfig } from '../types';
import { reduceTransitions } from './reduceTransitions';

/**
 *  Extracts the target, actions, guards, and description from a transition configuration.
 *
 * @param transitions
 * @returns An array of objects containing the target, actions, guards, and description for each transition configuration.
 *
 * @see {@linkcode _TransitionsConfig}

 */
export const reduceTransitionsConfig = (
  transitions: _TransitionsConfig,
) => {
  const actions = createBetterSet<string>();
  const guards = createBetterSet<string>();
  const targets = createBetterSet<string>();
  const events = createBetterSet<string>();
  const delays = createBetterSet<string>();
  const pContextKeys = createBetterSet<string>();
  const emitters = createBetterSet<string>();
  const children = createBetterSet<string>();

  type _HelperRecord = Record<
    'targets' | 'guards' | 'actions',
    BetterSet<string>
  >;

  const helperTransition = (v: _HelperRecord) => {
    targets.add(...v.targets);
    guards.add(...v.guards);
    actions.add(...v.actions);
  };

  const piped = pipe(
    () => transitions,

    t => ({
      on: t.on ?? {},
      always: t.always ?? [],
      actors: t.actors ?? {},
      after: t.after ?? {},
    }),

    tap(
      pipe(
        ({ on }) => on,
        on => Object.entries(on),
        entries => {
          entries.forEach(
            pipe(
              v => v,
              tap(([event]) => events.add(event)),
              ([, value]) => value,
              toArray.typed,
              v => reduceTransitions(...v),
              helperTransition,
            ),
          );
        },
      ),
    ),

    tap(
      pipe(
        ({ always }) => always,
        v => toArray.typed(v),
        v => reduceTransitions(...v),
        helperTransition,
      ),
    ),

    tap(
      pipe(
        ({ after }) => Object.entries(after),
        entries => {
          entries.forEach(
            pipe(
              v => v,
              tap(([delay]) => delays.add(delay)),
              ([, value]) => value,
              toArray.typed,
              v => reduceTransitions(...v),
              helperTransition,
            ),
          );
        },
      ),
    ),

    tap(
      pipe(
        ({ actors }) => actors,
        v => reduceActors(v),
        tap(pipe(v => v.emitters, emitters.__provideItems)),
        tap(pipe(v => v.children, children.__provideItems)),
        tap(pipe(v => v.pContextKeys, pContextKeys.__provideItems)),
        helperTransition,
      ),
    ),
  );

  piped();

  return {
    actions,
    guards,
    targets,
    events,
    delays,
    pContextKeys,
    emitters,
    children,
  };
};
