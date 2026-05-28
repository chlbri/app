import { isDescriber, type NodeConfig } from '~types';

import { isCompound } from './coumpound';
import { isParallel } from './parallel';
import { isAtomic } from './atomic';
import { stateType } from '../stateType';

export { isCompound, isParallel, isAtomic };

const ALLKEYS = [
  'on',
  'after',
  'activities',
  'entry',
  'exit',
  'description',
  'tags',
  'always',
  'actors',
  'after',
];

const GUARD_KEYS = ['and', 'or'];
const ACTIVITY_KEYS = ['guards', 'actions'];

// const ACTION_KEYS = ['description', 'name'];

const checkString = (value: unknown): boolean => {
  if (value === undefined) return true;
  return typeof value === 'string';
};

const checkAction = (entry: unknown) => {
  return checkString(entry) || isDescriber(entry);
};
const checkActions = (action: unknown): boolean => {
  if (Array.isArray(action)) return action.every(checkAction);
  else return checkAction(action);
};

const checkSoAString = (str: unknown): boolean => {
  if (Array.isArray(str)) {
    return str.every(checkString);
  } else return checkString(str);
};

const checkGuards = (value: unknown): boolean => {
  const check1 = checkAction(value);
  if (check1) return true;
  else if (Array.isArray(value)) {
    return value.every(checkGuards);
  } else {
    const _value: any = value;
    const check2 = typeof _value === 'object';
    if (!check2) return false;
    const keys = Object.keys(_value);
    const check3 = keys.length === 1;
    if (!check3) return false;
    const check4 = keys.every(k => GUARD_KEYS.includes(k));
    if (!check4) return false;
  }
  return true;
};

const checkActivities = (value: unknown): boolean => {
  const check1 = checkAction(value);
  if (check1) return true;
  else if (Array.isArray(value)) {
    return value.every(checkActivities);
  } else {
    const _value: any = value;
    const check2 = typeof _value === 'object';
    if (!check2) return false;
    const keys = Object.keys(_value);
    const check3 = keys.length === 1 || keys.length === 2;
    if (!check3) return false;
    const check4 = keys.every(k => ACTIVITY_KEYS.includes(k));
    if (!check4) return false;
    const guards = _value.guards;
    const actions = _value.actions;
    if (guards) {
      const check5 = checkGuards(guards);
      if (!check5) return false;
    }
    if (!actions) return false;
    return checkActions(actions);
  }
};

const checkAtomic = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const _value: any = value;
  const keys = Object.keys(_value);
  const check = keys.every(k => ALLKEYS.includes(k));
  if (!check) return false;
  const entry = _value.entry;
  const exit = _value.exit;
  const description = _value.description;
  const tags = _value.tags;
  const activities = _value.activities;
  // const on = _value.on;
  // const after = _value.after;
  // const always = _value.always;
  // const actors = _value.actors;

  if (!checkActions(entry)) return false;
  if (!checkActions(exit)) return false;
  if (description && typeof description !== 'string') return false;
  if (!checkSoAString(tags)) return false;
  if (!checkActivities(activities)) return false;

  return true;
};

export const isNodeConfig = (value: unknown): value is NodeConfig => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const _value: any = value;
  const check1 = checkAtomic(_value);
  if (!check1) return false;
  const type = stateType(_value);
  if (type === 'atomic') return true;
  const nexts = Object.values(_value.states);
  const check2 = nexts.every(isNodeConfig);
  if (!check2) return false;
  return true;
};
