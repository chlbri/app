import type { ActionConfig } from '#actions';
import type { _EmitterConfig, __ChildConfig } from '#actor';
import type { NoExtraKeysConfigDef, ConfigDef } from '#machines';
import type { NodeConfig } from '#states';
import type { RecordS } from '~types';

export type ParseTreeContext = {
  actionsSet: Set<ActionConfig>;
  guardsSet: Set<ActionConfig>;
  emittersMap: Map<string, _EmitterConfig>;
  childrenMap: Map<string, __ChildConfig>;
  delaysSet: Set<string>;
  pathsSet: Set<string>;
  actionsKeysSet: Set<string>;
  guardsKeysSet: Set<string>;
  actionsAddedSet: Set<string>;
  guardsAddedSet: Set<string>;
};

export type OutputParseTree = {
  flat: RecordS<NodeConfig>;
  __config: NodeConfig;

  keys: {
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

  actions: ActionConfig[];
  guards: ActionConfig[];
  emitters: _EmitterConfig[];
  children: __ChildConfig[];
  delays: ActionConfig[];
};
