import { checkActions } from '#actions';
import { checkGuards } from '#guards';
import { checkKeys, checkValues, isStringOrUndefined } from '#utils';
import type {
  ArrayTransitions,
  SingleOrArrayT,
  TransitionConfig,
  TransitionConfigF,
  TransitionConfigMap,
  TransitionConfigMapA,
  TransitionConfigMapF,
} from '../../types';

/** Allowed key names for transition configuration objects. */
const TRANSITIONS_KEYS = ['target', 'actions', 'guards', 'description'];

/**
 * Type guard for checking if a value is a valid transition configuration map.
 *
 * @template {string[]} T - Keys tuple type.
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
  const check3 = checkValues.orUndefined(target, ...keys);
  if (!check3) return false;
  const check4 = checkActions.orUndefined(actions);
  if (!check4) return false;
  return checkGuards.orUndefined(guards);
};

/**
 * Type guard for checking if a transition map requires a target.
 *
 * @template {string[]} T - Keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` if type {@linkcode TransitionConfigMapF}, `false` otherwise.
 */
export const isTransitionConfigMapTarget = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is TransitionConfigMapF<T[number]> => {
  return (
    isTransitionConfigMap(value, ...keys) && value.target !== undefined
  );
};

/**
 * Type guard for checking if a transition map requires actions.
 *
 * @template {string[]} T - Keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` if type {@linkcode TransitionConfigMapA}, `false` otherwise.
 */
export const isTransitionConfigMapActions = <
  T extends string[] = string[],
>(
  value: unknown,
  ...keys: T
): value is TransitionConfigMapA<T[number]> => {
  return (
    isTransitionConfigMap(value, ...keys) && checkActions(value.actions)
  );
};

/**
 * Type guard for checking string or object transition configuration.
 *
 * @template {string[]} T - Keys tuple type.
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
 * Type guard for checking target-required transition configuration.
 *
 * @template {string[]} T - Keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` if type {@linkcode TransitionConfigF}, `false` otherwise.
 */
export const isTransitionConfigTarget = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is TransitionConfigF<T[number]> => {
  if (typeof value === 'string') {
    return checkValues(value, ...keys);
  }
  return isTransitionConfigMapTarget(value, ...keys);
};

/**
 * Type guard for checking array of transition configurations.
 *
 * @template {string[]} T - Keys tuple type.
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
 * Type guard for checking single or array of transition configurations.
 *
 * @template {string[]} T - Keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` if type {@linkcode SingleOrArrayT}, `false` otherwise.
 */
export const isSingleOrArrayT = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is SingleOrArrayT<T[number]> => {
  return (
    isTransitionArray(value, ...keys) || isTransitionConfig(value, ...keys)
  );
};

isSingleOrArrayT.orUndefined = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is SingleOrArrayT<T[number]> | undefined => {
  if (value === undefined) return true;
  return isSingleOrArrayT(value, ...keys);
};
