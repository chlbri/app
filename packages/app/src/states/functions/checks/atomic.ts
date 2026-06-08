import type { NodeConfigAtomic2 } from '#states';
import { stateType } from '../stateType';

export function isAtomic(arg: any): arg is NodeConfigAtomic2 {
  const out = stateType(arg) === 'atomic';
  return out;
}
