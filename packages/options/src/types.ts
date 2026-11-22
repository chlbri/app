/**
 * Public typing surface of `@bemedev/app-options`.
 *
 * The option helpers mirror the ones injected by `machine.createOptions`, but
 * their generic parameters are resolved from a contract instead of a machine
 * instance. The `sync` flag carried by the contract selects the synchronous or
 * the asynchronous surface, and plugins extend it through their additive
 * utility maps.
 */

import type {
  AsyncAction2,
  Contract,
  ContractOptions,
  ContractSync,
} from '@bemedev/app-contract';
import type { ResolveUtilities, UtilityMode } from './utility';
import { AsyncAddons, BaseAddons, SyncAddons } from './addons';
import type { OptionsPlugin, PluginAddons } from './plugins';
import type { LegacyOptions } from './utility/plugin';

export type { LegacyOptions } from './utility/plugin';

/**
 * Extra options accepted by async action helpers.
 *
 * @template | {@linkcode Contract} `C` - Contract type.
 */
export type AsyncOptions<C extends Contract = Contract> = {
  /** Called with the thrown error when the async function rejects. */
  catch: (err: any) => AsyncAction2<C>;
  /** Optional action executed upon success. */
  then?: AsyncAction2<C>;
  /** Maximum duration in milliseconds before the action is aborted. */
  max?: number;
};

/**
 * Helper surface injected into an options callback.
 *
 * `Ps` accumulates the plugins applied to the `createOptions` call, so their
 * utilities are visible in the callback parameters.
 *
 * @template | {@linkcode Contract} `C` - Contract type.
 * @template | {@linkcode UtilityMode} `M` - Execution mode.
 * @template `Ps` - Plugins applied to the call.
 */
export type OptionsHelpers<
  C extends Contract,
  M extends UtilityMode,
  Ps extends readonly OptionsPlugin<any, C>[] = [],
> = [Ps[number]] extends [never]
  ? ResolveUtilities<BaseAddons<C>, M>
  : ResolveUtilities<BaseAddons<C>, M> & ResolveUtilities<PluginAddons<Ps>, M>;

/**
 * Synchronous helper surface of a contract.
 *
 * @template | {@linkcode Contract} `C` - Contract type.
 *
 * @deprecated Use {@linkcode SyncAddons} instead.
 */
export type SyncOptionsHelpers<C extends Contract> = SyncAddons<C>;

/**
 * Asynchronous helper surface of a contract.
 *
 * @template | {@linkcode Contract} `C` - Contract type.
 *
 * @deprecated Use {@linkcode AsyncAddons} instead.
 */
export type AsyncOptionsHelpers<C extends Contract> = AsyncAddons<C>;

/**
 * Options helper callback resolved from the contract's `sync` flag.
 *
 * @template | {@linkcode Contract} `C` - Contract type.
 * @template `O` - Resulting machine options type.
 * @template `Ps` - Plugins applied to the call.
 */
export type OptionsHelper<
  C extends Contract,
  O = ContractOptions<C>,
  Ps extends readonly OptionsPlugin<any, C>[] = [],
> =
  ContractSync<C> extends true
    ? (option: OptionsHelpers<C, 'sync', Ps>, legacy: LegacyOptions<C>) => O
    : (option: OptionsHelpers<C, 'async', Ps>, legacy: LegacyOptions<C>) => O;

/**
 * Curried options callable carrying the applied plugins.
 *
 * @template | {@linkcode Contract} `C` - Contract type.
 * @template `Ps` - Plugins already applied.
 */
export type CreateOptionsWith<
  C extends Contract,
  Ps extends readonly OptionsPlugin<any, C>[] = [],
> = {
  /**
   * Builds the options object.
   *
   * @param helper - Options callback receiving the resolved helpers.
   */
  <const O extends ContractOptions<C>>(helper: OptionsHelper<C, O, Ps>): O;

  /**
   * Applies one or more plugins to this callable.
   *
   * @param plugins - Plugins to apply.
   */
  use<const Qs extends readonly OptionsPlugin<any, C>[]>(
    ...plugins: Qs
  ): CreateOptionsWith<C, [...Ps, ...Qs]>;
};

/**
 * Curried `createOptions` signature.
 *
 * The returned function accepts an options callback and produces the machine
 * options object, typed with the contract option surface. Plugins can be
 * passed once or chained with `use`.
 *
 * @example
 * ```ts
 * const options = createOptions(contract)(({ assign }) => ({
 *   actions: { increment: assign('context.count', ({ context }) => context.count + 1) },
 * }));
 * ```
 *
 * @example
 * ```ts
 * const options = createOptions(contract, retryPlugin)(({ retry }) => ({
 *   actions: { load: retry(3, fetchAction) },
 * }));
 * ```
 */
export type CreateOptions_F = <
  const C extends Contract,
  const Ps extends readonly OptionsPlugin<any, C>[] = [],
>(
  contract: C,
  ...plugins: Ps
) => CreateOptionsWith<C, Ps>;
