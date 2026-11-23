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
import type { ResolveUtilities, UtilityMap, UtilityMode } from './utility';
import { Addons, AsyncAddons, SyncAddons } from './addons';
import type { OptionsPlugin, PluginAddons } from './utility/plugin';
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
  ? ResolveUtilities<Addons<C>, M>
  : ResolveUtilities<Addons<C>, M> & ResolveUtilities<PluginAddons<Ps>, M>;

/**
 * Utilities available to an inline `use` builder: every default helper plus
 * the utilities added by the plugins already applied to the callable.
 *
 * @template | {@linkcode Contract} `C` - Contract type.
 * @template `Ps` - Plugins already applied.
 */
export type UseHelpers<
  C extends Contract,
  Ps extends readonly OptionsPlugin<any, C>[] = [],
> = Addons<C> & PluginAddons<Ps>;

/**
 * Inline builder accepted by the function form of `use`.
 *
 * It receives the contract and the descriptor map built so far, and returns
 * the utilities to add.
 *
 * @template | {@linkcode Contract} `C` - Contract type.
 * @template `Ps` - Plugins already applied when the builder runs.
 * @template | {@linkcode UtilityMap} `R` - Utilities added by the builder.
 */
export type UseBuilder<
  C extends Contract,
  Ps extends readonly OptionsPlugin<any, C>[] = [],
  R extends UtilityMap = UtilityMap,
> = (args: { contract: C; utilities: UseHelpers<C, Ps> }) => R;

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
   * Applies utilities built from the contract and the utilities already
   * available.
   *
   * @param builder - Receives `{ contract, utilities }` and returns the
   * utilities to add.
   */
  use<const R extends OptionsPlugin<any, C>>(
    builder: UseBuilder<C, Ps, R>,
  ): CreateOptionsWith<C, [...Ps, R]>;

  /**
   * Applies one or more plugins to this callable.
   *
   * @param plugins - Plugins to apply.
   */
  use<const Qs extends readonly OptionsPlugin<any, C>[]>(
    ...plugins: Qs
  ): CreateOptionsWith<C, [...Ps, ...Qs]>;
};
