import {
  byKey,
  commonT,
  extract,
  keysOf,
  partialCall,
  toArray,
} from '@bemedev/app-contract/bemedev';

import { DEFAULT_DELIMITER } from '#constants';
import { type DefinedValue } from '#guards';
import {
  flatMap,
  initialConfig,
  isAtomic,
  isCompound,
  nodeToValue,
  valueToNodeConfig,
  type State,
  type StateExtended,
  type StateP,
  type StatePextended,
  type StateValue,
} from '#states';
import type {
  Contract,
  ContractActorsMap,
  ContractContext,
  ContractEvents,
  ContractEventsMap,
  ContractOptions,
  ContractPContext,
  ContractPaths,
  ContractTags,
  DescriptionProps,
} from '@bemedev/app-contract';
import type { OptionsPlugin } from '@bemedev/app-options';
import type { AllowedNames, Fn, NotUndefined } from '@bemedev/app-options/bemedev';
import { _unknown } from '@bemedev/app-options/bemedev';
import { constructEventsMap } from '@bemedev/app-options/internal';
import type { AnyMachine, MachineType } from '@bemedev/app-plugins';
import { decompose, type Decompose } from '@bemedev/decompose';
import type { CommonElements, GetIO_F } from './types';

/**
 * Abstract base class for state machines (synchronous and asynchronous).
 *
 * The class is parameterized by a contract. Configuration, contexts, events,
 * actors, tags, paths and options are all derived from it, so no machine member
 * redeclares a type the contract already owns.
 *
 * @template | {@linkcode Contract} `Ct` - Contract describing the machine.
 */
export abstract class CommonMachine<
  const Ct extends Contract = Contract,
> implements AnyMachine<Ct> {
  /**
   * The contract carried by this {@linkcode CommonMachine}.
   */
  private readonly _contract: Ct;

  /**
   * Plugins attached to this machine.
   *
   * @remarks Kept public so `SyncMachine` and `AsyncMachine` can narrow its
   * type and interpreters can infer the plugin tuple.
   */
  readonly __plugins: readonly OptionsPlugin<any, any>[];

  /**
   * The contract getter.
   *
   * @returns The contract object of type `Ct`.
   */
  get contract() {
    return this._contract;
  }

  /**
   * The machine configuration getter.
   *
   * @returns The configuration object owned by the contract.
   */
  get config() {
    return this._contract.config;
  }

  /**
   * Attaches a description hierarchy to the machine contract.
   *
   * @param props - Description hierarchy of every token category.
   *
   * @returns The machine itself.
   */
  describe(props: DescriptionProps) {
    this._contract.describe(props);
    return this;
  }

  /**
   * Contract type marker.
   *
   * @remarks Used for typing purposes only.
   */
  declare readonly __contract: Ct;

  /**
   * Protected event name list.
   */
  protected readonly __eventsList: Extract<keyof ContractEventsMap<Ct>, string>[];

  /**
   * List of event name strings getter.
   *
   * @returns The array of event name strings built from the configuration.
   */
  get eventsList() {
    return this.__eventsList;
  }

  /**
   * Protected flat map representation of state nodes.
   */
  protected __flat: any;

  /**
   * The public accessor for the flat map representation of the configuration.
   *
   * @returns The flat map of state nodes implemented by each concrete machine.
   */
  abstract get flat(): any;

  /**
   * Decomposed path mapping representation of the configuration.
   *
   * @returns The decomposed configuration object with `.` separators.
   */
  get decomposed() {
    return decompose(this.config as any, { sep: '.', start: false, object: 'both' });
  }

  /**
   * @deprecated
   *
   * This property provides the decomposed state for this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The decomposed state as a type.
   */
  get __decomposedState() {
    return _unknown<
      Decompose<State<Ct>, { sep: '.'; start: false; object: 'both' }>
    >();
  }

  /**
   * Public accessor for the events map for this {@linkcode CommonMachine}.
   *
   * @returns The events map as a type.
   */
  get eventsMap() {
    return _unknown<ContractEventsMap<Ct>>();
  }

  /**
   * Public accessor for the actors map for this {@linkcode CommonMachine}.
   *
   * @returns The actors configuration map as a type.
   */
  get actorsMap() {
    return _unknown<ContractActorsMap<Ct>>();
  }

  /**
   * @deprecated
   *
   * This property provides the events map for this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The event object type.
   */
  get __events() {
    return _unknown<ContractEvents<Ct>>();
  }

  /**
   * Abstract action function getter signature.
   */
  abstract __actionFn: any;

  /**
   * @deprecated
   *
   * This property provides any action key for this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The union of registered action keys.
   */
  get __actionKey() {
    return this._typingsByKey('actions');
  }

  /**
   * @deprecated
   *
   * This property provides the action parameters of action function for this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The action function parameters as a type.
   */
  get __actionParams() {
    return _unknown<{
      pContext: ContractPContext<Ct>;
      context: ContractContext<Ct>;
      map: ContractEventsMap<Ct>;
    }>();
  }

  /**
   * @deprecated
   *
   * This property provides the state for this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The state as a type.
   */
  get __state() {
    return _unknown<State<Ct>>();
  }

  /**
   * @deprecated
   *
   * This property provides the state extended for this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The extended state as a type.
   */
  get __stateExtended() {
    return _unknown<StateExtended<Ct>>();
  }

  /**
   * @deprecated
   *
   * This property provides the state payload for this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The state payload as a type.
   */
  get __stateP() {
    return _unknown<StateP<Ct>>();
  }

  /**
   * @deprecated
   *
   * This property provides the extended state payload for this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The extended state payload as a type.
   */
  get __statePextended() {
    return _unknown<StatePextended<Ct>>();
  }

  /**
   * Internal helper to extract typing key names.
   *
   * @template `K` - Key of a machine member holding a typed map.
   *
   * @param key - The machine member name whose keys are extracted.
   *
   * @returns The union of key names of the selected member.
   */
  private _typingsByKey = <
    K extends AllowedNames<AnyMachine<Ct>, object | undefined>,
  >(
    key: K,
  ) => {
    const _this = commonT.dynamic(this);
    const out1 = byKey(_this, key);
    const out2 = extract(out1, {} as object);
    const out3 = keysOf.union(out2);

    return out3;
  };

  /**
   * @deprecated
   *
   * This property provides any guard key for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The union of registered guard keys.
   */
  get __guardKey() {
    return this._typingsByKey('guards');
  }

  /**
   * Abstract predicate function getter signature.
   */
  abstract __predicate: any;

  /**
   * @deprecated
   *
   * This property provides any delay key for this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The union of registered delay keys.
   */
  get __delayKey() {
    return this._typingsByKey('delays');
  }

  /**
   * @deprecated
   *
   * This property provides the delay function for this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   */
  abstract __delay: any;

  /**
   * @deprecated
   *
   * This property provides any {@linkcode DefinedValue} for this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns A defined value of the private or public context.
   */
  get __definedValue() {
    return _unknown<DefinedValue<Ct>>();
  }

  /**
   * @deprecated
   *
   * This property provides any child key for this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns The union of registered child actor keys.
   */
  get __childKey() {
    return this._typingsByKey('children');
  }

  /**
   * @deprecated
   *
   * Return this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns This machine instance as a type.
   */
  get __machine() {
    return _unknown<this>();
  }

  /**
   * Internal state tag string marker getter.
   *
   * @returns The state tag string type.
   */
  get __tag() {
    return _unknown<ContractTags<Ct>>();
  }

  /**
   * Private actions map store.
   */
  private _actions?: ContractOptions<Ct>['actions'];

  /**
   * Private guards map store.
   */
  private _guards?: ContractOptions<Ct>['guards'];

  /**
   * Private delays map store.
   */
  private _delays?: ContractOptions<Ct>['delays'];

  /**
   * Private actors map store.
   */
  private _actors?: ContractOptions<Ct>['actors'];

  /**
   * Context for this {@linkcode CommonMachine}.
   */
  protected __context!: ContractContext<Ct>;

  /**
   * Private context for this {@linkcode CommonMachine}.
   */
  protected __pContext!: ContractPContext<Ct>;

  /**
   * Private tags array store.
   */
  private _tags: ContractTags<Ct>[];

  /**
   * Array of state tag strings defined on this machine.
   *
   * @returns The array of tag strings collected from the flat map.
   */
  get tags() {
    return this._tags;
  }

  /**
   * Private initial keys store.
   */
  private _initialKeys: string[] = [];

  /**
   * Private initial node config store.
   */
  private _initialConfig: any;

  /**
   * Private method to resolve initial state node keys.
   */
  private _getInitialKeys = () => {
    const entries = Object.entries<any>(this.__flat);
    entries.forEach(([key, { initial }]) => {
      const check1 = initial !== undefined;
      if (check1) {
        const toPush = `${key}${DEFAULT_DELIMITER}${initial}`;
        this._initialKeys.push(toPush);
      }
    });
  };

  /**
   * Creates an instance of class {@linkcode CommonMachine}.
   *
   * @param contract - The contract carrying the machine configuration.
   * @param plugins - Plugins extending the option helpers of the machine.
   *
   * @remarks
   * This constructor initializes the machine from its contract. It flattens the
   * configuration and prepares it for further operations ({@linkcode flat}).
   */
  constructor(contract: Ct, plugins: readonly OptionsPlugin<any, any>[] = []) {
    this._contract = contract;
    this.__plugins = plugins;
    this.__flat = flatMap.low(this.config as any, true);

    this._tags = Object.values<any>(this.__flat)
      .map(({ tags }) => toArray.typed(tags))
      .filter(Boolean)
      .flat() as any;
    this._initialConfig = initialConfig(this.config as any);
    this._getInitialKeys();
    this.__eventsList = constructEventsMap(this.config as any) as any;
  }

  /**
   * The accessor of context for this {@linkcode CommonMachine}.
   *
   * @returns The current public context object of type `Tc`.
   */
  get context() {
    const out = this.__elements.context;
    return out;
  }

  /**
   * The accessor of private context for this {@linkcode CommonMachine}.
   *
   * @returns The current private context object of type `Pc`.
   */
  get pContext() {
    const out = this.__elements.pContext;
    return out;
  }

  /**
   * Registered actions map getter.
   *
   * @returns The merged actions map, or `undefined` when none are registered.
   */
  get actions() {
    return this._actions;
  }

  /**
   * Registered guards map getter.
   *
   * @returns The merged guards map, or `undefined` when none are registered.
   */
  get guards() {
    return this._guards;
  }

  /**
   * Registered delays map getter.
   *
   * @returns The merged delays map, or `undefined` when none are registered.
   */
  get delays() {
    return this._delays;
  }

  /**
   * Registered child actors map getter.
   *
   * @returns The children map, or `undefined` when no child is registered.
   */
  get children() {
    return this._actors?.children;
  }

  /**
   * Registered emitters map getter.
   *
   * @returns The emitters map, or `undefined` when no emitter is registered.
   */
  get emitters() {
    return this._actors?.emitters;
  }

  /**
   * @deprecated
   *
   * This property provides all possible paths for this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @returns All possible state paths as a type.
   */
  get __allPaths() {
    return _unknown<ContractPaths<Ct>>();
  }

  /**
   * Checks if a target path is an initial state node.
   *
   * @param target - State node target path.
   *
   * @returns `true` if target is an initial node, `false` otherwise.
   */
  isInitial = (target: string) => {
    return this._initialKeys.includes(target);
  };

  /**
   * Recursively retrieves parent node from initial state target.
   *
   * @param target - Initial target state path.
   *
   * @returns Parent node configuration object.
   */
  retrieveParentFromInitial = (target: string): any => {
    const check1 = this.isInitial(target);
    const flat: any = this.__flat;
    if (check1) {
      const parent = target.substring(0, target.lastIndexOf(DEFAULT_DELIMITER));
      const check2 = this.isInitial(parent);

      if (check2) return this.retrieveParentFromInitial.bind(this)(parent);
      return flat[parent];
    }
    return flat[target];
  };

  /**
   * Internal helper method to merge actions into machine options.
   *
   * @param actions - Actions map to merge into the current store.
   *
   * @returns The updated actions map.
   */
  private _addActions = (actions?: ContractOptions<Ct>['actions']) =>
    (this._actions = { ...this._actions, ...actions });

  /**
   * Internal helper method to merge guards into machine options.
   *
   * @param guards - Guards map to merge into the current store.
   *
   * @returns The updated guards map.
   */
  private _addGuards = (guards?: ContractOptions<Ct>['guards']) =>
    (this._guards = { ...this._guards, ...guards });

  /**
   * Internal helper method to merge delays into machine options.
   *
   * @param delays - Delays map to merge into the current store.
   *
   * @returns The updated delays map.
   */
  private _addDelays = (delays?: ContractOptions<Ct>['delays']) =>
    (this._delays = { ...this._delays, ...delays });

  /**
   * Internal helper method to merge child actors into machine options.
   *
   * @param children - Children map to merge into the actor store.
   *
   * @returns The updated actors store.
   */
  private _addChildren = (
    children?: NotUndefined<ContractOptions<Ct>['actors']>['children'],
  ) =>
    (this._actors = {
      ...this._actors,
      children: { ...this._actors?.children, ...children },
    });

  /**
   * Internal helper method to merge emitters into machine options.
   *
   * @param emitters - Emitters map to merge into the actor store.
   *
   * @returns The updated actors store.
   */
  private _addEmitters = (
    emitters?: NotUndefined<ContractOptions<Ct>['actors']>['emitters'],
  ) =>
    (this._actors = {
      ...this._actors,
      emitters: { ...this._actors?.emitters, ...emitters },
    } as any);

  /**
   * Abstract factory function for creating machine options.
   *
   * @param helper - Option helper callback function.
   */
  abstract createOptions: (helper: Fn) => ContractOptions<Ct> | undefined;

  /**
   * Machine classification type ('sync' or 'async').
   */
  abstract readonly TYPE: MachineType;

  /**
   * Provides options for the machine.
   *
   * @param helper - A function that provides options for the machine.
   * Options can include actions, guards, delays, promises, and child machines.
   */
  addOptions(helper: Fn) {
    const out = this.createOptions(helper);

    this._addActions(out?.actions);
    this._addGuards(out?.guards);
    this._addDelays(out?.delays);
    this._addChildren(out?.actors?.children);
    this._addEmitters(out?.actors?.emitters);

    return out;
  }

  /**
   * Renews the machine with current configuration.
   *
   * @returns A new instance of this class {@linkcode CommonMachine}.
   */
  protected abstract __renew: () => this;

  /**
   * Returns a new instance from this {@linkcode CommonMachine} with all its elements.
   *
   * @returns A renewed machine instance holding the same configuration and options.
   */
  get renew() {
    const out = this.__renew();
    return out;
  }

  /**
   * Provides options for the machine.
   *
   * @param helper - A function that provides options for the machine.
   * Options can include actions, guards, delays, promises, and child machines.
   *
   * @returns A new instance of the machine with the provided options applied.
   */
  provideOptions(helper: Fn) {
    const out = this.renew;
    out.addOptions(helper);
    return out as any;
  }

  /**
   * Get all meaningful elements of the machine.
   *
   * @returns The cloned configuration along with contexts and registered options.
   */
  protected get __elements(): CommonElements<Ct> {
    const config = structuredClone(this.config);
    const pContext = this.__pContext;
    const context = structuredClone(this.__context);
    const actions = this._actions;
    const guards = this._guards;
    const delays = this._delays;
    const actors = this._actors;

    return { config, pContext, context, actions, guards, delays, actors };
  }

  /**
   * Sets the private context `pContext` for this machine.
   *
   * @param pContext - Private context value.
   */
  addPrivateContext = (pContext: ContractPContext<Ct>) => {
    this.__pContext = pContext;
  };

  /**
   * Sets the context `context` for this machine.
   *
   * @param context - Internal context value.
   */
  addContext = (context: ContractContext<Ct>) => {
    this.__context = context;
  };

  /**
   * Converts a {@linkcode StateValue} to a node configuration.
   *
   * @param from - The {@linkcode StateValue} to convert.
   *
   * @returns The converted node configuration.
   *
   * @see {@linkcode valueToNodeConfig}
   */
  valueToConfig = (from: StateValue) => {
    return valueToNodeConfig(this.config as any, from);
  };

  /**
   * The accessor of the initial node config of this {@linkcode CommonMachine}.
   *
   * @returns The initial node configuration object.
   */
  get initialConfig() {
    return this._initialConfig;
  }

  /**
   * The accessor of the initial {@linkcode StateValue} of this {@linkcode CommonMachine}.
   *
   * @returns The initial state value computed from the initial configuration.
   *
   * @see {@linkcode nodeToValue}
   */
  get initialValue() {
    return nodeToValue(this._initialConfig as any);
  }

  /**
   * Alias of {@linkcode valueToConfig} method.
   */
  toNode = this.valueToConfig;

  /**
   * Machine options object getter containing actions, guards, delays, and actors.
   *
   * @returns The machine options object of type `Mo`.
   */
  get options() {
    const guards = this._guards;
    const actions = this._actions;
    const delays = this._delays;
    const actors = this._actors;

    const out = _unknown<ContractOptions<Ct>>({ guards, actions, delays, actors });

    return out;
  }
}

/**
 * Helper to retrieve entry or exit actions from a node.
 *
 * @param key - Node property to read, either `entry` or `exit`.
 * @param node - Node configuration to inspect.
 *
 * @returns The collected actions of the requested key, including those of the
 * nested initial states.
 *
 * @see -- type {@linkcode GetIO_F}, {@linkcode isAtomic}, {@linkcode isCompound}
 */
const getIO: GetIO_F = (key, node) => {
  if (!node) return [];
  const out = toArray.typed(node?.[key]);

  if (isAtomic(node)) return out;
  const states = node.states;

  if (isCompound(node)) {
    const initial = states[node.initial];

    out.push(...getIO(key, initial));
  }

  return out;
};

/**
 * Retrieves all entry actions from a node.
 *
 * @returns The collected entry actions of the node and its initial states.
 */
export const getEntries = partialCall.paramArray(getIO, 'entry');

/**
 * Retrieves all exit actions from a node.
 *
 * @returns The collected exit actions of the node and its initial states.
 */
export const getExits = partialCall.paramArray(getIO, 'exit');
