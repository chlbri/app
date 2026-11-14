import type { EventObject } from '#events';
import type { PrimitiveObject } from '@bemedev/typings';
import type { FnMap } from '~types';

export type {
  AsyncDelayFunction2,
  AsyncDelayFunction3,
  SyncDelayFunction2,
  SyncDelayFunction3,
} from '@bemedev/app-options';

/**
 * Delay type definition.
 * The function takes in a context object and returns a delay in milliseconds.
 *
 * @template | {@linkcode EventObject} `E` - The events map.
 * @template `Pc` - The type of the private context.
 * @template | {@linkcode PrimitiveObject} `Tc` - The type of the context.
 * @template `T` - Event string type.
 *
 * @returns A number or a type {@linkcode FnMap} function that returns a number.
 */
export type AsyncDelayFunction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = number | FnMap<E, Pc, Tc, T, number>;

/**
 * Synchronous delay function type.
 *
 * @template | {@linkcode EventObject} `E` - Events map.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - Event string type.
 */
export type SyncDelayFunction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = number | FnMap<E, Pc, Tc, T, number>;

/**
 * Delay configuration map.
 * Maps a string key to an type {@linkcode AsyncDelayFunction} function.
 * @template | {@linkcode EventObject} `E` - The events map.
 * @template `Pc` - The type of the private context.
 * @template | {@linkcode PrimitiveObject} `Tc` - The type of the context.
 * @template `T` - Event string type.
 */
export type AsyncDelayMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Partial<Record<string, AsyncDelayFunction<E, Pc, Tc, T>>>;

/**
 * Sync delay configuration map.
 *
 * @template | {@linkcode EventObject} `E` - The events map.
 * @template `Pc` - The type of the private context.
 * @template | {@linkcode PrimitiveObject} `Tc` - The type of the context.
 * @template `T` - Event string type.
 */
export type SyncDelayMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Partial<Record<string, SyncDelayFunction<E, Pc, Tc, T>>>;
