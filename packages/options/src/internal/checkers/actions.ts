/**
 * Action entry checks used by the transition guards.
 *
 * Vendored from `@bemedev/app` so this package stays independent from the
 * machine implementation.
 */

import type { Describer } from '@bemedev/app-contract';
import { expandFn, toArray } from '@bemedev/app-contract/bemedev';
import { isDescriber, isString } from './primitives';

/**
 * Type guard checking that `entry` is an action name or a describer.
 *
 * @param entry - Value to check.
 *
 * @returns `true` when `entry` is a string or a describer.
 */
export const checkAction = (entry: unknown): entry is string | Describer => {
  return isString(entry) || isDescriber(entry);
};

/**
 * Type guard checking a single action or an array of actions.
 *
 * @param action - Value to check.
 *
 * @returns `true` when every entry is a valid action entry.
 */
export const checkActions = expandFn(
  (action: unknown): boolean => {
    const actions = toArray(action);
    return actions.every(checkAction);
  },
  {
    /**
     * Checks a single action, an array of actions, or `undefined`.
     *
     * @param action - Value to check.
     *
     * @returns `true` when `action` is `undefined` or holds valid entries.
     */
    orUndefined: (action: unknown): boolean => {
      if (action === undefined) return true;
      return checkActions(action);
    },
  },
);
