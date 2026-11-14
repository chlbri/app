import type { AsyncAction } from '#actions';

import type { AsyncDelayFunction } from '#delays';
import { ActorsConfigMap, type EventObject, type EventsMap } from '#events';
import { type FlatMapN } from '#states';
import { createAsyncHelpers } from '@bemedev/app-options/internal';
import { _unknown } from '@bemedev/app-options/bemedev';

import {
  CommonMachine,
  type CommonConfig3,
  type CommonCreateMachine_F,
  type SimpleMachineOptions2,
} from '#common/machine';

import type { AsyncPredicateS } from '#guards';

import type { AsyncAddOptions_F, AsyncProvideOptions_F } from './machine.types';

import type { PrimitiveObject } from '@bemedev/typings';
import type { EmptyObject } from '~types';

/**
 * A class representing an asynchronous state machine.
 * It provides methods to manage states, actions, guards, delays, promises, and machines.
 *
 * @template | {@linkcode CommonConfig3} `C` - Configuration type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template | {@linkcode EventsMap} `E` - Events map type.
 * @template | {@linkcode ActorsConfigMap} `A` - Actors configuration map type.
 * @template `Ta` - Tag string type.
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 * @template `AllPaths` - All state paths type.
 * @template | {@linkcode SimpleMachineOptions2} `Mo` - Machine options type.
 * @template | {@linkcode SimpleMachineOptions2} `L` - Additional options type.
 */

export class AsyncMachine<
  const C extends CommonConfig3 = CommonConfig3,
  const Pc = any,
  const Tc extends PrimitiveObject = PrimitiveObject,
  const E extends EventsMap = EventsMap,
  const A extends ActorsConfigMap = ActorsConfigMap,
  const Ta extends string = string,
  const Eo extends EventObject = EventObject,
  const AllPaths extends string = string,
  const Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  const L extends SimpleMachineOptions2 = EmptyObject,
> extends CommonMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo> {
  /**
   * Machine type identifier string.
   */
  readonly TYPE = 'async';

  /**
   * @deprecated
   * This property provides the action function for this class {@linkcode AsyncMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The action function type of the machine.
   */
  get __actionFn() {
    return _unknown<AsyncAction<Eo, Pc, Tc, Ta>>();
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
    return _unknown<AsyncPredicateS<Eo, Pc, Tc, Ta>>();
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
    return _unknown<AsyncDelayFunction<Eo, Pc, Tc, Ta>>();
  }

  // #endregion

  /**
   * The public accessor for the flat map representation of the configuration.
   *
   * @returns The flat map of state nodes.
   */
  get flat() {
    return this.__flat as FlatMapN<C, true>;
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
  createOptions: AsyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
    const _legacy = Object.freeze({
      actions: this.__elements.actions,
      guards: this.__elements.guards,
      delays: this.__elements.delays,
      actors: this.__elements.actions,
    }) as any;

    const helpers = createAsyncHelpers(this.config) as any;

    return helper(helpers, { _legacy }) as any;
  };

  /**
   * Provides elements of the machine.
   *
   * @param helper - Option helper callback.
   *
   * @returns Machine options structure.
   */
  addOptions: AsyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
    return super.addOptions(helper) as any;
  };

  /**
   * Provides options for the machine.
   *
   * @param helper - A function that provides options for the machine.
   *
   * @returns A new instance of the machine with the provided options applied.
   */
  provideOptions: AsyncProvideOptions_F<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L> =
    helper => super.provideOptions(helper);

  // #endregion

  /**
   * Renews the machine with current configuration.
   *
   * @returns A new instance of this class {@linkcode AsyncMachine}.
   */
  protected __renew = (): this => {
    const { config, pContext, context, guards, actions, delays, actors } =
      this.__elements;

    const out = new AsyncMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>(config);

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
   * @param config - The configuration for the machine.
   */
  constructor(config: C) {
    super(config);
    this.longRuns = this.config.__longRuns === true;
  }
}

/**
 * Helper function to create a new instance of class {@linkcode AsyncMachine}.
 *
 * @param config - The machine configuration object.
 *
 * @returns A new instance of class {@linkcode AsyncMachine}.
 */
export const createAsyncMachine: CommonCreateMachine_F = config => {
  return new AsyncMachine(config);
};
