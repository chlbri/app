import type { Action22 } from '#actions';
import type { Ru, SubTypeLow } from '#bemedev/globals/types';
import type { EventArg, EventArgAll, EventObject } from '#events';
import type { DefinedValue } from '#guards';
import type {
  AnyMachine,
  EventsMapFrom,
  SimpleMachineOptions2,
} from '#machines';
import type { PrimitiveObject } from '@bemedev/typings';
import type { Decompose, FnMap, FnR, ValuesOf } from '~types';

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
) => Action22<E, Pc, Tc, T>;

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
) => Action22<E, Pc, Tc, T>;

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
  F extends D[K] | Promise<D[K]> = D[K] | Promise<D[K]>,
>(
  key: K,
  fn: FnMap<E, Pc, Tc, T, F>,
) => Action22<E, Pc, Tc, T>;

export type SyncBatchAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <A extends (Action22<E, Pc, Tc, T> | undefined)[]>(
  ...fns: A
) => Action22<E, Pc, Tc, T>;

export type SyncVoidAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <F extends void | Promise<void> = void | Promise<void>>(
  fn: FnMap<E, Pc, Tc, T, F>,
) => Action22<E, Pc, Tc, T>;

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
) => Action22<E, Pc, Tc, T>;

export type SyncDebounceAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <A extends Action22<E, Pc, Tc, T>>(
  fn: A,
  options: {
    ms?: number;
    id: string;
  },
) => Action22<E, Pc, Tc, T>;

export type SyncResendAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (event: EventArgAll<E>) => Action22<E, Pc, Tc, T>;

export type SyncTimeAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (id: string) => Action22<E, Pc, Tc, T>;

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

/**
 * Type for the _legacy parameter containing previously defined options.
 */
export type SyncLegacyOptions<
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = Readonly<{
  actions?: Mo['actions'];
  guards?: Mo['guards'];
  actors?: Mo['actors'];
}>;

export type SyncAddOptionsParam_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = (
  option: SyncAddOption<E, Pc, Tc, T>,
  /**
   * Access to previously defined options from previous addOptions or provideOptions calls.
   * Provides actions, guards, emitters, machines, promises, and delays.
   */
  legacyOptions: {
    _legacy: SyncLegacyOptions<Mo>;
  },
) => Mo | undefined;

export type SyncAddOptions_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = (option: SyncAddOptionsParam_F<E, Pc, Tc, T, Mo>) => Mo | undefined;
