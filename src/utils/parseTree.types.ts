import type { ConfigDef, NoExtraKeysConfigDef } from '#machines';
import type { NodeConfig } from '#states';
import type { RecordS } from '~types';

export type ParseTreeContext = {
  actions: Set<string>;
  guards: Set<string>;
  emitters: Set<string>;
  children: Set<string>;
  delays: Set<string>;
  allPaths: Set<string>;
  events: Set<string>;
  actors: Set<string>;
};

export type OutputParseTree = {
  flat: RecordS<NodeConfig>;
  __config: NodeConfig;
  actions: string[];
  guards: string[];
  emitters: string[];
  children: string[];
  delays: string[];

  paths: {
    map: NoExtraKeysConfigDef<ConfigDef>;
    all: string[];
  };
};
