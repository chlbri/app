/**
 * Primitive checks shared by the actor and transition guards.
 *
 * Vendored from `@bemedev/app` so this package stays independent from the
 * machine implementation while keeping the very same validation rules.
 */

import { expandFn } from '@bemedev/app-utils-bemedev';
import _async from '@bemedev/boolean-recursive/async';
import sync from '@bemedev/boolean-recursive/sync';

/** Allowed property keys of a type `Describer`. */
const DESCRIBER_KEYS = ['name', 'description'] as const;

/** Signature of {@linkcode checkKeys}, including its `strict` variant. */
export type CheckKeys_F = {
  /**
   * Checks that every own key of `arg` is part of `keys`.
   *
   * @param arg - Object to check.
   * @param keys - Allowed keys.
   *
   * @returns `true` when no extra key is found.
   */
  <T extends object>(arg: T, ...keys: string[]): boolean;

  /**
   * Checks that `arg` owns exactly the provided `keys`.
   *
   * @param arg - Object to check.
   * @param keys - Required keys.
   *
   * @returns `true` when no key is missing nor extra.
   */
  strict: <T extends object>(arg: T, ...keys: string[]) => boolean;
};

/**
 * Checks that every own key of `arg` is part of `keys`.
 *
 * @param arg - Object to check.
 * @param keys - Allowed keys.
 *
 * @returns `true` when no extra key is found.
 */
export const checkKeys: CheckKeys_F = (arg, ...keys) => {
  const argKeys = Object.keys(arg);
  return argKeys.every(key => keys.includes(key));
};

/**
 * Checks that `arg` owns exactly the provided `keys`.
 *
 * @param arg - Object to check.
 * @param keys - Required keys.
 *
 * @returns `true` when no key is missing nor extra.
 */
checkKeys.strict = (arg, ...keys) => {
  if (!checkKeys(arg, ...keys)) return false;
  const argKeys = Object.keys(arg);
  return keys.every(key => argKeys.includes(key));
};

/**
 * Type guard function to verify if a value is contained within a list of allowed values.
 *
 * Includes properties {@linkcode checkValues.undefined} and {@linkcode checkValues.async}.
 *
 * @template `T` - The type of allowed values, defaults to `any`.
 * @param value - The candidate value to check.
 * @param values - Variadic array of allowed candidate values.
 *
 * @returns `true` if {@linkcode value} is included in {@linkcode values}, `false` otherwise.
 */
export const checkValues = expandFn(
  <T = any>(value: unknown, ...values: T[]): value is T => {
    if (values.length === 0) return true;
    const or = values.map(v => (value: unknown) => value === v);
    const fn = sync({ or });
    return fn(value);
  },
  {
    /**
     * Type guard function to verify if a value is `undefined` or contained within a list of allowed values.
     *
     * @template `T` - The type of allowed values, defaults to `any`.
     * @param value - The candidate value to check.
     * @param values - Variadic array of allowed candidate values.
     *
     * @returns `true` if {@linkcode value} is `undefined` or included in {@linkcode values}, `false` otherwise.
     */
    undefined: <T = any>(value: unknown, ...values: T[]): value is T | undefined => {
      if (value === undefined) return true;
      return checkValues(value, ...values);
    },

    /**
     * Asynchronously checks if a value is contained within a list of allowed values.
     *
     * Includes property {@linkcode checkValues.async.undefined}.
     *
     * @template `T` - The type of allowed values, defaults to `any`.
     * @param value - The candidate value to check.
     * @param values - Variadic array of allowed candidate values.
     *
     * @returns Promise resolving to `true` if {@linkcode value} is included in {@linkcode values}, `false` otherwise.
     */
    async: expandFn(
      async <T = any>(value: unknown, ...values: T[]) => {
        if (values.length === 0) return true;
        const or = values.map(v => async (value: unknown) => value === v);
        const fn = _async({ or });
        return fn(value);
      },
      {
        /**
         * Asynchronously checks if a value is `undefined` or contained within a list of allowed values.
         *
         * @template `T` - The type of allowed values, defaults to `any`.
         * @param value - The candidate value to check.
         * @param values - Variadic array of allowed candidate values.
         *
         * @returns Promise resolving to `true` if {@linkcode value} is `undefined` or included in {@linkcode values}, `false` otherwise.
         */
        undefined: async <T = any>(value: unknown, ...values: T[]) => {
          if (value === undefined) return true;
          return checkValues.async(value, undefined, ...values);
        },
      },
    ),
  },
);

/**
 * Type guard checking that `value` is a string.
 *
 * @param value - Value to check.
 *
 * @returns `true` when `value` is a string.
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

/**
 * Checks that `value` is `undefined` or a string.
 *
 * @param value - Value to check.
 *
 * @returns `true` when `value` is `undefined` or a string.
 */
export const isStringOrUndefined = (value: unknown): boolean => {
  if (value === undefined) return true;
  return typeof value === 'string';
};

/**
 * Type guard checking that `value` is a type `Describer`.
 *
 * @param value - Value to check.
 *
 * @returns `true` when `value` only holds `name` and `description`.
 */
export const isDescriber = (value: unknown): boolean => {
  if (typeof value !== 'object' || value === null) return false;
  return checkKeys.strict(value, ...DESCRIBER_KEYS);
};
