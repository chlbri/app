import type { SyncAction2 } from '#actions';
import type { EventsMapFrom } from '#common/interpreter';
import type { SyncDelayFunction2 } from '#delays';
import type { SyncEmitterFunction, SyncEmittersMap } from '#emitters';
import type {
  ActorsConfigMap,
  EventArg,
  EventArgAll,
  EventObject,
  EventsMap,
} from '#events';
import type {
  DefinedValue,
  SyncPredicateS,
  SyncPredicateS2,
} from '#guards';
import type { Ru, SubTypeLow } from '@bemedev/app-utils-bemedev';

import type {
  AnyMachine,
  CommonConfig3,
  SimpleMachineOptions2,
  SwapFunction_F,
} from '#common/machine';
import type { RegisterOptions } from '#registry';
import type { PrimitiveObject } from '@bemedev/typings';
import type {
  Decompose,
  EmptyObject,
  FnMap,
  FnMapFilterArray,
  FnMapFilterObject,
  FnR,
  RecordS,
  SingleOrArrayL2,
  TraversableTuple,
  ValuesOf,
} from '~types';
import type { SyncMachine } from './machine';

/**
 * Function type signature for creating a synchronous filter action helper.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncFilterAction_F<
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
) => SyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for creating a synchronous erase action helper.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncEraseAction_F<
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
) => SyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for creating a synchronous property definition guard helper.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncDefineGuard_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (path: DefinedValue<Pc, Tc>) => FnR<E, Pc, Tc, T, boolean>;

/**
 * Function type signature for creating a synchronous value checker guard helper.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncValueCheckerGuard_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (
  path: DefinedValue<Pc, Tc>,
  ...values: any[]
) => FnR<E, Pc, Tc, T, boolean>;

/**
 * Synchronous traversable tuple type alias for type {@linkcode TraversableTuple}.
 *
 * @template T - Source object type.
 * @template K - Keys extending type {@linkcode SingleOrArrayL2} of `keyof T`.
 */
export type TraversableTupleSync<
  T,
  K extends SingleOrArrayL2<keyof T>,
> = TraversableTuple<T, K>;

/**
 * Function type signature for creating a synchronous assign action helper.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @template D - Decomposed context paths object.
 */
export type SyncAssignAction_F<
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
  const F extends TraversableTupleSync<D, K> = TraversableTupleSync<D, K>,
>(
  keys: K,
  fn: FnMap<E, Pc, Tc, T, F>,
) => SyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for batching multiple synchronous actions into a single action.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncBatchAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <A extends (SyncAction2<E, Pc, Tc, T> | undefined)[]>(
  ...fns: A
) => SyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for creating a void synchronous action helper.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncVoidAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (fn: FnMap<E, Pc, Tc, T, void>) => SyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for sending an event to an actor machine synchronously.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncSendAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <M extends AnyMachine>(
  _?: M,
) => <
  F extends { to: string; event: EventArg<EventsMapFrom<M>> } = {
    to: string;
    event: EventArg<EventsMapFrom<M>>;
  },
>(
  fn: FnMap<E, Pc, Tc, T, F>,
) => SyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for creating a debounced synchronous action helper.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncDebounceAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <A extends SyncAction2<E, Pc, Tc, T>>(
  fn: A,
  options: { ms?: number; id: string },
) => SyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for resending an event as a synchronous action.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @param event - Event argument.
 *
 * @returns Synchronous action type {@linkcode SyncAction2}.
 */
export type SyncResendAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (event: EventArgAll<E>) => SyncAction2<E, Pc, Tc, T>;

/**
 * Function type signature for creating a synchronous activity or timer control action.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @param id - Activity or timer string identifier.
 *
 * @returns Synchronous action type {@linkcode SyncAction2}.
 */
export type SyncTimeAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (id: string) => SyncAction2<E, Pc, Tc, T>;

/**
 * Union of all supported synchronous action factory function types.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncAllActions_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> =
  | SyncAssignAction_F<E, Pc, Tc, T>
  | SyncVoidAction_F<E, Pc, Tc, T>
  | SyncSendAction_F<E, Pc, Tc, T>
  | SyncResendAction_F<E, Pc, Tc, T>
  | SyncDebounceAction_F<E, Pc, Tc, T>
  | SyncTimeAction_F<E, Pc, Tc, T>
  | SyncBatchAction_F<E, Pc, Tc, T>
  | SyncEraseAction_F<E, Pc, Tc, T>
  | SyncFilterAction_F<E, Pc, Tc, T>;

/**
 * Logical AND guard structure for synchronous guard batching options.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncGuardAndOption<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { and: SyncGuardUnionOption<E, Pc, Tc, T>[] };

/**
 * Logical OR guard structure for synchronous guard batching options.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncGuardOrOption<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { or: SyncGuardUnionOption<E, Pc, Tc, T>[] };

/**
 * Union of synchronous guard items for batching.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncGuardUnionOption<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> =
  | SyncPredicateS<E, Pc, Tc, T>
  | SyncGuardAndOption<E, Pc, Tc, T>
  | SyncGuardOrOption<E, Pc, Tc, T>
  | undefined;

/**
 * Function type signature for batching multiple synchronous guards into a single guard.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @param guards - Variadic array of guard functions or logical guard objects.
 *
 * @returns Synchronous guard function of type {@linkcode FnR}.
 */
export type SyncBatchGuard_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (
  ...guards: SyncGuardUnionOption<E, Pc, Tc, T>[]
) => FnR<E, Pc, Tc, T, boolean>;

/**
 * Object containing all action, guard, timer, and activity helper functions for a synchronous machine.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncAddOption<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  isDefined: SyncDefineGuard_F<E, Pc, Tc, T>;
  isNotDefined: SyncDefineGuard_F<E, Pc, Tc, T>;
  isValue: SyncValueCheckerGuard_F<E, Pc, Tc, T>;
  isNotValue: SyncValueCheckerGuard_F<E, Pc, Tc, T>;
  guardBatch: SyncBatchGuard_F<E, Pc, Tc, T>;
  swap: SwapFunction_F<E, Pc, Tc, T>;
  assign: SyncAssignAction_F<E, Pc, Tc, T>;
  batch: SyncBatchAction_F<E, Pc, Tc, T>;
  filter: SyncFilterAction_F<E, Pc, Tc, T>;
  erase: SyncEraseAction_F<E, Pc, Tc, T>;
  voidAction: SyncVoidAction_F<E, Pc, Tc, T>;
  sendTo: SyncSendAction_F<E, Pc, Tc, T>;
  debounce: SyncDebounceAction_F<E, Pc, Tc, T>;
  resend: SyncResendAction_F<E, Pc, Tc, T>;
  /**
   * Force send action, performs the action regardless of the current state.
   */
  forceSend: SyncResendAction_F<E, Pc, Tc, T>;
  pauseActivity: SyncTimeAction_F<E, Pc, Tc, T>;
  resumeActivity: SyncTimeAction_F<E, Pc, Tc, T>;
  stopActivity: SyncTimeAction_F<E, Pc, Tc, T>;
  pauseTimer: SyncTimeAction_F<E, Pc, Tc, T>;
  resumeTimer: SyncTimeAction_F<E, Pc, Tc, T>;
  stopTimer: SyncTimeAction_F<E, Pc, Tc, T>;
  // merge: DirectMerge_F<Pc, Tc>;
  // emitter: Emitter<E, P, Pc, Tc>;
};

/**
 * Parameters type signature for providing options to a synchronous machine.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @template Mo - Simple machine options type.
 * @template L - Legacy options type.
 */
export type SyncAddOptionsParam_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = (
  option: SyncAddOption<E, Pc, Tc, T>,
  /**
   * Access to previously defined options from previous addOptions or provideOptions calls.
   * Provides actions, guards, emitters, machines, promises, and delays.
   */
  legacyOptions: { _legacy: L },
) => Mo;

/**
 * Function type signature for adding options to a synchronous machine configuration.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template Ta - State tag string type.
 * @template Mo - Simple machine options type.
 * @template L - Existing options type.
 */
export type SyncAddOptions_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Ta extends string = string,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = <const T extends Mo>(
  option: SyncAddOptionsParam_F<E, Pc, Tc, Ta, T, L>,
) => Mo;

/**
 * Function type signature for providing options to a synchronous machine class {@linkcode SyncMachine}.
 *
 * @template C - Common machine config type {@linkcode CommonConfig3}.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template E - Events map type.
 * @template A - Actors config map type.
 * @template Ta - State tag string type.
 * @template Eo - Event object type.
 * @template AllPaths - All path strings type.
 * @template Mo - Simple machine options type.
 * @template L - Existing options type.
 */
export type SyncProvideOptions_F<
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
  option: SyncAddOptionsParam_F<Eo, Pc, Tc, Ta, T, L>,
) => SyncMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L & T>;

/**
 * Helper type signature for defining a synchronous child machine function.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @template R - Result type with `eventsMap`.
 */
export type SyncChildFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnR<E, Pc, Tc, T, R>;

/**
 * Machine options for synchronous machines registered with type {@linkcode RegisterOptions}.
 *
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @template Eo - Event object type.
 * @template O - Register options type.
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
    children: Partial<
      Record<O['children'], SyncChildFunction2<Eo, Pc, Tc, T, any>>
    >;
    emitters: Partial<
      Record<O['emitters'], SyncEmitterFunction<Eo, Pc, Tc, T, any>>
    >;
  }>;
}>;

/**
 * Simple representation machine options
 *
 * @template : {@linkcode EventsMap} [E] - type of the events map
 * @template : {@linkcode ActorsConfigMap} [A] - type of the actors config map
 * @template Pc - type of the private context
 * @template : {@linkcode PrimitiveObject} [Tc] - type of the context
 *
 */
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
