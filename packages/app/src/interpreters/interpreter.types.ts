import type { AsyncAction2, MaybeAsyncActionResult } from '#actions';
import type { InterpretArgs } from '#common/interpreter';
import type { AnyMachine, SimpleMachineOptions2 } from '#common/machine';
import type { AsyncPredicateS3 } from '#guards';
import type { NodeConfig2 } from '#states';
import type {
  AlwaysConfig,
  DelayedTransitions,
  TransitionConfig,
} from '#transitions';
import type {
  Contract,
  ContractEvents,
  ContractOptions,
  OptionsPlugin,
} from '@bemedev/app-options';
import type { EmptyObject, MaybePromise } from '~types';
import type { AsyncAddOptionsParam_F } from '../asyncMachine';
import { type AsyncInterpreter, type AsyncInterpreterFrom } from './interpreter';

/**
 * Factory function signature for instantiating an async interpreter class {@linkcode AsyncInterpreterFrom}.
 *
 * @template `M` - Machine type extending interface {@linkcode AnyMachine}.
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

 * @param action - Async action type {@linkcode AsyncAction2}.
 *
 * @returns Result type {@linkcode MaybeAsyncActionResult}.
 */
export type AsyncPerformActionLater_F<Ct extends Contract = Contract> = (
  action: AsyncAction2<Ct>,
) => MaybeAsyncActionResult<Ct>;

/**
 * Function type signature for performing an async action immediately.
 *

 * @param from - Origin state identifier string or `false`.
 * @param action - Async action type {@linkcode AsyncAction2}.
 *
 * @returns Promise resolving to `void`.
 */
export type AsyncPerformAction_F<Ct extends Contract = Contract> = (
  from: string | false,
  action: AsyncAction2<Ct>,
) => Promise<void>;

/**
 * Function type signature for evaluating an async predicate guard.
 *

 * @param predicate - Async predicate guard type {@linkcode AsyncPredicateS3}.
 *
 * @returns Promise or boolean result.
 */
export type AsyncPerformPredicate_F<Ct extends Contract = Contract> = (
  predicate: AsyncPredicateS3<Ct>,
) => MaybePromise<boolean>;

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
 * @template `E` - Event object type.
 * @param event - Event instance of type `E`.
 *
 * @returns Promise resolving to state node configuration type {@linkcode NodeConfig2} or `undefined`.
 */
export type _AsyncSend_F<Ct extends Contract = Contract> = (
  event: ContractEvents<Ct>,
) => Promise<NodeConfig2 | undefined>;

/**
 * Function type signature for providing machine options to an async interpreter
 * class {@linkcode AsyncInterpreter}.Ø
 *
 * The interpreter stays parameterized by the same contract, so the returned
 * instance exposes the contract options surface.
 *
 * @template | {@linkcode Contract} `Ct` - Contract describing the machine.
 * @template `L` - Existing options type.
 */
export type AsyncProvideMachineOptions_F<
  Ct extends Contract = Contract,
  L extends SimpleMachineOptions2 = EmptyObject,
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = <const T extends ContractOptions<Ct>>(
  option: AsyncAddOptionsParam_F<Ct, T, L, Ps>,
) => AsyncInterpreter<Ct, L & T, Ps>;
