import type {
  Contract,
  ContractActorsMap,
  ContractConfig,
  ContractContext,
  ContractEvents,
  ContractEventsMap,
  ContractOptions,
  ContractPContext,
  ContractPaths,
  ContractTags,
} from '@bemedev/app-contract';
import type { Fn, StateValue } from '@bemedev/app-utils-bemedev';

/**
 * Machine category classification (synchronous or asynchronous).
 */
export type MachineType = 'sync' | 'async';

/**
 * Simple representation of a machine with meaningful properties.
 *
 * Every machine property is derived from the contract carried by the machine:
 * no event, context or tag type is declared independently.
 *
 * @template | {@linkcode Contract} `Ct` - Contract describing the machine.
 *
 * @see -- type {@linkcode StateValue}, -- type {@linkcode Fn}
 */
export type AnyMachine<Ct extends Contract = Contract> = {
  /**
   * Contract of the machine.
   */
  contract: Ct;

  /**
   * Machine options object.
   */
  options: ContractOptions<Ct>;

  /**
   * Machine configuration object.
   */
  config: ContractConfig<Ct>;

  /**
   * Classification type of the machine ('sync' or 'async').
   */
  readonly TYPE: MachineType;

  /**
   * Flat map representation of node configurations.
   */
  flat: Record<string, any>;

  /**
   * Machine context object.
   */
  context: ContractContext<Ct>;

  /**
   * Machine private context object.
   */
  pContext: ContractPContext<Ct>;

  /**
   * Map of machine events.
   */
  eventsMap: ContractEventsMap<Ct>;

  /**
   * Map of machine actor configurations.
   */
  actorsMap: ContractActorsMap<Ct>;

  /**
   * Internal contract type marker.
   */
  __contract: Ct;

  /**
   * Internal event object type marker.
   */
  __events: ContractEvents<Ct>;

  /**
   * Internal state object type marker.
   */
  __state: any;

  /**
   * Internal decomposed state path object type marker.
   */
  __decomposedState: any;

  /**
   * Method to add options to the machine.
   */
  addOptions: any;

  /**
   * Registered actions map.
   */
  actions: any;

  /**
   * Registered guards map.
   */
  guards: any;

  /**
   * Registered delays map.
   */
  delays: any;

  /**
   * Internal state path string type marker.
   */
  __allPaths: ContractPaths<Ct>;

  /**
   * Internal state tag string type marker.
   */
  __tag: ContractTags<Ct>;

  /**
   * Array of state tag strings defined on the machine.
   */
  tags: ContractTags<Ct>[];

  /**
   * Registered child actors map.
   */
  children: any;

  /**
   * Method returning a renewed instance of the machine.
   */
  renew: any;

  /**
   * Initial node configuration object.
   */
  initialConfig: any;

  /**
   * Initial state value object.
   */
  initialValue: StateValue;

  /**
   * Function checking if a target state path is an initial node.
   */
  isInitial: Fn<[string], boolean>;

  /**
   * Function retrieving parent configuration node from initial target path.
   */
  retrieveParentFromInitial: Fn<[string], any>;

  /**
   * Function converting a state value into a node configuration.
   */
  toNode: Fn<[StateValue], any>;
};
