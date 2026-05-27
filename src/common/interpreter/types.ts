import type {
  ActorsConfigMap,
  EventArgObject,
  EventObject,
  EventsMap,
} from '#events';
import type { ActivityConfig, StateExtended, StateValue } from '#states';
import type { PrimitiveObject } from '@bemedev/typings';
import type {
  Fn,
  FnMapR,
  FnR,
  KeyU,
  MaybePromise,
  OptionalDefinition,
} from '~types';
import type { AnyMachine, CommonConfig } from '../machine/types';
import type { SubscriberClass, SubscriberOptions } from '../subscriber';
import type { ActionResult, WithDescriber } from '#actions';
import type { GuardConfig } from '#guards';
import type { Pausable } from '#emitters';
import type { NOmit } from '#bemedev/features/objects/types';
import type { Interval2, IntervalParams } from '@bemedev/interval2';
import type { NotUndefined } from '#bemedev/globals/types';
import type { SimpleMachineOptions2 } from '../machine';
import type { Primitive } from '#bemedev/features/common/types';
import type { Decompose } from '@bemedev/decompose';

export type WorkingStatus =
  | 'idle'
  | 'starting'
  | 'started'
  | 'paused'
  | 'working'
  | 'sending'
  | 'stopped'
  | 'busy';

export type Mode = 'normal' | 'strict';

export type OptionalDefinitions<P, C> = OptionalDefinition<P, 'pContext'> &
  OptionalDefinition<C, 'context'>;

export type AddSubscriber_F<
  E extends EventsMap = EventsMap,
  A extends ActorsConfigMap = ActorsConfigMap,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
> = (
  subscriber: FnMapR<Eo, Tc, T, void>,
  options?: SubscriberOptions<Eo, Tc, T>,
) => SubscriberClass<E, A, Tc, T, Eo>;

export interface AnyInterpreter<
  E extends EventsMap = EventsMap,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
> {
  mode: Mode;
  eventsMap: EventsMap;
  initialNode: any;
  node: any;
  makeStrict: () => Mode;
  makeNormal: () => Mode;

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
  _providePrivateContext: (pContext: Pc) => AnyMachine<E, A, Pc, Tc>;
  _ppC: (pContext: Pc) => AnyMachine<E, A, Pc, Tc>;
  _provideContext: (context: Tc) => AnyMachine<E, A, Pc, Tc>;

  subscribe: AddSubscriber_F<E, A, Tc, T, Eo>;

  send: (event: any) => any;
  toActionFn: (action: WithDescriber) => any;
  toPredicateFn: (guard: GuardConfig) => any;
  toDelayFn: (delay: string) => any;
  toChildFn: (machine: string) => any;
  id?: string;
  from?: string;

  dispose: () => void;
}

export type CommonCollectedService = {
  from: string;
  service: AnyInterpreter;
  id: string;
};

export type CollectedPausable = {
  from: string;
  pausable: Pausable;
  id: string;
};

export type CollectedService = {
  from: string;
  service: AnyInterpreter;
  id: string;
};

export type EmitterFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
> = (state: StateExtended<E, Pc, Tc, T>) => MaybePromise<Pausable<R>>;

export type ChildFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnR<E, Pc, Tc, T, MaybePromise<R>>;

export type SimpleScheduler = {
  schedule: Fn<[() => void, boolean?], any>;
  stop: Fn<[], any>;
};

export type ExecuteActivities_F = (
  from: string,
  activity: ActivityConfig,
) => string[];

/**
 * Represents a scheduled action with its data and execution time.
 *
 * @template :  any [Pc] - type of the private context
 * @template :  {@linkcode PrimitiveObject} [Tc] - type of the context
 *
 * @see {@linkcode ActionResult} for the result of the action.
 */
export type ScheduledData<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = { data: ActionResult<Pc, Tc>; ms: number; id: string };

export type SendToEvent<T = any> = {
  to: string;
  event: T;
};

export type DirectMerge_F<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = Fn<[result?: ActionResult<Pc, Tc>], void>;

export type CreateInterval2_F = (
  config: NOmit<IntervalParams, 'exact'>,
) => Interval2;

export type DiffNext = {
  sv: StateValue;
  diffEntries: WithDescriber[];
  diffExits: WithDescriber[];
};

/**
 * Getting config from a machine.
 *
 * @template : {@linkcode KeyU}<'config'> [T] - type of the machine pre-config
 *
 * @see {@linkcode Config} for the structure of the machine config.
 */
export type ConfigFrom<T extends KeyU<'config'>> = Extract<
  T['config'],
  CommonConfig
>;

/**
 * Getting private context from a machine.
 *
 * @template : {@linkcode KeyU}<'pContext'> [T] - type of the machine events map
 */
export type PrivateContextFrom<T extends KeyU<'pContext'>> = T['pContext'];

/**
 * Getting context from a machine.
 *
 * @template : {@linkcode KeyU}<'context'> [T] - type of the machine context
 *
 * @see {@linkcode PrimitiveObject} for the structure of the context.
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
export type EventsMapFrom<T extends KeyU<'eventsMap'>> = Extract<
  T['eventsMap'],
  EventsMap
>;

/**
 * Getting state from a machine.
 *
 * @template : {@linkcode KeyU}<'__state'> [T] - type of the machine state
 *
 * @see {@linkcode StateFrom} for extracting the state from the machine.
 */
export type StateFrom<T extends KeyU<'__state'>> = T['__state'];

export type DecomposedStateFrom<T extends KeyU<'__decomposedState'>> =
  T['__decomposedState'];

/**
 * Getting extended state from a machine.
 *
 * @template : {@linkcode KeyU}<'__stateExtended'> [T] - type of the machine extended state
 *
 * @see {@linkcode StateExtendedFrom} for extracting the extended state from the machine.
 */
export type StateExtendedFrom<T extends KeyU<'__stateExtended'>> =
  T['__stateExtended'];

/** * Getting stateP from a machine.
 * @template : {@linkcode KeyU}<'__stateP'> [T] - type of the machine stateP
 * @see {@linkcode StatePFrom} for extracting the stateP from the machine.
 */
export type StatePFrom<T extends KeyU<'__stateP'>> = T['__stateP'];

/**
 * Getting statePextended from a machine.
 *
 * @template : {@linkcode KeyU}<'__statePextended'> [T] - type of the machine statePextended
 *
 * @see {@linkcode StatePextendedFrom} for extracting the statePextended from the machine.
 */
export type StatePextendedFrom<T extends KeyU<'__statePextended'>> =
  T['__statePextended'];

/**
 * Getting promisees map from a machine.
 *
 * @template : {@linkcode KeyU}<'promiseesMap'> [T] - type of the machine promisees map
 *
 * @see {@linkcode ActorsConfigMap} for the structure of the promisees map.
 */
export type ActorsMapFrom<T extends KeyU<'actorsMap'>> = Extract<
  T['actorsMap'],
  ActorsConfigMap
>;

export type TagsFrom<T extends KeyU<'tags'>> = T['tags'];
export type TagFrom<T extends KeyU<'__tag'>> = T['__tag'];

export type AllPathsFrom<T extends KeyU<'__allPaths'>> = T['__allPaths'];

/**
 * Getting all events from a machine.
 *
 * @template : {@linkcode KeyU}<'__events'> [T] - type of the machine events
 *
 */
export type EventsFrom<T extends KeyU<'__events'>> = Extract<
  T['__events'],
  EventObject
>;

/**
 * Get all actions map from a machine.
 *
 * @template : {@linkcode KeyU}<'actions'> [T] - type of the machine actions
 *
 * @see {@linkcode ActionsMapFrom} for extracting actions from the machine.
 * @see {@linkcode NotUndefined}
 * @see {@linkcode ActionFnFrom} for extracting action functions from the machine.
 * @see {@linkcode ActionParamsFrom} for extracting action parameters from the machine.
 * @see {@linkcode ActionKeysFrom} for extracting action keys from the machine.
 */
export type ActionsMapFrom<T extends KeyU<'actions'>> = NotUndefined<
  T['actions']
>;

export type AddOptionsFrom<T extends KeyU<'addOptions'>> = NotUndefined<
  T['addOptions']
>;

/**
 * Get the action function from a machine.
 *
 * @template : {@linkcode KeyU}<'__actionFn'> [T] - type of the machine action function
 *
 * @see {@linkcode NotUndefined} for ensuring the action function is not undefined.
 */
export type ActionFnFrom<T extends KeyU<'__actionFn'>> = NotUndefined<
  T['__actionFn']
>;

/**
 * Get the action function parameters from a machine.
 *
 * @template : {@linkcode KeyU}<'__actionParams'> [T] - type of the machine action parameters
 *
 * @see {@linkcode NotUndefined} for ensuring the action parameters are not undefined.
 */
export type ActionParamsFrom<T extends KeyU<'__actionParams'>> =
  NotUndefined<T['__actionParams']>;

/**
 * Get the action keys from a machine.
 *
 * @template : {@linkcode KeyU}<'actions'> [T] - type of the machine actions
 *
 * @see {@linkcode ActionsMapFrom} for extracting actions from the machine.
 */
export type ActionKeysFrom<T extends KeyU<'__actionKey'>> =
  T['__actionKey'];

/**
 * Get all guards map from a machine.
 *
 * @template : {@linkcode KeyU}<'guards'> [T] - type of the machine guards map.
 *
 * @see {@linkcode NotUndefined}
 */
export type PredicatesMapFrom<T extends KeyU<'guards'>> = NotUndefined<
  T['guards']
>;

/**
 * Get the predicate function from a machine.
 *
 * @template : {@linkcode KeyU}<'__predicate'> [T] - type of the machine predicate function
 *
 * @see {@linkcode NotUndefined} for ensuring the predicate function is not undefined.
 */
export type PredicateSFrom<T extends KeyU<'__predicate'>> = NotUndefined<
  T['__predicate']
>;

/**
 * Get the guard keys from a machine.
 *
 * @template : {@linkcode KeyU}<'guards'> [T] - type of the machine machine guards map.
 *
 * @see {@linkcode NotUndefined} for ensuring the guards map is not undefined.
 * @see {@linkcode PredicatesMapFrom} for extracting guards from the machine.
 */
export type GuardKeysFrom<T extends KeyU<'__guardKey'>> = T['__guardKey'];

/**
 * Get all delays map from a machine.
 *
 * @template : {@linkcode KeyU}<'delays'> [T] - type of the machine delays map.
 *
 * @see {@linkcode NotUndefined} for ensuring the delays map is not undefined.
 */
export type DelaysMapFrom<T extends KeyU<'delays'>> = NotUndefined<
  T['delays']
>;

/**
 * Get the delay keys from a machine.
 *
 * @template : {@linkcode KeyU}<'delays'> [T] - type of the machine delays map.
 *
 * @see {@linkcode NotUndefined} for ensuring the delays map is not undefined.
 * @see {@linkcode DelaysMapFrom} for extracting delays from the machine.
 */
export type DelayKeysFrom<T extends KeyU<'__delayKey'>> = T['__delayKey'];

/**
 * Get the delay function from a machine.
 *
 * @template : {@linkcode KeyU}<'__delay'> [T] - type of the machine delay function.
 *
 * @see {@linkcode NotUndefined} for ensuring the delay function is not undefined.
 */
export type DelayFnFrom<T extends KeyU<'__delay'>> = NotUndefined<
  T['__delay']
>;

/**
 * Get the machines map from a machine.
 *
 * @template : {@linkcode KeyU}<'machines'> [T] - type of the machine machines map.
 *
 * @see {@linkcode NotUndefined} for ensuring the machines map is not undefined.
 */
export type MachinesMapFrom<T extends KeyU<'machines'>> = NotUndefined<
  T['machines']
>;

/**
 * Get the childrend keys from a machine.
 *
 * @template : {@linkcode KeyU}<'__childKey'> [T] - type of the machine child keys.
 */
export type ChildrenKeysFrom<T extends KeyU<'__childKey'>> =
  T['__childKey'];

/**
 * Getting the options from a machine.
 *
 * @template : {@linkcode KeyU}<'options'> [T] - type of the machine options
 *
 * @see {@linkcode SimpleMachineOptions2} for the structure of the machine options.
 */
export type MachineOptionsFrom<T extends KeyU<'options'>> = Extract<
  T['options'],
  SimpleMachineOptions2
>;

/**
 * Alias of {@linkcode MachineOptionsFrom}.
 */
export type MoF<T extends KeyU<'options'>> = MachineOptionsFrom<T>;

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
