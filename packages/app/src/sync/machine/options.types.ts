import type { SimpleMachineOptions2 } from '#common/machine';
import type {
  Contract,
  ContractOptions,
  OptionsPlugin,
  PluginAddons,
} from '@bemedev/app-options';
import type { SyncAddons } from '@bemedev/app-plugins/addons';
import type { SyncMachine } from './machine';
import type { ResolveUtilities } from '@bemedev/app-options/plugins';

export type {
  SyncChildFunction2,
  SyncMachineOptions2,
  SyncSimpleMachineOptions,
} from '@bemedev/app-options';

/**
 * Parameters type signature for providing options to a synchronous machine.
 *
 * @template `E` - Event object type.
 * @template `Pc` - Private context type.
 *
 * @template `T` - State tag string type.
 * @template `Mo` - Simple machine options type.
 * @template `L` - Legacy options type.
 */
export type SyncAddOptionsParam_F<
  Ct extends Contract = Contract,
  Mo = SimpleMachineOptions2,
  L = SimpleMachineOptions2,
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = (
  option: SyncAddons<Ct> & ResolveUtilities<PluginAddons<Ps>, 'sync'>,
  /**
   * Access to previously defined options from previous addOptions or provideOptions calls.
   * Provides actions, guards, emitters, machines, promises, and delays.
   */
  legacyOptions: { _legacy: L },
) => Mo;

/**
 * Function type signature for adding options to a synchronous machine
 * configuration.
 *
 * Every option type is derived from the contract: events, contexts and tags are
 * read through the contract helpers instead of being passed separately.
 *
 * @template | {@linkcode Contract} `Ct` - Contract describing the machine.
 * @template `L` - Existing options type.
 */
export type SyncAddOptions_F<
  Ct extends Contract = Contract,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = <const T extends ContractOptions<Ct>>(
  option: SyncAddOptionsParam_F<Ct, T, L, Ps>,
) => ContractOptions<Ct>;

/**
 * Function type signature for providing options to a synchronous machine class
 * {@linkcode SyncMachine}.
 *
 * The machine stays parameterized by the same contract, so the returned
 * instance exposes the contract options surface.
 *
 * @template | {@linkcode Contract} `Ct` - Contract describing the machine.
 * @template `L` - Existing options type.
 */
export type SyncProvideOptions_F<
  Ct extends Contract = Contract,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = <const T extends ContractOptions<Ct>>(
  option: SyncAddOptionsParam_F<Ct, T, L, Ps>,
) => SyncMachine<Ct, L & T, Ps>;
