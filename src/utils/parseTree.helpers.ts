import type { __ChildConfig } from '../actors/types';
import toArray from '#bemedev/features/arrays/castings/toArray';
import type { ConfigDef, NoExtraKeysConfigDef } from '#machines';
import type { ActivityConfig, NodeConfig } from '#states';
import type { _TransitionConfig, TransitionConfig } from '#transitions';
import type { SingleOrArrayL } from '~types';
import { reduceGuards } from '../guards/functions/helpers/reduceGuards';
import type { ParseTreeContext } from './parseTree.types';
import type { GuardUnion } from '#guards';
import type { WithDescriber } from '#actions';
import { reduceActivity } from '../states/functions/reduceActivity';
import { pipe } from '@bemedev/pipe';
import { reduceDescribers } from './reduceDescribers';

// Recursively builds the paths map (ConfigDef) from a NodeConfig node.
// `targets` is all state paths in the machine; `initial` is only set for compound nodes;
// `states` is recursively built for each child state.
export const buildPathsMap = (
  node: NodeConfig,
  allPaths: string[],
): NoExtraKeysConfigDef<ConfigDef> => {
  const isCompound = 'initial' in node && node.initial !== undefined;
  const hasStates = 'states' in node && node.states !== undefined;

  const result: ConfigDef = {
    targets: allPaths.join(' | '),
  };

  if (isCompound) {
    (result as any).initial = (node as any).initial;
  }

  if (hasStates) {
    (result as any).states = Object.fromEntries(
      Object.entries((node as any).states).map(([key, child]) => [
        key,
        buildPathsMap(child as NodeConfig, allPaths),
      ]),
    );
  }

  return result;
};

// Helper to extract from single activity
export const processActivity = (
  ctx: ParseTreeContext,
  activity?: ActivityConfig,
) => {
  const pipeOn = pipe(
    (value?: ActivityConfig) => value ?? {},
    reduceActivity,
    values => {
      values.actions.forEach(ctx.actions.add.bind(ctx.actions));
      values.guards.forEach(ctx.guards.add.bind(ctx.guards));
      values.delays.forEach(ctx.delays.add.bind(ctx.delays));
    },
  );

  pipeOn(activity);
};

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
export const processActor = (
  actor: any,
  actorKey: string,
  ctx: ParseTreeContext,
) => {
  if ('next' in actor) {
    // EmitterConfig
    if (!ctx.emittersMap.has(actorKey)) {
      ctx.emittersMap.set(actorKey, actor);
    }
  } else if ('on' in actor) {
    // ChildConfig
    if (!ctx.childrenMap.has(actorKey)) {
      const childEntry: __ChildConfig = {
        description: actor.name,
        on: Object.entries(actor.on || {}),
        contexts: actor.contexts
          ? Object.entries(actor.contexts)
          : undefined,
      };
      if (!childEntry.contexts) delete (childEntry as any).contexts;
      ctx.childrenMap.set(actorKey, childEntry);
    }
  }
};

// Process all nodes in flat structure
export const traverse = (node: NodeConfig, ctx: ParseTreeContext) => {
  processActions(ctx, node.entry);
  processActions(ctx, node.exit);
  processActivity(ctx, node.activities);

  // Extract from activities

  // Extract from on transitions
  if (node.on) {
    Object.entries(node.on).forEach(([eventKey, transition]) => {
      const transitions = toArray.typed(transition);
      transitions.forEach(trans =>
        processTransition(trans as any, eventKey, ctx),
      );
    });
  }

  // Extract from always transitions
  if (node.always) {
    if (Array.isArray(node.always)) {
      node.always.forEach((trans, index) => {
        if (typeof trans === 'object') {
          ctx.pathsSet.add(`always.[${index}]`);
          if ('actions' in trans) {
            const actions = toArray.typed(trans.actions);
            actions.forEach(a => {
              const aKey = typeof a === 'string' ? a : (a as any).name;
              if (aKey) {
                if (!ctx.actionsKeysSet.has(aKey)) {
                  ctx.actionsSet.add(a);
                }
                ctx.actionsKeysSet.add(aKey);
              }
            });
          }
          if ('guards' in trans) {
            const guards = toArray.typed(trans.guards);
            guards.forEach(g => {
              const gKey = typeof g === 'string' ? g : (g as any).name;
              if (gKey) {
                if (!ctx.guardsKeysSet.has(gKey)) {
                  ctx.guardsSet.add(g);
                }
                ctx.guardsKeysSet.add(gKey);
              }
            });
          }
        }
      });
    } else {
      ctx.pathsSet.add('always');
    }
  }

  // Extract from after (delays)
  if (node.after) {
    Object.entries(node.after).forEach(([delayKey, transition]) => {
      if (!ctx.delaysSet.has(delayKey)) {
        ctx.delaysSet.add(delayKey);
      }
      ctx.pathsSet.add(`after.${delayKey}`);
      processTransition(transition, delayKey, ctx);
    });
  }

  // Extract from actors
  if (node.actors) {
    Object.entries(node.actors).forEach(([actorKey, actor]) => {
      processActor(actor, actorKey, ctx);
    });
  }
};
