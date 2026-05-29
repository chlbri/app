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

const TRANSITIONS_KEYS = ['target', 'actions', 'guards', 'description'];

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
  const check3 = checkValues.orUndefined(target, ...keys);
  if (!check3) return false;
  const check33 = isStringOrUndefined(target);
  if (!check33) return false;
  const check4 = checkActions.orUndefined(actions);
  if (!check4) return false;
  const check5 = checkGuards.orUndefined(guards);
  if (!check5) return false;

  return true;
};

export const isTransitionConfigMapTarget = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is TransitionConfigMapF<T[number]> => {
  return (
    isTransitionConfigMap(value, ...keys) && value.target !== undefined
  );
};

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

export const isTransitionConfig = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is TransitionConfig<T[number]> => {
  if (typeof value === 'string') {
    return checkValues(value, ...keys);
  }
  return isTransitionConfigMap(value, ...keys);
};

isTransitionConfig.orUndefined = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is TransitionConfig<T[number]> | undefined => {
  if (value === undefined) return true;
  return isTransitionConfig(value, ...keys);
};

export const isTransitionConfigTarget = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is TransitionConfigF<T[number]> => {
  if (typeof value === 'string') {
    return checkValues(value, ...keys);
  }
  return isTransitionConfigMapTarget(value, ...keys);
};

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
