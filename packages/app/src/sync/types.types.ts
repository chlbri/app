import type { SyncAction } from '#actions';
import type { ActorConfig } from '#actor';
import type { NoExtraKeysTargetDef } from '#common/machine';
import type { AsyncEmitterFunction } from '#emitters';
import type { AsyncPredicate } from '#guards';

import type { BaseConfig, StateType, TargetDef } from '#states';
import type { AlwaysConfig, DelayedTransitions } from '#transitions';
import type { PrimitiveObject } from '@bemedev/typings';
import type { EventObject, FnMap, FnR, Identify, RecordS } from '~types';

/**
 * Transitions configuration container for synchronous state machines.
 *
 * @template {string} Paths - State path union.
 */
export type SyncTransitionsConfig<Paths extends string = string> = {
  readonly on?: DelayedTransitions<Paths>;
  readonly always?: AlwaysConfig<Paths>;
  readonly actors?: RecordS<ActorConfig<Paths>>;
};

/**
 * Common node configuration options for synchronous state nodes.
 *
 * @template {string} Paths - State path union.
 */
export type SyncCommonNodeConfig<Paths extends string = string> = BaseConfig &
  SyncTransitionsConfig<Paths>;

/**
 * State node configuration structure for synchronous state machines.
 *
 * @template {string} Paths - State path union.
 */
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
 * @template {NoExtraKeysTargetDef<TargetDef>} Paths - Target definitions.
 */
export type SyncConfig<
  Paths extends NoExtraKeysTargetDef<TargetDef> = NoExtraKeysTargetDef<TargetDef>,
> = SyncNodeConfig<Paths['targets']> & {
  readonly strict?: boolean;
  readonly __longRuns?: boolean;
};

/**
 * Represents a transition in a state machine with full defined functions.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 *
 * @see {@linkcode SyncAction}, {@linkcode AsyncPredicate}
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

/**
 * Synchronous emitter configuration container.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 * @template R - Return value type.
 */
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

/**
 * Synchronous child function returning return type `R`.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path type.
 * @template R - Return type.
 */
export type ChildFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnR<E, Pc, Tc, T, R>;

/**
 * Synchronous child actor configuration.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path type.
 * @template R - Return type.
 */
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

/**
 * Synchronous child function map.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path type.
 * @template R - Return type.
 */
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
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 *
 * @see {@linkcode SyncTransition}, {@linkcode Identify}
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

/**
 * Synchronous executable state node structure.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
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
