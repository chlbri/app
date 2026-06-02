import type { EventObject } from '#events';
import type { PrimitiveObject } from '@bemedev/typings';
import type { FnMap, FnR } from '~types';

/**
 * Delay type definition.
 * The function takes in a context object and returns a delay in milliseconds.
 * @template : type {@linkcode EventObject} [E], the events map.
 * @template : [Pc], the type of the private context.
 * @template : type {@linkcode PrimitiveObject} [Tc], the type of the context.
 * @returns : A number or a {@linkcode FnMap} function that returns a number.
 */
export type AsyncDelayFunction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = number | FnMap<E, Pc, Tc, T, number>;

export type SyncDelayFunction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = number | FnMap<E, Pc, Tc, T, number>;

export type AsyncDelayFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = number | AsyncDelayFunction3<E, Pc, Tc, T>;

export type SyncDelayFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = number | SyncDelayFunction3<E, Pc, Tc, T>;

export type AsyncDelayFunction3<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, number>;

export type SyncDelayFunction3<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, number>;

/**
 * Delay configuration map.
 * Maps a string key to a {@linkcode AsyncDelayFunction} function.
 * @template : type {@linkcode EventObject} [E] - The events map.
 * @template : [Pc] - The type of the private context.
 * @template : type {@linkcode PrimitiveObject} [Tc] - The type of the context.
 * @returns : A partial record where each key is a string and each value is a {@linkcode AsyncDelayFunction}.
 */
export type AsyncDelayMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Partial<Record<string, AsyncDelayFunction<E, Pc, Tc, T>>>;

export type SyncDelayMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Partial<Record<string, SyncDelayFunction<E, Pc, Tc, T>>>;
