import type { AsyncAction2 } from '#actions';

import type { AsyncPredicateS, DefinedValue } from '#guards';

import type { EventsMapFrom } from '#common/interpreter';
import type {
  AnyMachine,
  CommonEraseAction_F,
  CommonFilterAction_F,
  DecomposeC,
  SimpleMachineOptions2,
} from '#common/machine';
import type { EventArg, EventArgAll } from '#events';
import type {
  Contract,
  ContractContext,
  ContractEvents,
  ContractOptions,
  OptionsPlugin,
  PluginAddons,
  ResolveUtilities,
} from '@bemedev/app-options';
import type {
  EmptyObject,
  MaybePromise,
  SingleOrArrayL2,
  TraversableTuple,
} from '~types';
import type { AsyncMachine } from './machine';
import type { FnMap, FnR } from '@bemedev/app-contract';
import type { AsyncAddons } from '@bemedev/app-plugins/addons';
/**
 * Options for async action helpers.
 *
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
export type AsyncOptions<Ct extends Contract = Contract> = {
  /**
   * Called with the thrown error and current context snapshot when
   * the async function rejects. Return value is merged as ActionResult.
   * When omitted, rejection propagates to interpreter's `_addError` channel.
   *
   * @see -- type {@linkcode ErrorFn}
   */
  catch: ErrorFn<Ct>;
  /**
   * Optional async action of type {@linkcode AsyncAction2} executed upon success.
   */
  then?: AsyncAction2<Ct>;
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
type AsyncOptionsArgs<F, Ct extends Contract = Contract> = unknown extends F
  ? [AsyncOptions<Ct>?]
  : F extends Promise<any>
    ? [AsyncOptions<Ct>]
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
export type ErrorFn<Ct extends Contract = Contract> = <Err>(
  err: Err,
) => AsyncAction2<Ct>;

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
  Ct extends Contract = Contract,
  D = DecomposeC<ContractContext<Ct>>,
> = {
  <
    const K extends SingleOrArrayL2<keyof D>,
    const F extends TraversableTupleAsync<D, K> = TraversableTupleAsync<D, K>,
  >(
    keys: K,
    fn: FnMap<Ct, NoInfer<F>>,
    ...args: AsyncOptionsArgs<F, Ct>
  ): AsyncAction2<Ct>;

  <F extends ContractContext<Ct> | Promise<ContractContext<Ct>>>(
    fn: FnMap<Ct, F>,
    ...args: AsyncOptionsArgs<F, Ct>
  ): AsyncAction2<Ct>;
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
export type AsyncResendAction_F<Ct extends Contract = Contract> = (
  event: EventArgAll<ContractEvents<Ct>>,
) => AsyncAction2<Ct>;

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
export type AsyncForceSendAction_F<Ct extends Contract = Contract> = (
  event: EventArg<ContractEvents<Ct>>,
) => AsyncAction2<Ct>;

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
export type AsyncTimeAction_F<Ct extends Contract = Contract> = (
  id: string,
) => AsyncAction2<Ct>;

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
export type AsyncAction_F<Ct extends Contract = Contract> = <const F>(
  fn: FnMap<Ct, F>,
  ...args: AsyncOptionsArgs<F, Ct>
) => AsyncAction2<Ct>;

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
export type AsyncFilterAction_F<Ct extends Contract = Contract> =
  CommonFilterAction_F<Ct, AsyncAction2<Ct>>;

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
export type AsyncEraseAction_F<Ct extends Contract = Contract> = CommonEraseAction_F<
  Ct,
  AsyncAction2<Ct>
>;

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
export type AsyncSendAction_F<Ct extends Contract = Contract> = <
  M extends AnyMachine,
>(
  _?: M,
) => <
  F extends
    | { to: string; event: EventArg<EventsMapFrom<M>> }
    | Promise<{ to: string; event: EventArg<EventsMapFrom<M>> }> =
    | { to: string; event: EventArg<EventsMapFrom<M>> }
    | Promise<{ to: string; event: EventArg<EventsMapFrom<M>> }>,
>(
  fn: FnMap<Ct, F>,
  ...args: F extends Promise<{ to: string; event: EventArg<EventsMapFrom<M>> }>
    ? [AsyncOptions<Ct>]
    : []
) => AsyncAction2<Ct>;

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
export type AsyncValueCheckerGuard_F<Ct extends Contract = Contract> = (
  path: DefinedValue<Ct>,
  ...values: any[]
) => FnR<Ct, MaybePromise<boolean>>;

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
export type AsyncDefineGuard_F<Ct extends Contract = Contract> = (
  path: DefinedValue<Ct>,
) => FnR<Ct, MaybePromise<boolean>>;

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
export type AsyncBatchAction_F<Ct extends Contract = Contract> = <
  A extends (AsyncAction2<Ct> | undefined)[],
>(
  ...fns: A
) => AsyncAction2<Ct>;

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
export type AsyncForAction_F<Ct extends Contract = Contract> = (
  count: number | FnMap<Ct, MaybePromise<number>>,
  fn: AsyncAction2<Ct> | undefined,
) => AsyncAction2<Ct>;

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
export type AsyncWhileAction_F<Ct extends Contract = Contract> = (
  predicate: FnMap<Ct, MaybePromise<boolean>>,
  fn: AsyncAction2<Ct> | undefined,
) => AsyncAction2<Ct>;

/**
 * Logical AND guard structure for async guard batching options.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
export type AsyncGuardAndOption<Ct extends Contract = Contract> = {
  and: AsyncGuardUnionOption<Ct>[];
};

/**
 * Logical OR guard structure for async guard batching options.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
export type AsyncGuardOrOption<Ct extends Contract = Contract> = {
  or: AsyncGuardUnionOption<Ct>[];
};

/**
 * Union of async guard items for batching.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
export type AsyncGuardUnionOption<Ct extends Contract = Contract> =
  | undefined
  | AsyncPredicateS<Ct>
  | AsyncGuardAndOption<Ct>
  | AsyncGuardOrOption<Ct>;

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
export type AsyncBatchGuard_F<Ct extends Contract = Contract> = (
  ...guards: AsyncGuardUnionOption<Ct>[]
) => FnR<Ct, Promise<boolean>>;

/**
 * Object containing all action, guard, timer, and activity helper functions for an async machine.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
export type AsyncAddOption<Ct extends Contract = Contract> = {
  /**
   * Guard helper that checks whether a context property is defined.
   *
   * @see -- type {@linkcode AsyncDefineGuard_F}
   */
  isDefined: AsyncDefineGuard_F<Ct>;
  /**
   * Guard helper that checks whether a context property is not defined.
   *
   * @see -- type {@linkcode AsyncDefineGuard_F}
   */
  isNotDefined: AsyncDefineGuard_F<Ct>;
  /**
   * Guard helper that checks whether a context property equals one of the
   * provided values.
   *
   * @see -- type {@linkcode AsyncValueCheckerGuard_F}
   */
  isValue: AsyncValueCheckerGuard_F<Ct>;
  /**
   * Guard helper that checks whether a context property differs from all
   * provided values.
   *
   * @see -- type {@linkcode AsyncValueCheckerGuard_F}
   */
  isNotValue: AsyncValueCheckerGuard_F<Ct>;
  /**
   * Helper function to batch multiple guards into a single async guard.
   *
   * Boolean guards become constant predicates, logical objects (`and` and `or`)
   * are reduced recursively, and the resulting predicates are combined through
   * an async recursive evaluation.
   *
   * @see -- type {@linkcode AsyncBatchGuard_F}
   */
  guardBatch: AsyncBatchGuard_F<Ct>;
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
  assign: AsyncAssignAction_F<Ct>;
  /**
   * Helper function to batch multiple async actions into a single action.
   *
   * Sub-actions run in order, sharing the same state object. After each of
   * them, the committed mergers are merged in place into the state context, so
   * the following sub-actions observe the updated context.
   *
   * @see -- type {@linkcode AsyncBatchAction_F}
   */
  batch: AsyncBatchAction_F<Ct>;
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
  _for: AsyncForAction_F<Ct>;
  /**
   * Helper function to repeat a single action while a predicate holds.
   *
   * The predicate is evaluated before each iteration, so the action may never
   * run. Each iteration reads the context committed by the previous one.
   *
   * @see -- type {@linkcode AsyncWhileAction_F}
   */
  _while: AsyncWhileAction_F<Ct>;
  /**
   * Helper function to repeat a single action while a predicate holds, running
   * it at least once.
   *
   * The predicate is evaluated after each iteration, so the action always runs
   * once. Each iteration reads the context committed by the previous one.
   *
   * @see -- type {@linkcode AsyncWhileAction_F}
   */
  _doWhile: AsyncWhileAction_F<Ct>;
  /**
   * Helper function to filter array or object properties asynchronously.
   *
   * @see -- type {@linkcode AsyncFilterAction_F}
   */
  filter: AsyncFilterAction_F<Ct>;
  /**
   * Helper function to erase object properties asynchronously.
   *
   * @see -- type {@linkcode AsyncEraseAction_F}
   */
  erase: AsyncEraseAction_F<Ct>;
  /**
   * Helper function to create async actions.
   *
   * @see -- type {@linkcode AsyncAction_F}
   */
  action: AsyncAction_F<Ct>;
  /**
   * Helper function to send events to actor machines asynchronously.
   *
   * @see -- type {@linkcode AsyncSendAction_F}
   */
  sendTo: AsyncSendAction_F<Ct>;
  /**
   * Helper function to resend an event as an async action.
   *
   * @see -- type {@linkcode AsyncResendAction_F}
   */
  resend: AsyncResendAction_F<Ct>;
  /**
   * Helper function to force sending an event as an async action, whatever the
   * current state is.
   *
   * @see -- type {@linkcode AsyncForceSendAction_F}
   */
  forceSend: AsyncResendAction_F<Ct>;
  /**
   * Helper function to pause an activity.
   *
   * @see -- type {@linkcode AsyncTimeAction_F}
   */
  pauseActivity: AsyncTimeAction_F<Ct>;
  /**
   * Helper function to resume an activity.
   *
   * @see -- type {@linkcode AsyncTimeAction_F}
   */
  resumeActivity: AsyncTimeAction_F<Ct>;
  /**
   * Helper function to stop an activity.
   *
   * @see -- type {@linkcode AsyncTimeAction_F}
   */
  stopActivity: AsyncTimeAction_F<Ct>;
  /**
   * Helper function to pause a timer.
   *
   * @see -- type {@linkcode AsyncTimeAction_F}
   */
  pauseTimer: AsyncTimeAction_F<Ct>;
  /**
   * Helper function to resume a timer.
   *
   * @see -- type {@linkcode AsyncTimeAction_F}
   */
  resumeTimer: AsyncTimeAction_F<Ct>;
  /**
   * Helper function to stop a timer.
   *
   * @see -- type {@linkcode AsyncTimeAction_F}
   */
  stopTimer: AsyncTimeAction_F<Ct>;
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
  Ct extends Contract = Contract,
  Mo = SimpleMachineOptions2,
  L = SimpleMachineOptions2,
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = (
  option: AsyncAddons<Ct> & ResolveUtilities<PluginAddons<Ps>, 'async'>,
  /**
   * Access to previously defined options from previous addOptions or provideOptions calls.
   * Provides actions, guards, emitters, machines, promises, and delays.
   */
  legacyOptions: { _legacy: L },
) => Mo;

/**
 * Function type signature for adding options to an async machine
 * configuration.
 *
 * Every option type is derived from the contract: events, contexts and tags are
 * read through the contract helpers instead of being passed separately.
 *
 * @template | {@linkcode Contract} `Ct` - Contract describing the machine.
 * @template `L` - Existing options type.
 */
export type AsyncAddOptions_F<
  Ct extends Contract = Contract,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = <const T extends ContractOptions<Ct>>(
  option: AsyncAddOptionsParam_F<Ct, T, L, Ps>,
) => ContractOptions<Ct>;

/**
 * Function type signature for providing options to an async machine class
 * {@linkcode AsyncMachine}.
 *
 * The machine stays parameterized by the same contract, so the returned
 * instance exposes the contract options surface.
 *
 * @template | {@linkcode Contract} `Ct` - Contract describing the machine.
 * @template `L` - Existing options type.
 */
export type AsyncProvideOptions_F<
  Ct extends Contract = Contract,
  L extends SimpleMachineOptions2 = EmptyObject,
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = <const T extends ContractOptions<Ct>>(
  option: AsyncAddOptionsParam_F<Ct, T, L, Ps>,
) => AsyncMachine<Ct, L & T, Ps>;
