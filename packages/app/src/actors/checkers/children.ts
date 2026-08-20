import type { ChildConfig } from '#actor';
import { isOn } from '#transitions';
import { checkKeys, isStringOrUndefined } from '#utils';
import { isString } from '~types';

/**
 * Allowed property keys for child actor configurations.
 */
const CHILD_KEYS = ['on', 'contexts', 'description'] as const;

/**
 * Type guard for checking if a value is a valid child actor configuration.
 *
 * @template {string[]} T - Keys parameter tuple type.
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

  const _value: any = value;
  const valueKeys = Object.keys(_value);
  const check1 = checkKeys(_value, ...CHILD_KEYS);
  if (!check1) return false;

  const check2 = valueKeys.length > 0;
  if (!check2) return false;
  const on = _value.on;
  const contexts = _value.contexts;
  const description = _value.description;

  if (!isStringOrUndefined(description)) return false;
  const check3 = on === undefined && contexts === undefined;
  if (check3) return false;

  const check4 = isOn.orUndefined(on, ...keys);
  if (!check4) return false;
  if (contexts === undefined) return true;
  if (typeof contexts !== 'object' || contexts === null || Array.isArray(contexts))
    return false;
  const valueContexts = Object.values(contexts);

  return valueContexts.every(isString);
};
