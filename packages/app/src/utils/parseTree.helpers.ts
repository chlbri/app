import type { WithDescriber } from '#actions';
import { toArray } from '@bemedev/app-utils-bemedev';
import { DEFAULT_DELIMITER } from '#constants';
import { flatMap, type ActivityConfig, type NodeConfig2 } from '#states';
import type { _TransitionsConfig } from '#transitions';
import { recompose } from '@bemedev/decompose';
import { pipe } from '@bemedev/pipe';
import {
  paramArray,
  tap,
  monad,
  toggleMonad,
} from '@bemedev/pipe/extensions/common';
import type { RecordS, SingleOrArrayL } from '~types';
import { reduceActivity } from '../states/functions/reduceActivity';
import { reduceTransitionsConfig } from '../transitions/functions/reduceTransitionsConfig';
import type {
  ConfigPaths,
  ConfigPaths2,
  ParseTreeContext,
} from './parseTree.types';
import { reduceDescribers } from './reduceDescribers';

// Recursively builds the paths map (ConfigDef) from a NodeConfig node.
// `targets` is all state paths in the machine; `initial` is only set for compound nodes;
// `states` is recursively built for each child state.
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

// Helper to extract from single activity
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

// Process all nodes in flat structure
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
