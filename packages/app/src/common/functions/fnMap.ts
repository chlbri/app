import type { EventObject } from '#events';
import { isFnPromise } from '#utils';
import type { PrimitiveObject } from '@bemedev/typings';
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
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
  Ex extends string = never,
>(
  value: unknown,
): value is FnMap<E, Pc, Tc, T, R, Ex> => {
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
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
  Ex extends string = never,
>(
  value: unknown,
): value is FnMap<E, Pc, Tc, T, R, Ex> => {
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
