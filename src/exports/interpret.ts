import { isAsyncConfig } from '#common/utils';
import { interpretSync } from '../sync/interpreter';
import type { CreateInterpreter_F } from './types.types';
import { interpret as interpretAsync } from '#interpreter';
import type { Fn } from '~types';

// @ts-expect-error - This file is meant to be used in both sync and async contexts, so some types may not align perfectly.
export const interpret: CreateInterpreter_F = (machine, config) => {
  const check =
    !isAsyncConfig(machine.config) && !!config && config.sync === 'sync';

  const { sync: _, ...rest } = { sync: undefined, ...config };
  const fn: Fn = check ? interpretSync : interpretAsync;
  return fn(machine, rest);
};
