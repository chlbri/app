import {
  Contract,
  FnMap,
  SyncAction2,
  ContractContext,
  MaybePromise,
  AsyncAction2,
} from '@bemedev/app-contract';

/**
 * Extra options accepted by async action helpers.
 *
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
export type AsyncOptions<C extends Contract = Contract> = {
  /** Called with the thrown error when the async function rejects. */
  catch: (err: any) => AsyncAction2<C>;
  /** Optional action executed upon success. */
  then?: AsyncAction2<C>;
  /** Maximum duration in milliseconds before the action is aborted. */
  max?: number;
};

export type SyncAssign<C extends Contract> = {
  <const K extends string, R = any>(
    keys: K | readonly K[],
    fn: FnMap<C, R>,
  ): SyncAction2<C>;
  (fn: FnMap<C, ContractContext<C>>): SyncAction2<C>;
};

/** Asynchronous `assign` overloads. */
export type AsyncAssign<C extends Contract> = {
  <const K extends string, R = any>(
    keys: K | readonly K[],
    fn: FnMap<C, MaybePromise<R>>,
    options?: AsyncOptions<C>,
  ): AsyncAction2<C>;
  (
    fn: FnMap<C, MaybePromise<ContractContext<C>>>,
    options?: AsyncOptions<C>,
  ): AsyncAction2<C>;
};

type AsyncArgs<F, C extends Contract> =
  F extends Promise<any> ? [options: AsyncOptions<C>] : [];

/**
 * Async action helper accepting optional {@linkcode AsyncOptions}.
 *
 * @template | {@linkcode Contract} `C` - Contract type.
 * @template `F` - Handler return type.
 */
export type AsyncActionHelper<C extends Contract> = <const F>(
  fn: FnMap<C, F>,
  ...args: AsyncArgs<F, C>
) => AsyncAction2<C>;
