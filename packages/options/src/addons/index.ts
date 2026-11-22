import type {
  AsyncAction2,
  Contract,
  ContractEventArg,
  FnMap,
  FnR,
  MaybePromise,
  SyncAction2,
} from '@bemedev/app-contract';

import type { Fn } from '@bemedev/app-utils-bemedev';
import type { ResolveUtilities, UtilityMode, UtilityPair } from '../utility';

import { AsyncActionHelper, AsyncAssign, AsyncOptions, SyncAssign } from './actions';

import {
  AsyncGuardUnion,
  SyncGuardUnion,
  ValueDefined,
  ValueIs,
} from './guards.types';

/**
 * Open helper map that every addon extends: each key holds the synchronous and
 * the asynchronous variant of the same helper.
 */
export type _Addons = Record<string, UtilityPair<Fn, Fn>>;

/** Swaps state arguments in functional transitions. */
type Swap<C extends Contract> = <
  F extends (...args: any[]) => any,
  Ev extends string = string,
>(
  fn: F,
  event?: Ev,
) => (types: any) => FnR<C, ReturnType<F>>;

/**
 * Contract followed by every addon: a synchronous and an asynchronous
 * variant of the same helper.
 *
 * Augment this interface from a plugin package to expose its utilities to
 * `createOptions` callbacks. Augmentation only changes types: the plugin must
 * still be registered at runtime with `configureOptions` or
 * `registerOptionsPlugin`.
 *
 * @template | {@linkcode Contract} `Ct` - Contract type.
 */
export interface Addons<Ct extends Contract = Contract> extends _Addons {
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

  /** Swaps state arguments in functional transitions. */
  swap: { sync: Swap<Ct>; async: Swap<Ct> };

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
    sync: (key: string, fn: any) => SyncAction2<Ct>;
    async: (key: string, fn: any) => AsyncAction2<Ct>;
  };

  /** Erases context properties. */
  erase: {
    sync: (...keys: string[]) => SyncAction2<Ct>;
    async: (...keys: string[]) => AsyncAction2<Ct>;
  };

  /** Creates an action running a side effect. */
  action: { sync: (fn: FnMap<Ct>) => SyncAction2<Ct>; async: AsyncActionHelper<Ct> };

  /** Sends an event to a child actor. */
  sendTo: {
    sync: () => (
      fn: FnMap<Ct, { to: string; event: ContractEventArg<Ct> }>,
    ) => SyncAction2<Ct>;
    async: () => <
      F extends { to: string; event: ContractEventArg<Ct> } = {
        to: string;
        event: ContractEventArg<Ct>;
      },
    >(
      fn: FnMap<Ct, MaybePromise<F>>,
      options?: AsyncOptions<Ct>,
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
}

/** Keeps a declared key, dropping index signatures such as `string`. */
type _DefinedKey<K> = [K] extends [string] ? (string extends K ? never : K) : never;

/** Keeps declared keys only, dropping the `_Addons` index signature. */
type _DefinedKeys<T> = { [K in keyof T as _DefinedKey<K>]: T[K] };

/**
 * Closed descriptor map declared by the package, without the `_Addons` index
 * signature.
 *
 * It stays closed so that an unknown helper name is a compile error, while
 * {@linkcode Addons} remains an augmentable interface for plugin packages.
 */
export type BaseAddons<Ct extends Contract = Contract> = _DefinedKeys<Addons<Ct>>;

/** Synchronous helper surface resolved from {@linkcode Addons}. */
export type SyncAddons<Ct extends Contract = Contract> = ResolveUtilities<
  BaseAddons<Ct>,
  'sync'
>;

/** Asynchronous helper surface resolved from {@linkcode Addons}. */
export type AsyncAddons<Ct extends Contract = Contract> = ResolveUtilities<
  BaseAddons<Ct>,
  'async'
>;

/**
 * Resolves only the addons not already declared by the consumer.
 *
 * Machine option surfaces declare their own built-in helpers, so they use this
 * type to remap every *extra* key of {@linkcode Addons} — typically utilities
 * added by module augmentation in a plugin package — without replacing their
 * more precise built-in signatures.
 *
 * @template | {@linkcode Contract} `Ct` - Contract type.
 * @template | {@linkcode UtilityMode} `M` - Execution mode.
 * @template `Declared` - Keys already declared by the consumer.
 */
export type AugmentedAddons<
  Ct extends Contract = Contract,
  M extends UtilityMode = 'sync',
  Declared extends PropertyKey = never,
> = ResolveUtilities<
  Pick<BaseAddons<Ct>, Exclude<keyof BaseAddons<Ct>, Declared>>,
  M
>;
