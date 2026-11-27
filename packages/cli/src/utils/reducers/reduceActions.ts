import { createBetterSet } from '@bemedev/better-set';

/**
 * Deduplicates action names.
 *
 * Actions are declared as plain strings.
 *
 * @param actions - List of action names.
 *
 * @returns Set of unique action names.
 */
export const reduceActions = (...actions: string[]) => {
  const keys = createBetterSet<string>();

  actions.forEach(action => {
    keys.add(action);
  });

  return keys;
};
