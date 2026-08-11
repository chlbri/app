import type { NotUndefined } from '@bemedev/app-utils-bemedev';
import type { ActorsConfigMap, EventObject } from '#events';
import type { StateExtended } from '#states';
import type { AsyncTransition } from '#transitions';
import type { PrimitiveObject } from '@bemedev/typings';
import type { RecordS } from '~types';

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

/**
 * Observer wired into a type {@linkcode Pausable} via its `subscribe` method.
 * Mirrors the shape expected by `@bemedev/rx-pausable`'s SubArgs.
 *
 * @template R - The emitted payload type.
 */
export type EmitterObserver<R = any> = {
  /**
   * Receives next value emission.
   */
  next: (value: R) => void;
  /**
   * Receives error emission.
   */
  error: (err: any) => void;
  /**
   * Receives completion notification.
   */
  complete: () => void;
};

/**
 * Minimal pausable interface — intentionally framework-agnostic so the lib
 * does not pull in RxJS as a peer dependency.
 *
 * Implementations (e.g. the class returned by `createPausable` from
 * `@bemedev/rx-pausable`) must satisfy this shape.
 *
 * @template R - The value type emitted by the underlying source.
 */
export type Pausable<R = any> = {
  /** Wire the observer that will receive forwarded events. */
  subscribe: (observer: EmitterObserver<R>) => void;
  /** Start consuming the source — has no effect if not stopped. */
  start: () => void;
  /** Stop the stream and remove any pending timers. */
  stop: () => void;
  /**
   * Suspend forwarding while buffering incoming events.
   * Has no effect if already paused or stopped.
   */
  pause: () => void;
  /**
   * Replay buffered events then resume live forwarding.
   * Has no effect if not paused.
   */
  resume: () => void;
};

/** The string id that references an emitter source in the options map. */
export type EmitterSrcConfig = string;

/**
 * Definition structure for next and error primitive payloads in an emitter.
 */
export type EmitterDef = { next: PrimitiveObject; error: PrimitiveObject };

/**
 * Record map of emitter names to emitter definitions.
 *
 * @template {string} S - Key identifier string union.
 */
export type EmitterConfigMap<S extends string = string> = Record<
  S,
  EmitterDef
>;

/**
 * Asynchronous emitter configuration structure.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 * @template R - Return value type.
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
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 * @template R - Return value type.
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
 * @template {string} K - Emitter key string.
 * @template {ActorsConfigMap} A - Actors configuration map.
 */
export type EmitterReturn<
  K extends string,
  A extends ActorsConfigMap = ActorsConfigMap,
> = NotUndefined<A['emitters']>[K]['next'] extends infer P
  ? unknown extends P
    ? never
    : P
  : never;

/**
 * Async emitter factory function signature.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 * @template R - Return value type.
 *
 * @param state - Current extended state node of type {@linkcode StateExtended}.
 *
 * @returns Pausable stream object of type {@linkcode Pausable}.
 */
export type AsyncEmitterFunction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
> = (state: StateExtended<E, Pc, Tc, T>) => Pausable<R>;

/**
 * Sync emitter factory function signature.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 * @template R - Return value type.
 *
 * @param state - Current extended state node of type {@linkcode StateExtended}.
 *
 * @returns Pausable stream object of type {@linkcode Pausable}.
 */
export type SyncEmitterFunction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
> = (state: StateExtended<E, Pc, Tc, T>) => Pausable<R>;

/**
 * Map of async emitter keys to their factory functions.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
export type AsyncEmittersMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = RecordS<AsyncEmitterFunction<E, Pc, Tc, T>>;

/**
 * Map of sync emitter keys to their factory functions.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
export type SyncEmittersMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = RecordS<SyncEmitterFunction<E, Pc, Tc, T>>;
