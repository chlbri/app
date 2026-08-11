import { _any } from '@bemedev/app-utils-bemedev';
import type { EventObject } from '#events';
import { isFunction } from '../types/primitives';
import type { FnMap, FnMapR, FnR, FnReduced } from '~types';
import { nothing } from './nothing';
import type { PrimitiveObject } from '@bemedev/typings';

/**
 * Signature for function that reduces a function map to a unified event handler function.
 *
 * @template Pc - Public context type. Defaults to `any`.
 * @template {PrimitiveObject} Tc - Internal context type. Defaults to type {@linkcode PrimitiveObject}.
 * @template {string} T - Event string type. Defaults to `string`.
 * @template R - Return type. Defaults to `any`.
 * @template {EventObject} Eo - Event object type. Defaults to type {@linkcode EventObject}.
 *
 * @param fn - Function map of type {@linkcode FnMap}.
 * @param events - Expected event keys.
 *
 * @returns Unified event handler function of type {@linkcode FnR}.
 */
export type ReduceFnMap_F = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
  Eo extends EventObject = EventObject,
>(
  fn: FnMap<Eo, Pc, Tc, T, R>,
  ...events: string[]
) => FnR<Eo, Pc, Tc, T, R>;

/**
 * Reduces a function map to a single function that processes events.
 * @param fn the function map to reduce.
 * @param events the list of expected events to match against.
 * @returns a function that takes a context and an event, returning the result of the function map.
 *
 * @see {@linkcode isFunction} for checking if a value is a function.
 * @see {@linkcode nothing} for the default else function.
 */
export const reduceFnMap: ReduceFnMap_F = (fn, ...events) => {
  const check1 = isFunction(fn);
  if (check1) return fn;

  return ({ event, ...rest }) => {
    const check5 = typeof event === 'string';
    const _else = fn.else ?? nothing;
    if (check5) return _any(_else({ ...rest, event }));

    const { payload, type } = event;

    for (const key of events) {
      const check2 = type === key;
      const func = _any(fn)[key];
      const check3 = !!func;

      const check4 = check2 && check3;
      if (check4) return func({ ...rest, payload });
    }

    return _any(_else({ ...rest, event }));
  };
};

/**
 * Signature for function that reduces a context-free function map to a unified event handler function.
 *
 * @template {PrimitiveObject} Tc - Internal context type. Defaults to type {@linkcode PrimitiveObject}.
 * @template {string} T - Event string type. Defaults to `string`.
 * @template R - Return type. Defaults to `any`.
 * @template {EventObject} Eo - Event object type. Defaults to type {@linkcode EventObject}.
 *
 * @param fn - Function map of type {@linkcode FnMapR}.
 * @param events - Expected event keys.
 *
 * @returns Unified event handler function of type {@linkcode FnReduced}.
 */
export type ReduceFnMap2_F = <
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
  Eo extends EventObject = EventObject,
>(
  fn: FnMapR<Eo, Tc, T, R>,
  ...events: string[]
) => FnReduced<Eo, Tc, T, R>;

/**
 * Reduces a function map to a single function that processes events with a context.
 *
 * @param fn - The function map to reduce.
 * @param events - The list of expected events to match against.
 *
 * @returns A function that takes a context and an event, returning the result of the function map.
 *
 * @remarks
 * This version is specifically designed to work with a context and an events map.
 * Similar to {@linkcode reduceFnMap}, but it does not take a private context.
 *
 * @see {@linkcode isFunction}, {@linkcode nothing}
 */
export const reduceFnMapReduced: ReduceFnMap2_F = (fn, ...events) => {
  const check1 = isFunction(fn);
  if (check1) return _any(fn);

  return ({ event, ...rest }) => {
    const check5 = typeof event === 'string';
    const _else = fn.else ?? nothing;
    if (check5) {
      return _any(_else({ ...rest, event }));
    }

    const { payload, type } = event;

    for (const key of events) {
      const check2 = type === key;
      const func = _any(fn)[key];
      const check3 = !!func;

      const check4 = check2 && check3;
      if (check4) return func({ ...rest, payload });
    }

    return _any(_else({ ...rest, event }));
  };
};
