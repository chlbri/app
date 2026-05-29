import { checkAction } from '#actions';
import { checkKeys } from '#utils';
import type { GuardConfig } from '~types';

const GUARD_KEYS = ['and', 'or'];
export const checkGuards = (value: unknown): value is GuardConfig => {
  if (value === undefined) return false;
  const check1 = checkAction(value);
  if (check1) return true;
  else if (Array.isArray(value)) {
    return value.length > 0 && value.every(checkGuards);
  } else {
    const _value: any = value;
    const check2 = typeof _value === 'object';
    if (!check2) return false;
    const keys = Object.keys(_value);
    const check3 = keys.length === 1;
    if (!check3) return false;
    const check4 = checkKeys(_value, ...GUARD_KEYS);
    if (!check4) return false;

    const and = _value.and;
    const or = _value.or;

    const check5 = Array.isArray(and) || Array.isArray(or);
    if (!check5) return false;

    return checkGuards(and) || checkGuards(or);
  }
};

checkGuards.orUndefined = (
  value: unknown,
): value is GuardConfig | undefined => {
  if (value === undefined) return true;
  return checkGuards(value);
};
