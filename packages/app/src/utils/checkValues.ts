import { expandFn } from '@bemedev/app-utils-bemedev';
import _async from '@bemedev/boolean-recursive/async';
import sync from '@bemedev/boolean-recursive/sync';

/**
 * Type guard function to verify if a value is contained within a list of allowed values.
 *
 * Includes properties {@linkcode checkValues.undefined} and {@linkcode checkValues.async}.
 *
 * @template T - The type of allowed values, defaults to `any`.
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
     * @template T - The type of allowed values, defaults to `any`.
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
     * @template T - The type of allowed values, defaults to `any`.
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
         * @template T - The type of allowed values, defaults to `any`.
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
