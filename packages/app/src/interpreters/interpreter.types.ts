import type { AsyncAction2, MaybeAsyncActionResult } from '#actions';
import type { InterpretArgs } from '#common/interpreter';
import type { AnyMachine, SimpleMachineOptions2 } from '#common/machine';
import type { AsyncDelayFunction3 } from '#delays';
import type { ActorsConfigMap, EventObject, EventsMap } from '#events';
import type { AsyncPredicateS3 } from '#guards';
import type { AsyncAddOptionsParam_F, AsyncConfig } from '#machines';
import type { NodeConfig } from '#states';
import type {
  AlwaysConfig,
  DelayedTransitions,
  TransitionConfig,
} from '#transitions';
import type { PrimitiveObject } from '@bemedev/typings';
import type { EmptyObject } from '~types';
import {
  type AsyncInterpreter,
  type AsyncInterpreterFrom,
} from './interpreter';

export type AsyncInterpreter_F = <M extends AnyMachine>(
  ...args: InterpretArgs<M>
) => AsyncInterpreterFrom<M>;

export type AsyncPerformActionLater_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (action: AsyncAction2<E, Pc, Tc, T>) => MaybeAsyncActionResult<Pc, Tc>;

export type AsyncPerformAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (action: AsyncAction2<E, Pc, Tc, T>) => Promise<void>;

export type AsyncPerformPredicate_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (predicate: AsyncPredicateS3<E, Pc, Tc, T>) => boolean;

export type AsyncPerformDelay_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (delay: AsyncDelayFunction3<E, Pc, Tc, T>) => number;

export type AsyncPerformAfter_F = (
  from: string,
  after: DelayedTransitions,
) => (() => Promise<string | false>) | undefined;

export type AsyncPerformAlway_F = (
  always: AlwaysConfig,
) => Promise<string | false>;

export type AsyncCollected0 = {
  after?: (() => Promise<string | false>) | undefined;
  always?: () => Promise<string | false>;
};

export type AsyncPerformTransition_F = (
  transition: TransitionConfig,
) => Promise<string | false>;

export type AsyncPerformTransitions_F = (
  ...transitions: TransitionConfig[]
) => Promise<string | false>;

export type _AsyncSend_F<E extends EventObject> = (
  event: E,
) => Promise<NodeConfig | undefined>;

export type AsyncProvideMachineOptions_F<
  C extends AsyncConfig = AsyncConfig,
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
  option: AsyncAddOptionsParam_F<Eo, Pc, Tc, Ta, T, L>,
) => AsyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L & T>;
