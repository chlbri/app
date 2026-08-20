import { createAsyncMachine } from '../asyncMachine/machine';
import { createSyncMachine } from '../sync/machine';
import type { CreateMachine_F } from './types.types';
export type { CreateMachine_F } from './types.types';

/**
 * Internal helper function to instantiate state machine instance based on options.
 *
 * @param _config - State machine configuration object.
 * @param types - Type definitions or options map.
 *
 * @returns Synchronous or asynchronous state machine instance.
 */
const builder = (_config: any, types: any) => {
  const check = types?.sync === true;
  const fn = check ? createSyncMachine : createAsyncMachine;
  return fn(_config);
};

/**
 * Factory function to instantiate a sync or async state machine.
 *
 * @param nameOrConfig - Machine name registered in type {@linkcode Register} or state machine configuration object.
 * @param configOrTypes - Machine configuration object or type definitions map.
 * @param types - Optional type definition configuration if machine name was specified.
 *
 * @returns An instance of type {@linkcode SyncMachine} or type {@linkcode AsyncMachine}.
 *
 * @see {@linkcode CreateMachine_F}
 */
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
