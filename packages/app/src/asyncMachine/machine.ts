import type { AsyncAction } from '#actions';

import { type DelayFunction } from '#delays';
import { type FlatMapN } from '#states';
import {
  buildHelpers,
  type Contract,
  type ContractConfig,
  type OptionsPlugin,
} from '@bemedev/app-options';
import { _unknown } from '@bemedev/app-options/bemedev';

import type { CommonCreateMachine_F, SimpleMachineOptions2 } from '#common/machine';

import type { AsyncPredicateS } from '#guards';

import { CommonMachine } from '../common/machine';
import type { EmptyObject } from '~types';
import type { AsyncAddOptions_F, AsyncProvideOptions_F } from './machine.types';

/**
 * A class representing an asynchronous state machine.
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
export class AsyncMachine<
  const Ct extends Contract = Contract,
  const L extends SimpleMachineOptions2 = EmptyObject,
  const Ps extends readonly OptionsPlugin<any, any>[] = [],
> extends CommonMachine<Ct> {
  /**
   * Machine type identifier string.
   */
  readonly TYPE = 'async';

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
   * @deprecated
   * This property provides the action function for this class {@linkcode AsyncMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The action function type of the machine.
   */
  get __actionFn() {
    return _unknown<AsyncAction<Ct>>();
  }

  /**
   * @deprecated
   * This property provides the predicate function for this class {@linkcode AsyncMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The async predicate function type of the machine.
   */
  get __predicate() {
    return _unknown<AsyncPredicateS<Ct>>();
  }

  /**
   * @deprecated
   * This property provides the delay function for this class {@linkcode AsyncMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The delay function type of the machine.
   */
  get __delay() {
    return _unknown<DelayFunction<Ct>>();
  }

  // #endregion

  /**
   * The public accessor for the flat map representation of the configuration.
   *
   * @returns The flat map of state nodes.
   */
  get flat() {
    return this.__flat as FlatMapN<ContractConfig<Ct>, true>;
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
  createOptions: AsyncAddOptions_F<Ct, L, Ps> = helper => {
    const _legacy = Object.freeze({
      actions: this.__elements.actions,
      guards: this.__elements.guards,
      delays: this.__elements.delays,
      actors: this.__elements.actions,
    }) as any;

    const helpers = buildHelpers({
      contract: this.contract,
      plugins: this.__plugins,
      legacy: { _legacy },
    }) as any;

    return helper(helpers, { _legacy }) as any;
  };

  /**
   * Provides elements of the machine.
   *
   * @param helper - Option helper callback.
   *
   * @returns Machine options structure.
   */
  addOptions: AsyncAddOptions_F<Ct, L, Ps> = helper => {
    return super.addOptions(helper) as any;
  };

  /**
   * Provides options for the machine.
   *
   * @param helper - A function that provides options for the machine.
   *
   * @returns A new instance of the machine with the provided options applied.
   */
  provideOptions: AsyncProvideOptions_F<Ct, L, Ps> = helper =>
    super.provideOptions(helper);

  // #endregion

  /**
   * Renews the machine with current configuration.
   *
   * @returns A new instance of this class {@linkcode AsyncMachine}.
   */
  protected __renew = (): this => {
    const { pContext, context, guards, actions, delays, actors } = this.__elements;

    const out = new AsyncMachine<Ct, L, Ps>(this.contract, this.__plugins);

    out.__pContext = pContext;
    out.__context = context;

    out.addOptions(() => ({ guards, actions, delays, actors }) as any);

    return out as any;
  };

  /**
   * Flag indicating whether the machine contains long-running operations.
   */
  readonly longRuns: boolean;

  /**
   * Creates an instance of class {@linkcode AsyncMachine}.
   *
   * @param contract - Contract carrying the machine configuration.
   */
  constructor(contract: Ct, plugins: readonly OptionsPlugin<any, any>[] = []) {
    super(contract, plugins);
    this.longRuns = this.config.__longRuns === true;
  }
}

/**
 * Helper function to create a new instance of class {@linkcode AsyncMachine}.
 *
 * @param contract - Contract carrying the machine configuration.
 *
 * @returns A new instance of class {@linkcode AsyncMachine}.
 */
export const createAsyncMachine: CommonCreateMachine_F = (contract, plugins) => {
  return new AsyncMachine(contract, plugins);
};
