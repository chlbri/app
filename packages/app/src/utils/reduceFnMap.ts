import { isStringEvent, transformEventArg, type EventObject } from '#events';
import { _any } from '@bemedev/app-utils-bemedev';
import type { PrimitiveObject } from '@bemedev/typings';
import type {
  FnMap,
  FnMapFilterArray,
  FnMapFilterObject,
  FnR,
  StateExtended,
} from '~types';
import { isFunction } from '../types/primitives';
import { nothing } from './nothing';

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

  events.push(...Object.keys(fn).filter(isStringEvent));

  return state => {
    const { event, ...rest } = state;
    const _else = (fn as any)?.else ?? nothing;
    const { payload, type, __internal } = transformEventArg(event);

    for (const key of events.toReversed()) {
      const func = _any(fn)?.[key];
      if (!func) continue;
      if (__internal === key) return func(state);
      if (type === key) return func({ ...rest, payload });
    }

    return _any(_else(state));
  };
};

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
  events.push(...Object.keys(fn).filter(isStringEvent));

  return (item, index, state) => {
    const { event, ...rest } = state;
    const _else = (fn as any)?.else ?? nothing;
    const { payload, type, __internal } = transformEventArg(event);

    for (const key of events.toReversed()) {
      const func = _any(fn)?.[key];
      if (!func) continue;
      if (__internal === key) return func(item, index, state);
      if (type === key) return func(item, index, { ...rest, payload });
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
  events.push(...Object.keys(fn).filter(isStringEvent));

  return (item, state) => {
    const { event, ...rest } = state;
    const _else = (fn as any)?.else ?? nothing;
    const { payload, type, __internal } = transformEventArg(event);

    for (const key of events.toReversed()) {
      const func = _any(fn)?.[key];
      if (!func) continue;
      if (__internal === key) return func(item, state);
      if (type === key) return func(item, { ...rest, payload });
    }

    return _any(_else(item, state));
  };
};
