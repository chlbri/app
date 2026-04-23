import type { WithDescriber } from '#actions';
import toArray from '#bemedev/features/arrays/castings/toArray';
import type { GuardUnion } from '#guards';
import type { ConfigDef } from '#machines';
import { flatMap, type ActivityConfig, type NodeConfig } from '#states';
import type { _TransitionConfig, _TransitionsConfig } from '#transitions';
import { pipe } from '@bemedev/pipe';
import { tap } from '@bemedev/pipe/extensions/common';
import type { RecordS, SingleOrArrayL } from '~types';
import { reduceActors } from '../actors/reduceActors';
import type { ActorConfig } from '../actors/types';
import { reduceGuards } from '../guards/functions/helpers/reduceGuards';
import { reduceActivity } from '../states/functions/reduceActivity';
import { reduceTransitionsConfig } from '../transitions/functions/reduceTransitionsConfig';
import type { ConfigPaths, ParseTreeContext } from './parseTree.types';
import { reduceDescribers } from './reduceDescribers';

// Recursively builds the paths map (ConfigDef) from a NodeConfig node.
// `targets` is all state paths in the machine; `initial` is only set for compound nodes;
// `states` is recursively built for each child state.
export const buildPathsMap = (
  node: NodeConfig,
  ...paths: string[]
): ConfigPaths => {
  


  const hasStates = 'states' in node && node.states !== undefined;

  const result: ConfigPaths = {
    targets: paths,
  };

  result.initial = node.initial;

  if (hasStates) {
    result.states = Object.fromEntries(
      Object.entries(node.states).map(([key, child]) => {
        return [key, buildPathsMap(child as NodeConfig, ...paths)];
      }),
    );
  }

  return result;
};

// Helper to extract from single activity
export const processActivity = pipe(
  (ctx: ParseTreeContext, activity?: ActivityConfig) => ({
    ctx,
    values: pipe(
      () => activity,
      a => a ?? {},
      reduceActivity,
    )(),
  }),
  ({ ctx, values }) => {
    ctx.actions.add(...values.actions);
    ctx.guards.add(...values.guards);
    ctx.delays.add(...values.delays);
  },
);

const processGuards = (
  ctx: ParseTreeContext,
  guards?: SingleOrArrayL<GuardUnion>,
) => {
  const pipeOn = pipe(
    (values?: typeof guards) => toArray.typed(values),
    values => reduceGuards(...values),
    values => reduceDescribers(...values),
    values => values.forEach(ctx.guards.add.bind(ctx.guards)),
  );

  pipeOn(guards);
};

const processActions = (
  ctx: ParseTreeContext,
  actions?: SingleOrArrayL<WithDescriber>,
) => {
  const pipeOn = pipe(
    (values?: typeof actions) => toArray.typed(values),
    values => reduceDescribers(...values),
    values => values.forEach(ctx.actions.add.bind(ctx.actions)),
  );

  pipeOn(actions);
};

// Helper to extract from transitions
export const processTransition = (
  transition: _TransitionConfig,
  eventKey: string,
  ctx: ParseTreeContext,
) => {
  if (typeof transition === 'string') {
    ctx.pathsSet.add(`on.${eventKey}`);
  } else if (typeof transition === 'object') {
    if ('target' in transition || 'actions' in transition) {
      ctx.pathsSet.add(`on.${eventKey}`);
    }
    processActions(ctx, transition.actions);
    processGuards(ctx, transition.guards);
  }
};

// Helper to process actor configs
export const processActors = pipe(
  (ctx: ParseTreeContext, actors?: RecordS<ActorConfig>) => {
    return {
      ctx,
      actors: pipe(
        () => actors,
        a => a ?? {},
        reduceActors,
        v => v,
      )(),
    };
  },
  ({ ctx, actors }) => {
    ctx.actions.add(...actors.actions);
    ctx.guards.add(...actors.guards);
    ctx.targets.add(...actors.targets);
    ctx.emitters.add(...actors.emitters);
    ctx.children.add(...actors.children);
    ctx.pContextKeys.add(...actors.pContextKeys);
  },
);

export const processTransitionsConfig = (
  ctx: ParseTreeContext,
  transitions: _TransitionsConfig,
) => {
  return pipe(
    () => transitions,
    reduceTransitionsConfig,
    transitions => {
      ctx.actions.add(...transitions.actions);
      ctx.guards.add(...transitions.guards);
      ctx.targets.add(...transitions.targets);
      ctx.events.add(...transitions.events);
      ctx.delays.add(...transitions.delays);
      ctx.pContextKeys.add(...transitions.pContextKeys);
      ctx.emitters.add(...transitions.emitters);
      ctx.children.add(...transitions.children);
    },
  )();
};

// Process all nodes in flat structure
export const traverseOne = (ctx: ParseTreeContext, node: NodeConfig) => {
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
export const traverse = (ctx: ParseTreeContext, node: NodeConfig) => {
  pipe(
    () => node,
    flatMap,
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
