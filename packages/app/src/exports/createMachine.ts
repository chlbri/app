import { isAsyncConfig } from '#common/functions/isAsyncConfig';
import { createAsyncMachine } from '#machine';
import { NodeConfig_Schema } from '#states';
import { _any } from '@bemedev/app-utils-bemedev';
import * as v from 'valibot';
import { createSyncMachine } from '../sync/machine';
import type { CreateMachine_F } from './types.types';
export type { CreateMachine_F } from './types.types';

const builder = (config: any, types: any) => {
  console.warn(
    'pass',
    JSON.stringify(
      v.safeParse(NodeConfig_Schema(), config).issues?.length,
      null,
      2,
    ),
  );
  // const _config = v.parse(NodeConfig_Schema(), config);
  const check = !isAsyncConfig(config) && types?.sync === true;
  const { sync: __, ...rest } = { sync: undefined, ...types };
  const fn = check ? _any(createSyncMachine) : _any(createAsyncMachine);
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
