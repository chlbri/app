import { isString } from '@bemedev/app-options/internal';

/**
 * Checks if a given argument is a string and if it is empty (i.e., contains only whitespace).
 *
 * @param arg - The value to check.
 *
 * @returns `true` if the argument is a string and is empty, otherwise `false`.
 */
export const isStringEmpty = (arg: unknown) => {
  return isString(arg) && arg.trim() === '';
};

/**
 * Type guard function to check if a value is a string or undefined.
 *
 * Re-exported from `@bemedev/app-options` so the machine runtime and the
 * option helpers share a single implementation.
 */
export { isStringOrUndefined } from '@bemedev/app-options/internal';
