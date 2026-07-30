import { createAsyncMachine } from '../asyncMachine/machine';
import { createSyncMachine } from '../sync/machine';
import type { CreateMachine_F } from './types.types';
export type { CreateMachine_F } from './types.types';

const builder = (_config: any, types: any) => {
  const check = types?.sync === true;
  const fn = check ? createSyncMachine : createAsyncMachine;
  return fn(_config);
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
