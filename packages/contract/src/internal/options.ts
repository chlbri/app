/**
 * Vendored machine options types.
 *
 * Every machine-dependent type is contract-first: events, contexts, tags and
 * the sync flag are read from the contract carried as the first type parameter.
 */

import type { StateValue } from '@bemedev/app-utils-bemedev';
import type { RegisterOptions } from '../registry.types';
import type {
  ContractContextOf,
  ContractEventsOf,
  ContractLike,
  ContractPContextOf,
  ContractTagsOf,
} from './contract';
import type { EventArgObject, EventStrings } from './events';
import type { RecordS } from './primitives';

/**
 * Merger descriptor accepted by an action result.
 *
 * @template `T` - Source object type.
 * @template `K` - Key union of the merge target.
 */
export type Merger<T = any, K extends string = string> = {
  /** Optional source object containing values to merge. */
  source?: T;
  /** Dot-separated key path indicating which property to merge. */
  key?: K;
};

/**
 * Event forwarded to another interpreter.
 *
 * @template `T` - Forwarded event type.
 */
export type SendToEvent<T = any> = { to: string; event: T };

/**
 * Extra parameters accepted by extended actions.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type ExtendedActionsParams<Ct extends ContractLike = ContractLike> = Partial<{
  resend: EventArgObject<ContractEventsOf<Ct>>;
  forceSend: EventArgObject<ContractEventsOf<Ct>>;
  pauseActivity: string;
  resumeActivity: string;
  stopActivity: string;
  sentEvent: SendToEvent<EventArgObject<ContractEventsOf<Ct>>>;
}>;

/**
 * Result of executing an action.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type ActionResult<Ct extends ContractLike = ContractLike> = {
  mergers?: Merger<ContractContextOf<Ct>, string>[];
} & ExtendedActionsParams<Ct>;

/**
 * Action result, synchronous or asynchronous.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type MaybeAsyncActionResult<Ct extends ContractLike = ContractLike> =
  | ActionResult<Ct>
  | Promise<ActionResult<Ct>>;

/**
 * Value or promise of that value.
 *
 * @template `T` - Resolved value type.
 */
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

/**
 * Fields shared by every active state object.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type CommonState<Ct extends ContractLike = ContractLike> = {
  context: ContractContextOf<Ct>;
  status: WorkingStatus;
  value: StateValue;
  tags: ContractTagsOf<Ct>[];
};

/**
 * Active state object.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type State<Ct extends ContractLike = ContractLike> = {
  event: ContractEventsOf<Ct>;
} & CommonState<Ct>;

/**
 * Internal payload state object with a specialized payload type.
 *
 * It lets a function map narrow the payload of each event without exposing a
 * separate event parameter on the public `StateP` type.
 */
type _StateP<Ct extends ContractLike, P> = { payload: P } & CommonState<Ct>;

/**
 * Active state object with a raw payload.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type StateP<Ct extends ContractLike = ContractLike> = _StateP<
  Ct,
  ContractEventsOf<Ct>['payload']
>;

/**
 * Payload state object narrowed to a specific event.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 * @template `Ev` - Event object type.
 */
export type StatePOf<Ct extends ContractLike, Ev> = _StateP<
  Ct,
  Ev extends { payload: infer P } ? P : any
>;

/**
 * Active state object including the private context.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type StateExtended<Ct extends ContractLike = ContractLike> = {
  pContext: ContractPContextOf<Ct>;
} & State<Ct>;

/** Internal payload state object including the private context. */
type _StatePextended<Ct extends ContractLike, P> = {
  pContext: ContractPContextOf<Ct>;
} & _StateP<Ct, P>;

/**
 * Payload state object including the private context.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type StatePextended<Ct extends ContractLike = ContractLike> = _StatePextended<
  Ct,
  ContractEventsOf<Ct>['payload']
>;

/**
 * Payload state object including the private context, narrowed to a specific
 * event.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 * @template `Ev` - Event object type.
 */
export type StatePextendedOf<Ct extends ContractLike, Ev> = _StatePextended<
  Ct,
  Ev extends { payload: infer P } ? P : any
>;

/** Extracts the string event type from an event object or string. */
export type EventToType<T extends string | { type: string }> = T extends {
  type: infer U extends string;
}
  ? U
  : T extends string
    ? T
    : never;

/**
 * Common function signature receiving an extended state.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 * @template `R` - Returned value type.
 */
export type FnR<Ct extends ContractLike = ContractLike, R = any> = (
  state: StateExtended<Ct>,
) => R;

/**
 * Internal function map keyed by event types.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 * @template `R` - Returned value type.
 * @template `Ex` - Event types to exclude.
 */
type _FnMap<Ct extends ContractLike, R, Ex extends string> = {
  [key in Exclude<EventToType<ContractEventsOf<Ct>>, EventStrings | Ex>]?: (
    state: _StatePextended<
      Ct,
      Extract<ContractEventsOf<Ct>, { type: key }>['payload']
    >,
  ) => R;
} & Partial<Record<EventStrings | 'else', FnR<Ct, R>>>;

/**
 * Maps event types to handler functions, with a fallback handler.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 * @template `R` - Returned value type.
 * @template `Ex` - Event types to exclude.
 */
export type FnMap<
  Ct extends ContractLike = ContractLike,
  R = any,
  Ex extends string = never,
> = FnR<Ct, R> | _FnMap<Ct, R, Ex>;

/**
 * Synchronous action function.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type SyncAction2<Ct extends ContractLike = ContractLike> = FnR<
  Ct,
  ActionResult<Ct>
>;

/**
 * Asynchronous action function.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type AsyncAction2<Ct extends ContractLike = ContractLike> = FnR<
  Ct,
  MaybeAsyncActionResult<Ct>
>;

/**
 * Synchronous predicate.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type SyncPredicateS<Ct extends ContractLike = ContractLike> =
  | boolean
  | FnMap<Ct, boolean>;

/**
 * Asynchronous predicate.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type AsyncPredicateS<Ct extends ContractLike = ContractLike> =
  | boolean
  | FnMap<Ct, MaybePromise<boolean>>;

/**
 * Synchronous predicate runner.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type SyncPredicateS3<Ct extends ContractLike = ContractLike> = FnR<
  Ct,
  boolean
>;

/**
 * Asynchronous predicate runner.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type AsyncPredicateS3<Ct extends ContractLike = ContractLike> = FnR<
  Ct,
  MaybePromise<boolean>
>;

/**
 * Synchronous predicate or runner.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type SyncPredicateS2<Ct extends ContractLike = ContractLike> =
  | boolean
  | SyncPredicateS3<Ct>;

/**
 * Asynchronous predicate or runner.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type AsyncPredicateS2<Ct extends ContractLike = ContractLike> =
  | boolean
  | AsyncPredicateS3<Ct>;

/**
 * Delay runner.
 *
 * Synchronous and asynchronous machines share the same delay signature: a
 * callback receiving the extended state and returning a `number`, so a single
 * type covers both flavors.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type DelayFunction3<Ct extends ContractLike = ContractLike> = FnR<Ct, number>;

/**
 * Delay value or runner.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type DelayFunction2<Ct extends ContractLike = ContractLike> =
  | number
  | DelayFunction3<Ct>;

/**
 * Observer wired into a pausable source.
 *
 * @template `R` - Emitted value type.
 */
export type EmitterObserver<R = any> = {
  next: (value: R) => void;
  error: (err: any) => void;
  complete: () => void;
};

/**
 * Minimal pausable stream interface.
 *
 * @template `R` - Emitted value type.
 */
export type Pausable<R = any> = {
  subscribe: (observer: EmitterObserver<R>) => void;
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
};

/**
 * Emitter factory function.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 * @template `R` - Emitted value type.
 */
export type SyncEmitterFunction<Ct extends ContractLike = ContractLike, R = any> = (
  state: StateExtended<Ct>,
) => Pausable<R>;

/**
 * Asynchronous emitter factory function.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 * @template `R` - Emitted value type.
 */
export type AsyncEmitterFunction<Ct extends ContractLike = ContractLike, R = any> = (
  state: StateExtended<Ct>,
) => Pausable<R>;

/**
 * Map of emitter names to emitter factories.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type SyncEmittersMap<Ct extends ContractLike = ContractLike> = RecordS<
  SyncEmitterFunction<Ct>
>;

/**
 * Map of emitter names to asynchronous emitter factories.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type AsyncEmittersMap<Ct extends ContractLike = ContractLike> = RecordS<
  AsyncEmitterFunction<Ct>
>;

/**
 * Synchronous child machine factory.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 * @template `R` - Child machine type.
 */
export type SyncChildFunction2<
  Ct extends ContractLike = ContractLike,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnR<Ct, R>;

/**
 * Asynchronous child machine factory.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 * @template `R` - Child machine type.
 */
export type AsyncChildFunction2<
  Ct extends ContractLike = ContractLike,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnR<Ct, MaybePromise<R>>;

/**
 * Machine options for synchronous machines registered with a type
 * {@linkcode RegisterOptions} entry.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 * @template | {@linkcode RegisterOptions} `O` - Registered option identifiers.
 */
export type SyncMachineOptions2<
  Ct extends ContractLike = ContractLike,
  O extends RegisterOptions = RegisterOptions,
> = Partial<{
  actions: Partial<Record<O['actions'], SyncAction2<Ct>>>;
  guards: Partial<Record<O['guards'], SyncPredicateS<Ct>>>;
  delays: Partial<Record<O['delays'], DelayFunction2<Ct>>>;
  actors: Partial<{
    children: Partial<Record<O['children'], SyncChildFunction2<Ct, any>>>;
    emitters: Partial<Record<O['emitters'], SyncEmitterFunction<Ct, any>>>;
  }>;
}>;

/**
 * Machine options for asynchronous machines registered with a type
 * {@linkcode RegisterOptions} entry.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 * @template | {@linkcode RegisterOptions} `O` - Registered option identifiers.
 */
export type AsyncMachineOptions2<
  Ct extends ContractLike = ContractLike,
  O extends RegisterOptions = RegisterOptions,
> = Partial<{
  actions: Partial<Record<O['actions'], AsyncAction2<Ct>>>;
  guards: Partial<Record<O['guards'], AsyncPredicateS<Ct>>>;
  delays: Partial<Record<O['delays'], DelayFunction2<Ct>>>;
  actors: Partial<{
    children: Partial<Record<O['children'], AsyncChildFunction2<Ct, any>>>;
    emitters: Partial<Record<O['emitters'], AsyncEmitterFunction<Ct, any>>>;
  }>;
}>;

/**
 * Simple machine options for synchronous machines.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type SyncSimpleMachineOptions<Ct extends ContractLike = ContractLike> =
  Partial<{
    actions: Partial<RecordS<SyncAction2<Ct>>>;
    guards: Partial<RecordS<SyncPredicateS2<Ct>>>;
    delays: Partial<RecordS<DelayFunction2<Ct>>>;
    actors: Partial<{
      children: RecordS<SyncChildFunction2<Ct>>;
      emitters: SyncEmittersMap<Ct>;
    }>;
  }>;

/**
 * Simple machine options for asynchronous machines.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type AsyncSimpleMachineOptions<Ct extends ContractLike = ContractLike> =
  Partial<{
    actions: Partial<RecordS<AsyncAction2<Ct>>>;
    guards: Partial<RecordS<AsyncPredicateS2<Ct>>>;
    delays: Partial<RecordS<DelayFunction2<Ct>>>;
    actors: Partial<{
      children: RecordS<AsyncChildFunction2<Ct>>;
      emitters: AsyncEmittersMap<Ct>;
    }>;
  }>;

/**
 * Union of every machine options surface supported by a contract.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 * @template | {@linkcode RegisterOptions} `O` - Registered option identifiers.
 */
export type MachineOptions<
  Ct extends ContractLike = ContractLike,
  O extends RegisterOptions = RegisterOptions,
> = AsyncMachineOptions2<Ct, O> | SyncMachineOptions2<Ct, O>;

/** Base shape satisfied by every machine options surface. */
export type AnyMachineOptions = {
  actions?: Record<string, any>;
  guards?: Record<string, any>;
  delays?: Record<string, any>;
  actors?: { children?: Record<string, any>; emitters?: Record<string, any> };
};

/**
 * Union of every simple machine options surface supported by a contract.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type SimpleMachineOptions<Ct extends ContractLike = ContractLike> =
  | AsyncSimpleMachineOptions<Ct>
  | SyncSimpleMachineOptions<Ct>;

/**
 * Selects the machine options surface matching the contract `sync` flag.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 * @template | {@linkcode RegisterOptions} `O` - Registered option identifiers.
 */
export type ContractMachineOptions<
  Ct extends ContractLike = ContractLike,
  O extends RegisterOptions = RegisterOptions,
> = Ct['types']['sync'] extends true
  ? SyncMachineOptions2<Ct, O>
  : AsyncMachineOptions2<Ct, O>;

/**
 * Selects the simple machine options surface matching the contract `sync` flag.
 *
 * @template | {@linkcode ContractLike} `Ct` - Contract of the machine.
 */
export type ContractSimpleMachineOptions<Ct extends ContractLike = ContractLike> =
  Ct['types']['sync'] extends true
    ? SyncSimpleMachineOptions<Ct>
    : AsyncSimpleMachineOptions<Ct>;
