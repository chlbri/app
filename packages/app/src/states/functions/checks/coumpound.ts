import type { NodeConfigCompound2 } from '#states';
import { stateType } from '../stateType';

export function isCompound(arg: any): arg is NodeConfigCompound2 {
  const out = stateType(arg) === 'compound';
  return out;
}
