import { checkAction, checkActions } from '#actions';
import { checkGuards } from '#guards';
import { isTransitionsConfig } from '#transitions';
import {
  checkKeys,
  checkSoAString,
  checkValues,
  isStringOrUndefined,
} from '#utils';
import type {
  ActivityConfig,
  ActivityMap,
  NodeConfig2,
} from '../../types';
import { stateType } from '../stateType';

/** Allowed keys for state node configuration objects. */
const ALLKEYS = [
  'on',
  'after',
  'activities',
  'initial',
  'entry',
  'exit',
  'description',
  'states',
  'type',
  'tags',
  'always',
  'actors',
  'after',
];

/** Allowed keys for activity configuration objects. */
const ACTIVITY_KEYS = ['guards', 'actions'];

// const ACTION_KEYS = ['description', 'name'];

/**
 * Type guard for checking activity map configuration.
 *
 * @param value - Value to check.
 *
 * @returns `true` if type {@linkcode ActivityMap}, `false` otherwise.
 */
export const checkActivity = (value: unknown): value is ActivityMap => {
  if (!value) return false;
  const check1 = checkAction(value);
  if (check1) return true;
  else if (Array.isArray(value)) {
    return value.every(checkActivity);
  } else {
    const _value: any = value;
    const check2 = typeof _value !== 'object';
    if (check2) return false;
    const keys = Object.keys(_value);
    const check3 = keys.length === 1 || keys.length === 2;
    if (!check3) return false;
    const check4 = checkKeys(_value, ...ACTIVITY_KEYS);
    if (!check4) return false;
    const guards = _value.guards;
    const actions = _value.actions;
    if (guards !== undefined) {
      const check5 = checkGuards(guards);
      if (!check5) return false;
    }
    if (!actions) return false;
    return checkActions(actions);
  }
};

/**
 * Type guard for checking activity configuration record.
 *
 * @param value - Value to check.
 *
 * @returns `true` if type {@linkcode ActivityConfig}, `false` otherwise.
 */
export const checkActivities = (
  value: unknown,
): value is ActivityConfig => {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;

  const _value: any = value;
  const values = Object.values(_value);
  return values.every(checkActivity);
};

checkActivities.orUndefined = (value: unknown): boolean => {
  if (value === undefined) return true;
  return checkActivities(value);
};

/**
 * Validates atomic properties and transition options of a node config object.
 *
 * @template {string[]} T - Path keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target state paths.
 *
 * @returns `true` if valid atomic node configuration, `false` otherwise.
 */
export const checkAtomic = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): boolean => {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;

  const check0 = isTransitionsConfig(value, ...keys);
  if (!check0) return false;
  const { __longRuns: _, strict: __, ..._value }: any = value;
  const check = checkKeys(_value, ...ALLKEYS);
  if (!check) return false;

  const entry = _value.entry;
  const exit = _value.exit;
  const description = _value.description;
  const tags = _value.tags;
  const activities = _value.activities;
  const initial = _value.initial;
  const type = _value.type;

  if (!checkActions.orUndefined(entry)) return false;
  if (!checkActions.orUndefined(exit)) return false;
  if (!isStringOrUndefined(description)) return false;
  if (!checkSoAString.orUndefined(tags)) return false;
  if (!checkActivities.orUndefined(activities)) return false;
  if (!isStringOrUndefined(type)) return false;

  if (!checkValues.undefined(type, 'atomic', 'compound', 'parallel')) {
    return false;
  }

  return isStringOrUndefined(initial);
};

/**
 * Recursive type guard for validating complete state node configuration objects.
 *
 * @template {string[]} T - Path keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target state paths.
 *
 * @returns `true` if valid type {@linkcode NodeConfig2}, `false` otherwise.
 */
export const isNodeConfig = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is NodeConfig2<T[number]> => {
  const check1 = checkAtomic(value, ...keys);
  if (!check1) return false;
  const _value: any = value;
  const type = stateType(_value);
  if (type === 'atomic') return true;
  const nexts = Object.values(_value.states);
  return nexts.every(v => isNodeConfig(v, ...keys));
};

isNodeConfig.orUndefined = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is NodeConfig2<T[number]> | undefined => {
  if (value === undefined) return true;
  return isNodeConfig(value, ...keys);
};
