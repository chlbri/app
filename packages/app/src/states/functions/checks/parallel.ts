import type { NodeConfigParallel2 } from '../../types';

export function isParallel(arg: unknown): arg is NodeConfigParallel2 {
  return (arg as any).type === 'parallel';
}
