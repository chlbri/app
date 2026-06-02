import type { SyncAction2 } from '#actions';
import type { AnyInterpreter } from '#common/interpreter';
import type { SimpleMachineOptions2 } from '#common/machine';
import type { SyncDelayFunction3 } from '#delays';
import type { ActorsConfigMap, EventObject, EventsMap } from '#events';
import type {
  GuardConfig,
  SyncPredicateS2,
  SyncPredicateS3,
} from '#guards';
import type { AlwaysConfig, TransitionConfig } from '#transitions';
import type { PrimitiveObject } from '@bemedev/typings';
import type { EmptyObject } from '~types';
import type { SyncAddOptionsParam_F } from '../machine/options.types';
import type { SyncConfig, SyncNodeConfig } from '../types.types';
import type { SyncInterpreter } from './interpreter';

export type SyncCollectedService = {
  from: string;
  service: AnyInterpreter;
  id: string;
};

export type SyncPerformAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (action: SyncAction2<E, Pc, Tc, T>) => void;

export type SyncToPredicate_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (predicate?: GuardConfig) => SyncPredicateS2<E, Pc, Tc, T>;

export type SyncPerformPredicate_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (predicate: SyncPredicateS3<E, Pc, Tc, T>) => boolean;

export type SyncPerformTransition_F = (
  transition: TransitionConfig,
) => string | false;

export type SyncPerformTransitions_F = (
  ...transitions: TransitionConfig[]
) => string | false;

export type SyncPerformAlway_F = (always: AlwaysConfig) => string | false;

export type _SyncSend_F<E extends EventObject> = (
  event: E,
) => SyncNodeConfig | undefined;

export type SyncPerformDelay_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (delay: SyncDelayFunction3<E, Pc, Tc, T>) => number;

export type SyncProvideMachineOptions_F<
  C extends SyncConfig = SyncConfig,
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
