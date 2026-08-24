import { DEFAULT_DELIMITER } from '#constants';
import { AFTER_EVENT, ALWAYS_EVENT } from '../constants';

const _concat = <T extends string, U extends string, V extends string>(
  str1: T,
  sep: U,
  str2: V,
) => `${str1}${sep}${str2}` as `${T}${U}${V}`;

export const always = <T extends string>(state: T) => {
  return _concat(state, DEFAULT_DELIMITER, ALWAYS_EVENT);
};

export const after = <T extends string>(state: T) => {
  return _concat(state, DEFAULT_DELIMITER, AFTER_EVENT);
};
