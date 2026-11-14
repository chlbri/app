/**
 * Transition configuration checks used by the actor guards.
 *
 * Vendored from `@bemedev/app` so this package stays independent from the
 * machine implementation.
 */

import type {
  ArrayTransitions,
  SingleOrArrayT,
  TransitionConfig,
  TransitionConfigMap,
} from '@bemedev/app-contract';
import { checkActions } from './actions';
import { checkGuards } from './guard-configs';
import { checkKeys, checkValues, isStringOrUndefined } from './primitives';
import { expandFn } from '@bemedev/app-utils-bemedev';

/** Allowed key names for transition configuration objects. */
const TRANSITIONS_KEYS = ['target', 'actions', 'guards', 'description'];

/**
 * Type guard for checking if a value is a valid transition configuration map.
 *
 * @template `T` - Keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target state paths.
 *
 * @returns `true` if type {@linkcode TransitionConfigMap}, `false` otherwise.
 */
export const isTransitionConfigMap = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is TransitionConfigMap<T[number]> => {
  if (!value) return false;
  if (typeof value !== 'object') return false;

  const _value: any = value;
  const valueKeys = Object.keys(_value);
  if (valueKeys.length === 0) return false;
  const check1 = checkKeys(_value, ...TRANSITIONS_KEYS);
  if (!check1) return false;
  const description = _value.description;
  const target = _value.target;
  const actions = _value.actions;
  const guards = _value.guards;

  const noCheck = target === undefined && actions === undefined;
  if (noCheck) return false;

  const check2 = isStringOrUndefined(description);
  if (!check2) return false;
  const check33 = isStringOrUndefined(target);
  if (!check33) return false;
  const check3 = checkValues.undefined(target, ...keys);
  if (!check3) return false;
  const check4 = checkActions.orUndefined(actions);
  if (!check4) return false;
  return checkGuards.orUndefined(guards);
};

/**
 * Type guard for checking string or object transition configuration.
 *
 * @template `T` - Keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` if type {@linkcode TransitionConfig}, `false` otherwise.
 */
export const isTransitionConfig = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is TransitionConfig<T[number]> => {
  if (typeof value === 'string') {
    return checkValues(value, ...keys);
  }
  return isTransitionConfigMap(value, ...keys);
};

/**
 * Type guard for checking array of transition configurations.
 *
 * @template `T` - Keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` if type {@linkcode ArrayTransitions}, `false` otherwise.
 */
export const isTransitionArray = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is ArrayTransitions<T[number]> => {
  if (!Array.isArray(value)) return false;
  const _value = [...value];
  const pop = _value.pop();
  if (!pop) return false;
  const check1 = isTransitionConfig(pop, ...keys);
  if (!check1) return false;

  return _value.every(v => {
    const check2 = isTransitionConfigMap(v, ...keys);
    if (!check2) return false;
    const guards = v.guards;
    return checkGuards(guards);
  });
};

/**
 * Type guard checking a single transition or an array of transitions.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` when `value` is a valid single or array transition.
 */
export const isSingleOrArrayT = expandFn(
  <T extends string[] = string[]>(
    value: unknown,
    ...keys: T
  ): value is SingleOrArrayT<T[number]> => {
    return isTransitionArray(value, ...keys) || isTransitionConfig(value, ...keys);
  },
  {
    /**
     * Checks a single or array transition, or `undefined`.
     *
     * @param value - Value to check.
     * @param keys - Allowed target paths.
     *
     * @returns `true` when `value` is `undefined` or a valid transition.
     */
    orUndefined: <T extends string[] = string[]>(
      value: unknown,
      ...keys: T
    ): value is SingleOrArrayT<T[number]> | undefined => {
      if (value === undefined) return true;
      return isSingleOrArrayT(value, ...keys);
    },
  },
);

/**
 * Type guard checking a delayed transitions configuration map.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` when every entry is a valid single or array transition.
 */
export const isAfter = Object.assign(
  (value: unknown, ...keys: string[]): boolean => {
    if (typeof value !== 'object' || value === null || Array.isArray(value))
      return false;

    const values = Object.values(value);
    return values.every(v => isSingleOrArrayT(v, ...keys));
  },
  {
    /**
     * Checks a delayed transitions map or `undefined`.
     *
     * @param value - Value to check.
     * @param keys - Allowed target paths.
     *
     * @returns `true` when `value` is `undefined` or a delayed transitions map.
     */
    orUndefined: (value: unknown, ...keys: string[]): boolean => {
      if (value === undefined) return true;
      return isAfter(value, ...keys);
    },
  },
);

/** Type guard checking an `on` event map (alias of {@linkcode isAfter}). */
export const isOn = isAfter;
