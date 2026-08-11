import type { NodeConfigCompound2 } from '#states';
import { stateType } from '../stateType';

/**
 * Type guard for checking if a state configuration is compound.
 *
 * @param arg - State configuration object.
 *
 * @returns `true` if compound state node, `false` otherwise.
 */
export function isCompound(arg: any): arg is NodeConfigCompound2 {
  const out = stateType(arg) === 'compound';
  return out;
}
