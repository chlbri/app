import type { SyncAction } from '#actions';
import type { ActorConfig } from '#actor';
import type { NoExtraKeysTargetDef } from '#common/machine';
import type { AsyncEmitterFunction } from '#emitters';
import type { AsyncPredicate } from '#guards';
import { Identify } from '~types';

import type {
  AlwaysConfig,
  BaseConfig,
  Contract,
  DelayedTransitions,
  FnMap,
  FnR,
  RecordS,
  StateType,
  TargetDef,
} from '@bemedev/app-contract';

/**
 * Transitions configuration container for synchronous state machines.
 *
 * @template `Paths` - State path union.
 */
export type SyncTransitionsConfig<Paths extends string = string> = {
  readonly on?: DelayedTransitions<Paths>;
  readonly always?: AlwaysConfig<Paths>;
  readonly actors?: RecordS<ActorConfig<Paths>>;
};

/**
 * Common node configuration options for synchronous state nodes.
 *
 * @template `Paths` - State path union.
 */
export type SyncCommonNodeConfig<Paths extends string = string> = BaseConfig &
  SyncTransitionsConfig<Paths>;

/**
 * State node configuration structure for synchronous state machines.
 *
 * @template `Paths` - State path union.
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
 * @template `Paths` - Target definitions.
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
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 *
 * @see -- type {@linkcode SyncAction}, -- type {@linkcode AsyncPredicate}
 */
export type SyncTransition<Ct extends Contract = Contract> = {
  readonly target?: string;
  readonly actions: SyncAction<Ct>[];
  readonly guards: AsyncPredicate<Ct>[];
  readonly description?: string;
};

/**
 * Synchronous emitter configuration container.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 * @template `R` - Return value type.
 */
export type SyncEmitter<Ct extends Contract = Contract, R = any> = {
  src: AsyncEmitterFunction<Ct, R>;
  description?: string;
  next: SyncTransition<Ct>[];
  error: SyncTransition<Ct>[];
  complete: SyncTransition<Ct>[];
};

/**
 * Synchronous child function returning return type `R`.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path type.
 * @template `R` - Return type.
 */
export type ChildFunction2<
  Ct extends Contract = Contract,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnR<Ct, R>;

/**
 * Synchronous child actor configuration.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path type.
 * @template `R` - Return type.
 */
export type SyncChild<
  Ct extends Contract = Contract,
  R extends { eventsMap: any } = { eventsMap: any },
> = {
  src: ChildFunction2<Ct, R>;
  description?: string;
  id: string;
  on: Identify<RecordS<SyncTransition<Ct>>>[];
  contexts: string[];
};

/**
 * Synchronous child function map.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path type.
 * @template `R` - Return type.
 */
export type SyncChildFunction<
  Ct extends Contract = Contract,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnMap<Ct, R, `${string}::on::${string}`>;

/**
 * Represents all transitions inside a state config with full defined functions.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 *
 * @see -- type {@linkcode SyncTransition}, -- type {@linkcode Identify}
 */
export type SyncTransitions<Ct extends Contract = Contract> = {
  on: Identify<SyncTransition<Ct>>[];
  always: SyncTransition<Ct>[];
  after: Identify<SyncTransition<Ct>>[];
  emitters: SyncEmitter<Ct>[];
  children: SyncChild<Ct>[];
};

/**
 * Synchronous executable state node structure.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 */
export type SyncNode<Ct extends Contract = Contract> = {
  id?: string;
  description?: string;
  type: StateType;
  entry: SyncAction<Ct>[];
  exit: SyncAction<Ct>[];
  tags: string[];
  states: Identify<SyncNode<Ct>>[];
  initial?: string;
} & SyncTransitions<Ct>;
