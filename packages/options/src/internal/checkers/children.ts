/**
 * Child actor configuration guard.
 *
 * Migrated from `@bemedev/app` so this package is the single home of the
 * actor checkers.
 */

import type { ChildConfig } from '@bemedev/app-contract';

import { checkKeys, isString, isStringOrUndefined } from './primitives';
import { isOn } from './transitions';

/** Allowed property keys for child actor configurations. */
const CHILD_KEYS = ['on', 'contexts', 'description'] as const;

/**
 * Type guard for checking if a value is a valid child actor configuration.
 *
 * @template `T` - Keys parameter tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target state path keys.
 *
 * @returns `true` if type {@linkcode ChildConfig}, `false` otherwise.
 */
export const isChildConfig = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is ChildConfig<T[number]> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;

  const _value = value as {
    on?: unknown;
    contexts?: unknown;
    description?: unknown;
  };
  const valueKeys = Object.keys(_value);
  if (!checkKeys(_value, ...CHILD_KEYS)) return false;
  if (valueKeys.length === 0) return false;

  const { on, contexts, description } = _value;

  if (!isStringOrUndefined(description)) return false;
  if (on === undefined && contexts === undefined) return false;
  if (!isOn.orUndefined(on, ...keys)) return false;

  if (contexts === undefined) return true;
  if (typeof contexts !== 'object' || contexts === null || Array.isArray(contexts))
    return false;

  return Object.values(contexts).every(isString);
};
