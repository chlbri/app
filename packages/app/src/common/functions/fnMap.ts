import { isFnPromise } from '#utils';
import type { Contract } from '@bemedev/app-options';
import { isFunction, type FnMap } from '~types';

/**
 * Runtime validation function to check if a value is a function map.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path type.
 * @template `R` - Return type.
 * @template `Ex` - Exception string type.
 *
 * @param value - Value to check.
 *
 * @returns `true` if value is type {@linkcode FnMap}, `false` otherwise.
 */
export const isFnMap = <
  Ct extends Contract = Contract,
  R = any,
  Ex extends string = never,
>(
  value: unknown,
): value is FnMap<Ct, R, Ex> => {
  const check1 = isFunction(value);
  if (check1) return true;

  if (
    !value ||
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const obj = value as Record<string, unknown>;
  const functions = Object.values(obj);
  return functions.every(isFunction);
};

/**
 * Runtime validation function to check if a value is an async function map.
 * An async function map contains functions that return Promises.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path type.
 * @template `R` - Return type.
 * @template `Ex` - Exception string type.
 *
 * @param value - Value to check.
 *
 * @returns `true` if value is an async type {@linkcode FnMap}, `false` otherwise.
 */
export const isAsyncFnMap = <
  Ct extends Contract = Contract,
  R = any,
  Ex extends string = never,
>(
  value: unknown,
): value is FnMap<Ct, R, Ex> => {
  const check1 = isFnPromise(value);
  if (check1) return true;

  if (
    !value ||
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const obj = value as Record<string, unknown>;
  const functions = Object.values(obj);
  const check2 = functions.every(isFunction);
  if (!check2) return false;
  return functions.some(isFnPromise);
};
