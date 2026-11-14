/**
 * Guard configuration checks used by the transition guards.
 *
 * Vendored from `@bemedev/app` so this package stays independent from the
 * machine implementation.
 */

import { expandFn } from '@bemedev/app-utils-bemedev';
import { checkAction } from './actions';
import { checkKeys } from './primitives';

/** Allowed key names for guard combination objects. */
const GUARD_KEYS = ['and', 'or'];

/**
 * Type guard checking that `value` is a guard configuration.
 *
 * @param value - Value to check.
 *
 * @returns `true` when `value` is a valid guard configuration.
 */
export const checkGuards = expandFn(
  (value: unknown): boolean => {
    if (value === undefined) return false;
    if (checkAction(value)) return true;

    if (Array.isArray(value)) {
      return value.length > 0 && value.every(checkGuards);
    }

    if (typeof value !== 'object' || value === null) return false;

    const _value = value as { and?: unknown; or?: unknown };
    const keys = Object.keys(_value);
    if (keys.length !== 1) return false;
    if (!checkKeys(_value, ...GUARD_KEYS)) return false;

    const and = _value.and;
    const or = _value.or;
    if (!Array.isArray(and) && !Array.isArray(or)) return false;

    return checkGuards(and) || checkGuards(or);
  },
  {
    /**
     * Checks a guard configuration or `undefined`.
     *
     * @param value - Value to check.
     *
     * @returns `true` when `value` is `undefined` or a guard configuration.
     */
    orUndefined: (value: unknown): boolean => {
      if (value === undefined) return true;
      return checkGuards(value);
    },
  },
);
