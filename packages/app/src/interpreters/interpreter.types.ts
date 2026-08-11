import type { AsyncAction2, MaybeAsyncActionResult } from '#actions';
import type { InterpretArgs } from '#common/interpreter';
import type {
  AnyMachine,
  CommonConfig3,
  SimpleMachineOptions2,
} from '#common/machine';
import type { AsyncDelayFunction3 } from '#delays';
import type { ActorsConfigMap, EventObject, EventsMap } from '#events';
import type { AsyncPredicateS3 } from '#guards';
import type { AsyncAddOptionsParam_F } from '../asyncMachine';
import type { NodeConfig2 } from '#states';
import type {
  AlwaysConfig,
  DelayedTransitions,
  TransitionConfig,
} from '#transitions';
import type { PrimitiveObject } from '@bemedev/typings';
import type { EmptyObject, MaybePromise } from '~types';
import {
  type AsyncInterpreter,
  type AsyncInterpreterFrom,
} from './interpreter';

/**
 * Factory function signature for instantiating an async interpreter class {@linkcode AsyncInterpreterFrom}.
 *
 * @template M - Machine type extending interface {@linkcode AnyMachine}.
 * @param args - Interpreter initialization arguments.
 *
 * @returns Instance of class {@linkcode AsyncInterpreterFrom}.
 */
export type AsyncInterpreter_F = <M extends AnyMachine>(
  ...args: InterpretArgs<M>
) => AsyncInterpreterFrom<M>;

/**
 * Function type signature for performing an action later asynchronously.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @param action - Async action type {@linkcode AsyncAction2}.
 *
 * @returns Result type {@linkcode MaybeAsyncActionResult}.
 */
export type AsyncPerformActionLater_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (action: AsyncAction2<E, Pc, Tc, T>) => MaybeAsyncActionResult<Pc, Tc>;

/**
 * Function type signature for performing an async action immediately.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @param from - Origin state identifier string or `false`.
 * @param action - Async action type {@linkcode AsyncAction2}.
 *
 * @returns Promise resolving to `void`.
 */
export type AsyncPerformAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (
  from: string | false,
  action: AsyncAction2<E, Pc, Tc, T>,
) => Promise<void>;

/**
 * Function type signature for evaluating an async predicate guard.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @param predicate - Async predicate guard type {@linkcode AsyncPredicateS3}.
 *
 * @returns Promise or boolean result.
 */
export type AsyncPerformPredicate_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (predicate: AsyncPredicateS3<E, Pc, Tc, T>) => MaybePromise<boolean>;

/**
 * Function type signature for evaluating an async delay value.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @param delay - Async delay function type {@linkcode AsyncDelayFunction3}.
 *
 * @returns Delay duration in milliseconds.
 */
export type AsyncPerformDelay_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (delay: AsyncDelayFunction3<E, Pc, Tc, T>) => number;

/**
 * Function type signature for performing an after delay transition asynchronously.
 *
 * @param from - Origin state identifier string.
 * @param after - Delayed transitions configuration type {@linkcode DelayedTransitions}.
 *
 * @returns Promise returning target state string or `false`.
 */
export type AsyncPerformAfter_F = (
  from: string,
  after: DelayedTransitions,
) => (() => Promise<string | false>) | undefined;

/**
 * Function type signature for performing an always transition asynchronously.
 *
 * @param from - Origin state identifier string.
 * @param always - Always transition configuration type {@linkcode AlwaysConfig}.
 *
 * @returns Promise resolving to target state string or `false`.
 */
export type AsyncPerformAlway_F = (
  from: string,
  always: AlwaysConfig,
) => Promise<string | false>;

/**
 * Collected async transition handlers structure.
 */
export type AsyncCollected0 = {
  /**
   * After transition handler callback.
   */
  after?: (() => Promise<string | false>) | undefined;
  /**
   * Always transition handler callback.
   */
  always?: () => Promise<string | false>;
};

/**
 * Function type signature for evaluating a single transition asynchronously.
 *
 * @param from - Origin state string or `false`.
 * @param transition - Transition configuration type {@linkcode TransitionConfig}.
 *
 * @returns Promise resolving to target state string or `false`.
 */
export type AsyncPerformTransition_F = (
  from: string | false,
  transition: TransitionConfig,
) => Promise<string | false>;

/**
 * Function type signature for evaluating multiple candidate transitions asynchronously.
 *
 * @param from - Origin state string or `false`.
 * @param transitions - Variadic transition configurations type {@linkcode TransitionConfig}.
 *
 * @returns Promise resolving to target state string or `false`.
 */
export type AsyncPerformTransitions_F = (
  from: string | false,
  ...transitions: TransitionConfig[]
) => Promise<string | false>;

/**
 * Internal async event dispatcher function type.
 *
 * @template E - Event object type.
 * @param event - Event instance of type `E`.
 *
 * @returns Promise resolving to state node configuration type {@linkcode NodeConfig2} or `undefined`.
 */
export type _AsyncSend_F<E extends EventObject> = (
  event: E,
) => Promise<NodeConfig2 | undefined>;

/**
 * Function type signature for providing machine options to an async interpreter class {@linkcode AsyncInterpreter}.
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
 * @param option - Machine options param.
 *
 * @returns Updated class {@linkcode AsyncInterpreter} instance.
 */
export type AsyncProvideMachineOptions_F<
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
) => AsyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L & T>;
