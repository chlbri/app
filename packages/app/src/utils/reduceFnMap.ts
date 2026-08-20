import { _any } from '@bemedev/app-utils-bemedev';
import type { EventObject } from '#events';
import { isFunction } from '../types/primitives';
import type {
  FnMap,
  FnMapFilterArray,
  FnMapFilterObject,
  FnMapR,
  FnR,
  FnReduced,
  StateExtended,
} from '~types';
import { nothing } from './nothing';
import type { PrimitiveObject } from '@bemedev/typings';

/**
 * Signature for function that reduces a function map to a unified event handler function.
 *
 * @template Pc - Public context type. Defaults to `any`.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type. Defaults to type {@linkcode PrimitiveObject}.
 * @template `T` - Event string type. Defaults to `string`.
 * @template R - Return type. Defaults to `any`.
 * @template | {@linkcode EventObject} `Eo` - Event object type. Defaults to type {@linkcode EventObject}.
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
 * @see {@linkcode isFunction}, {@linkcode nothing}
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
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type. Defaults to type {@linkcode PrimitiveObject}.
 * @template `T` - Event string type. Defaults to `string`.
 * @template R - Return type. Defaults to `any`.
 * @template | {@linkcode EventObject} `Eo` - Event object type. Defaults to type {@linkcode EventObject}.
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
 * Signature for function that reduces an array filter function map to a unified filter predicate.
 *
 * @template Pc - Public context type. Defaults to `any`.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type. Defaults to type {@linkcode PrimitiveObject}.
 * @template `T` - Event string type. Defaults to `string`.
 * @template Item - Item type. Defaults to `any`.
 * @template | {@linkcode EventObject} `Eo` - Event object type. Defaults to type {@linkcode EventObject}.
 *
 * @param fn - Array filter function map of type {@linkcode FnMapFilterArray}.
 * @param events - Expected event keys.
 *
 * @returns Unified array filter predicate function.
 */
export type ReduceFnMapFilterArray_F = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Item = any,
  Eo extends EventObject = EventObject,
>(
  fn: FnMapFilterArray<Eo, Pc, Tc, T, Item>,
  ...events: string[]
) => (item: Item, index: number, state: StateExtended<Eo, Pc, Tc, T>) => boolean;

/**
 * Reduces an array filter function map to a unified array filter predicate function.
 *
 * @param fn - The array filter function map to reduce.
 * @param events - The list of expected events to match against.
 *
 * @returns A predicate function taking `(item, index, state)`.
 *
 * @see {@linkcode isFunction}, {@linkcode nothing}
 */
export const reduceFnMapFilterArray: ReduceFnMapFilterArray_F = (fn, ...events) => {
  const check1 = isFunction(fn);
  if (check1) return fn;

  return (item, index, state) => {
    const { event, ...rest } = state;
    const check5 = typeof event === 'string';
    const _else = (fn as any).else ?? nothing;

    if (check5) {
      for (const key of events) {
        if (event === key) {
          const func = _any(fn)[key];
          if (func) return func(item, index, { ...rest, payload: {} });
        }
      }
      return _any(_else(item, index, state));
    }

    const { payload, type } = event;

    for (const key of events) {
      const check2 = type === key;
      const func = _any(fn)[key];
      const check3 = !!func;

      const check4 = check2 && check3;
      if (check4) return func(item, index, { ...rest, payload });
    }

    return _any(_else(item, index, state));
  };
};

/**
 * Signature for function that reduces an object filter function map to a unified filter predicate.
 *
 * @template Pc - Public context type. Defaults to `any`.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type. Defaults to type {@linkcode PrimitiveObject}.
 * @template `T` - Event string type. Defaults to `string`.
 * @template Item - Item value type. Defaults to `any`.
 * @template | {@linkcode EventObject} `Eo` - Event object type. Defaults to type {@linkcode EventObject}.
 *
 * @param fn - Object filter function map of type {@linkcode FnMapFilterObject}.
 * @param events - Expected event keys.
 *
 * @returns Unified object filter predicate function.
 */
export type ReduceFnMapFilterObject_F = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Item = any,
  Eo extends EventObject = EventObject,
>(
  fn: FnMapFilterObject<Eo, Pc, Tc, T, Item>,
  ...events: string[]
) => (item: Item, state: StateExtended<Eo, Pc, Tc, T>) => boolean;

/**
 * Reduces an object filter function map to a unified object filter predicate function.
 *
 * @param fn - The object filter function map to reduce.
 * @param events - The list of expected events to match against.
 *
 * @returns A predicate function taking `(item, state)`.
 *
 * @see {@linkcode isFunction}, {@linkcode nothing}
 */
export const reduceFnMapFilterObject: ReduceFnMapFilterObject_F = (
  fn,
  ...events
) => {
  const check1 = isFunction(fn);
  if (check1) return fn;

  return (item, state) => {
    const { event, ...rest } = state;
    const check5 = typeof event === 'string';
    const _else = (fn as any).else ?? nothing;

    if (check5) {
      for (const key of events) {
        if (event === key) {
          const func = _any(fn)[key];
          if (func) return func(item, { ...rest, payload: {} });
        }
      }
      return _any(_else(item, state));
    }

    const { payload, type } = event;

    for (const key of events) {
      const check2 = type === key;
      const func = _any(fn)[key];
      const check3 = !!func;

      const check4 = check2 && check3;
      if (check4) return func(item, { ...rest, payload });
    }

    return _any(_else(item, state));
  };
};
