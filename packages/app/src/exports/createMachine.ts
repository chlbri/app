import { createContract, type Contract } from '@bemedev/app-options';
import { createAsyncMachine } from '../asyncMachine/machine';
import { createSyncMachine } from '../sync/machine';
import type { CreateMachine_F } from './types.types';
export type { ContractMachine, CreateMachine_F } from './types.types';

/**
 * Internal helper function to instantiate a state machine from a contract.
 *
 * @param contract - Contract carrying the configuration and its types.
 *
 * @returns Synchronous or asynchronous state machine instance.
 */
const builder = (contract: Contract) => {
  const check = contract.types?.sync === true;
  const fn = check ? createSyncMachine : createAsyncMachine;
  return fn(contract);
};

/**
 * Creates the runtime contract consumed by machine classes.
 *
 * @param nameOrConfig - Contract name, configuration, or an existing contract.
 * @param configOrTypes - Configuration or types, depending on the call form.
 * @param types - Optional types for the named form.
 *
 * @returns A frozen contract.
 */
const toContract = (
  nameOrConfig: any,
  configOrTypes?: any,
  types?: any,
): Contract => {
  if (typeof nameOrConfig === 'string')
    return createContract(nameOrConfig, configOrTypes, types);

  return createContract(nameOrConfig, configOrTypes);
};

/**
 * Checks that a value is a contract, i.e. holds a config and its types.
 *
 * @param value - Value to check.
 *
 * @returns `true` when `value` is a contract.
 */
const isContract = (value: any): boolean =>
  !!value && typeof value === 'object' && 'config' in value && 'types' in value;

/**
 * Factory function to instantiate a sync or async state machine.
 *
 * A contract can be passed as the first argument: its `config` and `types` are
 * forwarded to the machine builder. Options built by `@bemedev/app-options`
 * are attached afterwards with `machine.addOptions(() => options)`.
 *
 * @param nameOrConfig - Contract, machine name registered in interface {@linkcode Register}, or state machine configuration object.
 * @param configOrTypes - Machine configuration object or type definitions map.
 * @param types - Optional type definition configuration if machine name was specified.
 *
 * @returns An instance of class {@linkcode SyncMachine} or class {@linkcode AsyncMachine}.
 *
 * @see -- type {@linkcode CreateMachine_F}
 */
export const createMachine: CreateMachine_F = (
  nameOrConfig: any,
  configOrTypes?: any,
  types?: any,
) => {
  if (isContract(nameOrConfig)) return builder(nameOrConfig);

  return builder(toContract(nameOrConfig, configOrTypes, types));
};
