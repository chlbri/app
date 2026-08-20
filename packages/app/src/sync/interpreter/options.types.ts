import type { SyncAction2 } from '#actions';
import type { AnyInterpreter } from '#common/interpreter';
import type { CommonConfig3, SimpleMachineOptions2 } from '#common/machine';
import type { SyncDelayFunction3 } from '#delays';
import type { ActorsConfigMap, EventObject, EventsMap } from '#events';
import type { GuardConfig, SyncPredicateS2, SyncPredicateS3 } from '#guards';
import type { AlwaysConfig, TransitionConfig } from '#transitions';
import type { PrimitiveObject } from '@bemedev/typings';
import type { EmptyObject } from '~types';
import type { SyncAddOptionsParam_F } from '../machine/options.types';
import type { SyncNodeConfig } from '../types.types';
import type { SyncInterpreter } from './interpreter';

/**
 * Structure representing a collected running service instance.
 */
export type SyncCollectedService = {
  /**
   * Origin state identifier string.
   */
  from: string;
  /**
   * Running service instance of type {@linkcode AnyInterpreter}.
   */
  service: AnyInterpreter;
  /**
   * Unique service string identifier.
   */
  id: string;
};

/**
 * Function type signature for performing a synchronous action.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @param action - Action configuration type {@linkcode SyncAction2}.
 */
export type SyncPerformAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (action: SyncAction2<E, Pc, Tc, T>) => void;

/**
 * Function type signature for building a synchronous predicate guard.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @param predicate - Guard configuration type {@linkcode GuardConfig}.
 *
 * @returns Synchronous predicate guard type {@linkcode SyncPredicateS2}.
 */
export type SyncToPredicate_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (predicate?: GuardConfig) => SyncPredicateS2<E, Pc, Tc, T>;

/**
 * Function type signature for evaluating a synchronous predicate guard.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @param predicate - Synchronous predicate guard type {@linkcode SyncPredicateS3}.
 *
 * @returns Boolean result.
 */
export type SyncPerformPredicate_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (predicate: SyncPredicateS3<E, Pc, Tc, T>) => boolean;

/**
 * Function type signature for evaluating a synchronous transition.
 *
 * @param transition - Transition configuration type {@linkcode TransitionConfig}.
 *
 * @returns Target state string or `false`.
 */
export type SyncPerformTransition_F = (
  transition: TransitionConfig,
) => string | false;

/**
 * Function type signature for evaluating multiple candidate synchronous transitions.
 *
 * @param transitions - Variadic transition configurations type {@linkcode TransitionConfig}.
 *
 * @returns Target state string or `false`.
 */
export type SyncPerformTransitions_F = (
  ...transitions: TransitionConfig[]
) => string | false;

/**
 * Function type signature for performing an always transition synchronously.
 *
 * @param always - Always transition configuration type {@linkcode AlwaysConfig}.
 *
 * @returns Target state string or `false`.
 */
export type SyncPerformAlway_F = (always: AlwaysConfig) => string | false;

/**
 * Internal synchronous event dispatcher function type.
 *
 * @template E - Event object type.
 * @param event - Event instance of type `E`.
 *
 * @returns Synchronous state node configuration type {@linkcode SyncNodeConfig} or `undefined`.
 */
export type _SyncSend_F<E extends EventObject> = (
  event: E,
) => SyncNodeConfig | undefined;

/**
 * Function type signature for evaluating a synchronous delay value.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @param delay - Synchronous delay function type {@linkcode SyncDelayFunction3}.
 *
 * @returns Delay duration in milliseconds.
 */
export type SyncPerformDelay_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (delay: SyncDelayFunction3<E, Pc, Tc, T>) => number;

/**
 * Function type signature for providing machine options to a synchronous interpreter class {@linkcode SyncInterpreter}.
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
 * @returns Updated class {@linkcode SyncInterpreter} instance.
 */
export type SyncProvideMachineOptions_F<
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
) => SyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L & T>;
