import type { AsyncAction2 } from '#actions';

import type { AsyncPredicateS, DefinedValue } from '#guards';

import type { EventsMapFrom } from '#common/interpreter';
import type {
  AnyMachine,
  CommonConfig3,
  CommonEraseAction_F,
  CommonFilterAction_F,
  DecomposeC,
  SimpleMachineOptions2,
  SwapFunction_F,
} from '#common/machine';
import type {
  ActorsConfigMap,
  EventArg,
  EventArgAll,
  EventObject,
  EventsMap,
} from '#events';
import type { PrimitiveObject } from '@bemedev/typings';
import type {
  EmptyObject,
  FnMap,
  FnR,
  MaybePromise,
  SingleOrArrayL2,
  TraversableTuple,
} from '~types';
import type { AsyncMachine } from './machine';
/**
 * Options for async action helpers.
 *
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
export type AsyncOptions<
  Eo extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  /**
   * Called with the thrown error and current context snapshot when
   * the async function rejects. Return value is merged as ActionResult.
   * When omitted, rejection propagates to interpreter's `_addError` channel.
   *
   * @see -- type {@linkcode ErrorFn}
   */
  catch: ErrorFn<Eo, Pc, Tc, T>;
  /**
   * Optional async action of type {@linkcode AsyncAction2} executed upon success.
   */
  then?: AsyncAction2<Eo, Pc, Tc, T>;
  /**
   * Maximum duration in milliseconds before the async action is forcibly aborted.
   * When omitted, no timeout is applied.
   */
  max?: number;
};

/**
 * Conditional rest arguments for async action helpers.
 *
 * Options are required when the handler returns a `Promise` and rejected for
 * synchronous handlers. When the return type cannot be resolved (for example
 * with an unannotated handler parameter), options stay optional instead of
 * being rejected.
 *
 * @template `F` - Handler return type.
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
type AsyncOptionsArgs<
  F,
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = unknown extends F
  ? [AsyncOptions<E, Pc, Tc, T>?]
  : F extends Promise<any>
    ? [AsyncOptions<E, Pc, Tc, T>]
    : [];

/**
 * Error handler function signature for async options.
 *
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 * @param err - Thrown error value.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type ErrorFn<
  Eo extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <Err>(err: Err) => AsyncAction2<Eo, Pc, Tc, T>;

/**
 * Union type of traversable tuple `R` or Promise resolving to `R`.
 *
 * @template `T` - Source object type.
 * @template | {@linkcode SingleOrArrayL2} `K` - Keys extending `keyof T`.
 * @template | {@linkcode TraversableTuple} `R` - Resolved traversable tuple type.
 */
export type TraversableTupleAsync<
  T,
  K extends SingleOrArrayL2<keyof T>,
  R extends TraversableTuple<T, K> = TraversableTuple<T, K>,
> = R | Promise<R>;

/**
 * Function type signature for creating an async assign action helper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 * @template | {@linkcode DecomposeC} `D` - Decomposed context paths object type.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncAssignAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  D = DecomposeC<Tc>,
> = {
  <
    const K extends SingleOrArrayL2<keyof D>,
    const F extends TraversableTupleAsync<D, K> = TraversableTupleAsync<D, K>,
  >(
    keys: K,
    fn: FnMap<E, Pc, Tc, T, NoInfer<F>>,
    ...args: AsyncOptionsArgs<F, E, Pc, Tc, T>
  ): AsyncAction2<E, Pc, Tc, T>;

  <F extends Tc | Promise<Tc>>(
    fn: FnMap<E, Pc, Tc, T, F>,
    ...args: AsyncOptionsArgs<F, E, Pc, Tc, T>
  ): AsyncAction2<E, Pc, Tc, T>;
};

/**
 * Function type signature for resending an event as an async action.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 * @param event - Event argument of type {@linkcode EventArgAll}.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncResendAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (event: EventArgAll<E>) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for forcibly sending an event as an async action.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 * @param event - Event argument of type {@linkcode EventArg}.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncForceSendAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (event: EventArg<E>) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for time-related async actions (activities, timers).
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 * @param id - Activity or timer string identifier.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncTimeAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (id: string) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for creating an async action helper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <F>(
  fn: FnMap<E, Pc, Tc, T, F>,
  ...args: AsyncOptionsArgs<F, E, Pc, Tc, T>
) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for creating an array/object filter action helper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncFilterAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = CommonFilterAction_F<E, Pc, Tc, T, AsyncAction2<E, Pc, Tc, T>>;

/**
 * Function type signature for creating an erase property action helper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncEraseAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = CommonEraseAction_F<Tc, AsyncAction2<E, Pc, Tc, T>>;

/**
 * Function type signature for sending an event to an actor machine asynchronously.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 *
 * @returns Function returning an async action of type {@linkcode AsyncAction2}.
 */
export type AsyncSendAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <M extends AnyMachine>(
  _?: M,
) => <
  F extends
    | { to: string; event: EventArg<EventsMapFrom<M>> }
    | Promise<{ to: string; event: EventArg<EventsMapFrom<M>> }> =
    | { to: string; event: EventArg<EventsMapFrom<M>> }
    | Promise<{ to: string; event: EventArg<EventsMapFrom<M>> }>,
>(
  fn: FnMap<E, Pc, Tc, T, F>,
  ...args: F extends Promise<{ to: string; event: EventArg<EventsMapFrom<M>> }>
    ? [AsyncOptions<E, Pc, Tc, T>]
    : []
) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for creating a value checker guard helper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 * @param path - Property path of type {@linkcode DefinedValue}.
 * @param values - Values to check against.
 *
 * @returns Guard function of type {@linkcode FnR}.
 */
export type AsyncValueCheckerGuard_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (path: DefinedValue<Pc, Tc>, ...values: any[]) => FnR<E, Pc, Tc, T, boolean>;

/**
 * Function type signature for creating a property definition guard helper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 * @param path - Property path of type {@linkcode DefinedValue}.
 *
 * @returns Guard function of type {@linkcode FnR}.
 */
export type AsyncDefineGuard_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (path: DefinedValue<Pc, Tc>) => FnR<E, Pc, Tc, T, boolean>;

/**
 * Function type signature for batching multiple actions into a single async action.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 * @param fns - Array of async actions of type {@linkcode AsyncAction2}.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncBatchAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <A extends (AsyncAction2<E, Pc, Tc, T> | undefined)[]>(
  ...fns: A
) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for repeating a single action.
 *
 * The action may itself be a batch action, and `undefined` produces a no-op action.
 * The iteration count is either a number or a function map of type
 * {@linkcode FnMap} receiving the extended state (per event or `else`) and
 * returning a number or a promise of a number. It is resolved once, before the
 * first iteration.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 * @param count - Number of iterations, or function map of type {@linkcode FnMap}
 * receiving the extended state and returning a number.
 * @param fn - Single async action of type {@linkcode AsyncAction2}, or `undefined`.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncForAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (
  count: number | FnMap<E, Pc, Tc, T, MaybePromise<number>>,
  fn: AsyncAction2<E, Pc, Tc, T> | undefined,
) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for repeating a single action while a predicate holds.
 *
 * Used by both the `_while` helper (predicate evaluated before each iteration)
 * and the `_doWhile` helper (predicate evaluated after each iteration, running
 * the action at least once). The action may itself be a batch action, and an
 * `undefined` action produces a no-op action.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 * @param predicate - Function map of type {@linkcode FnMap} receiving the extended
 * state and returning a boolean or a promise of a boolean.
 * @param fn - Single action of type {@linkcode AsyncAction2}, or `undefined`.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncWhileAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (
  predicate: FnMap<E, Pc, Tc, T, MaybePromise<boolean>>,
  fn: AsyncAction2<E, Pc, Tc, T> | undefined,
) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Logical AND guard structure for async guard batching options.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
export type AsyncGuardAndOption<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { and: AsyncGuardUnionOption<E, Pc, Tc, T>[] };

/**
 * Logical OR guard structure for async guard batching options.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
export type AsyncGuardOrOption<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { or: AsyncGuardUnionOption<E, Pc, Tc, T>[] };

/**
 * Union of async guard items for batching.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
export type AsyncGuardUnionOption<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> =
  | undefined
  | AsyncPredicateS<E, Pc, Tc, T>
  | AsyncGuardAndOption<E, Pc, Tc, T>
  | AsyncGuardOrOption<E, Pc, Tc, T>;

/**
 * Function type signature for batching multiple guards into a single async guard.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 * @param guards - Variadic array of guard functions or logical guard objects.
 *
 * @returns Async guard function of type {@linkcode FnR}.
 */
export type AsyncBatchGuard_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (
  ...guards: AsyncGuardUnionOption<E, Pc, Tc, T>[]
) => FnR<E, Pc, Tc, T, Promise<boolean>>;

/**
 * Object containing all action, guard, timer, and activity helper functions for an async machine.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
export type AsyncAddOption<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  /**
   * Guard helper that checks whether a context property is defined.
   *
   * @see -- type {@linkcode AsyncDefineGuard_F}
   */
  isDefined: AsyncDefineGuard_F<E, Pc, Tc, T>;
  /**
   * Guard helper that checks whether a context property is not defined.
   *
   * @see -- type {@linkcode AsyncDefineGuard_F}
   */
  isNotDefined: AsyncDefineGuard_F<E, Pc, Tc, T>;
  /**
   * Guard helper that checks whether a context property equals one of the
   * provided values.
   *
   * @see -- type {@linkcode AsyncValueCheckerGuard_F}
   */
  isValue: AsyncValueCheckerGuard_F<E, Pc, Tc, T>;
  /**
   * Guard helper that checks whether a context property differs from all
   * provided values.
   *
   * @see -- type {@linkcode AsyncValueCheckerGuard_F}
   */
  isNotValue: AsyncValueCheckerGuard_F<E, Pc, Tc, T>;
  /**
   * Helper function to batch multiple guards into a single async guard.
   *
   * Boolean guards become constant predicates, logical objects (`and` and `or`)
   * are reduced recursively, and the resulting predicates are combined through
   * an async recursive evaluation.
   *
   * @see -- type {@linkcode AsyncBatchGuard_F}
   */
  guardBatch: AsyncBatchGuard_F<E, Pc, Tc, T>;
  /**
   * Swap helper function that swaps the state arguments in functional
   * transitions.
   *
   * @see -- type {@linkcode SwapFunction_F}
   */
  swap: SwapFunction_F<E, Pc, Tc, T>;
  /**
   * Helper function to assign context variables asynchronously.
   *
   * Supports the keyless form (a function map returning the next context), the
   * keyed form with a single key, and the keyed form with an array of keys
   * returning a traversable tuple. Options of type {@linkcode AsyncOptions}
   * bound the execution with `max`, chain a follow-up action with `then`, and
   * handle rejections with `catch`.
   *
   * @see -- type {@linkcode AsyncAssignAction_F}
   */
  assign: AsyncAssignAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to batch multiple async actions into a single action.
   *
   * Sub-actions run in order, sharing the same state object. After each of
   * them, the committed mergers are merged in place into the state context, so
   * the following sub-actions observe the updated context.
   *
   * @see -- type {@linkcode AsyncBatchAction_F}
   */
  batch: AsyncBatchAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to repeat a single action a fixed number of times.
   *
   * The action may itself be a batch action, and `undefined` produces a no-op
   * action. The iteration count is resolved once, before the first iteration;
   * non-finite or non-positive counts produce a no-op action. Each iteration
   * reads the context committed by the previous one.
   *
   * @see -- type {@linkcode AsyncForAction_F}
   */
  _for: AsyncForAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to repeat a single action while a predicate holds.
   *
   * The predicate is evaluated before each iteration, so the action may never
   * run. Each iteration reads the context committed by the previous one.
   *
   * @see -- type {@linkcode AsyncWhileAction_F}
   */
  _while: AsyncWhileAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to repeat a single action while a predicate holds, running
   * it at least once.
   *
   * The predicate is evaluated after each iteration, so the action always runs
   * once. Each iteration reads the context committed by the previous one.
   *
   * @see -- type {@linkcode AsyncWhileAction_F}
   */
  _doWhile: AsyncWhileAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to filter array or object properties asynchronously.
   *
   * @see -- type {@linkcode AsyncFilterAction_F}
   */
  filter: AsyncFilterAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to erase object properties asynchronously.
   *
   * @see -- type {@linkcode AsyncEraseAction_F}
   */
  erase: AsyncEraseAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to create async actions.
   *
   * @see -- type {@linkcode AsyncAction_F}
   */
  action: AsyncAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to send events to actor machines asynchronously.
   *
   * @see -- type {@linkcode AsyncSendAction_F}
   */
  sendTo: AsyncSendAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to resend an event as an async action.
   *
   * @see -- type {@linkcode AsyncResendAction_F}
   */
  resend: AsyncResendAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to force sending an event as an async action, whatever the
   * current state is.
   *
   * @see -- type {@linkcode AsyncForceSendAction_F}
   */
  forceSend: AsyncResendAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to pause an activity.
   *
   * @see -- type {@linkcode AsyncTimeAction_F}
   */
  pauseActivity: AsyncTimeAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to resume an activity.
   *
   * @see -- type {@linkcode AsyncTimeAction_F}
   */
  resumeActivity: AsyncTimeAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to stop an activity.
   *
   * @see -- type {@linkcode AsyncTimeAction_F}
   */
  stopActivity: AsyncTimeAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to pause a timer.
   *
   * @see -- type {@linkcode AsyncTimeAction_F}
   */
  pauseTimer: AsyncTimeAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to resume a timer.
   *
   * @see -- type {@linkcode AsyncTimeAction_F}
   */
  resumeTimer: AsyncTimeAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to stop a timer.
   *
   * @see -- type {@linkcode AsyncTimeAction_F}
   */
  stopTimer: AsyncTimeAction_F<E, Pc, Tc, T>;
};

/**
 * Parameters type signature for providing options to an async machine.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 * @template | {@linkcode SimpleMachineOptions2} `Mo` - Simple machine options type.
 * @template | {@linkcode SimpleMachineOptions2} `L` - Legacy options type.
 * @param option - Action and guard options object of type {@linkcode AsyncAddOption}.
 * @param legacyOptions - Access to previously defined options.
 *
 * @returns Machine options of type {@linkcode SimpleMachineOptions2}.
 */
export type AsyncAddOptionsParam_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = (
  option: AsyncAddOption<E, Pc, Tc, T>,
  /**
   * Access to previously defined options from previous addOptions or provideOptions calls.
   * Provides actions, guards, emitters, machines, promises, and delays.
   */
  legacyOptions: { _legacy: L },
) => Mo;

/**
 * Function type signature for adding options to an async machine configuration.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `Ta` - State tag string type.
 * @template | {@linkcode SimpleMachineOptions2} `Mo` - Simple machine options type.
 * @template | {@linkcode SimpleMachineOptions2} `L` - Existing options type.
 */
export type AsyncAddOptions_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Ta extends string = string,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = <const T extends Mo>(
  option: AsyncAddOptionsParam_F<E, Pc, Tc, Ta, T, L>,
) => L & T;

/**
 * Function type signature for providing options to an async machine class {@linkcode AsyncMachine}.
 *
 * @template | {@linkcode CommonConfig3} `C` - Common machine config type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template | {@linkcode EventsMap} `E` - Events map type.
 * @template | {@linkcode ActorsConfigMap} `A` - Actors config map type.
 * @template `Ta` - State tag string type.
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 * @template `AllPaths` - All path strings type.
 * @template | {@linkcode SimpleMachineOptions2} `Mo` - Simple machine options type.
 * @template | {@linkcode EmptyObject} `L` - Existing options type.
 */
export type AsyncProvideOptions_F<
  C extends CommonConfig3 = CommonConfig3,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = EventsMap,
  A extends ActorsConfigMap = ActorsConfigMap,
  Ta extends string = string,
  Eo extends EventObject = EventObject,
  AllPaths extends string = string,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  L extends SimpleMachineOptions2 = EmptyObject,
> = <const T extends Mo>(
  option: AsyncAddOptionsParam_F<Eo, Pc, Tc, Ta, T, L>,
) => AsyncMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L & T>;
