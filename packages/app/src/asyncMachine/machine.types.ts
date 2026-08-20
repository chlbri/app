import type { AsyncAction2 } from '#actions';

import type { AsyncPredicateS, DefinedValue } from '#guards';
import type { Decompose } from '@bemedev/decompose';

import type { EventsMapFrom } from '#common/interpreter';
import type {
  AnyMachine,
  CommonConfig3,
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
import type { Ru, SubTypeLow } from '@bemedev/app-utils-bemedev';
import type { PrimitiveObject } from '@bemedev/typings';
import type {
  EmptyObject,
  FnMap,
  FnMapFilterArray,
  FnMapFilterObject,
  FnR,
  SingleOrArrayL2,
  TraversableTuple,
  ValuesOf,
} from '~types';
import type { AsyncMachine } from './machine';
/**
 * Options for async action helpers.
 *
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
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
 * Error handler function signature for async options.
 *
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
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
 * @template T - Source object type.
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
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
 * @template | {@linkcode Decompose} `D` - Decomposed context paths object type.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncAssignAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  D = Decompose<
    { pContext: Pc; context: Tc },
    { object: 'both'; start: false; sep: '.' }
  >,
> = <
  const K extends SingleOrArrayL2<keyof D>,
  const F extends TraversableTupleAsync<D, K> = TraversableTupleAsync<
    D,
    K
  >,
>(
  keys: K,
  fn: FnMap<E, Pc, Tc, T, F>,
  ...args: F extends Promise<any> ? [AsyncOptions<E, Pc, Tc, T>] : []
) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for resending an event as an async action.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
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
 * Function type signature for creating an activity or timer control action.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
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
 * Function type signature for creating a void async action helper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncVoidAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <F extends void | Promise<void> = void | Promise<void>>(
  fn: FnMap<E, Pc, Tc, T, F>,
  ...args: F extends Promise<void> ? [AsyncOptions<E, Pc, Tc, T>] : []
) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for creating an array/object filter action helper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncFilterAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <
  D = Decompose<
    { pContext: Pc; context: Tc },
    { object: 'both'; start: false; sep: '.' }
  >,
  K extends keyof D & string = keyof D & string,
>(
  key: K,
  fn: D[K] extends Array<infer Item>
    ? FnMapFilterArray<E, Pc, Tc, T, Item>
    : D[K] extends Ru
      ? FnMapFilterObject<E, Pc, Tc, T, ValuesOf<D[K]>>
      : never,
) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for creating an erase property action helper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncEraseAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <
  D extends object = Decompose<
    { pContext: Pc; context: Tc },
    { object: 'both'; start: false; sep: '.' }
  >,
  DD = 0 extends 1 & Tc ? Record<string, any> : SubTypeLow<D, undefined>,
  K extends keyof DD & string = keyof DD & string,
>(
  key: K,
) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for sending an event to an actor machine asynchronously.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
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
  ...args: F extends Promise<{
    to: string;
    event: EventArg<EventsMapFrom<M>>;
  }>
    ? [AsyncOptions<E, Pc, Tc, T>]
    : []
) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for creating a value checker guard helper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
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
> = (
  path: DefinedValue<Pc, Tc>,
  ...values: any[]
) => FnR<E, Pc, Tc, T, boolean>;

/**
 * Function type signature for creating a property definition guard helper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
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
 * Function type signature for creating a debounced action helper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
 * @param fn - Async action of type {@linkcode AsyncAction2}.
 * @param options - Configuration options object.
 * @param options.ms - Optional debounce delay in milliseconds.
 * @param options.id - String identifier for the debounced action.
 *
 * @returns Async action of type {@linkcode AsyncAction2}.
 */
export type AsyncDebounceAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <A extends AsyncAction2<E, Pc, Tc, T>>(
  fn: A,
  options: { ms?: number; id: string },
) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for batching multiple actions into a single async action.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
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
 * Logical AND guard structure for async guard batching options.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
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
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
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
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
 */
export type AsyncGuardUnionOption<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> =
  | AsyncPredicateS<E, Pc, Tc, T>
  | AsyncGuardAndOption<E, Pc, Tc, T>
  | AsyncGuardOrOption<E, Pc, Tc, T>;

/**
 * Function type signature for batching multiple guards into a single async guard.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
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
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
 */
export type AsyncAddOption<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  /**
   * Guard helper to check if a property is defined.
   */
  isDefined: AsyncDefineGuard_F<E, Pc, Tc, T>;
  /**
   * Guard helper to check if a property is not defined.
   */
  isNotDefined: AsyncDefineGuard_F<E, Pc, Tc, T>;
  /**
   * Guard helper to check if a property equals specific value(s).
   */
  isValue: AsyncValueCheckerGuard_F<E, Pc, Tc, T>;
  /**
   * Guard helper to check if a property does not equal specific value(s).
   */
  isNotValue: AsyncValueCheckerGuard_F<E, Pc, Tc, T>;
  /**
   * Helper function to batch multiple guards into a single async guard.
   */
  guardBatch: AsyncBatchGuard_F<E, Pc, Tc, T>;
  /**
   * Swap helper function of type {@linkcode SwapFunction_F}.
   */
  swap: SwapFunction_F<E, Pc, Tc, T>;
  /**
   * Helper function to assign context variables asynchronously.
   */
  assign: AsyncAssignAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to batch multiple actions.
   */
  batch: AsyncBatchAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to filter array or object properties asynchronously.
   */
  filter: AsyncFilterAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to erase object properties asynchronously.
   */
  erase: AsyncEraseAction_F<E, Pc, Tc, T>;
  /**
   * Helper function for void actions.
   */
  voidAction: AsyncVoidAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to send events to actor machines asynchronously.
   */
  sendTo: AsyncSendAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to debounce an async action.
   */
  debounce: AsyncDebounceAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to resend an event as an async action.
   */
  resend: AsyncResendAction_F<E, Pc, Tc, T>;
  /**
   * Force send action, performs the action regardless of the current state.
   */
  forceSend: AsyncResendAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to pause an activity.
   */
  pauseActivity: AsyncTimeAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to resume an activity.
   */
  resumeActivity: AsyncTimeAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to stop an activity.
   */
  stopActivity: AsyncTimeAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to pause a timer.
   */
  pauseTimer: AsyncTimeAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to resume a timer.
   */
  resumeTimer: AsyncTimeAction_F<E, Pc, Tc, T>;
  /**
   * Helper function to stop a timer.
   */
  stopTimer: AsyncTimeAction_F<E, Pc, Tc, T>;
};

/**
 * Parameters type signature for providing options to an async machine.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template T - State tag string type.
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
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template Ta - State tag string type.
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
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template | {@linkcode EventsMap} `E` - Events map type.
 * @template | {@linkcode ActorsConfigMap} `A` - Actors config map type.
 * @template Ta - State tag string type.
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 * @template AllPaths - All path strings type.
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
