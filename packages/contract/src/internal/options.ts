/**
 * Vendored machine options types.
 *
 * Copied from the machine option surface so contracts can describe the object
 * returned by `createOptions` without importing `@bemedev/app`. Both the
 * synchronous and asynchronous variants are provided; the contract factory
 * selects one from its `sync` flag.
 */

import type { RegisterOptions } from '../registry.types';
import type { EventArgObject, EventObject, EventStrings } from './events';
import type { PrimitiveObject, RecordS } from './primitives';

/** Merger descriptor accepted by an action result. */
export type Merger<T, K extends string = string> = {
  /** Optional source object containing values to merge. */
  source?: T;
  /** Dot-separated key path indicating which property to merge. */
  key?: K;
};

/** Event forwarded to another interpreter. */
export type SendToEvent<T = any> = { to: string; event: T };

/** Extra parameters accepted by extended actions. */
export type ExtendedActionsParams<Eo extends EventObject = EventObject> = Partial<{
  resend: EventArgObject<Eo>;
  forceSend: EventArgObject<Eo>;
  pauseActivity: string;
  resumeActivity: string;
  stopActivity: string;
  sentEvent: SendToEvent;
}>;

/** Result of executing an action. */
export type ActionResult<
  Tc extends PrimitiveObject = PrimitiveObject,
  Eo extends EventObject = EventObject,
> = { mergers?: Merger<Tc, string>[] } & ExtendedActionsParams<Eo>;

/** Action result, synchronous or asynchronous. */
export type MaybeAsyncActionResult<Tc extends PrimitiveObject = PrimitiveObject> =
  | ActionResult<Tc>
  | Promise<ActionResult<Tc>>;

/** Value or promise of that value. */
export type MaybePromise<T> = T | Promise<T>;

/** Machine lifecycle status strings. */
export type WorkingStatus =
  | 'idle'
  | 'starting'
  | 'started'
  | 'paused'
  | 'working'
  | 'sending'
  | 'stopped'
  | 'busy';

/** Nested state value map. */
export interface StateValueMap {
  [key: string]: StateValue;
}

/** Machine state value. */
export type StateValue = string | StateValueMap;

/** Fields shared by every active state object. */
export type CommonState<
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { context: Tc; status: WorkingStatus; value: StateValue; tags: T[] };

/** Active state object. */
export type State<
  E extends EventObject = EventObject,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { event: E } & CommonState<Tc, T>;

/** Active state object with a raw payload. */
export type StateP<
  E = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { payload: E } & CommonState<Tc, T>;

/** Active state object including the private context. */
export type StateExtended<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { pContext: Pc } & State<E, Tc, T>;

/** Payload state object including the private context. */
export type StatePextended<
  E = any,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { pContext: Pc } & StateP<E, Tc, T>;

/** Extracts the string event type from an event object or string. */
export type EventToType<T extends string | { type: string }> = T extends {
  type: infer U extends string;
}
  ? U
  : T extends string
    ? T
    : never;

/** Common function signature receiving an extended state. */
export type FnR<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
> = (state: StateExtended<E, Pc, Tc, T>) => R;

/** Internal function map keyed by event types. */
type _FnMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
  Ex extends string = never,
  TT extends Exclude<E, Ex> = Exclude<E, Ex>,
> = {
  [key in Exclude<EventToType<TT>, EventStrings>]?: (
    state: StatePextended<Extract<TT, { type: key }>['payload'], Pc, Tc, T>,
  ) => R;
} & Partial<Record<EventStrings | 'else', FnR<E, Pc, Tc, T, R>>>;

/** Maps event types to handler functions, with a fallback handler. */
export type FnMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
  Ex extends string = never,
> = FnR<E, Pc, Tc, T, R> | _FnMap<E, Pc, Tc, T, R, Ex>;

/** Synchronous action function. */
export type SyncAction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, ActionResult<Tc>>;

/** Asynchronous action function. */
export type AsyncAction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, MaybeAsyncActionResult<Tc>>;

/** Synchronous predicate. */
export type SyncPredicateS<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = boolean | FnMap<E, Pc, Tc, T, boolean>;

/** Asynchronous predicate. */
export type AsyncPredicateS<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = boolean | FnMap<E, Pc, Tc, T, MaybePromise<boolean>>;

/** Synchronous predicate runner. */
export type SyncPredicateS3<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, boolean>;

/** Asynchronous predicate runner. */
export type AsyncPredicateS3<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, MaybePromise<boolean>>;

/** Synchronous predicate or runner. */
export type SyncPredicateS2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = boolean | SyncPredicateS3<E, Pc, Tc, T>;

/** Asynchronous predicate or runner. */
export type AsyncPredicateS2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = boolean | AsyncPredicateS3<E, Pc, Tc, T>;

/** Synchronous delay runner. */
export type SyncDelayFunction3<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, number>;

/** Asynchronous delay runner. */
export type AsyncDelayFunction3<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, number>;

/** Synchronous delay value or runner. */
export type SyncDelayFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = number | SyncDelayFunction3<E, Pc, Tc, T>;

/** Asynchronous delay value or runner. */
export type AsyncDelayFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = number | AsyncDelayFunction3<E, Pc, Tc, T>;

/** Observer wired into a pausable source. */
export type EmitterObserver<R = any> = {
  next: (value: R) => void;
  error: (err: any) => void;
  complete: () => void;
};

/** Minimal pausable stream interface. */
export type Pausable<R = any> = {
  subscribe: (observer: EmitterObserver<R>) => void;
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
};

/** Emitter factory function. */
export type SyncEmitterFunction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
> = (state: StateExtended<E, Pc, Tc, T>) => Pausable<R>;

/** Asynchronous emitter factory function. */
export type AsyncEmitterFunction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
> = (state: StateExtended<E, Pc, Tc, T>) => Pausable<R>;

/** Map of emitter names to emitter factories. */
export type SyncEmittersMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = RecordS<SyncEmitterFunction<E, Pc, Tc, T>>;

/** Map of emitter names to asynchronous emitter factories. */
export type AsyncEmittersMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = RecordS<AsyncEmitterFunction<E, Pc, Tc, T>>;

/** Synchronous child machine factory. */
export type SyncChildFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnR<E, Pc, Tc, T, R>;

/** Asynchronous child machine factory. */
export type AsyncChildFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnR<E, Pc, Tc, T, MaybePromise<R>>;

/**
 * Machine options for synchronous machines registered with a
 * {@linkcode RegisterOptions} entry.
 */
export type SyncMachineOptions2<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
  O extends RegisterOptions = RegisterOptions,
> = Partial<{
  actions: Partial<Record<O['actions'], SyncAction2<Eo, Pc, Tc, T>>>;
  guards: Partial<Record<O['guards'], SyncPredicateS<Eo, Pc, Tc, T>>>;
  delays: Partial<Record<O['delays'], SyncDelayFunction2<Eo, Pc, Tc, T>>>;
  actors: Partial<{
    children: Partial<Record<O['children'], SyncChildFunction2<Eo, Pc, Tc, T, any>>>;
    emitters: Partial<
      Record<O['emitters'], SyncEmitterFunction<Eo, Pc, Tc, T, any>>
    >;
  }>;
}>;

/** Machine options for asynchronous machines registered with a `RegisterOptions` entry. */
export type AsyncMachineOptions2<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
  O extends RegisterOptions = RegisterOptions,
> = Partial<{
  actions: Partial<Record<O['actions'], AsyncAction2<Eo, Pc, Tc, T>>>;
  guards: Partial<Record<O['guards'], AsyncPredicateS<Eo, Pc, Tc, T>>>;
  delays: Partial<Record<O['delays'], AsyncDelayFunction2<Eo, Pc, Tc, T>>>;
  actors: Partial<{
    children: Partial<
      Record<O['children'], AsyncChildFunction2<Eo, Pc, Tc, T, any>>
    >;
    emitters: Partial<
      Record<O['emitters'], AsyncEmitterFunction<Eo, Pc, Tc, T, any>>
    >;
  }>;
}>;

/** Simple machine options for synchronous machines. */
export type SyncSimpleMachineOptions<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
> = Partial<{
  actions: Partial<RecordS<SyncAction2<Eo, Pc, Tc, T>>>;
  guards: Partial<RecordS<SyncPredicateS2<Eo, Pc, Tc, T>>>;
  delays: Partial<RecordS<SyncDelayFunction2<Eo, Pc, Tc, T>>>;
  actors: Partial<{
    children: RecordS<SyncChildFunction2<Eo, Pc, Tc, T>>;
    emitters: SyncEmittersMap<Eo, Pc, Tc, T>;
  }>;
}>;

/** Simple machine options for asynchronous machines. */
export type AsyncSimpleMachineOptions<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
> = Partial<{
  actions: Partial<RecordS<AsyncAction2<Eo, Pc, Tc, T>>>;
  guards: Partial<RecordS<AsyncPredicateS2<Eo, Pc, Tc, T>>>;
  delays: Partial<RecordS<AsyncDelayFunction2<Eo, Pc, Tc, T>>>;
  actors: Partial<{
    children: RecordS<AsyncChildFunction2<Eo, Pc, Tc, T>>;
    emitters: AsyncEmittersMap<Eo, Pc, Tc, T>;
  }>;
}>;

/** Union of every machine options surface supported by a contract. */
export type MachineOptions<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
  O extends RegisterOptions = RegisterOptions,
> = AsyncMachineOptions2<Pc, Tc, T, Eo, O> | SyncMachineOptions2<Pc, Tc, T, Eo, O>;

/** Base shape satisfied by every machine options surface. */
export type AnyMachineOptions = {
  actions?: Record<string, any>;
  guards?: Record<string, any>;
  delays?: Record<string, any>;
  actors?: { children?: Record<string, any>; emitters?: Record<string, any> };
};

/** Union of every simple machine options surface supported by a contract. */
export type SimpleMachineOptions<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
> =
  | AsyncSimpleMachineOptions<Pc, Tc, T, Eo>
  | SyncSimpleMachineOptions<Pc, Tc, T, Eo>;

/** Selects the machine options surface matching the `sync` flag. */
export type ContractMachineOptions<
  Sync extends true | undefined,
  Pc,
  Tc extends PrimitiveObject,
  T extends string,
  Eo extends EventObject,
  O extends RegisterOptions,
> = Sync extends true
  ? SyncMachineOptions2<Pc, Tc, T, Eo, O>
  : AsyncMachineOptions2<Pc, Tc, T, Eo, O>;

/** Selects the simple machine options surface matching the `sync` flag. */
export type ContractSimpleMachineOptions<
  Sync extends true | undefined,
  Pc,
  Tc extends PrimitiveObject,
  T extends string,
  Eo extends EventObject,
> = Sync extends true
  ? SyncSimpleMachineOptions<Pc, Tc, T, Eo>
  : AsyncSimpleMachineOptions<Pc, Tc, T, Eo>;
