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

/**
 * Synchronous delay function type.
 *
 * @template {EventObject} E - Events map.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Public context type.
 * @template {string} T - Event string type.
 */
export type SyncDelayFunction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = number | FnMap<E, Pc, Tc, T, number>;

/**
 * Async delay function type resolver.
 *
 * @template {EventObject} E - Events map.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Public context type.
 * @template {string} T - Event string type.
 */
export type AsyncDelayFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = number | AsyncDelayFunction3<E, Pc, Tc, T>;

/**
 * Sync delay function type resolver.
 *
 * @template {EventObject} E - Events map.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Public context type.
 * @template {string} T - Event string type.
 */
export type SyncDelayFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = number | SyncDelayFunction3<E, Pc, Tc, T>;

/**
 * Async delay function execution handler.
 *
 * @template {EventObject} E - Events map.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Public context type.
 * @template {string} T - Event string type.
 */
export type AsyncDelayFunction3<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, number>;

/**
 * Sync delay function execution handler.
 *
 * @template {EventObject} E - Events map.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Public context type.
 * @template {string} T - Event string type.
 */
export type SyncDelayFunction3<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, number>;

/**
 * Delay configuration map.
 * Maps a string key to an type {@linkcode AsyncDelayFunction} function.
 * @template {EventObject} E - The events map.
 * @template Pc - The type of the private context.
 * @template {PrimitiveObject} Tc - The type of the context.
 * @template {string} T - Event string type.
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
 * @template {EventObject} E - The events map.
 * @template Pc - The type of the private context.
 * @template {PrimitiveObject} Tc - The type of the context.
 * @template {string} T - Event string type.
 */
export type SyncDelayMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Partial<Record<string, SyncDelayFunction<E, Pc, Tc, T>>>;
