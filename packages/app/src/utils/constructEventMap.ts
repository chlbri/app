import { constructEventsMap } from '@bemedev/app-options/internal';
import { type NodeConfig3 } from '#states';

/**
 * Constructs an array of all event strings supported by a state node and its descendants.
 *
 * Delegates to `@bemedev/app-options` so the machine runtime and the option
 * helpers share a single implementation.
 *
 * @param node - The state node configuration of type {@linkcode NodeConfig3}.
 *
 * @returns Array of event string names.
 */
export const constructEvents = (node: NodeConfig3) => constructEventsMap(node);
