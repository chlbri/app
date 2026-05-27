import { isAsyncConfig } from '#common/utils';
import { createMachine as createAsyncMachine } from '#machine';
import type { Fn } from '~types';
import { createSyncMachine } from '../sync/machine';
import type { CreateMachine_F } from './types.types';

export const createMachine: CreateMachine_F = (name, config, types) => {
  const check = !isAsyncConfig(config) && !!types && types.sync === 'sync';
  const { sync: _, ...rest } = { sync: undefined, ...types };
  const fn: Fn = check ? createSyncMachine : createAsyncMachine;
  return fn(name, config, rest);
};
