import type { NodeConfig2, RecordS } from '@bemedev/app';
import { createBetterSet, type BetterSet } from '@bemedev/better-set';
import { buildPaths, traverse } from './parseTree.helpers';
import type {
  ConfigPaths,
  NoExtraKeysConfigPaths,
  ParseTreeContext,
} from './parseTree.types';

type Output = {
  __config: NodeConfig2;
  flat: RecordS<NodeConfig2>;
  paths: { map: NoExtraKeysConfigPaths<ConfigPaths>; all: string[] };
  actions: BetterSet<string>;
  guards: BetterSet<string>;
  emitters: BetterSet<string>;
  children: BetterSet<string>;
  delays: BetterSet<string>;
  allPaths: BetterSet<string>;
  targets: BetterSet<string>;
  events: BetterSet<string>;
  pContextKeys: BetterSet<string>;
  tags: BetterSet<string>;
};

export type ParseTree_F = (config: NodeConfig2) => Output;

export const parseTree: ParseTree_F = config => {
  const __config = config;

  // Initialize context with Sets
  const ctx: ParseTreeContext = {
    actions: createBetterSet<string>(),
    guards: createBetterSet<string>(),
    emitters: createBetterSet<string>(),
    children: createBetterSet<string>(),
    delays: createBetterSet<string>(),
    allPaths: createBetterSet<string>(),
    targets: createBetterSet<string>(),
    events: createBetterSet<string>(),
    pContextKeys: createBetterSet<string>(),
    tags: createBetterSet<string>(),
  };

  // Traverse through all nodes in flat structure
  traverse(ctx, config);
  const { __flat, ...rest } = ctx;
  const flat = __flat!;

  return {
    ...rest,
    flat,
    __config,

    paths: { map: buildPaths(flat), all: Object.keys(flat) },
  };
};
