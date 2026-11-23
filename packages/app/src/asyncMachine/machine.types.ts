import type {
  Contract,
  ContractOptions,
  OptionsPlugin,
  PluginAddons,
} from '@bemedev/app-options';
import type {
  AsyncAddons,
  SimpleMachineOptions2,
} from '@bemedev/app-plugins/addons';
import { ResolveUtilities } from '@bemedev/app-plugins/types';
import type { EmptyObject } from '~types';
import type { AsyncMachine } from './machine';
export type { AsyncAddons };

/**
 * Parameters type signature for providing options to an async machine.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template `T` - State tag string type.
 * @template | {@linkcode SimpleMachineOptions2} `Mo` - Simple machine options type.
 * @template | {@linkcode SimpleMachineOptions2} `L` - Legacy options type.
 * @param option - Action and guard options object of type {@linkcode AsyncAddons}.
 * @param legacyOptions - Access to previously defined options.
 *
 * @returns Machine options of type {@linkcode SimpleMachineOptions2}.
 */
export type AsyncAddOptionsParam_F<
  Ct extends Contract = Contract,
  Mo = SimpleMachineOptions2,
  L = SimpleMachineOptions2,
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = (
  option: AsyncAddons<Ct> & ResolveUtilities<PluginAddons<Ps>, 'async'>,
  /**
   * Access to previously defined options from previous addOptions or provideOptions calls.
   * Provides actions, guards, emitters, machines, promises, and delays.
   */
  legacyOptions: { _legacy: L },
) => Mo;

/**
 * Function type signature for adding options to an async machine
 * configuration.
 *
 * Every option type is derived from the contract: events, contexts and tags are
 * read through the contract helpers instead of being passed separately.
 *
 * @template | {@linkcode Contract} `Ct` - Contract describing the machine.
 * @template `L` - Existing options type.
 */
export type AsyncAddOptions_F<
  Ct extends Contract = Contract,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = <const T extends ContractOptions<Ct>>(
  option: AsyncAddOptionsParam_F<Ct, T, L, Ps>,
) => ContractOptions<Ct>;

/**
 * Function type signature for providing options to an async machine class
 * {@linkcode AsyncMachine}.
 *
 * The machine stays parameterized by the same contract, so the returned
 * instance exposes the contract options surface.
 *
 * @template | {@linkcode Contract} `Ct` - Contract describing the machine.
 * @template `L` - Existing options type.
 */
export type AsyncProvideOptions_F<
  Ct extends Contract = Contract,
  L extends SimpleMachineOptions2 = EmptyObject,
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = <const T extends ContractOptions<Ct>>(
  option: AsyncAddOptionsParam_F<Ct, T, L, Ps>,
) => AsyncMachine<Ct, L & T, Ps>;
