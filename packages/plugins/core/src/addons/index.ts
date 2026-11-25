/**
 * Built-in addons injected into the options callbacks.
 *
 * @module
 */

import type {
  AsyncAction2,
  Contract,
  ContractEventArg,
  FnMap,
  FnR,
  MaybePromise,
  SyncAction2,
} from '@bemedev/app-contract';

import type { ResolveUtilities } from '../types';
import type { Fn, UtilityPair } from './types';

import type {
  AsyncActionHelper,
  AsyncAssign,
  AsyncOptions,
  CommonEraseAction,
  CommonFilterAction,
  FnMapFilterArray,
  FnMapFilterObject,
  SyncAssign,
} from './actions';

import type { AnyMachine } from '../anyMachine';
import type {
  AsyncGuardUnion,
  DefinedValue,
  SyncGuardUnion,
  ValueDefined,
  ValueIs,
} from './guards.types';
import type { EventArg, EventsMapFrom } from './inferers';

export type * from './inferers';
export type * from './types';

export type {
  AsyncActionHelper,
  AsyncAssign,
  AsyncGuardUnion,
  AsyncOptions,
  DefinedValue,
  Fn,
  FnMapFilterArray,
  FnMapFilterObject,
  SyncAssign,
  SyncGuardUnion,
  UtilityPair,
  ValueDefined,
  ValueIs,
};

/**
 * Contract followed by every addon: a synchronous and an asynchronous
 * variant of the same helper.
 *
 * It is the closed map of helpers injected into options callbacks. Plugins are
 * not declared here: they extend the surface through their own utility maps,
 * which flow through the generic parameters of `createOptions`.
 *
 * @template | {@linkcode Contract} `Ct` - Contract type.
 */
export type Addons<Ct extends Contract = Contract> = {
  /** Guard checking that a context path is defined. */
  isDefined: ValueDefined<Ct>;

  /** Guard checking that a context path is not defined. */
  isNotDefined: ValueDefined<Ct>;

  /** Guard checking that a context path matches one of the values. */
  isValue: ValueIs<Ct>;

  /** Guard checking that a context path matches none of the values. */
  isNotValue: ValueIs<Ct>;

  /** Batches multiple guards into a single one. */
  guardBatch: {
    sync: (...guards: SyncGuardUnion<Ct>[]) => FnR<Ct, boolean>;
    async: (...guards: AsyncGuardUnion<Ct>[]) => FnR<Ct, Promise<boolean>>;
  };

  /** Assigns context keys. */
  assign: { sync: SyncAssign<Ct>; async: AsyncAssign<Ct> };

  /** Batches multiple actions. */
  batch: {
    sync: (...fns: (SyncAction2<Ct> | undefined)[]) => SyncAction2<Ct>;
    async: (...fns: (AsyncAction2<Ct> | undefined)[]) => AsyncAction2<Ct>;
  };

  /** Repeats an action a fixed number of times. */
  _for: {
    sync: (
      count: number | FnMap<Ct, number>,
      fn: SyncAction2<Ct> | undefined,
    ) => SyncAction2<Ct>;
    async: (
      count: number | FnMap<Ct, MaybePromise<number>>,
      fn: AsyncAction2<Ct> | undefined,
    ) => AsyncAction2<Ct>;
  };

  /** Repeats an action while a predicate holds. */
  _while: {
    sync: (
      predicate: FnMap<Ct, boolean>,
      fn: SyncAction2<Ct> | undefined,
    ) => SyncAction2<Ct>;
    async: (
      predicate: FnMap<Ct, MaybePromise<boolean>>,
      fn: AsyncAction2<Ct> | undefined,
    ) => AsyncAction2<Ct>;
  };

  /** Repeats an action at least once while a predicate holds. */
  _doWhile: {
    sync: (
      predicate: FnMap<Ct, boolean>,
      fn: SyncAction2<Ct> | undefined,
    ) => SyncAction2<Ct>;
    async: (
      predicate: FnMap<Ct, MaybePromise<boolean>>,
      fn: AsyncAction2<Ct> | undefined,
    ) => AsyncAction2<Ct>;
  };

  /** Filters an array or object context property. */
  filter: {
    sync: CommonFilterAction<Ct, SyncAction2<Ct>>;
    async: CommonFilterAction<Ct, AsyncAction2<Ct>>;
  };

  /** Erases context properties. */
  erase: {
    sync: CommonEraseAction<Ct, SyncAction2<Ct>>;
    async: CommonEraseAction<Ct, AsyncAction2<Ct>>;
  };

  /** Creates an action running a side effect. */
  action: { sync: (fn: FnMap<Ct>) => SyncAction2<Ct>; async: AsyncActionHelper<Ct> };

  /** Sends an event to a child actor. */
  sendTo: {
    sync: <M extends AnyMachine>(
      _?: M,
    ) => <
      F extends { to: string; event: EventArg<EventsMapFrom<M>> } = {
        to: string;
        event: EventArg<EventsMapFrom<M>>;
      },
    >(
      fn: FnMap<Ct, F>,
    ) => SyncAction2<Ct>;

    async: <M extends AnyMachine>(
      _?: M,
    ) => <
      F extends
        | { to: string; event: EventArg<EventsMapFrom<M>> }
        | Promise<{ to: string; event: EventArg<EventsMapFrom<M>> }> =
        | { to: string; event: EventArg<EventsMapFrom<M>> }
        | Promise<{ to: string; event: EventArg<EventsMapFrom<M>> }>,
    >(
      fn: FnMap<Ct, F>,
      ...args: F extends Promise<{ to: string; event: EventArg<EventsMapFrom<M>> }>
        ? [AsyncOptions<Ct>]
        : []
    ) => AsyncAction2<Ct>;
  };

  /** Resends an event. */
  resend: {
    sync: (event: ContractEventArg<Ct>) => SyncAction2<Ct>;
    async: (event: ContractEventArg<Ct>) => AsyncAction2<Ct>;
  };

  /** Forcibly sends an event. */
  forceSend: {
    sync: (event: ContractEventArg<Ct>) => SyncAction2<Ct>;
    async: (event: ContractEventArg<Ct>) => AsyncAction2<Ct>;
  };

  /** Pauses an activity. */
  pauseActivity: {
    sync: (id: string) => SyncAction2<Ct>;
    async: (id: string) => AsyncAction2<Ct>;
  };

  /** Resumes an activity. */
  resumeActivity: {
    sync: (id: string) => SyncAction2<Ct>;
    async: (id: string) => AsyncAction2<Ct>;
  };

  /** Stops an activity. */
  stopActivity: {
    sync: (id: string) => SyncAction2<Ct>;
    async: (id: string) => AsyncAction2<Ct>;
  };

  /** Pauses a timer. */
  pauseTimer: {
    sync: (id: string) => SyncAction2<Ct>;
    async: (id: string) => AsyncAction2<Ct>;
  };

  /** Resumes a timer. */
  resumeTimer: {
    sync: (id: string) => SyncAction2<Ct>;
    async: (id: string) => AsyncAction2<Ct>;
  };

  /** Stops a timer. */
  stopTimer: {
    sync: (id: string) => SyncAction2<Ct>;
    async: (id: string) => AsyncAction2<Ct>;
  };
};

/** Synchronous helper surface resolved from {@linkcode Addons}. */
export type SyncAddons<Ct extends Contract = Contract> = ResolveUtilities<
  Addons<Ct>,
  'sync'
>;

/** Asynchronous helper surface resolved from {@linkcode Addons}. */
export type AsyncAddons<Ct extends Contract = Contract> = ResolveUtilities<
  Addons<Ct>,
  'async'
>;
