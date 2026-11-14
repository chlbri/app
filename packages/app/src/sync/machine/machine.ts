import type { SyncAction2 } from '#actions';

import type {
  CommonConfig3,
  CommonCreateMachine_F,
  SimpleMachineOptions2,
} from '#common/machine';
import type { SyncDelayFunction } from '#delays';
import type { ActorsConfigMap, EventObject, EventsMap } from '#events';
import { type AsyncPredicateS } from '#guards';
import type { FlatMapN } from '#states';
import { createSyncHelpers } from '@bemedev/app-options/internal';
import { _unknown } from '@bemedev/app-options/bemedev';
import type { PrimitiveObject } from '@bemedev/typings';
import { CommonMachine } from '../../common/machine';
import type { SyncAddOptions_F, SyncProvideOptions_F } from './options.types';

/**
 * A class representing a synchronous state machine.
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
export class SyncMachine<
  const C extends CommonConfig3 = CommonConfig3,
  const Pc = any,
  const Tc extends PrimitiveObject = PrimitiveObject,
  const E extends EventsMap = EventsMap,
  const A extends ActorsConfigMap = ActorsConfigMap,
  const Ta extends string = string,
  const Eo extends EventObject = EventObject,
  const AllPaths extends string = string,
  const Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  const L extends SimpleMachineOptions2 = SimpleMachineOptions2,
> extends CommonMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo> {
  /**
   * Machine type identifier string.
   */
  readonly TYPE = 'sync';

  /**
   * @deprecated Use the action function type.
   *
   * @returns The action function type of the machine.
   */
  get __actionFn() {
    return _unknown<SyncAction2<Eo, Pc, Tc, Ta>>();
  }

  /**
   * The public accessor for the flat map representation of the configuration.
   *
   * @returns The flat map of state nodes.
   */
  get flat() {
    return this.__flat as FlatMapN<C, true>;
  }

  /**
   * @deprecated Use the predicate function type.
   *
   * @returns The async predicate function type of the machine.
   */
  get __predicate() {
    return _unknown<AsyncPredicateS<Eo, Pc, Tc, Ta>>();
  }

  /**
   * @deprecated Use the delay function type.
   *
   * @returns The delay function type of the machine.
   */
  get __delay() {
    return _unknown<SyncDelayFunction<Eo, Pc, Tc, Ta>>();
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
  createOptions: SyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
    const _legacy = Object.freeze({
      actions: this.__elements.actions,
      guards: this.__elements.guards,
      delays: this.__elements.delays,
      actors: this.__elements.actors,
    }) as any;

    const helpers = createSyncHelpers(this.config) as any;

    return helper(helpers, { _legacy });
  };

  /**
   * Provides elements of the machine.
   *
   * @param helper - Option helper callback.
   *
   * @returns Machine options structure.
   */
  addOptions: SyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
    return super.addOptions(helper) as any;
  };

  /**
   * Provides options for the machine.
   *
   * @param helper - A function that provides options for the machine.
   *
   * @returns A new instance of the machine with the provided options applied.
   */
  provideOptions: SyncProvideOptions_F<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L> =
    helper => super.provideOptions(helper);

  // #endregion

  /**
   * Renews the machine with current configuration.
   *
   * @returns A new instance of this class {@linkcode SyncMachine}.
   */
  protected __renew = (): this => {
    const { config, pContext, context, guards, actions, delays, actors } =
      this.__elements;

    const out = new SyncMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>(config);

    out.__pContext = pContext;
    out.__context = context;

    out.addOptions(() => ({ guards, actions, delays, actors }) as any);

    return out as any;
  };
}

/**
 * Creates a new synchronous state machine instance.
 *
 * @param config - Machine configuration object.
 *
 * @returns Instance of class {@linkcode SyncMachine}.
 */
export const createSyncMachine: CommonCreateMachine_F = config => {
  return new SyncMachine(config);
};
