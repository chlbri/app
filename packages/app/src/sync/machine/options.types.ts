import type { SyncAction2 } from '#actions';
import type { EventsMapFrom } from '#common/interpreter';
import type { EventArg, EventArgAll } from '#events';
import type { DefinedValue, SyncPredicateS } from '#guards';

import type {
  AnyMachine,
  CommonEraseAction_F,
  CommonFilterAction_F,
  DecomposeC,
  SimpleMachineOptions2,
} from '#common/machine';
import type {
  Contract,
  ContractContext,
  ContractEvents,
  ContractOptions,
  OptionsPlugin,
  PluginAddons,
  ResolveUtilities,
} from '@bemedev/app-options';
import type { FnMap, FnR, SingleOrArrayL2, TraversableTuple } from '~types';
import type { SyncMachine } from './machine';
import type { SyncAddons } from '@bemedev/app-plugins/addons';

export type {
  SyncChildFunction2,
  SyncMachineOptions2,
  SyncSimpleMachineOptions,
} from '@bemedev/app-options';

/**
 * Function type signature for creating a synchronous filter action helper.
 *

 */
export type SyncFilterAction_F<Ct extends Contract = Contract> =
  CommonFilterAction_F<Ct, SyncAction2<Ct>>;

/**
 * Function type signature for creating a synchronous erase action helper.
 *

 */
export type SyncEraseAction_F<Ct extends Contract = Contract> = CommonEraseAction_F<
  Ct,
  SyncAction2<Ct>
>;

/**
 * Function type signature for creating a synchronous property definition guard helper.
 *

 */
export type SyncDefineGuard_F<Ct extends Contract = Contract> = (
  path: DefinedValue<Ct>,
) => FnR<Ct, boolean>;

/**
 * Function type signature for creating a synchronous value checker guard helper.
 *

 */
export type SyncValueCheckerGuard_F<Ct extends Contract = Contract> = (
  path: DefinedValue<Ct>,
  ...values: any[]
) => FnR<Ct, boolean>;

/**
 * Synchronous traversable tuple type alias for type {@linkcode TraversableTuple}.
 *
 * @template `T` - Source object type.
 * @template `K` - Keys extending type {@linkcode SingleOrArrayL2} of `keyof T`.
 */
export type TraversableTupleSync<
  T,
  K extends SingleOrArrayL2<keyof T>,
> = TraversableTuple<T, K>;

/**
 * Function type signature for creating a synchronous assign action helper.
 *

 * @template `D` - Decomposed context paths object.
 */
export type SyncAssignAction_F<
  Ct extends Contract = Contract,
  D = DecomposeC<ContractContext<Ct>>,
> = {
  <
    const K extends SingleOrArrayL2<keyof D>,
    const F extends TraversableTupleSync<D, K> = TraversableTupleSync<D, K>,
  >(
    keys: K,
    fn: FnMap<Ct, NoInfer<F>>,
  ): SyncAction2<Ct>;

  (fn: FnMap<Ct, ContractContext<Ct>>): SyncAction2<Ct>;
};

/**
 * Function type signature for batching multiple synchronous actions into a single action.
 *

 * @template `T` - State tag string type.
 */
export type SyncBatchAction_F<Ct extends Contract = Contract> = <
  A extends (SyncAction2<Ct> | undefined)[],
>(
  ...fns: A
) => SyncAction2<Ct>;

/**
 * Function type signature for repeating a single synchronous action.
 *
 * The action may itself be a batch action, and `undefined` produces a no-op action.
 * The iteration count is either a number or a function map of type
 * {@linkcode FnMap} receiving the extended state (per event or `else`) and
 * returning a number. It is resolved once, before the first iteration.
 *

 * @template `T` - State tag string type.
 */
export type SyncForAction_F<Ct extends Contract = Contract> = (
  count: number | FnMap<Ct, number>,
  fn: SyncAction2<Ct> | undefined,
) => SyncAction2<Ct>;

/**
 * Function type signature for repeating a single synchronous action while a
 * predicate holds.
 *
 * Used by both the `_while` helper (predicate evaluated before each iteration)
 * and the `_doWhile` helper (predicate evaluated after each iteration, running
 * the action at least once). The action may itself be a batch action, and an
 * `undefined` action produces a no-op action.
 *

 * @param predicate - Function map of type {@linkcode FnMap} receiving the extended
 * state and returning a boolean.
 * @param fn - Single synchronous action of type {@linkcode SyncAction2}, or `undefined`.
 *
 * @returns Synchronous action of type {@linkcode SyncAction2}.
 */
export type SyncWhileAction_F<Ct extends Contract = Contract> = (
  predicate: FnMap<Ct, boolean>,
  fn: SyncAction2<Ct> | undefined,
) => SyncAction2<Ct>;

/**
 * Function type signature for creating a synchronous action helper.
 *

 */
export type SyncAction_F<Ct extends Contract = Contract> = (
  fn: FnMap<Ct, any>,
) => SyncAction2<Ct>;

/**
 * Function type signature for sending an event to an actor machine synchronously.
 *

 */
export type SyncSendAction_F<Ct extends Contract = Contract> = <
  M extends AnyMachine,
>(
  _?: M,
) => <
  F extends { to: string; event: EventArg<EventsMapFrom<M>> } = {
    to: string;
    event: EventArg<EventsMapFrom<M>>;
  },
>(
  fn: FnMap<Ct, F>,
) => SyncAction2<Ct>;

/**
 * Function type signature for resending an event as a synchronous action.
 *

 *
 * @returns Synchronous action type {@linkcode SyncAction2}.
 */
export type SyncResendAction_F<Ct extends Contract = Contract> = (
  event: EventArgAll<ContractEvents<Ct>>,
) => SyncAction2<Ct>;

/**
 * Function type signature for creating a synchronous activity or timer control action.
 *
 * @template `E` - Event object type.
 * @template `Pc` - Private context type.
 *
 * @template `T` - State tag string type.
 * @param id - Activity or timer string identifier.
 *
 * @returns Synchronous action type {@linkcode SyncAction2}.
 */
export type SyncTimeAction_F<Ct extends Contract = Contract> = (
  id: string,
) => SyncAction2<Ct>;

/**
 * Union of all supported synchronous action factory function types.

 * @template `T` - State tag string type.
 */
export type SyncAllActions_F<Ct extends Contract = Contract> =
  | SyncAssignAction_F<Ct>
  | SyncAction_F<Ct>
  | SyncSendAction_F<Ct>
  | SyncResendAction_F<Ct>
  | SyncTimeAction_F<Ct>
  | SyncBatchAction_F<Ct>
  | SyncForAction_F<Ct>
  | SyncWhileAction_F<Ct>
  | SyncEraseAction_F<Ct>
  | SyncFilterAction_F<Ct>;

/**
 * Logical AND guard structure for synchronous guard batching options.
 *
 * @template `E` - Event object type.
 * @template `Pc` - Private context type.
 *
 * @template `T` - State tag string type.
 */
export type SyncGuardAndOption<Ct extends Contract = Contract> = {
  and: SyncGuardUnionOption<Ct>[];
};

/**
 * Logical OR guard structure for synchronous guard batching options.
 *
 * @template `E` - Event object type.
 * @template `Pc` - Private context type.
 *
 * @template `T` - State tag string type.
 */
export type SyncGuardOrOption<Ct extends Contract = Contract> = {
  or: SyncGuardUnionOption<Ct>[];
};

/**
 * Union of synchronous guard items for batching.
 *
 * @template `E` - Event object type.
 * @template `Pc` - Private context type.
 *
 * @template `T` - State tag string type.
 */
export type SyncGuardUnionOption<Ct extends Contract = Contract> =
  | undefined
  | SyncPredicateS<Ct>
  | SyncGuardAndOption<Ct>
  | SyncGuardOrOption<Ct>;

/**
 * Function type signature for batching multiple synchronous guards into a single guard.
 *
 * @template `E` - Event object type.
 * @template `Pc` - Private context type.
 *
 * @template `T` - State tag string type.
 * @param guards - Variadic array of guard functions or logical guard objects.
 *
 * @returns Synchronous guard function of type {@linkcode FnR}.
 */
export type SyncBatchGuard_F<Ct extends Contract = Contract> = (
  ...guards: SyncGuardUnionOption<Ct>[]
) => FnR<Ct, boolean>;

/**
 * Object containing all action, guard, timer, and activity helper functions for a synchronous machine.
 *
 * @template `E` - Event object type.
 * @template `Pc` - Private context type.
 *
 * @template `T` - State tag string type.
 */
export type SyncAddOption<Ct extends Contract = Contract> = {
  /**
   * Guard helper that checks whether a context property is defined.
   *
   * @see -- type {@linkcode SyncDefineGuard_F}
   */
  isDefined: SyncDefineGuard_F<Ct>;
  /**
   * Guard helper that checks whether a context property is not defined.
   *
   * @see -- type {@linkcode SyncDefineGuard_F}
   */
  isNotDefined: SyncDefineGuard_F<Ct>;
  /**
   * Guard helper that checks whether a context property equals one of the
   * provided values.
   *
   * @see -- type {@linkcode SyncValueCheckerGuard_F}
   */
  isValue: SyncValueCheckerGuard_F<Ct>;
  /**
   * Guard helper that checks whether a context property differs from all
   * provided values.
   *
   * @see -- type {@linkcode SyncValueCheckerGuard_F}
   */
  isNotValue: SyncValueCheckerGuard_F<Ct>;
  /**
   * Helper function to batch multiple guards into a single synchronous guard.
   *
   * Boolean guards become constant predicates, logical objects (`and` and `or`)
   * are reduced recursively, and the resulting predicates are combined through
   * a recursive evaluation.
   *
   * @see -- type {@linkcode SyncBatchGuard_F}
   */
  guardBatch: SyncBatchGuard_F<Ct>;
  /**
   * Helper function to assign context variables synchronously.
   *
   * Supports the keyless form (a function map returning the next context), the
   * keyed form with a single key, and the keyed form with an array of keys
   * returning a traversable tuple.
   *
   * @see -- type {@linkcode SyncAssignAction_F}
   */
  assign: SyncAssignAction_F<Ct>;
  /**
   * Helper function to batch multiple synchronous actions into a single action.
   *
   * Sub-actions run in order, sharing the same state object. After each of
   * them, the committed mergers are merged in place into the state context, so
   * the following sub-actions observe the updated context.
   *
   * @see -- type {@linkcode SyncBatchAction_F}
   */
  batch: SyncBatchAction_F<Ct>;
  /**
   * Helper function to repeat a single action a fixed number of times.
   *
   * The action may itself be a batch action, and `undefined` produces a no-op
   * action. The iteration count is resolved once, before the first iteration;
   * non-finite or non-positive counts produce a no-op action. Each iteration
   * reads the context committed by the previous one.
   *
   * @see -- type {@linkcode SyncForAction_F}
   */
  _for: SyncForAction_F<Ct>;
  /**
   * Helper function to repeat a single action while a predicate holds.
   *
   * The predicate is evaluated before each iteration, so the action may never
   * run. Each iteration reads the context committed by the previous one.
   *
   * @see -- type {@linkcode SyncWhileAction_F}
   */
  _while: SyncWhileAction_F<Ct>;
  /**
   * Helper function to repeat a single action while a predicate holds, running
   * it at least once.
   *
   * The predicate is evaluated after each iteration, so the action always runs
   * once. Each iteration reads the context committed by the previous one.
   *
   * @see -- type {@linkcode SyncWhileAction_F}
   */
  _doWhile: SyncWhileAction_F<Ct>;
  /**
   * Helper function to filter array or object properties synchronously.
   *
   * @see -- type {@linkcode SyncFilterAction_F}
   */
  filter: SyncFilterAction_F<Ct>;
  /**
   * Helper function to erase object properties synchronously.
   *
   * @see -- type {@linkcode SyncEraseAction_F}
   */
  erase: SyncEraseAction_F<Ct>;
  /**
   * Helper function to create synchronous actions.
   *
   * @see -- type {@linkcode SyncAction_F}
   */
  action: SyncAction_F<Ct>;
  /**
   * Helper function to send events to actor machines synchronously.
   *
   * @see -- type {@linkcode SyncSendAction_F}
   */
  sendTo: SyncSendAction_F<Ct>;

  /**
   * Helper function to resend an event as a synchronous action.
   *
   * @see -- type {@linkcode SyncResendAction_F}
   */
  resend: SyncResendAction_F<Ct>;
  /**
   * Helper function to force sending an event as a synchronous action, whatever
   * the current state is.
   *
   * @see -- type {@linkcode SyncResendAction_F}
   */
  forceSend: SyncResendAction_F<Ct>;
  /**
   * Helper function to pause an activity.
   *
   * @see -- type {@linkcode SyncTimeAction_F}
   */
  pauseActivity: SyncTimeAction_F<Ct>;
  /**
   * Helper function to resume an activity.
   *
   * @see -- type {@linkcode SyncTimeAction_F}
   */
  resumeActivity: SyncTimeAction_F<Ct>;
  /**
   * Helper function to stop an activity.
   *
   * @see -- type {@linkcode SyncTimeAction_F}
   */
  stopActivity: SyncTimeAction_F<Ct>;
  /**
   * Helper function to pause a timer.
   *
   * @see -- type {@linkcode SyncTimeAction_F}
   */
  pauseTimer: SyncTimeAction_F<Ct>;
  /**
   * Helper function to resume a timer.
   *
   * @see -- type {@linkcode SyncTimeAction_F}
   */
  resumeTimer: SyncTimeAction_F<Ct>;
  /**
   * Helper function to stop a timer.
   *
   * @see -- type {@linkcode SyncTimeAction_F}
   */
  stopTimer: SyncTimeAction_F<Ct>;
};

/**
 * Parameters type signature for providing options to a synchronous machine.
 *
 * @template `E` - Event object type.
 * @template `Pc` - Private context type.
 *
 * @template `T` - State tag string type.
 * @template `Mo` - Simple machine options type.
 * @template `L` - Legacy options type.
 */
export type SyncAddOptionsParam_F<
  Ct extends Contract = Contract,
  Mo = SimpleMachineOptions2,
  L = SimpleMachineOptions2,
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = (
  option: SyncAddons<Ct> & ResolveUtilities<PluginAddons<Ps>, 'sync'>,
  /**
   * Access to previously defined options from previous addOptions or provideOptions calls.
   * Provides actions, guards, emitters, machines, promises, and delays.
   */
  legacyOptions: { _legacy: L },
) => Mo;

/**
 * Function type signature for adding options to a synchronous machine
 * configuration.
 *
 * Every option type is derived from the contract: events, contexts and tags are
 * read through the contract helpers instead of being passed separately.
 *
 * @template | {@linkcode Contract} `Ct` - Contract describing the machine.
 * @template `L` - Existing options type.
 */
export type SyncAddOptions_F<
  Ct extends Contract = Contract,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = <const T extends ContractOptions<Ct>>(
  option: SyncAddOptionsParam_F<Ct, T, L, Ps>,
) => ContractOptions<Ct>;

/**
 * Function type signature for providing options to a synchronous machine class
 * {@linkcode SyncMachine}.
 *
 * The machine stays parameterized by the same contract, so the returned
 * instance exposes the contract options surface.
 *
 * @template | {@linkcode Contract} `Ct` - Contract describing the machine.
 * @template `L` - Existing options type.
 */
export type SyncProvideOptions_F<
  Ct extends Contract = Contract,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = <const T extends ContractOptions<Ct>>(
  option: SyncAddOptionsParam_F<Ct, T, L, Ps>,
) => SyncMachine<Ct, L & T, Ps>;
