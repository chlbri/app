import type { NotUndefined } from '@bemedev/app-options/bemedev';
import type { ActorsConfigMap } from '#events';
import type { AsyncTransition } from '#transitions';
import type { AsyncEmitterFunction, Contract } from '@bemedev/app-options';

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
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `R` - Return value type.
 */
export type AsyncEmitter<Ct extends Contract = Contract, R = any> = {
  /**
   * Source function returning a pausable stream.
   */
  src: AsyncEmitterFunction<Ct, R>;
  /**
   * Optional description string.
   */
  description?: string;
  /**
   * Transitions triggered on next emission.
   */
  next: AsyncTransition<Ct>[];
  /**
   * Transitions triggered on error emission.
   */
  error: AsyncTransition<Ct>[];
  /**
   * Transitions triggered on completion.
   */
  complete: AsyncTransition<Ct>[];
};

/**
 * Synchronous emitter configuration structure.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `R` - Return value type.
 */
export type SyncEmitter<Ct extends Contract = Contract, R = any> = {
  /**
   * Source function returning a pausable stream.
   */
  src: AsyncEmitterFunction<Ct, R>;
  /**
   * Optional description string.
   */
  description?: string;
  /**
   * Transitions triggered on next emission.
   */
  next: AsyncTransition<Ct>[];
  /**
   * Transitions triggered on error emission.
   */
  error: AsyncTransition<Ct>[];
  /**
   * Transitions triggered on completion.
   */
  complete: AsyncTransition<Ct>[];
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
