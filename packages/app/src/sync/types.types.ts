import type { SyncAction } from '#actions';
import type { ActorConfig } from '#actor';
import type { NoExtraKeysTargetDef } from '#common/machine';
import type { AsyncEmitterFunction } from '#emitters';
import type { AsyncPredicate } from '#guards';

import type { BaseConfig, StateType, TargetDef } from '#states';
import type { AlwaysConfig, DelayedTransitions } from '#transitions';
import type { PrimitiveObject } from '@bemedev/typings';
import type { EventObject, FnMap, FnR, Identify, RecordS } from '~types';

export type SyncTransitionsConfig<Paths extends string = string> = {
  readonly on?: DelayedTransitions<Paths>;
  readonly always?: AlwaysConfig<Paths>;
  readonly actors?: RecordS<ActorConfig<Paths>>;
};

export type SyncCommonNodeConfig<Paths extends string = string> =
  BaseConfig & SyncTransitionsConfig<Paths>;

export type SyncNodeConfig<Paths extends string = string> =
  SyncCommonNodeConfig<Paths> &
    (
      | {
          readonly type?: 'atomic';
          readonly initial?: never;
          readonly states?: never;
        }
      | {
          readonly type?: 'compound';
          readonly initial: string;
          readonly states: RecordS<SyncNodeConfig<Paths>>;
        }
      | {
          readonly type: 'parallel';
          readonly initial?: never;
          readonly states: RecordS<SyncNodeConfig<Paths>>;
        }
    );

/**
 * Type representing the main JSON node config of a sync state machine.
 *
 * @see {@linkcode ConfigNode} for more details.
 * @see {@linkcode MachineConfig}
 * @see {@linkcode SingleOrArrayL}
 */
export type SyncConfig<
  Paths extends NoExtraKeysTargetDef<TargetDef> =
    NoExtraKeysTargetDef<TargetDef>,
> = SyncNodeConfig<Paths['targets']> & {
  readonly strict?: boolean;
  readonly __longRuns?: boolean;
};

/**
 * Represents a transition in a state machine with full defined functions.
 *
 * @template : {@linkcode PromiseeMap} [P] - The promisees map used in the transition.
 * @template : [Pc] - The private context type for the transition.
 * @template : {@linkcode types} [Tc] - The context for the transition.
 *
 * @see {@linkcode Action} for the structure of actions in the transition.
 * @see {@linkcode AsyncPredicate} for the structure of guards in the transition.
 */
export type SyncTransition<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  readonly target?: string;
  readonly actions: SyncAction<E, Pc, Tc, T>[];
  readonly guards: AsyncPredicate<E, Pc, Tc, T>[];
  readonly description?: string;
};

export type SyncEmitter<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
> = {
  src: AsyncEmitterFunction<E, Pc, Tc, T, R>;
  description?: string;
  next: SyncTransition<E, Pc, Tc, T>[];
  error: SyncTransition<E, Pc, Tc, T>[];
  complete: SyncTransition<E, Pc, Tc, T>[];
};

export type ChildFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnR<E, Pc, Tc, T, R>;

export type SyncChild<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = {
  src: ChildFunction2<E, Pc, Tc, T, R>;
  description?: string;
  id: string;
  on: Identify<RecordS<SyncTransition<E, Pc, Tc, T>>>[];
  contexts: string[];
};

export type SyncChildFunction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnMap<E, Pc, Tc, T, R, `${string}::on::${string}`>;

/**
 * Represents all transitions inside a state config with full defined functions.
 *
 * @template : [Pc] - The private context type for the transitions.
 * @template : {@linkcode PrimitiveObject} [Tc] - The context for the transitions
 *
 * @see {@linkcode Transition} for the structure of a single transition.
 * @see {@linkcode Identify} for identifying properties in the transitions.
 */
export type SyncTransitions<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  on: Identify<SyncTransition<E, Pc, Tc, T>>[];
  always: SyncTransition<E, Pc, Tc, T>[];
  after: Identify<SyncTransition<E, Pc, Tc, T>>[];
  emitters: SyncEmitter<E, Pc, Tc, T>[];
  children: SyncChild<E, Pc, Tc, T>[];
};

export type SyncNode<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  id?: string;
  description?: string;
  type: StateType;
  entry: SyncAction<E, Pc, Tc, T>[];
  exit: SyncAction<E, Pc, Tc, T>[];
  tags: string[];
  states: Identify<SyncNode<E, Pc, Tc, T>>[];
  initial?: string;
} & SyncTransitions<E, Pc, Tc, T>;
