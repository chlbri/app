/**
 * Function-map reducers used by the option runtime.
 *
 * Vendored from `@bemedev/app` so options built from a contract resolve
 * per-event function maps exactly like machine options do.
 */

import { nothing } from './constants';
import { isStringEvent, transformEventArg } from './events';
import { isFunction } from './objects';

/**
 * Reduces a function map to a single function processing events.
 *
 * @param fn - Function or function map to reduce.
 * @param events - Expected event keys.
 *
 * @returns A function taking a state and returning the matched result.
 */
export const reduceFnMap = (fn: any, ...events: string[]): any => {
  if (isFunction(fn)) return fn;
  events.push(...Object.keys(fn).filter(isStringEvent));

  return (state: any) => {
    const { event, ...rest } = state;
    const _else = fn?.else ?? nothing;
    const { payload, type, __internal } = transformEventArg(event);

    for (const key of events.toReversed()) {
      const func = fn?.[key];
      if (!func) continue;
      if (__internal === key) return func(state);
      if (type === key) return func({ ...rest, payload });
    }

    return _else(state);
  };
};

/**
 * Reduces an array filter function map to a predicate.
 *
 * @param fn - Function or function map to reduce.
 * @param events - Expected event keys.
 *
 * @returns A predicate taking `(item, index, state)`.
 */
export const reduceFnMapFilterArray = (fn: any, ...events: string[]): any => {
  if (isFunction(fn)) return fn;
  events.push(...Object.keys(fn).filter(isStringEvent));

  return (item: any, index: number, state: any) => {
    const { event, ...rest } = state;
    const _else = fn?.else ?? nothing;
    const { payload, type, __internal } = transformEventArg(event);

    for (const key of events.toReversed()) {
      const func = fn?.[key];
      if (!func) continue;
      if (__internal === key) return func(item, index, state);
      if (type === key) return func(item, index, { ...rest, payload });
    }

    return _else(item, index, state);
  };
};

/**
 * Reduces an object filter function map to a predicate.
 *
 * @param fn - Function or function map to reduce.
 * @param events - Expected event keys.
 *
 * @returns A predicate taking `(item, state)`.
 */
export const reduceFnMapFilterObject = (fn: any, ...events: string[]): any => {
  if (isFunction(fn)) return fn;
  events.push(...Object.keys(fn).filter(isStringEvent));

  return (item: any, state: any) => {
    const { event, ...rest } = state;
    const _else = fn?.else ?? nothing;
    const { payload, type, __internal } = transformEventArg(event);

    for (const key of events.toReversed()) {
      const func = fn?.[key];
      if (!func) continue;
      if (__internal === key) return func(item, state);
      if (type === key) return func(item, { ...rest, payload });
    }

    return _else(item, state);
  };
};
