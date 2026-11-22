import type { SyncAction2 } from '#actions';
import type { AnyInterpreter } from '#common/interpreter';
import type { SimpleMachineOptions2 } from '#common/machine';
import type { GuardConfig, SyncPredicateS2, SyncPredicateS3 } from '#guards';
import type { AlwaysConfig, TransitionConfig } from '#transitions';
import type {
  Contract,
  ContractEvents,
  ContractOptions,
  OptionsPlugin,
} from '@bemedev/app-options';
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

 * @param action - Action configuration type {@linkcode SyncAction2}.
 */
export type SyncPerformAction_F<Ct extends Contract = Contract> = (
  action: SyncAction2<Ct>,
) => void;

/**
 * Function type signature for building a synchronous predicate guard.
 *

 * @param predicate - Guard configuration type {@linkcode GuardConfig}.
 *
 * @returns Synchronous predicate guard type {@linkcode SyncPredicateS2}.
 */
export type SyncToPredicate_F<Ct extends Contract = Contract> = (
  predicate?: GuardConfig,
) => SyncPredicateS2<Ct>;

/**
 * Function type signature for evaluating a synchronous predicate guard.
 *

 * @param predicate - Synchronous predicate guard type {@linkcode SyncPredicateS3}.
 *
 * @returns Boolean result.
 */
export type SyncPerformPredicate_F<Ct extends Contract = Contract> = (
  predicate: SyncPredicateS3<Ct>,
) => boolean;

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
 * @template `E` - Event object type.
 * @param event - Event instance of type `E`.
 *
 * @returns Synchronous state node configuration type {@linkcode SyncNodeConfig} or `undefined`.
 */
export type _SyncSend_F<Ct extends Contract = Contract> = (
  event: ContractEvents<Ct>,
) => SyncNodeConfig | undefined;

/**
 * Function type signature for providing machine options to a synchronous
 * interpreter class {@linkcode SyncInterpreter}.
 *
 * The interpreter stays parameterized by the same contract, so the returned
 * instance exposes the contract options surface.
 *
 * @template | {@linkcode Contract} `Ct` - Contract describing the machine.
 * @template `L` - Existing options type.
 */
export type SyncProvideMachineOptions_F<
  Ct extends Contract = Contract,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = <const T extends ContractOptions<Ct>>(
  option: SyncAddOptionsParam_F<Ct, T, L, Ps>,
) => SyncInterpreter<Ct, L & T, Ps>;
