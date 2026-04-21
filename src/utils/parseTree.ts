import type { ActionConfig } from '#actions';
import type { __ChildConfig, _EmitterConfig } from '#actor';
import { flatMap, type NodeConfig } from '#states';
import { buildPathsMap, traverse } from './parseTree.helpers';
import type { OutputParseTree, ParseTreeContext } from './parseTree.types';

export type ParseTree_F = (config: NodeConfig) => OutputParseTree;

export const parseTree: ParseTree_F = config => {
  const flat = flatMap(config);
  const allPaths = Object.keys(flat);

  // Initialize context with Sets
  const ctx: ParseTreeContext = {
    actionsSet: new Set<ActionConfig>(),
    guardsSet: new Set<ActionConfig>(),
    emittersMap: new Map<string, _EmitterConfig>(),
    childrenMap: new Map<string, __ChildConfig>(),
    delaysSet: new Set<string>(),
    pathsSet: new Set<string>(),
    actionsKeysSet: new Set<string>(),
    guardsKeysSet: new Set<string>(),
    actionsAddedSet: new Set<string>(),
    guardsAddedSet: new Set<string>(),
  };

  // Traverse through all nodes in flat structure
  Object.values(flat).forEach(node => traverse(node, ctx));

  return {
    flat,
    __config: config,
    keys: {
      actions: Array.from(ctx.actionsKeysSet),
      guards: Array.from(ctx.guardsKeysSet),
      emitters: Array.from(ctx.emittersMap.keys()),
      children: Array.from(ctx.childrenMap.keys()),
      delays: Array.from(ctx.delaysSet),
      paths: {
        map: buildPathsMap(config, allPaths),
        all: allPaths,
      },
    },
    actions: Array.from(ctx.actionsSet),
    guards: Array.from(ctx.guardsSet),
    emitters: Array.from(ctx.emittersMap.values()),
    children: Array.from(ctx.childrenMap.values()),
    delays: Array.from(ctx.delaysSet).map(d => d as any),
  };
};
