import type { SyncAction, WithDescriber } from '#actions';
import type { ActorsConfigMap, EventObject, EventsMap } from '#events';
import type { GuardConfig, PredicateS2, PredicateS3 } from '#guards';
import type { AddSubscriber_F, Mode, WorkingStatus } from '#interpreters';
import type { StateValue } from '#states';
import type { PrimitiveObject } from '@bemedev/typings';
import type { AnySyncMachine, SyncNodeConfig } from './types.types';
import type { AlwaysConfig, TransitionConfig } from '#transitions';
import type { DelayFunction33 } from '#delays';

export interface AnySyncInterpreter<
  E extends EventsMap = EventsMap,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> {
  mode: Mode;
  eventsMap: EventsMap;
  initialNode: any;
  node: any;

  makeStrict: () => void;
  status: WorkingStatus;
  initialConfig: SyncNodeConfig;
  initialValue: StateValue;
  config: SyncNodeConfig;
  renew: any;
  value: StateValue;
  context: any;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  _providePrivateContext: (pContext: Pc) => AnySyncMachine<E, A, Pc, Tc>;
  _ppC: (pContext: Pc) => AnySyncMachine<E, A, Pc, Tc>;
  _provideContext: (context: Tc) => AnySyncMachine<E, A, Pc, Tc>;

  subscribe: AddSubscriber_F<E, A, Tc, T>;

  send: (event: any) => void;
  toActionFn: (action: WithDescriber) => any;
  toPredicateFn: (guard: GuardConfig) => any;
  toDelayFn: (delay: string) => any;
  toChildFunction: (machine: string) => any;
  id?: string;
  from?: string;

  dispose: () => void;
}

export type SyncCollectedService = {
  from: string;
  service: AnySyncInterpreter;
  id: string;
};

export type SyncPerformAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (action: SyncAction<E, Pc, Tc, T>) => void;

export type SyncToPredicate_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (predicate?: GuardConfig) => PredicateS2<E, Pc, Tc, T>;

export type SyncPerformPredicate_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (predicate: PredicateS3<E, Pc, Tc, T>) => boolean;

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
> = (delay: DelayFunction33<E, Pc, Tc, T>) => number;
