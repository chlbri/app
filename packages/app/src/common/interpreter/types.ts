import type { ActionResult, WithDescriber } from '#actions';
import type { DelayFunction3 } from '#delays';
import type { Pausable } from '#emitters';
import type { ActorsConfigMap, EventObject, EventsMap } from '#events';
import type { GuardConfig } from '#guards';
import type {
  ActivityConfig,
  ActivityMap,
  StateValue,
  WorkingStatus,
} from '#states';
import type { NotUndefined, Primitive } from '@bemedev/app-options/bemedev';
import type {
  Contract,
  ContractContext,
  ContractPContext,
} from '@bemedev/app-options';
import type { Decompose } from '@bemedev/app-options/decompose';
import type { Interval3, IntervalParams } from '@bemedev/interval3';
import type { Equals, PrimitiveObject } from '@bemedev/typings';
import type { Fn, FnMap, FnMapR, KeyU, OptionalDefinition } from '~types';
import type { SimpleMachineOptions2 } from '../machine';
import type { AnyMachine, MachineType } from '../machine/types';
import type { Subscriber, SubscriberOptions } from '../subscriber';

export type { ExtendedActionsParams, SendToEvent } from '@bemedev/app-options';

/**
 * Execution mode of state machine interpreter.
 */
export type Mode = 'normal' | 'strict';

/**
 * Optional definitions for context and private context setup.
 *
 * @template `P` - Private context.
 * @template `C` - Internal context.
 */
export type OptionalDefinitions<P, C> = OptionalDefinition<P, 'pContext'> &
  OptionalDefinition<C, 'context'>;

/**
 * Function signature for adding subscriber instance to interpreter.
 *
 * Every subscriber type is derived from the contract.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the observed machine.
 */
export type AddSubscriber_F<Ct extends Contract = Contract> = (
  subscriber: FnMapR<Ct, void>,
  options?: SubscriberOptions<Ct>,
) => Subscriber<Ct>;

/**
 * Generic interface for an interpreter instance.
 */
export type AnyInterpreter = {
  /**
   * Current execution mode of type {@linkcode Mode}.
   */
  mode: Mode;
  /**
   * Array of event type strings supported by the machine.
   */
  eventsList: string[];
  /**
   * Events map exposed by the machine.
   */
  eventsMap: EventsMap;
  /**
   * Initial resolved state node.
   */
  initialNode: any;
  /**
   * Current resolved state node.
   */
  node: any;
  /**
   * Switches the execution mode to `'strict'`.
   */
  makeStrict: () => Mode;
  /**
   * Switches the execution mode to `'normal'`.
   */
  makeNormal: () => Mode;
  /**
   * Machine classification type of type {@linkcode MachineType}.
   */
  readonly TYPE: MachineType;
  /**
   * Checks whether all given event types can currently be performed.
   */
  canEvents: (...events: string[]) => boolean;

  /**
   * Current working status of type {@linkcode WorkingStatus}.
   */
  status: WorkingStatus;
  /**
   * Initial node configuration of the machine.
   */
  initialConfig: any;
  /**
   * Initial state value of the machine.
   */
  initialValue: StateValue;
  /**
   * Active node configuration.
   */
  config: any;
  /**
   * Renewed interpreter instance sharing the same configuration.
   */
  renew: any;
  /**
   * Current state value of type {@linkcode StateValue}.
   */
  value: StateValue;
  /**
   * Current public context object.
   */
  context: any;
  /**
   * Starts the interpreter.
   */
  start: () => void;
  /**
   * Pauses the interpreter.
   */
  pause: () => void;
  /**
   * Resumes the interpreter from a paused state.
   */
  resume: () => void;
  /**
   * Stops the interpreter and releases its running resources.
   */
  stop: () => void;
  /**
   * Provides the initial private context to the machine.
   */
  _providePrivateContext: Fn;
  /**
   * Alias of {@linkcode AnyInterpreter._providePrivateContext}.
   */
  _ppC: Fn;
  /**
   * Provides the initial public context to the machine.
   */
  _provideContext: Fn;

  /**
   * Subscribes a listener to state changes.
   */
  subscribe: Fn;
  /**
   * Sends an event to the interpreter.
   */
  send: (event: any) => any;
  /**
   * Resolves an action describer into an executable action function.
   */
  toActionFn: (action: WithDescriber) => any;
  /**
   * Resolves a guard configuration into an executable predicate function.
   */
  toPredicateFn: (guard: GuardConfig) => any;
  /**
   * Resolves a delay key into a delay provider function.
   */
  toDelayFn: (delay: string) => any;
  /**
   * Resolves a child key into a child machine factory function.
   */
  toChildFn: (machine: string) => any;
  /**
   * Optional interpreter identifier.
   */
  id?: string;
  /**
   * Optional origin state path that spawned this interpreter.
   */
  from?: string;

  /**
   * Disposes the interpreter resources.
   */
  dispose: () => void;
};

/**
 * Structure holding collected pausable emitter metadata.
 */
export type CollectedPausable = { from: string; pausable: Pausable; id: string };

/**
 * Structure holding collected child interpreter service metadata.
 */
export type CommonCollectedService = {
  from: string;
  service: AnyInterpreter;
  id: string;
};

/**
 * Simple task scheduler interface.
 */
export type SimpleScheduler = {
  schedule: Fn<[() => void, boolean?], any>;
  stop: Fn<[], any>;
};

/**
 * Function signature for executing the activities of a state node.
 *
 * @param from - The origin state path string.
 * @param activity - The activities map, keyed by delay name.
 *
 * @returns The identifiers of the started activity intervals.
 */
export type ExecuteActivities_F = (
  from: string,
  activity: ActivityConfig,
) => string[];

/**
 * Function signature building the callback run on every pass of an activity.
 *
 * @param from - The origin state path string.
 * @param actions - The activity definitions to run on each pass.
 *
 * @returns The callback invoked by the interval.
 */
export type ExecuteActivity_F = (from: string, actions: ActivityMap[]) => () => any;

/**
 * Function signature for evaluating a delay function against the current state.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @param delay - Delay function type {@linkcode DelayFunction3}.
 *
 * @returns Delay duration in milliseconds.
 */
export type PerformDelay_F<Ct extends Contract = Contract> = (
  delay: DelayFunction3<Ct>,
) => number;

/**
 * Function signature for merging action execution result.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type DirectMerge_F<Ct extends Contract = Contract> = Fn<
  [result?: ActionResult<Ct>],
  void
>;

/**
 * Function signature for creating a timer instance.
 *
 * The returned instance is a type {@linkcode Interval3}, whose `interval` member
 * is recomputed on every pass.
 *
 * @param config - Interval parameters of type {@linkcode IntervalParams}.
 *
 * @returns A new interval instance of type {@linkcode Interval3}.
 */
export type CreateInterval2_F = (config: IntervalParams) => Interval3;

/**
 * Difference calculation output structure for next state transition.
 */
export type DiffNext = {
  sv: StateValue;
  diffEntries: WithDescriber[];
  diffExits: WithDescriber[];
};

/**
 * Getting config from a machine.
 *
 * @template `T` - Type of machine pre-config.
 */
export type ConfigFrom<T extends KeyU<'config'>> = T['config'];

/**
 * Getting private context from a machine.
 *
 * @template `T` - Type of machine events map.
 */
export type PrivateContextFrom<T extends KeyU<'pContext'>> = T['pContext'];

/**
 * Getting context from a machine.
 *
 * @template `T` - Type of machine context.
 *
 * @see -- type {@linkcode PrimitiveObject}
 */
export type ContextFrom<T extends KeyU<'context'>> = Extract<
  T['context'],
  PrimitiveObject
>;

/**
 * Getting events map from a machine.
 *
 * @template `T` - Type of machine events map.
 *
 * @see -- type {@linkcode EventsMap}
 */
export type EventsMapFrom<T extends KeyU<'eventsMap'>> = Extract<
  T['eventsMap'],
  EventsMap
>;

/**
 * Getting state from a machine.
 *
 * @template `T` - Type of machine state.
 */
export type StateFrom<T extends KeyU<'__state'>> = T['__state'];

/**
 * Getting decomposed state from a machine.
 *
 * @template `T` - Type of machine decomposed state.
 */
export type DecomposedStateFrom<T extends KeyU<'__decomposedState'>> =
  T['__decomposedState'];

/**
 * Getting function map from a machine.
 *
 * @template `T` - Target machine type.
 * @template `R` - Return value type.
 * @template `Ex` - Exception string type.
 */
export type FnMapFrom<
  T extends KeyU<'__contract'>,
  R = any,
  Ex extends string = never,
> = FnMap<Extract<T['__contract'], Contract>, R, Ex>;

/**
 * Getting extended state from a machine.
 *
 * @template `T` - Type of machine extended state.
 */
export type StateExtendedFrom<T extends KeyU<'__stateExtended'>> =
  T['__stateExtended'];

/**
 * Getting stateP from a machine.
 *
 * @template `T` - Type of machine stateP.
 */
export type StatePFrom<T extends KeyU<'__stateP'>> = T['__stateP'];

/**
 * Getting statePextended from a machine.
 *
 * @template `T` - Type of machine statePextended.
 */
export type StatePextendedFrom<T extends KeyU<'__statePextended'>> =
  T['__statePextended'];

/**
 * Getting promisees map from a machine.
 *
 * @template `T` - Type of machine promisees map.
 *
 * @see -- type {@linkcode ActorsConfigMap}
 */
export type ActorsMapFrom<T extends KeyU<'actorsMap'>> = Extract<
  T['actorsMap'],
  ActorsConfigMap
>;

/**
 * Getting tag from a machine.
 *
 * @template `T` - Target machine type.
 */
export type TagFrom<T extends KeyU<'__tag'>> = T['__tag'];

/**
 * Getting all paths from a machine.
 *
 * @template `T` - Target machine type.
 */
export type AllPathsFrom<T extends KeyU<'__allPaths'>> = T['__allPaths'];

/**
 * Getting all events from a machine.
 *
 * @template `T` - Type of machine events.
 */
export type EventsFrom<T extends KeyU<'__events'>> = Extract<
  T['__events'],
  EventObject
>;

/**
 * Get all actions map from a machine.
 *
 * @template `T` - Type of machine actions.
 *
 * @see -- type {@linkcode NotUndefined}
 */
export type ActionsMapFrom<T extends KeyU<'actions'>> = NotUndefined<T['actions']>;

/**
 * Getting options added to machine.
 *
 * @template `T` - Target machine type.
 */
export type AddOptionsFrom<T extends KeyU<'addOptions'>> = NotUndefined<
  T['addOptions']
>;

/**
 * Get the action function from a machine.
 *
 * @template `T` - Type of machine action function.
 *
 * @see -- type {@linkcode NotUndefined}
 */
export type ActionFnFrom<T extends KeyU<'__actionFn'>> = NotUndefined<
  T['__actionFn']
>;

/**
 * Get the action function parameters from a machine.
 *
 * @template `T` - Type of machine action parameters.
 *
 * @see -- type {@linkcode NotUndefined}
 */
export type ActionParamsFrom<T extends KeyU<'__actionParams'>> = NotUndefined<
  T['__actionParams']
>;

/**
 * Get the action keys from a machine.
 *
 * @template `T` - Type of machine actions.
 */
export type ActionKeysFrom<T extends KeyU<'__actionKey'>> = T['__actionKey'];

/**
 * Get all guards map from a machine.
 *
 * @template `T` - Type of machine guards map.
 *
 * @see -- type {@linkcode NotUndefined}
 */
export type PredicatesMapFrom<T extends KeyU<'guards'>> = NotUndefined<T['guards']>;

/**
 * Get the predicate function from a machine.
 *
 * @template `T` - Type of machine predicate function.
 *
 * @see -- type {@linkcode NotUndefined}
 */
export type PredicateSFrom<T extends KeyU<'__predicate'>> = NotUndefined<
  T['__predicate']
>;

/**
 * Get the guard keys from a machine.
 *
 * @template `T` - Type of machine guards map.
 *
 * @see -- type {@linkcode NotUndefined}
 */
export type GuardKeysFrom<T extends KeyU<'__guardKey'>> = T['__guardKey'];

/**
 * Get all delays map from a machine.
 *
 * @template `T` - Type of machine delays map.
 *
 * @see -- type {@linkcode NotUndefined}
 */
export type DelaysMapFrom<T extends KeyU<'delays'>> = NotUndefined<T['delays']>;

/**
 * Get the delay keys from a machine.
 *
 * @template `T` - Type of machine delays map.
 *
 * @see -- type {@linkcode NotUndefined}
 */
export type DelayKeysFrom<T extends KeyU<'__delayKey'>> = T['__delayKey'];

/**
 * Get the delay function from a machine.
 *
 * @template `T` - Type of machine delay function.
 *
 * @see -- type {@linkcode NotUndefined}
 */
export type DelayFnFrom<T extends KeyU<'__delay'>> = NotUndefined<T['__delay']>;

/**
 * Get the machines map from a machine.
 *
 * @template `T` - Type of machine machines map.
 *
 * @see -- type {@linkcode NotUndefined}
 */
export type MachinesMapFrom<T extends KeyU<'machines'>> = NotUndefined<
  T['machines']
>;

/**
 * Get the children keys from a machine.
 *
 * @template `T` - Type of machine child keys.
 */
export type ChildrenKeysFrom<T extends KeyU<'__childKey'>> = T['__childKey'];

/**
 * Getting the options from a machine.
 *
 * @template `T` - Type of machine options.
 *
 * @see -- type {@linkcode SimpleMachineOptions2}
 */
export type MachineOptionsFrom<T extends KeyU<'options'>> = Extract<
  T['options'],
  SimpleMachineOptions2
>;

/**
 * Object structure storing private and internal contexts.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type Contexts<Ct extends Contract = Contract> = {
  pContext?: ContractPContext<Ct>;
  context?: ContractContext<Ct>;
};

/**
 * Alias of type {@linkcode MachineOptionsFrom}.
 *
 * @template `T` - Type of machine options.
 */
export type MoF<T extends KeyU<'options'>> = MachineOptionsFrom<T>;

/**
 * State selector function type signature.
 *
 * @template `T` - State shape.
 */
export type Selector_F<T = any> = 0 extends 1 & T
  ? (key: string) => any
  : T extends Primitive
    ? undefined
    : <
        D extends Omit<
          Decompose<T, { start: false; object: 'both' }>,
          `${string}.[${number}]${string}`
        >,
        K extends Extract<keyof D, string>,
        R = D[K],
      >(
        selector: K,
      ) => R;

/**
 * Options for configuring an interpreter.
 *
 * @template | {@linkcode AnyMachine} `M` - Machine type.
 * @template `P` - Private context.
 * @template `C` - Internal context.
 *
 * @see {@linkcode InterpreterOptions.exact}
 */
export type InterpreterOptions<
  M extends AnyMachine,
  P extends PrivateContextFrom<M> = PrivateContextFrom<M>,
  C extends ContextFrom<M> = ContextFrom<M>,
> = {
  /** Execution mode of type {@linkcode Mode}, `'strict'` by default. */
  mode?: Mode;
  /**
   * @deprecated Interval timing is no longer configurable: the interval engine
   * always recomputes the delay on every pass. The flag is still accepted for
   * backward compatibility and ignored.
   */
  exact?: boolean;
} & OptionalDefinitions<P, C>;

/**
 * Arguments tuple passed to interpret function.
 *
 * @template | {@linkcode AnyMachine} `M` - Machine type.
 */
export type InterpretArgs<M extends AnyMachine> =
  Equals<InterpreterOptions<M>, Partial<InterpreterOptions<M>>> extends true
    ? [machine: M, config?: InterpreterOptions<M>]
    : [machine: M, config: InterpreterOptions<M>];
