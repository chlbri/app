import type { NodeConfigAtomic2 } from '#states';
import { stateType } from '../stateType';

/**
 * Type guard for checking if a state configuration is atomic.
 *
 * @param arg - State configuration object.
 *
 * @returns `true` if atomic state node, `false` otherwise.
 */
export function isAtomic(arg: any): arg is NodeConfigAtomic2 {
  const out = stateType(arg) === 'atomic';
  return out;
}
