import type { __ChildConfig } from '#actor';
import toArray from '#bemedev/features/arrays/castings/toArray';
import type { ConfigDef, NoExtraKeysConfigDef } from '#machines';
import type { NodeConfig } from '#states';
import type { ParseTreeContext } from './parseTree.types';

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
export const processActivity = (activity: any, ctx: ParseTreeContext) => {
  if (typeof activity === 'string') {
    ctx.actionsKeysSet.add(activity);
    if (!ctx.actionsAddedSet.has(activity)) {
      ctx.actionsAddedSet.add(activity);
      ctx.actionsSet.add(activity);
    }
  } else if (typeof activity === 'object' && activity !== null) {
    if ('actions' in activity) {
      const actions = toArray.typed(activity.actions);
      actions.forEach(a => {
        const aKey =
          typeof a === 'string' ? a : (a as any).description || '';
        if (aKey) ctx.actionsKeysSet.add(aKey);
        if (!ctx.actionsAddedSet.has(aKey)) {
          ctx.actionsAddedSet.add(aKey);
          ctx.actionsSet.add(a);
        }
      });
    }
    if ('guards' in activity) {
      const guards = toArray.typed(activity.guards);
      guards.forEach(g => {
        const gKey =
          typeof g === 'string' ? g : (g as any).description || '';
        if (gKey) ctx.guardsKeysSet.add(gKey);
        if (!ctx.guardsAddedSet.has(gKey)) {
          ctx.guardsAddedSet.add(gKey);
          ctx.guardsSet.add(g);
        }
      });
    }
  }
};

// Helper to extract from transitions
export const processTransition = (
  transition: any,
  eventKey: string,
  ctx: ParseTreeContext,
) => {
  if (typeof transition === 'string') {
    ctx.pathsSet.add(`on.${eventKey}`);
  } else if (Array.isArray(transition)) {
    transition.forEach((trans, index) => {
      if (typeof trans === 'object') {
        if ('target' in trans || 'actions' in trans) {
          ctx.pathsSet.add(
            `on.${eventKey}${typeof trans === 'object' && Array.isArray(transition) ? `.[${index}]` : ''}`,
          );
        }
        if ('actions' in trans) {
          const actions = toArray.typed(trans.actions);
          actions.forEach(a => {
            const aKey =
              typeof a === 'string' ? a : (a as any).description || '';
            if (aKey) ctx.actionsKeysSet.add(aKey);
            if (!ctx.actionsAddedSet.has(aKey)) {
              ctx.actionsAddedSet.add(aKey);
              ctx.actionsSet.add(a);
            }
          });
        }
        if ('guards' in trans) {
          const guards = toArray.typed(trans.guards);
          guards.forEach(g => {
            const gKey =
              typeof g === 'string' ? g : (g as any).description || '';
            if (gKey) ctx.guardsKeysSet.add(gKey);
            if (!ctx.guardsAddedSet.has(gKey)) {
              ctx.guardsAddedSet.add(gKey);
              ctx.guardsSet.add(g);
            }
          });
        }
      }
    });
  } else if (typeof transition === 'object') {
    if ('target' in transition || 'actions' in transition) {
      ctx.pathsSet.add(`on.${eventKey}`);
    }
    if ('actions' in transition) {
      const actions = toArray.typed(transition.actions);
      actions.forEach(a => {
        const aKey =
          typeof a === 'string' ? a : (a as any).description || '';
        if (aKey) ctx.actionsKeysSet.add(aKey);
        if (!ctx.actionsAddedSet.has(aKey)) {
          ctx.actionsAddedSet.add(aKey);
          ctx.actionsSet.add(a);
        }
      });
    }
    if ('guards' in transition) {
      const guards = toArray.typed(transition.guards);
      guards.forEach(g => {
        const gKey =
          typeof g === 'string' ? g : (g as any).description || '';
        if (gKey) ctx.guardsKeysSet.add(gKey);
        if (!ctx.guardsAddedSet.has(gKey)) {
          ctx.guardsAddedSet.add(gKey);
          ctx.guardsSet.add(g);
        }
      });
    }
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
        description: actor.description,
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
  // Extract entry actions
  if (node.entry) {
    const entries = toArray.typed(node.entry as any);
    entries.forEach(entry => {
      const eKey =
        typeof entry === 'string'
          ? entry
          : (entry as any).description || '';
      if (eKey) ctx.actionsKeysSet.add(eKey);
      if (!ctx.actionsAddedSet.has(eKey)) {
        ctx.actionsAddedSet.add(eKey);
        ctx.actionsSet.add(entry);
      }
    });
  }

  // Extract exit actions
  if (node.exit) {
    const exits = toArray.typed(node.exit as any);
    exits.forEach(exit => {
      const eKey =
        typeof exit === 'string' ? exit : (exit as any).description || '';
      if (eKey) ctx.actionsKeysSet.add(eKey);
      if (!ctx.actionsAddedSet.has(eKey)) {
        ctx.actionsAddedSet.add(eKey);
        ctx.actionsSet.add(exit);
      }
    });
  }

  // Extract from activities
  if (node.activities) {
    Object.entries(node.activities).forEach(([_actKey, activity]) => {
      const activities = toArray.typed(activity as any);
      activities.forEach(act => processActivity(act, ctx));
    });
  }

  // Extract from on transitions
  if (node.on) {
    Object.entries(node.on).forEach(([eventKey, transition]) => {
      processTransition(transition, eventKey, ctx);
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
              const aKey =
                typeof a === 'string' ? a : (a as any).description || '';
              if (aKey) ctx.actionsKeysSet.add(aKey);
              if (!ctx.actionsAddedSet.has(aKey)) {
                ctx.actionsAddedSet.add(aKey);
                ctx.actionsSet.add(a);
              }
            });
          }
          if ('guards' in trans) {
            const guards = toArray.typed(trans.guards);
            guards.forEach(g => {
              const gKey =
                typeof g === 'string' ? g : (g as any).description || '';
              if (gKey) ctx.guardsKeysSet.add(gKey);
              if (!ctx.guardsAddedSet.has(gKey)) {
                ctx.guardsAddedSet.add(gKey);
                ctx.guardsSet.add(g);
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
