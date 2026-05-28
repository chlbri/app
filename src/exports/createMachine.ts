import { isAsyncConfig } from '#common/utils';
import { createAsyncMachine } from '#machine';
import { createSyncMachine } from '../sync/machine';
import type { CreateMachine_F } from './types.types';
export type { CreateMachine_F } from './types.types';

const builder = (config: any, types: any) => {
  const check = !isAsyncConfig(config) && !!types && types.sync === 'sync';
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
