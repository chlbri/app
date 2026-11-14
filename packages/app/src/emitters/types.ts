import type { NotUndefined } from '@bemedev/app-utils-bemedev';
import type { ActorsConfigMap, EventObject } from '#events';
import type { AsyncTransition } from '#transitions';
import type { PrimitiveObject } from '@bemedev/typings';
import type { AsyncEmitterFunction } from '@bemedev/app-options';

export type {
  AsyncEmitterFunction,
  AsyncEmittersMap,
  EmitterConfigMap,
  EmitterDef,
  EmitterObserver,
  Pausable,
  SyncEmitterFunction,
  SyncEmittersMap,
} from '@bemedev/app-options';

/**
 * Object holding an unsubscribe cleanup method.
 */
export type Subscriber = {
  /**
   * Unsubscribes from the source stream.
   */
  unsubscribe: () => void;
};

/**
 * Interface for objects that allow subscribing via a type {@linkcode Subscriber}.
 */
export type Subscribable = {
  /**
   * Subscribes to emissions.
   */
  subscribe: Subscriber;
};

/** The string id that references an emitter source in the options map. */
export type EmitterSrcConfig = string;

/**
 * Asynchronous emitter configuration structure.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 * @template `R` - Return value type.
 */
export type AsyncEmitter<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
> = {
  /**
   * Source function returning a pausable stream.
   */
  src: AsyncEmitterFunction<E, Pc, Tc, T, R>;
  /**
   * Optional description string.
   */
  description?: string;
  /**
   * Transitions triggered on next emission.
   */
  next: AsyncTransition<E, Pc, Tc, T>[];
  /**
   * Transitions triggered on error emission.
   */
  error: AsyncTransition<E, Pc, Tc, T>[];
  /**
   * Transitions triggered on completion.
   */
  complete: AsyncTransition<E, Pc, Tc, T>[];
};

/**
 * Synchronous emitter configuration structure.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 * @template `R` - Return value type.
 */
export type SyncEmitter<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
> = {
  /**
   * Source function returning a pausable stream.
   */
  src: AsyncEmitterFunction<E, Pc, Tc, T, R>;
  /**
   * Optional description string.
   */
  description?: string;
  /**
   * Transitions triggered on next emission.
   */
  next: AsyncTransition<E, Pc, Tc, T>[];
  /**
   * Transitions triggered on error emission.
   */
  error: AsyncTransition<E, Pc, Tc, T>[];
  /**
   * Transitions triggered on completion.
   */
  complete: AsyncTransition<E, Pc, Tc, T>[];
};

/**
 * Type helper extracting the return payload type for an emitter key `K`.
 *
 * @template `K` - Emitter key string.
 * @template | {@linkcode ActorsConfigMap} `A` - Actors configuration map.
 */
export type EmitterReturn<
  K extends string,
  A extends ActorsConfigMap = ActorsConfigMap,
> = NotUndefined<A['emitters']>[K]['next'] extends infer P
  ? unknown extends P
    ? never
    : P
  : never;
