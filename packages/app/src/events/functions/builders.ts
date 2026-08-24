import { DEFAULT_DELIMITER } from '#constants';
import { AFTER_EVENT, ALWAYS_EVENT } from '../constants';

/**
 * Internal helper to concatenate two strings with a delimiter.
 *
 * @template | {@linkcode string} `T` - The first string type.
 * @template | {@linkcode string} `U` - The delimiter string type.
 * @template | {@linkcode string} `V` - The second string type.
 *
 * @param str1 - The prefix string.
 * @param sep - The separator string.
 * @param str2 - The suffix string.
 *
 * @returns Concatenated string template literal of type `${T}${U}${V}`.
 */
const _concat = <T extends string, U extends string, V extends string>(
  str1: T,
  sep: U,
  str2: V,
) => `${str1}${sep}${str2}` as `${T}${U}${V}`;

/**
 * Builds an always event string for the specified state.
 *
 * @template | {@linkcode string} `T` - State name string type.
 *
 * @param state - The target state name.
 *
 * @returns Formatted always event string for type {@linkcode T}.
 *
 * @see {@linkcode DEFAULT_DELIMITER}, {@linkcode ALWAYS_EVENT}
 */
export const always = <T extends string>(state: T) => {
  return _concat(state, DEFAULT_DELIMITER, ALWAYS_EVENT);
};

/**
 * Builds an after event string for the specified state.
 *
 * @template | {@linkcode string} `T` - State name string type.
 *
 * @param state - The target state name.
 *
 * @returns Formatted after event string for type {@linkcode T}.
 *
 * @see {@linkcode DEFAULT_DELIMITER}, {@linkcode AFTER_EVENT}
 */
export const after = <T extends string>(state: T) => {
  return _concat(state, DEFAULT_DELIMITER, AFTER_EVENT);
};
