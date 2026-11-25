import type {
  ActorsConfigMap,
  Contract,
  EventArgObject,
  EventObject,
  EventsMap,
  EventsR,
  FnMap,
} from '@bemedev/app-contract';
import type { NotUndefined } from '@bemedev/app-utils-bemedev';
import { PrimitiveObject } from '@bemedev/typings';
import type { KeyU, SimpleMachineOptions2 } from './types';

/**
 * Transforms an event map into arguments to send to the machine.
 * @template | {@linkcode EventsMap} `E` - the map of events.
 *
 * @see {@linkcode EventsR}, -- type {@linkcode EventObject}
 */
export type EventArg<E extends EventsMap> = EventArgObject<EventsR<E>>;

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
