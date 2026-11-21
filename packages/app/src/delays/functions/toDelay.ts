import { reduceFnMap } from '@bemedev/app-options/internal';
import type { Contract } from '@bemedev/app-options';
import type { DelayFunction3, DelayMap } from '../types';

/**
 * Function signature for converting a delay config string into an executable delay function.
 *
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - Event string type.
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 *
 * @param delay - Delay configuration key or name.
 * @param delays - Optional delay map.
 * @param events - List of machine event keys.
 *
 * @returns Executable delay function of type {@linkcode DelayFunction3} or `undefined`.
 */
export type ToDelay_F = <Ct extends Contract = Contract>(
  delay: string,
  delays: DelayMap<Ct> | undefined,
  ...events: string[]
) => DelayFunction3<Ct> | undefined;

/**
 * Converts a delay configuration to a function that returns the delay in milliseconds.
 * If the delay is a number, it returns a function that returns that number.
 * If the delay is a function, it reduces the function map with the provided events list.
 *
 * @param delay of type string,  The delay configuration.
 * @param delays of type {@linkcode DelayMap}, the map of delays containing functions to execute.
 * @param events of type {@linkcode string[]}, list of events of the machine.
 * @returns a function that returns the delay in milliseconds or undefined if not found.
 *
 * @see -- type {@linkcode PrimitiveObject}, {@linkcode reduceFnMap}
 */
export const toDelay: ToDelay_F = (delay, delays, ...events) => {
  const fn = delays?.[delay];
  const check = typeof fn === 'number';
  if (check) return () => fn;

  const func = fn ? reduceFnMap(fn, ...events) : undefined;
  return func;
};
