import { isString } from '~types';

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
 * @param value - The value to inspect.
 *
 * @returns `true` if `value` is undefined or of type `string`, `false` otherwise.
 */
export const isStringOrUndefined = (value: unknown): boolean => {
  if (value === undefined) return true;
  return typeof value === 'string';
};
