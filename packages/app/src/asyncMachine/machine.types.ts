import type { AsyncAction2 } from '#actions';

import type { DefinedValue } from '#guards';
import type { Decompose } from '@bemedev/decompose';

import type { EventsMapFrom } from '#common/interpreter';
import type {
  AnyMachine,
  CommonConfig3,
  SimpleMachineOptions2,
} from '#common/machine';
import type {
  ActorsConfigMap,
  EventArg,
  EventArgAll,
  EventObject,
  EventsMap,
} from '#events';
import type { AsyncMachine } from './machine';
import type { Ru, SubTypeLow } from '@bemedev/app-utils-bemedev';
import type { PrimitiveObject } from '@bemedev/typings';
import type { EmptyObject, FnMap, FnR, ValuesOf } from '~types';
/**
 * Options for async action helpers.
 * - `error`: called with the thrown error and current context snapshot when
 *   the async function rejects. Its return value is merged as the ActionResult.
 *   When omitted, the rejection propagates to the interpreter's `_addError` channel.
 * - `max`: maximum milliseconds before the async action is forcibly aborted via
 *   `TimeoutPromise`. When omitted, no timeout is applied.
 */
export type AsyncOptions<
  Eo extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  catch: ErrorFn<Eo, Pc, Tc, T>;
  then?: AsyncAction2<Eo, Pc, Tc, T>;
  max?: number;
};

export type ErrorFn<
  Eo extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <Err>(err: Err) => AsyncAction2<Eo, Pc, Tc, T>;

export type AsyncAssignAction_F<
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
  ...args: F extends Promise<D[K]> ? [AsyncOptions<E, Pc, Tc, T>] : []
) => AsyncAction2<E, Pc, Tc, T>;

export type AsyncResendAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (event: EventArgAll<E>) => AsyncAction2<E, Pc, Tc, T>;

export type AsyncTimeAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (id: string) => AsyncAction2<E, Pc, Tc, T>;

export type AsyncVoidAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <F extends void | Promise<void> = void | Promise<void>>(
  fn: FnMap<E, Pc, Tc, T, F>,
  ...args: F extends Promise<void> ? [AsyncOptions<E, Pc, Tc, T>] : []
) => AsyncAction2<E, Pc, Tc, T>;

export type AsyncFilterAction_F<
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
) => AsyncAction2<E, Pc, Tc, T>;

export type AsyncEraseAction_F<
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
) => AsyncAction2<E, Pc, Tc, T>;

export type AsyncSendAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <M extends AnyMachine>(
  _?: M,
) => <
  F extends
    | { to: string; event: EventArg<EventsMapFrom<M>> }
    | Promise<{ to: string; event: EventArg<EventsMapFrom<M>> }> =
    | { to: string; event: EventArg<EventsMapFrom<M>> }
    | Promise<{ to: string; event: EventArg<EventsMapFrom<M>> }>,
>(
  fn: FnMap<E, Pc, Tc, T, F>,
  ...args: F extends Promise<{
    to: string;
    event: EventArg<EventsMapFrom<M>>;
  }>
    ? [AsyncOptions<E, Pc, Tc, T>]
    : []
) => AsyncAction2<E, Pc, Tc, T>;

export type AsyncValueCheckerGuard_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (
  path: DefinedValue<Pc, Tc>,
  ...values: any[]
) => FnR<E, Pc, Tc, T, boolean>;

export type AsyncDefineGuard_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (path: DefinedValue<Pc, Tc>) => FnR<E, Pc, Tc, T, boolean>;

export type AsyncDebounceAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <A extends AsyncAction2<E, Pc, Tc, T>>(
  fn: A,
  options: {
    ms?: number;
    id: string;
  },
) => AsyncAction2<E, Pc, Tc, T>;

export type AsyncBatchAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <A extends (AsyncAction2<E, Pc, Tc, T> | undefined)[]>(
  ...fns: A
) => AsyncAction2<E, Pc, Tc, T>;

export type AsyncAddOption<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  isDefined: AsyncDefineGuard_F<E, Pc, Tc, T>;
  isNotDefined: AsyncDefineGuard_F<E, Pc, Tc, T>;
  isValue: AsyncValueCheckerGuard_F<E, Pc, Tc, T>;
  isNotValue: AsyncValueCheckerGuard_F<E, Pc, Tc, T>;
  assign: AsyncAssignAction_F<E, Pc, Tc, T>;
  batch: AsyncBatchAction_F<E, Pc, Tc, T>;
  filter: AsyncFilterAction_F<E, Pc, Tc, T>;
  erase: AsyncEraseAction_F<E, Pc, Tc, T>;
  voidAction: AsyncVoidAction_F<E, Pc, Tc, T>;
  sendTo: AsyncSendAction_F<E, Pc, Tc, T>;
  debounce: AsyncDebounceAction_F<E, Pc, Tc, T>;
  resend: AsyncResendAction_F<E, Pc, Tc, T>;
  /**
   * Force send action, performs the action regardless of the current state.
   */
  forceSend: AsyncResendAction_F<E, Pc, Tc, T>;
  pauseActivity: AsyncTimeAction_F<E, Pc, Tc, T>;
  resumeActivity: AsyncTimeAction_F<E, Pc, Tc, T>;
  stopActivity: AsyncTimeAction_F<E, Pc, Tc, T>;
  pauseTimer: AsyncTimeAction_F<E, Pc, Tc, T>;
  resumeTimer: AsyncTimeAction_F<E, Pc, Tc, T>;
  stopTimer: AsyncTimeAction_F<E, Pc, Tc, T>;
  // merge: DirectMerge_F<Pc, Tc>;
  // emitter: Emitter<E, P, Pc, Tc>;
};

export type AsyncAddOptionsParam_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = (
  option: AsyncAddOption<E, Pc, Tc, T>,
  /**
   * Access to previously defined options from previous addOptions or provideOptions calls.
   * Provides actions, guards, emitters, machines, promises, and delays.
   */
  legacyOptions: {
    _legacy: L;
  },
) => Mo;

export type AsyncAddOptions_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Ta extends string = string,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = <const T extends Mo>(
  option: AsyncAddOptionsParam_F<E, Pc, Tc, Ta, T, L>,
) => L & T;

export type AsyncProvideOptions_F<
  C extends CommonConfig3 = CommonConfig3,
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
) => AsyncMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L & T>;
