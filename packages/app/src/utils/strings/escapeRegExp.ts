import { ESCAPE_REGEXP } from '#constants';

/**
 * Function type signature for escaping regular expression special characters in a string.
 *
 * @param arg - The string to escape.
 *
 * @returns The escaped string.
 */
export type EscapeRexExp_F = (arg: string) => string;

/**
 * Escapes special characters in a string to be used in a regular expression using constant {@linkcode ESCAPE_REGEXP}.
 *
 * @param arg - The string to escape.
 *
 * @returns The escaped string, where special characters are prefixed with `'\\$&'`.
 *
 * @see {@linkcode EscapeRexExp_F}
 */
export const escapeRegExp: EscapeRexExp_F = arg => {
  const replacer = '\\$&';
  return arg.replace(ESCAPE_REGEXP, replacer);
};
