import { toArray } from '@bemedev/app';
import { DEFAULT_DELIMITER } from '@bemedev/app/constants';
import type {
  ActivityConfig,
  NodeConfig2,
  RecordS,
  SingleOrArrayL,
  WithDescriber,
} from '@bemedev/app/types';
import { flatMap } from '@bemedev/app/states';
import { reduceActivity } from './reducers/reduceActivity';
import { reduceDescribers } from './reducers/reduceDescribers';
import { reduceTransitionsConfig } from './reducers/reduceTransitionsConfig';
import { recompose } from '@bemedev/decompose';
import { pipe } from '@bemedev/pipe';
import {
  monad,
  paramArray,
  tap,
  toggleMonad,
} from '@bemedev/pipe/extensions/common';
import type { ConfigPaths, ConfigPaths2, ParseTreeContext } from './parseTree.types';
import type { _TransitionsConfig } from '@bemedev/app/transitions';

/**
 * Recursively builds the paths map from a flat map of node configurations.
 * `targets` is all state paths in the machine; `initial` is set for compound nodes;
 * `states` is recursively built for each child state.
 */
export const buildPaths = pipe(
  (flat: RecordS<NodeConfig2>) => Object.entries(flat),
  entries => {
    return entries.map(
      pipe(
        ([key, value], _, all) => {
          return [
            key,
            value.initial,
            all.map(([k]) => k).filter(k => k !== key),
          ] as const;
        },
        ([key, initial, targets]) => {
          return [key, { targets, initial }] as const;
        },
        ([key, { targets, initial }]) => {
          const value: ConfigPaths2 = { targets };

          if (initial) value.initial = initial;
          return [key, value] as const;
        },

        ([key, value]) => {
          if (key === DEFAULT_DELIMITER) {
            const out = [
              ['initial', value.initial],
              ['targets', value.targets],
            ] as const;
            return out;
          }

          const newKey = pipe(
            () => key,
            k => k.replaceAll(DEFAULT_DELIMITER, '.states.'),
            k => k.substring(1),
          )();

          return [newKey, value] as const;
        },
      ),
    );
  },
  v => {
    const array: any[] = [];

    v.forEach(
      pipe(
        v => v,
        toggleMonad(
          ([key]) => Array.isArray(key),
          tap(([val1, val2]) => {
            array.push(val1, val2);
          }),
          tap(([key, val2]) => {
            array.push([key, val2]);
          }),
        ),
      ),
    );

    return array;
  },
  Object.fromEntries,
  recompose,
  v => v as ConfigPaths,
);

/**
 * Extracts action, guard, and delay tokens from an activity configuration node into context.
 *
 * @param ctx - Parse tree context of type {@linkcode ParseTreeContext}.
 * @param activity - Optional activity configuration node of type {@linkcode ActivityConfig}.
 */
export const processActivity = pipe(
  (ctx: ParseTreeContext, activity?: ActivityConfig) => {
    pipe(
      () => activity,
      monad(branch => [
        branch(
          v => v !== undefined,
          tap(
            pipe(
              reduceActivity,
              tap(pipe(v => v.actions, paramArray(ctx.actions.add))),
              tap(pipe(v => v.guards, paramArray(ctx.guards.add))),
              tap(pipe(v => v.delays, paramArray(ctx.delays.add))),
            ),
          ),
        ),
      ]),
    )();
  },
);

/**
 * Processes transitions configuration object and populates symbol sets into context.
 *
 * @param ctx - Parse tree context of type {@linkcode ParseTreeContext}.
 * @param transitions - Transitions config object of type {@linkcode _TransitionsConfig}.
 */
export const processTransitionsConfig = (
  ctx: ParseTreeContext,
  transitions: _TransitionsConfig,
) => {
  return pipe(
    () => transitions,
    reduceTransitionsConfig,
    tap(pipe(v => v.actions, paramArray(ctx.actions.add))),
    tap(pipe(v => v.guards, paramArray(ctx.guards.add))),
    tap(pipe(v => v.targets, paramArray(ctx.targets.add))),
    tap(pipe(v => v.events, paramArray(ctx.events.add))),
    tap(pipe(v => v.delays, paramArray(ctx.delays.add))),
    tap(pipe(v => v.pContextKeys, paramArray(ctx.pContextKeys.add))),
    tap(pipe(v => v.emitters, paramArray(ctx.emitters.add))),
    tap(pipe(v => v.children, paramArray(ctx.children.add))),
  )();
};

/**
 * Extracts action names from entry or exit describers and adds them to context.
 *
 * @param ctx - Parse tree context of type {@linkcode ParseTreeContext}.
 * @param actions - Single action or array of actions with describers of type {@linkcode WithDescriber}.
 */
const processActions = pipe(
  (ctx: ParseTreeContext, actions?: SingleOrArrayL<WithDescriber>) => {
    pipe(
      () => actions,
      toArray.typed,
      values => reduceDescribers(...values),
      values => ctx.actions.add(...values),
    )();
  },
);

/**
 * Traverses a single node config and processes entry/exit actions, activities, transitions, and tags.
 *
 * @param ctx - Parse tree context of type {@linkcode ParseTreeContext}.
 * @param node - Node configuration object of type {@linkcode NodeConfig2}.
 */
export const traverseOne = (ctx: ParseTreeContext, node: NodeConfig2) => {
  processActions(ctx, node.entry);
  processActions(ctx, node.exit);
  processActivity(ctx, node.activities);
  processTransitionsConfig(ctx, node);

  pipe(
    () => node,
    n => n.tags,
    toArray.typed,
    v => ctx.tags.add(...v),
  )();
};

/**
 * Flattens and traverses all nodes in a machine configuration hierarchy.
 *
 * @param ctx - Parse tree context of type {@linkcode ParseTreeContext}.
 * @param node - Root machine configuration node of type {@linkcode NodeConfig2}.
 */
export const traverse = (ctx: ParseTreeContext, node: NodeConfig2) => {
  pipe(
    () => node,
    flatMap,
    tap(f => (ctx.__flat = f)),
    v => Object.entries(v),
    v => {
      return v.forEach(
        pipe(
          v => v,
          tap(([key]) => ctx.allPaths.add(key)),
          ([, value]) => value,
          v => traverseOne(ctx, v),
        ),
      );
    },
  )();
};
