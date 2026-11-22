import {
  createContract,
  type Contract,
  type OptionsPlugin,
} from '@bemedev/app-options';
import { createAsyncMachine } from '../asyncMachine/machine';
import { createSyncMachine } from '../sync/machine';
import type { CreateMachine_F } from './types.types';
export type { ContractMachine, CreateMachine_F } from './types.types';
import { toArray } from '@bemedev/app-utils-bemedev';

/**
 * Internal helper function to instantiate a state machine from a contract.
 *
 * @param contract - Contract carrying the configuration and its types.
 *
 * @returns Synchronous or asynchronous state machine instance.
 */
const builder = (
  contract: Contract,
  plugins: readonly OptionsPlugin<any, any>[] = [],
) => {
  const check = contract.types?.sync === true;
  const fn = check ? createSyncMachine : createAsyncMachine;
  return fn(contract, plugins);
};

/**
 * Splits the optional `plugins` entry out of a type schema object.
 *
 * @param types - Type schema object, possibly carrying plugins.
 *
 * @returns The type schemas without `plugins`, and the extracted plugins.
 */
const splitPlugins = (types?: any) => {
  if (!types || typeof types !== 'object' || Array.isArray(types)) {
    return { plugins: [] as readonly OptionsPlugin<any, any>[], types };
  }

  const { plugins, ...rest } = types;

  return {
    plugins: (Array.isArray(plugins) ? plugins : []) as readonly OptionsPlugin<
      any,
      any
    >[],
    types: rest,
  };
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
const toContract = (nameOrConfig: any, configOrTypes?: any, types?: any) => {
  if (typeof nameOrConfig === 'string') {
    const split = splitPlugins(types);
    return {
      contract: createContract(nameOrConfig, configOrTypes, split.types),
      plugins: split.plugins,
    };
  }

  const split = splitPlugins(configOrTypes);

  return {
    contract: createContract(nameOrConfig, split.types),
    plugins: split.plugins,
  };
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
  if (isContract(nameOrConfig)) {
    const plugins = (nameOrConfig.types as any)?.plugins;
    return builder(nameOrConfig, toArray(plugins));
  }

  const { contract, plugins } = toContract(nameOrConfig, configOrTypes, types);
  return builder(contract, plugins);
};
