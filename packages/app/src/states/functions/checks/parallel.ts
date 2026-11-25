import type { NodeConfigParallel2 } from '@bemedev/app-contract';

/**
 * Type guard for checking if a state configuration is parallel.
 *
 * @param arg - State configuration object.
 *
 * @returns `true` if parallel state node, `false` otherwise.
 */
export function isParallel(arg: unknown): arg is NodeConfigParallel2 {
  return (arg as any).type === 'parallel';
}
