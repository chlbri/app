import { isAsyncConfig } from '#common/functions/isAsyncConfig';
import { createAsyncMachine } from '#machine';
import { getTargetsFromConfig, NodeConfig_Schema } from '#states';
import * as v from 'valibot';
import { createSyncMachine } from '../sync/machine';
import type { CreateMachine_F } from './types.types';
export type { CreateMachine_F } from './types.types';

const builder = (config: any, types: any) => {
  const config1 = v.safeParse(NodeConfig_Schema(), config);
  const targets = getTargetsFromConfig(config);
  const config2 = v.safeParse(NodeConfig_Schema(...targets), config1);
  console.warn('issues', config2.issues);
  const check = !isAsyncConfig(config) && types?.sync === true;
  const { sync: __, ...rest } = { sync: undefined, ...types };
  const fn = check ? createSyncMachine : createAsyncMachine;
  return fn(config, rest);
};

// @ts-expect-error - This file is meant to be used in both sync and async contexts, so some types may not align perfectly.
export const createMachine: CreateMachine_F = (
  nameOrConfig,
  configOrTypes,
  types,
) => {
  if (typeof nameOrConfig === 'string') {
    return builder(configOrTypes, types);
  }
  return builder(nameOrConfig, configOrTypes);
};
