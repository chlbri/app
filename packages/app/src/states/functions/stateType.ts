import type { Fn } from '@bemedev/app-utils-bemedev';
import type { NodeConfig2, StateType } from '../types';

/**
 * Function signature for determining state category type.
 */
export type StateType_F = Fn<[state: NodeConfig2], StateType>;

/**
 * Determines the type of state based on its configuration.
 *
 * @param config - The state configuration object.
 * @returns The type of the state: 'atomic', 'compound', or the specified type.
 *
 * @see {@linkcode StateType_F} for more details.
 */
export const stateType: StateType_F = config => {
  const type = config.type;
  if (type) return type;
  const states = (config as any).states;

  if (states) {
    const len = Object.keys(states).length;

    /* v8 ignore else -- @preserve */
    if (len > 0) return 'compound';
  }

  return 'atomic';
};
