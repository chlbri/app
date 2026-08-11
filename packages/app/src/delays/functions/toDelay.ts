import type { EventObject } from '#events';
import { reduceFnMap } from '#utils';
import type { PrimitiveObject } from '@bemedev/typings';
import type { AsyncDelayFunction3, AsyncDelayMap } from '../types';

/**
 * Function signature for converting a delay config string into an executable delay function.
 *
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Public context type.
 * @template {string} T - Event string type.
 * @template {EventObject} Eo - Event object type.
 *
 * @param delay - Delay configuration key or name.
 * @param delays - Optional delay map.
 * @param events - List of machine event keys.
 *
 * @returns Executable delay function of type {@linkcode AsyncDelayFunction3} or `undefined`.
 */
export type ToDelay_F = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
>(
  delay: string,
  delays: AsyncDelayMap<Eo, Pc, Tc, T> | undefined,
  ...events: string[]
) => AsyncDelayFunction3<Eo, Pc, Tc, T> | undefined;

/**
 * Converts a delay configuration to a function that returns the delay in milliseconds.
 * If the delay is a number, it returns a function that returns that number.
 * If the delay is a function, it reduces the function map with the provided events list.
 *
 * @param delay of type string,  The delay configuration.
 * @param delays of type {@linkcode AsyncDelayMap}, the map of delays containing functions to execute.
 * @param events of type {@linkcode string[]}, list of events of the machine.
 * @returns a function that returns the delay in milliseconds or undefined if not found.
 *
 * @see {@linkcode PrimitiveObject}
 * @see {@linkcode reduceFnMap}
 */
export const toDelay: ToDelay_F = (delay, delays, ...events) => {
  const fn = delays?.[delay];
  const check = typeof fn === 'number';
  if (check) return () => fn;

  const func = fn ? reduceFnMap(fn, ...events) : undefined;
  return func;
};
