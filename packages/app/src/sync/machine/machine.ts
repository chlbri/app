import type { SyncAction2 } from '#actions';

import type { CommonCreateMachine_F, SimpleMachineOptions2 } from '#common/machine';
import type { DelayFunction } from '#delays';
import { type AsyncPredicateS } from '#guards';
import type { FlatMapN } from '#states';
import type { Contract, ContractConfig, OptionsPlugin } from '@bemedev/app-options';
import { _unknown } from '@bemedev/app-options/bemedev';
import { buildHelpers } from '@bemedev/app-options';
import { CommonMachine } from '../../common/machine';
import type { SyncAddOptions_F, SyncProvideOptions_F } from './options.types';

/**
 * A class representing a synchronous state machine.
 * It provides methods to manage states, actions, guards, delays, promises, and machines.
 *
 * The class is parameterized by a contract: every member type is read from it
 * instead of being declared independently. The second parameter `L` is not part
 * of the contract: it accumulates the options of chained `provideOptions`
 * calls.
 *
 * @template | {@linkcode Contract} `Ct` - Contract describing the machine.
 * @template | {@linkcode SimpleMachineOptions2} `L` - Accumulated options.
 */
export class SyncMachine<
  const Ct extends Contract = Contract,
  const L extends SimpleMachineOptions2 = SimpleMachineOptions2,
  const Ps extends readonly OptionsPlugin<any, any>[] = [],
> extends CommonMachine<Ct> {
  /**
   * Machine type identifier string.
   */
  readonly TYPE = 'sync';

  /**
   * Plugins attached to this machine.
   *
   * @remarks Used for typing purposes only; the runtime value lives on
   * {@linkcode CommonMachine}.
   */
  declare readonly __plugins: Ps;

  /**
   * Accumulated options type marker.
   *
   * @remarks Used for typing purposes only.
   */
  declare readonly __legacy: L;

  /**
   * @deprecated Use the action function type.
   *
   * @returns The action function type of the machine.
   */
  get __actionFn() {
    return _unknown<SyncAction2<Ct>>();
  }

  /**
   * The public accessor for the flat map representation of the configuration.
   *
   * @returns The flat map of state nodes.
   */
  get flat() {
    return this.__flat as FlatMapN<ContractConfig<Ct>, true>;
  }

  /**
   * @deprecated Use the predicate function type.
   *
   * @returns The async predicate function type of the machine.
   */
  get __predicate() {
    return _unknown<AsyncPredicateS<Ct>>();
  }

  /**
   * @deprecated Use the delay function type.
   *
   * @returns The delay function type of the machine.
   */
  get __delay() {
    return _unknown<DelayFunction<Ct>>();
  }

  // #region Providers

  /**
   * Create options for the machine.
   *
   * @param helper - A function that provides options for the machine.
   * Options can include actions, guards, delays, promises, and child machines.
   *
   * @returns Option object for machine customization.
   */
  createOptions: SyncAddOptions_F<Ct, L, Ps> = helper => {
    const _legacy = Object.freeze({
      actions: this.__elements.actions,
      guards: this.__elements.guards,
      delays: this.__elements.delays,
      actors: this.__elements.actors,
    }) as any;

    const helpers = buildHelpers({
      contract: this.contract,
      plugins: this.__plugins,
    }) as any;

    return helper(helpers, { _legacy });
  };

  /**
   * Provides elements of the machine.
   *
   * @param helper - Option helper callback.
   *
   * @returns Machine options structure.
   */
  addOptions: SyncAddOptions_F<Ct, L, Ps> = helper => {
    return super.addOptions(helper) as any;
  };

  /**
   * Provides options for the machine.
   *
   * @param helper - A function that provides options for the machine.
   *
   * @returns A new instance of the machine with the provided options applied.
   */
  provideOptions: SyncProvideOptions_F<Ct, L, Ps> = helper =>
    super.provideOptions(helper);

  // #endregion

  /**
   * Renews the machine with current configuration.
   *
   * @returns A new instance of this class {@linkcode SyncMachine}.
   */
  protected __renew = (): this => {
    const { pContext, context, guards, actions, delays, actors } = this.__elements;

    const out = new SyncMachine<Ct, L, Ps>(this.contract, this.__plugins);

    out.__pContext = pContext;
    out.__context = context;

    out.addOptions(() => ({ guards, actions, delays, actors }) as any);

    return out as any;
  };
}

/**
 * Creates a new synchronous state machine instance.
 *
 * @param contract - Contract carrying the machine configuration.
 *
 * @returns Instance of class {@linkcode SyncMachine}.
 */
export const createSyncMachine: CommonCreateMachine_F = (contract, plugins) => {
  return new SyncMachine(contract, plugins);
};
