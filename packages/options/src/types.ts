/**
 * Public typing surface of `@bemedev/app-options`.
 *
 * The option helpers mirror the ones injected by `machine.createOptions`, but
 * their generic parameters are resolved from a contract instead of a machine
 * instance. The `sync` flag carried by the contract selects the synchronous or
 * the asynchronous surface.
 */

import type {
  AsyncAction2,
  AsyncPredicateS,
  Contract,
  ContractContext,
  ContractEventArg,
  ContractEvents,
  ContractOptions,
  ContractPContext,
  ContractSync,
  EventObject,
  FnMap,
  FnR,
  PrimitiveObject,
  SyncAction2,
  SyncPredicateS,
} from '@bemedev/app-contract';

/**
 * Extra options accepted by async action helpers.
 *
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
export type AsyncOptions<
  Eo extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  /** Called with the thrown error when the async function rejects. */
  catch: (err: any) => AsyncAction2<Eo, Pc, Tc, T>;
  /** Optional action executed upon success. */
  then?: AsyncAction2<Eo, Pc, Tc, T>;
  /** Maximum duration in milliseconds before the action is aborted. */
  max?: number;
};

/**
 * Async action helper accepting optional {@linkcode AsyncOptions}.
 *
 * @template | {@linkcode Contract} `C` - Contract type.
 * @template `F` - Handler return type.
 */
type AsyncActionHelper<C extends Contract, F = any> =
  F extends Promise<any>
    ? (
        fn: FnMap<
          ContractEvents<C>,
          ContractPContext<C>,
          ContractContext<C>,
          string,
          F
        >,
        options: AsyncOptions<
          ContractEvents<C>,
          ContractPContext<C>,
          ContractContext<C>
        >,
      ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>
    : (
        fn: FnMap<
          ContractEvents<C>,
          ContractPContext<C>,
          ContractContext<C>,
          string,
          F
        >,
        options?: AsyncOptions<
          ContractEvents<C>,
          ContractPContext<C>,
          ContractContext<C>
        >,
      ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;

/** Union of synchronous guard items accepted by `guardBatch`. */
type SyncGuardUnion<C extends Contract> =
  | undefined
  | SyncPredicateS<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>
  | { and: SyncGuardUnion<C>[] }
  | { or: SyncGuardUnion<C>[] };

/** Union of asynchronous guard items accepted by `guardBatch`. */
type AsyncGuardUnion<C extends Contract> =
  | undefined
  | AsyncPredicateS<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>
  | { and: AsyncGuardUnion<C>[] }
  | { or: AsyncGuardUnion<C>[] };

/** Synchronous `assign` overloads. */
type SyncAssign<C extends Contract> = {
  <const K extends string, R = any>(
    keys: K | readonly K[],
    fn: FnMap<ContractEvents<C>, ContractPContext<C>, ContractContext<C>, string, R>,
  ): SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  (
    fn: FnMap<
      ContractEvents<C>,
      ContractPContext<C>,
      ContractContext<C>,
      string,
      ContractContext<C>
    >,
  ): SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
};

/** Asynchronous `assign` overloads. */
type AsyncAssign<C extends Contract> = {
  <const K extends string, R = any>(
    keys: K | readonly K[],
    fn: FnMap<
      ContractEvents<C>,
      ContractPContext<C>,
      ContractContext<C>,
      string,
      MaybePromise<R>
    >,
    options?: AsyncOptions<
      ContractEvents<C>,
      ContractPContext<C>,
      ContractContext<C>
    >,
  ): AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  (
    fn: FnMap<
      ContractEvents<C>,
      ContractPContext<C>,
      ContractContext<C>,
      string,
      MaybePromise<ContractContext<C>>
    >,
    options?: AsyncOptions<
      ContractEvents<C>,
      ContractPContext<C>,
      ContractContext<C>
    >,
  ): AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
};

/** Value that may be wrapped in a promise. */
type MaybePromise<T> = T | Promise<T>;

/**
 * Helper surface injected into a synchronous options callback.
 *
 * @template | {@linkcode Contract} `C` - Contract type.
 */
export type SyncOptionsHelpers<C extends Contract> = {
  /** Guard checking that a context path is defined. */
  isDefined: (
    path: string,
  ) => FnR<
    ContractEvents<C>,
    ContractPContext<C>,
    ContractContext<C>,
    string,
    boolean
  >;
  /** Guard checking that a context path is not defined. */
  isNotDefined: (
    path: string,
  ) => FnR<
    ContractEvents<C>,
    ContractPContext<C>,
    ContractContext<C>,
    string,
    boolean
  >;
  /** Guard checking that a context path matches one of the values. */
  isValue: (
    path: string,
    ...values: any[]
  ) => FnR<
    ContractEvents<C>,
    ContractPContext<C>,
    ContractContext<C>,
    string,
    boolean
  >;
  /** Guard checking that a context path matches none of the values. */
  isNotValue: (
    path: string,
    ...values: any[]
  ) => FnR<
    ContractEvents<C>,
    ContractPContext<C>,
    ContractContext<C>,
    string,
    boolean
  >;
  /** Batches multiple guards into a single one. */
  guardBatch: (
    ...guards: SyncGuardUnion<C>[]
  ) => FnR<
    ContractEvents<C>,
    ContractPContext<C>,
    ContractContext<C>,
    string,
    boolean
  >;
  /** Swaps state arguments in functional transitions. */
  swap: <F extends (...args: any[]) => any, Ev extends string = string>(
    fn: F,
    event?: Ev,
  ) => (
    types: any,
  ) => FnR<
    ContractEvents<C>,
    ContractPContext<C>,
    ContractContext<C>,
    string,
    ReturnType<F>
  >;
  /** Assigns context keys. */
  assign: SyncAssign<C>;
  /** Batches multiple actions. */
  batch: (
    ...fns: (
      | SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>
      | undefined
    )[]
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Repeats an action a fixed number of times. */
  _for: (
    count:
      | number
      | FnMap<
          ContractEvents<C>,
          ContractPContext<C>,
          ContractContext<C>,
          string,
          number
        >,
    fn:
      | SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>
      | undefined,
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Repeats an action while a predicate holds. */
  _while: (
    predicate: FnMap<
      ContractEvents<C>,
      ContractPContext<C>,
      ContractContext<C>,
      string,
      boolean
    >,
    fn:
      | SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>
      | undefined,
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Repeats an action at least once while a predicate holds. */
  _doWhile: (
    predicate: FnMap<
      ContractEvents<C>,
      ContractPContext<C>,
      ContractContext<C>,
      string,
      boolean
    >,
    fn:
      | SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>
      | undefined,
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Filters an array or object context property. */
  filter: (
    key: string,
    fn: any,
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Erases context properties. */
  erase: (
    ...keys: string[]
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Creates an action running a side effect. */
  action: (
    fn: FnMap<
      ContractEvents<C>,
      ContractPContext<C>,
      ContractContext<C>,
      string,
      any
    >,
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Sends an event to a child actor. */
  sendTo: () => (
    fn: FnMap<
      ContractEvents<C>,
      ContractPContext<C>,
      ContractContext<C>,
      string,
      { to: string; event: ContractEventArg<C> }
    >,
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Resends an event. */
  resend: (
    event: ContractEventArg<C>,
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Forcibly sends an event. */
  forceSend: (
    event: ContractEventArg<C>,
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Pauses an activity. */
  pauseActivity: (
    id: string,
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Resumes an activity. */
  resumeActivity: (
    id: string,
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Stops an activity. */
  stopActivity: (
    id: string,
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Pauses a timer. */
  pauseTimer: (
    id: string,
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Resumes a timer. */
  resumeTimer: (
    id: string,
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Stops a timer. */
  stopTimer: (
    id: string,
  ) => SyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
};

/**
 * Helper surface injected into an asynchronous options callback.
 *
 * @template | {@linkcode Contract} `C` - Contract type.
 */
export type AsyncOptionsHelpers<C extends Contract> = {
  /** Guard checking that a context path is defined. */
  isDefined: (
    path: string,
  ) => FnR<
    ContractEvents<C>,
    ContractPContext<C>,
    ContractContext<C>,
    string,
    MaybePromise<boolean>
  >;
  /** Guard checking that a context path is not defined. */
  isNotDefined: (
    path: string,
  ) => FnR<
    ContractEvents<C>,
    ContractPContext<C>,
    ContractContext<C>,
    string,
    MaybePromise<boolean>
  >;
  /** Guard checking that a context path matches one of the values. */
  isValue: (
    path: string,
    ...values: any[]
  ) => FnR<
    ContractEvents<C>,
    ContractPContext<C>,
    ContractContext<C>,
    string,
    MaybePromise<boolean>
  >;
  /** Guard checking that a context path matches none of the values. */
  isNotValue: (
    path: string,
    ...values: any[]
  ) => FnR<
    ContractEvents<C>,
    ContractPContext<C>,
    ContractContext<C>,
    string,
    MaybePromise<boolean>
  >;
  /** Batches multiple guards into a single one. */
  guardBatch: (
    ...guards: AsyncGuardUnion<C>[]
  ) => FnR<
    ContractEvents<C>,
    ContractPContext<C>,
    ContractContext<C>,
    string,
    Promise<boolean>
  >;
  /** Swaps state arguments in functional transitions. */
  swap: <F extends (...args: any[]) => any, Ev extends string = string>(
    fn: F,
    event?: Ev,
  ) => (
    types: any,
  ) => FnR<
    ContractEvents<C>,
    ContractPContext<C>,
    ContractContext<C>,
    string,
    ReturnType<F>
  >;
  /** Assigns context keys. */
  assign: AsyncAssign<C>;
  /** Batches multiple actions. */
  batch: (
    ...fns: (
      | AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>
      | undefined
    )[]
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Repeats an action a fixed number of times. */
  _for: (
    count:
      | number
      | FnMap<
          ContractEvents<C>,
          ContractPContext<C>,
          ContractContext<C>,
          string,
          MaybePromise<number>
        >,
    fn:
      | AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>
      | undefined,
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Repeats an action while a predicate holds. */
  _while: (
    predicate: FnMap<
      ContractEvents<C>,
      ContractPContext<C>,
      ContractContext<C>,
      string,
      MaybePromise<boolean>
    >,
    fn:
      | AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>
      | undefined,
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Repeats an action at least once while a predicate holds. */
  _doWhile: (
    predicate: FnMap<
      ContractEvents<C>,
      ContractPContext<C>,
      ContractContext<C>,
      string,
      MaybePromise<boolean>
    >,
    fn:
      | AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>
      | undefined,
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Filters an array or object context property. */
  filter: (
    key: string,
    fn: any,
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Erases context properties. */
  erase: (
    ...keys: string[]
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Creates an action running a side effect. */
  action: AsyncActionHelper<C>;
  /** Sends an event to a child actor. */
  sendTo: () => <
    F extends { to: string; event: ContractEventArg<C> } = {
      to: string;
      event: ContractEventArg<C>;
    },
  >(
    fn: FnMap<
      ContractEvents<C>,
      ContractPContext<C>,
      ContractContext<C>,
      string,
      MaybePromise<F>
    >,
    options?: AsyncOptions<
      ContractEvents<C>,
      ContractPContext<C>,
      ContractContext<C>
    >,
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Resends an event. */
  resend: (
    event: ContractEventArg<C>,
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Forcibly sends an event. */
  forceSend: (
    event: ContractEventArg<C>,
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Pauses an activity. */
  pauseActivity: (
    id: string,
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Resumes an activity. */
  resumeActivity: (
    id: string,
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Stops an activity. */
  stopActivity: (
    id: string,
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Pauses a timer. */
  pauseTimer: (
    id: string,
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Resumes a timer. */
  resumeTimer: (
    id: string,
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
  /** Stops a timer. */
  stopTimer: (
    id: string,
  ) => AsyncAction2<ContractEvents<C>, ContractPContext<C>, ContractContext<C>>;
};

/** Access to previously defined options. */
export type LegacyOptions<C extends Contract> = {
  /** Previously defined options, empty for a freshly built contract. */
  _legacy: ContractOptions<C>;
};

/**
 * Options helper callback resolved from the contract's `sync` flag.
 *
 * @template | {@linkcode Contract} `C` - Contract type.
 * @template `O` - Resulting machine options type.
 */
export type OptionsHelper<C extends Contract, O = ContractOptions<C>> =
  ContractSync<C> extends true
    ? (option: SyncOptionsHelpers<C>, legacyOptions: LegacyOptions<C>) => O
    : (option: AsyncOptionsHelpers<C>, legacyOptions: LegacyOptions<C>) => O;

/**
 * Curried `createOptions` signature.
 *
 * The returned function accepts an options callback and produces the machine
 * options object, typed with the contract option surface.
 *
 * @example
 * ```ts
 * const options = createOptions(contract)(({ assign }) => ({
 *   actions: { increment: assign('context.count', ({ context }) => context.count + 1) },
 * }));
 * ```
 */
export type CreateOptions_F = <const C extends Contract>(
  contract: C,
) => <const O extends ContractOptions<C>>(helper: OptionsHelper<C, O>) => O;
