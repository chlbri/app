import { DEFAULT_DELIMITER } from '#constants';
import { flatByKey } from '@bemedev/decompose';
import type { FlatMapN, NodeConfig2 } from '../types';
import { expandFn } from '@bemedev/app-utils-bemedev';
import type { RecordS } from '~types';

/**
 * Function signature for flattening state node configuration map.
 *
 * @template {NodeConfig2} T - Root node configuration type.
 *
 * @param config - State node configuration.
 * @param children - Whether to include child states.
 * @param sep - Delimiter string.
 *
 * @returns Flattened state map of type {@linkcode FlatMapN}.
 */
export type FlatMap_F<T extends NodeConfig2 = NodeConfig2> = <
  const SN extends T,
  Wc extends boolean = false,
>(
  config: SN,
  children?: Wc,
  sep?: string,
) => FlatMapN<SN, Wc>;

/**
 * Flattens a state node configuration into a map structure.
 *
 * @param node - The state node configuration to flatten.
 * @param withChildren - Whether to include child states in the output.
 * @param delimiter - The delimiter to use for paths in the output map. Defaults to {@linkcode DEFAULT_DELIMITER}.
 * @param path - The current path in the output map (used for recursion).
 * @returns A flat map of the state node configuration.
 *
 * @see {@linkcode FlatMap_F} for more details.
 */
export const flatMap = expandFn(
  ((node, children, sep = DEFAULT_DELIMITER) => {
    return flatByKey.low(node, 'states', { children, sep });
  }) as FlatMap_F,
  {
    low: (node: NodeConfig2, children = false, sep = DEFAULT_DELIMITER) => {
      return flatByKey.low(node, 'states', {
        children,
        sep,
      }) as RecordS<NodeConfig2>;
    },
  },
);
