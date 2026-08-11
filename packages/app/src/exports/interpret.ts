import { interpretAsync } from '#interpreter';
import type { Fn } from '~types';
import { interpretSync } from '../sync/interpreter';
import type { CreateInterpreter_F } from './types.types';

/**
 * Creates and starts an interpreter instance for a given machine (sync or async).
 *
 * @param machine - The state machine instance to interpret.
 * @param config - Options and implementations required by the interpreter.
 *
 * @returns Running interpreter instance of type {@linkcode OutInterpreter}.
 *
 * @see -- type {@linkcode CreateInterpreter_F}
 */
// @ts-expect-error - This file is meant to be used in both sync and async contexts, so some types may not align perfectly.
export const interpret: CreateInterpreter_F = (machine, config) => {
  const check = machine.TYPE === 'sync';
  const { sync: _, ...rest } = { sync: undefined, ...config };
  const fn: Fn = check ? interpretSync : interpretAsync;
  return fn(machine, rest);
};
