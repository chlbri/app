import {
  AsyncAction2,
  Contract,
  ContractContext,
  FnMap,
  SyncAction2,
} from '@bemedev/app-contract';
import type {
  DecomposeC,
  SingleOrArrayL2,
  TraversableTupleAsync,
  TraversableTupleSync,
} from './types';

export type ErrorFn<Ct extends Contract = Contract> = <Err>(
  err: Err,
) => AsyncAction2<Ct>;

/**
 * Extra options accepted by async action helpers.
 *
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
export type AsyncOptions<C extends Contract = Contract> = {
  /**
   * Called with the thrown error and current context snapshot when
   * the async function rejects. Return value is merged as ActionResult.
   * When omitted, rejection propagates to interpreter's `_addError` channel.
   *
   * @see -- type {@linkcode ErrorFn}
   */
  catch: ErrorFn<C>;

  /** Optional action executed upon success. */
  then?: AsyncAction2<C>;

  /** Maximum duration in milliseconds before the action is aborted. */
  max?: number;
};

export type SyncAssign<
  Ct extends Contract = Contract,
  D = DecomposeC<ContractContext<Ct>>,
> = {
  <
    const K extends SingleOrArrayL2<keyof D>,
    const F extends TraversableTupleSync<D, K> = TraversableTupleSync<D, K>,
  >(
    keys: K,
    fn: FnMap<Ct, NoInfer<F>>,
  ): SyncAction2<Ct>;

  (fn: FnMap<Ct, ContractContext<Ct>>): SyncAction2<Ct>;
};

/**
 * Conditional rest arguments for async action helpers.
 *
 * Options are required when the handler returns a `Promise` and rejected for
 * synchronous handlers. When the return type cannot be resolved (for example
 * with an unannotated handler parameter), options stay optional instead of
 * being rejected.
 *
 * @template `F` - Handler return type.
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 */
type AsyncArgs<F, Ct extends Contract = Contract> = unknown extends F
  ? [AsyncOptions<Ct>?]
  : F extends Promise<any>
    ? [AsyncOptions<Ct>]
    : [];

/** Asynchronous `assign` overloads. */
export type AsyncAssign<
  Ct extends Contract = Contract,
  D = DecomposeC<ContractContext<Ct>>,
> = {
  <
    const K extends SingleOrArrayL2<keyof D>,
    const F extends TraversableTupleAsync<D, K> = TraversableTupleAsync<D, K>,
  >(
    keys: K,
    fn: FnMap<Ct, NoInfer<F>>,
    ...args: AsyncArgs<F, Ct>
  ): AsyncAction2<Ct>;

  <F extends ContractContext<Ct> | Promise<ContractContext<Ct>>>(
    fn: FnMap<Ct, F>,
    ...args: AsyncArgs<F, Ct>
  ): AsyncAction2<Ct>;
};

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
