import { fromDescriber, type WithDescriber } from '@bemedev/app/types';
import { createBetterSet } from '@bemedev/better-set';

/**
 * Extracts action/guard names from describer objects or strings.
 *
 * @param describers - List of describer objects of type {@linkcode WithDescriber} or string keys.
 *
 * @returns Set of extracted describer key strings.
 */
export const reduceDescribers = (...describers: WithDescriber[]) => {
  const keys = createBetterSet<string>();

  describers.forEach(describer => {
    const key = fromDescriber(describer);
    keys.add(key);
  });

  return keys;
};
