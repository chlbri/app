import type { ActionResult, WithDescriber } from '#actions';
import type { Primitive } from '@bemedev/app-utils-bemedev';
import type { NOmit } from '@bemedev/app-utils-bemedev';
import type { NotUndefined } from '@bemedev/app-utils-bemedev';
import type { Pausable } from '#emitters';
import type {
  ActorsConfigMap,
  EventArgObject,
  EventObject,
  EventsMap,
} from '#events';
import type { GuardConfig } from '#guards';
import type { ActivityConfig, StateValue, WorkingStatus } from '#states';
import type { Decompose } from '@bemedev/decompose';
import type { Interval2 } from '@bemedev/interval2';
import type { Equals, PrimitiveObject } from '@bemedev/typings';
import type { Fn, FnMapR, KeyU, OptionalDefinition } from '~types';
import type { ScheduledData, SimpleMachineOptions2 } from '../machine';
import type { AnyMachine, MachineType } from '../machine/types';
import type { Subscriber, SubscriberOptions } from '../subscriber';
import type { IntervalParams } from '@bemedev/interval2/types';

/**
 * Execution mode of state machine interpreter.
 */
export type Mode = 'normal' | 'strict';

/**
 * Optional definitions for context and private context setup.
 *
 * @template P - Private context.
 * @template C - Internal context.
 */
export type OptionalDefinitions<P, C> = OptionalDefinition<P, 'pContext'> &
  OptionalDefinition<C, 'context'>;

/**
 * Function signature for adding subscriber instance to interpreter.
 *
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 * @template {EventObject} Eo - Event object type.
 */
export type AddSubscriber_F<
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
> = (
  subscriber: FnMapR<Eo, Tc, T, void>,
  options?: SubscriberOptions<Eo, Tc, T>,
) => Subscriber<Tc, T, Eo>;

/**
 * Generic interface for an interpreter instance.
 */
export type AnyInterpreter = {
  mode: Mode;
  eventsList: string[];
  eventsMap: EventsMap;
  initialNode: any;
  node: any;
  makeStrict: () => Mode;
  makeNormal: () => Mode;
  readonly TYPE: MachineType;
  canEvents: (...events: string[]) => boolean;

  status: WorkingStatus;
  initialConfig: any;
  initialValue: StateValue;
  config: any;
  renew: any;
  value: StateValue;
  context: any;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  _providePrivateContext: Fn;
  _ppC: Fn;
  _provideContext: Fn;

  subscribe: Fn;
  send: (event: any) => any;
  toActionFn: (action: WithDescriber) => any;
  toPredicateFn: (guard: GuardConfig) => any;
  toDelayFn: (delay: string) => any;
  toChildFn: (machine: string) => any;
  id?: string;
  from?: string;

  dispose: () => void;
};

/**
 * Structure holding collected pausable emitter metadata.
 */
export type CollectedPausable = {
  from: string;
  pausable: Pausable;
  id: string;
};

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
 * Function signature for executing activities.
 */
export type ExecuteActivities_F = (
  from: string,
  activity: ActivityConfig,
) => string[];

/**
 * Target-directed event envelope.
 *
 * @template T - Event type.
 */
export type SendToEvent<T = any> = { to: string; event: T };

/**
 * Function signature for merging action execution result.
 *
 * @template Pc - Private context.
 * @template {PrimitiveObject} Tc - Internal context type.
 */
export type DirectMerge_F<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = Fn<[result?: ActionResult<Pc, Tc>], void>;

/**
 * Function signature for creating timer instance.
 */
export type CreateInterval2_F = (
  config: NOmit<IntervalParams, 'exact'>,
) => Interval2;

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
 * @template {KeyU<'config'>} T - Type of machine pre-config.
 */
export type ConfigFrom<T extends KeyU<'config'>> = T['config'];

/**
 * Getting private context from a machine.
 *
 * @template {KeyU<'pContext'>} T - Type of machine events map.
 */
export type PrivateContextFrom<T extends KeyU<'pContext'>> = T['pContext'];

/**
 * Getting context from a machine.
 *
 * @template {KeyU<'context'>} T - Type of machine context.
 *
 * @see {@linkcode PrimitiveObject}
 */
export type ContextFrom<T extends KeyU<'context'>> = Extract<
  T['context'],
  PrimitiveObject
>;

/**
 * Getting events map from a machine.
 *
 * @template : {@linkcode KeyU}<'eventsMap'> [T] - type of the machine events map
 *
 * @see {@linkcode EventsMap} for the structure of the events map.
 */
/**
 * Getting events map from a machine.
 *
 * @template {KeyU<'eventsMap'>} T - Type of machine events map.
 *
 * @see {@linkcode EventsMap}
 */
export type EventsMapFrom<T extends KeyU<'eventsMap'>> = Extract<
  T['eventsMap'],
  EventsMap
>;

/**
 * Getting state from a machine.
 *
 * @template {KeyU<'__state'>} T - Type of machine state.
 */
export type StateFrom<T extends KeyU<'__state'>> = T['__state'];

/**
 * Getting decomposed state from a machine.
 *
 * @template {KeyU<'__decomposedState'>} T - Type of machine decomposed state.
 */
export type DecomposedStateFrom<T extends KeyU<'__decomposedState'>> =
  T['__decomposedState'];

/**
 * Getting function map from a machine.
 *
 * @template {KeyU<'__events' | 'pContext' | 'context' | 'actorsMap' | '__tag'>} T - Target machine type.
 * @template R - Return value type.
 * @template {string} Ex - Exception string type.
 */
export type FnMapFrom<
  T extends KeyU<
    '__events' | 'pContext' | 'context' | 'actorsMap' | '__tag'
  >,
  R = any,
  Ex extends string = never,
> = FnMapR<
  Extract<T['__events'], EventObject>,
  ContextFrom<T>,
  Extract<T['__tag'], string>,
  R,
  Ex
>;

/**
 * Getting extended state from a machine.
 *
 * @template {KeyU<'__stateExtended'>} T - Type of machine extended state.
 */
export type StateExtendedFrom<T extends KeyU<'__stateExtended'>> =
  T['__stateExtended'];

/**
 * Getting stateP from a machine.
 *
 * @template {KeyU<'__stateP'>} T - Type of machine stateP.
 */
export type StatePFrom<T extends KeyU<'__stateP'>> = T['__stateP'];

/**
 * Getting statePextended from a machine.
 *
 * @template {KeyU<'__statePextended'>} T - Type of machine statePextended.
 */
export type StatePextendedFrom<T extends KeyU<'__statePextended'>> =
  T['__statePextended'];

/**
 * Getting promisees map from a machine.
 *
 * @template {KeyU<'actorsMap'>} T - Type of machine promisees map.
 *
 * @see {@linkcode ActorsConfigMap}
 */
export type ActorsMapFrom<T extends KeyU<'actorsMap'>> = Extract<
  T['actorsMap'],
  ActorsConfigMap
>;

/**
 * Getting tag from a machine.
 *
 * @template {KeyU<'__tag'>} T - Target machine type.
 */
export type TagFrom<T extends KeyU<'__tag'>> = T['__tag'];

/**
 * Getting all paths from a machine.
 *
 * @template {KeyU<'__allPaths'>} T - Target machine type.
 */
export type AllPathsFrom<T extends KeyU<'__allPaths'>> = T['__allPaths'];

/**
 * Getting all events from a machine.
 *
 * @template {KeyU<'__events'>} T - Type of machine events.
 */
export type EventsFrom<T extends KeyU<'__events'>> = Extract<
  T['__events'],
  EventObject
>;

/**
 * Get all actions map from a machine.
 *
 * @template {KeyU<'actions'>} T - Type of machine actions.
 *
 * @see {@linkcode NotUndefined}
 */
export type ActionsMapFrom<T extends KeyU<'actions'>> = NotUndefined<
  T['actions']
>;

/**
 * Getting options added to machine.
 *
 * @template {KeyU<'addOptions'>} T - Target machine type.
 */
export type AddOptionsFrom<T extends KeyU<'addOptions'>> = NotUndefined<
  T['addOptions']
>;

/**
 * Get the action function from a machine.
 *
 * @template {KeyU<'__actionFn'>} T - Type of machine action function.
 *
 * @see {@linkcode NotUndefined}
 */
export type ActionFnFrom<T extends KeyU<'__actionFn'>> = NotUndefined<
  T['__actionFn']
>;

/**
 * Get the action function parameters from a machine.
 *
 * @template {KeyU<'__actionParams'>} T - Type of machine action parameters.
 *
 * @see {@linkcode NotUndefined}
 */
export type ActionParamsFrom<T extends KeyU<'__actionParams'>> =
  NotUndefined<T['__actionParams']>;

/**
 * Get the action keys from a machine.
 *
 * @template {KeyU<'__actionKey'>} T - Type of machine actions.
 */
export type ActionKeysFrom<T extends KeyU<'__actionKey'>> =
  T['__actionKey'];

/**
 * Get all guards map from a machine.
 *
 * @template {KeyU<'guards'>} T - Type of machine guards map.
 *
 * @see {@linkcode NotUndefined}
 */
export type PredicatesMapFrom<T extends KeyU<'guards'>> = NotUndefined<
  T['guards']
>;

/**
 * Get the predicate function from a machine.
 *
 * @template {KeyU<'__predicate'>} T - Type of machine predicate function.
 *
 * @see {@linkcode NotUndefined}
 */
export type PredicateSFrom<T extends KeyU<'__predicate'>> = NotUndefined<
  T['__predicate']
>;

/**
 * Get the guard keys from a machine.
 *
 * @template {KeyU<'__guardKey'>} T - Type of machine guards map.
 *
 * @see {@linkcode NotUndefined}
 */
export type GuardKeysFrom<T extends KeyU<'__guardKey'>> = T['__guardKey'];

/**
 * Get all delays map from a machine.
 *
 * @template {KeyU<'delays'>} T - Type of machine delays map.
 *
 * @see {@linkcode NotUndefined}
 */
export type DelaysMapFrom<T extends KeyU<'delays'>> = NotUndefined<
  T['delays']
>;

/**
 * Get the delay keys from a machine.
 *
 * @template {KeyU<'__delayKey'>} T - Type of machine delays map.
 *
 * @see {@linkcode NotUndefined}
 */
export type DelayKeysFrom<T extends KeyU<'__delayKey'>> = T['__delayKey'];

/**
 * Get the delay function from a machine.
 *
 * @template {KeyU<'__delay'>} T - Type of machine delay function.
 *
 * @see {@linkcode NotUndefined}
 */
export type DelayFnFrom<T extends KeyU<'__delay'>> = NotUndefined<
  T['__delay']
>;

/**
 * Get the machines map from a machine.
 *
 * @template {KeyU<'machines'>} T - Type of machine machines map.
 *
 * @see {@linkcode NotUndefined}
 */
export type MachinesMapFrom<T extends KeyU<'machines'>> = NotUndefined<
  T['machines']
>;

/**
 * Get the children keys from a machine.
 *
 * @template {KeyU<'__childKey'>} T - Type of machine child keys.
 */
export type ChildrenKeysFrom<T extends KeyU<'__childKey'>> =
  T['__childKey'];

/**
 * Getting the options from a machine.
 *
 * @template {KeyU<'options'>} T - Type of machine options.
 *
 * @see {@linkcode SimpleMachineOptions2}
 */
export type MachineOptionsFrom<T extends KeyU<'options'>> = Extract<
  T['options'],
  SimpleMachineOptions2
>;

/**
 * Object structure storing private and internal contexts.
 *
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 */
export type Contexts<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = { pContext?: Pc; context?: Tc };

/**
 * Alias of {@linkcode MachineOptionsFrom}.
 *
 * @template {KeyU<'options'>} T - Type of machine options.
 */
export type MoF<T extends KeyU<'options'>> = MachineOptionsFrom<T>;

/**
 * State selector function type signature.
 *
 * @template T - State shape.
 */
export type Selector_F<T = any> = 0 extends 1 & T
  ? (key: string) => any
  : T extends Primitive
    ? undefined
    : <
        D extends Decompose<T, { start: false; object: 'both' }>,
        K extends Extract<keyof D, string>,
        R = D[K],
      >(
        selector: K,
      ) => R;

/**
 * Map of built-in action payloads passed to action functions.
 *
 * @template {EventObject} Eo - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 */
export type ExtendedActionsParams<
  Eo extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = Partial<{
  scheduled: ScheduledData<Pc, Tc>;
  resend: EventArgObject<Eo>;
  forceSend: EventArgObject<Eo>;
  pauseActivity: string;
  resumeActivity: string;
  stopActivity: string;
  pauseTimer: string;
  resumeTimer: string;
  stopTimer: string;
  sentEvent: SendToEvent;
}>;

/**
 * Options for configuring an interpreter.
 *
 * @template {AnyMachine} M - Machine type.
 * @template {PrivateContextFrom<M>} P - Private context.
 * @template {ContextFrom<M>} C - Internal context.
 */
export type InterpreterOptions<
  M extends AnyMachine,
  P extends PrivateContextFrom<M> = PrivateContextFrom<M>,
  C extends ContextFrom<M> = ContextFrom<M>,
> = { mode?: Mode; exact?: boolean } & OptionalDefinitions<P, C>;

/**
 * Arguments tuple passed to interpret function.
 *
 * @template {AnyMachine} M - Machine type.
 */
export type InterpretArgs<M extends AnyMachine> =
  Equals<
    InterpreterOptions<M>,
    Partial<InterpreterOptions<M>>
  > extends true
    ? [machine: M, config?: InterpreterOptions<M>]
    : [machine: M, config: InterpreterOptions<M>];
