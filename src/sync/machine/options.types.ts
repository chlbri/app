import type { SyncAction2 } from '#actions';
import type { Ru, SubTypeLow } from '#bemedev/globals/types';
import type { EventsMapFrom } from '#common/interpreter';
import type { SyncDelayFunction2 } from '#delays';
import type { EmitterFunction2 } from '#emitters';
import type {
  ActorsConfigMap,
  EventArg,
  EventArgAll,
  EventObject,
  EventsMap,
} from '#events';
import type { DefinedValue, SyncPredicateS } from '#guards';
import type { AnyMachine, SimpleMachineOptions2 } from '#machines';
import type { RegisterOptions } from '#registry';
import type { PrimitiveObject } from '@bemedev/typings';
import type { Decompose, EmptyObject, FnMap, FnR, ValuesOf } from '~types';
import type { SyncConfig } from '../types.types';
import type { SyncMachine } from './machine';

export type SyncFilterAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <
  D = Decompose<
    { pContext: Pc; context: Tc },
    { object: 'both'; start: false; sep: '.' }
  >,
  K extends keyof D & string = keyof D & string,
>(
  key: K,
  fn: D[K] extends Array<infer Item>
    ? (item: Item, index: number, array: Item[]) => boolean
    : D[K] extends Ru
      ? (value: ValuesOf<D[K]>, all: D[K]) => boolean
      : never,
) => SyncAction2<E, Pc, Tc, T>;

export type SyncEraseAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <
  D extends object = Decompose<
    { pContext: Pc; context: Tc },
    { object: 'both'; start: false; sep: '.' }
  >,
  DD = 0 extends 1 & Tc ? Record<string, any> : SubTypeLow<D, undefined>,
  K extends keyof DD & string = keyof DD & string,
>(
  key: K,
) => SyncAction2<E, Pc, Tc, T>;

export type SyncDefineGuard_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (path: DefinedValue<Pc, Tc>) => FnR<E, Pc, Tc, T, boolean>;

export type SyncValueCheckerGuard_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (
  path: DefinedValue<Pc, Tc>,
  ...values: any[]
) => FnR<E, Pc, Tc, T, boolean>;

export type SyncAssignAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <
  D = Decompose<
    { pContext: Pc; context: Tc },
    { object: 'both'; start: false; sep: '.' }
  >,
  K extends keyof D = keyof D,
>(
  key: K,
  fn: FnMap<E, Pc, Tc, T, D[K]>,
) => SyncAction2<E, Pc, Tc, T>;

export type SyncBatchAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <A extends (SyncAction2<E, Pc, Tc, T> | undefined)[]>(
  ...fns: A
) => SyncAction2<E, Pc, Tc, T>;

export type SyncVoidAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (fn: FnMap<E, Pc, Tc, T, void>) => SyncAction2<E, Pc, Tc, T>;

export type SyncSendAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <M extends AnyMachine>(
  _?: M,
) => <
  F extends { to: string; event: EventArg<EventsMapFrom<M>> } = {
    to: string;
    event: EventArg<EventsMapFrom<M>>;
  },
>(
  fn: FnMap<E, Pc, Tc, T, F>,
) => SyncAction2<E, Pc, Tc, T>;

export type SyncDebounceAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <A extends SyncAction2<E, Pc, Tc, T>>(
  fn: A,
  options: {
    ms?: number;
    id: string;
  },
) => SyncAction2<E, Pc, Tc, T>;

export type SyncResendAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (event: EventArgAll<E>) => SyncAction2<E, Pc, Tc, T>;

export type SyncTimeAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (id: string) => SyncAction2<E, Pc, Tc, T>;

export type SyncAllActions_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> =
  | SyncAssignAction_F<E, Pc, Tc, T>
  | SyncVoidAction_F<E, Pc, Tc, T>
  | SyncSendAction_F<E, Pc, Tc, T>
  | SyncResendAction_F<E, Pc, Tc, T>
  | SyncDebounceAction_F<E, Pc, Tc, T>
  | SyncTimeAction_F<E, Pc, Tc, T>
  | SyncBatchAction_F<E, Pc, Tc, T>
  | SyncEraseAction_F<E, Pc, Tc, T>
  | SyncFilterAction_F<E, Pc, Tc, T>;

export type SyncAddOption<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  isDefined: SyncDefineGuard_F<E, Pc, Tc, T>;
  isNotDefined: SyncDefineGuard_F<E, Pc, Tc, T>;
  isValue: SyncValueCheckerGuard_F<E, Pc, Tc, T>;
  isNotValue: SyncValueCheckerGuard_F<E, Pc, Tc, T>;
  assign: SyncAssignAction_F<E, Pc, Tc, T>;
  batch: SyncBatchAction_F<E, Pc, Tc, T>;
  filter: SyncFilterAction_F<E, Pc, Tc, T>;
  erase: SyncEraseAction_F<E, Pc, Tc, T>;
  voidAction: SyncVoidAction_F<E, Pc, Tc, T>;
  sendTo: SyncSendAction_F<E, Pc, Tc, T>;
  debounce: SyncDebounceAction_F<E, Pc, Tc, T>;
  resend: SyncResendAction_F<E, Pc, Tc, T>;
  /**
   * Force send action, performs the action regardless of the current state.
   */
  forceSend: SyncResendAction_F<E, Pc, Tc, T>;
  pauseActivity: SyncTimeAction_F<E, Pc, Tc, T>;
  resumeActivity: SyncTimeAction_F<E, Pc, Tc, T>;
  stopActivity: SyncTimeAction_F<E, Pc, Tc, T>;
  pauseTimer: SyncTimeAction_F<E, Pc, Tc, T>;
  resumeTimer: SyncTimeAction_F<E, Pc, Tc, T>;
  stopTimer: SyncTimeAction_F<E, Pc, Tc, T>;
  // merge: DirectMerge_F<Pc, Tc>;
  // emitter: Emitter<E, P, Pc, Tc>;
};

export type SyncAddOptionsParam_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = (
  option: SyncAddOption<E, Pc, Tc, T>,
  /**
   * Access to previously defined options from previous addOptions or provideOptions calls.
   * Provides actions, guards, emitters, machines, promises, and delays.
   */
  legacyOptions: {
    _legacy: L;
  },
) => Mo;

export type SyncAddOptions_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Ta extends string = string,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = <const T extends Mo>(
  option: SyncAddOptionsParam_F<E, Pc, Tc, Ta, T, L>,
) => Mo;

export type SyncProvideOptions_F<
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
) => SyncMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L & T>;

export type SyncChildFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnR<E, Pc, Tc, T, R>;

export type SyncMachineOptions2<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
  O extends RegisterOptions = RegisterOptions,
> = Partial<{
  actions: Partial<Record<O['actions'], SyncAction2<Eo, Pc, Tc, T>>>;
  guards: Partial<Record<O['guards'], SyncPredicateS<Eo, Pc, Tc, T>>>;
  delays: Partial<Record<O['delays'], SyncDelayFunction2<Eo, Pc, Tc, T>>>;
  actors: Partial<{
    children: Partial<
      Record<O['children'], SyncChildFunction2<Eo, Pc, Tc, T, any>>
    >;
    emitters: Partial<
      Record<O['emitters'], EmitterFunction2<Eo, Pc, Tc, T, any>>
    >;
  }>;
}>;
