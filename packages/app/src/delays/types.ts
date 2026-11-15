import type { EventObject } from '#events';
import type { PrimitiveObject } from '@bemedev/typings';
import type { FnMap } from '~types';

export type { DelayFunction2, DelayFunction3 } from '@bemedev/app-options';

/**
 * Delay type definition.
 * The function takes in a context object and returns a delay in milliseconds.
 *
 * Synchronous and asynchronous machines share the same delay signature, so a
 * single type covers both flavors.
 *
 * @template | {@linkcode EventObject} `E` - The events map.
 * @template `Pc` - The type of the private context.
 * @template | {@linkcode PrimitiveObject} `Tc` - The type of the context.
 * @template `T` - Event string type.
 *
 * @returns A number or a type {@linkcode FnMap} function that returns a number.
 */
export type DelayFunction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = number | FnMap<E, Pc, Tc, T, number>;

/**
 * Delay configuration map.
 * Maps a string key to an type {@linkcode DelayFunction} function.
 *
 * @template | {@linkcode EventObject} `E` - The events map.
 * @template `Pc` - The type of the private context.
 * @template | {@linkcode PrimitiveObject} `Tc` - The type of the context.
 * @template `T` - Event string type.
 */
export type DelayMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Partial<Record<string, DelayFunction<E, Pc, Tc, T>>>;
