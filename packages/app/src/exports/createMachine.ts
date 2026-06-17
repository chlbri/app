import { createAsyncMachine } from '../asyncMachine/machine';
import { getTargetsFromConfig } from '#states';
import * as v from 'valibot';
import { createSyncMachine } from '../sync/machine';
import { Config_Schema } from './schema';
import type { CreateMachine_F } from './types.types';
export type { CreateMachine_F } from './types.types';

const builder = (_config: any, types: any) => {
  const targets = getTargetsFromConfig(_config);
  const config = v.parse(Config_Schema(...targets), _config);
  const check = types?.sync === true;
  const fn = check ? createSyncMachine : createAsyncMachine;
  return fn(config);
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
