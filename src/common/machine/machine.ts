import toArray from '#bemedev/features/arrays/castings/toArray';
import commonT from '#bemedev/features/common/typings';
import extract from '#bemedev/features/common/typings/extract';
import { partialCall } from '#bemedev/features/functions/functions/partialCall';
import byKey from '#bemedev/features/objects/typings/byKey';
import keysOf from '#bemedev/features/objects/typings/keysOf';
import type {
  AllowedNames,
  Fn,
  NotUndefined,
} from '#bemedev/globals/types';
import { _unknown } from '#bemedev/globals/utils/_unknown';
import { DEFAULT_DELIMITER } from '#constants';
import type { ActorsConfigMap, EventObject, EventsMap } from '#events';
import {
  isDefinedS,
  isNotDefinedS,
  isNotValue,
  isValue,
  type DefinedValue,
} from '#guards';
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
import { merge } from '#utils';
import { decompose, type Decompose } from '@bemedev/decompose';
import type { PrimitiveObject } from '@bemedev/typings';
import cloneDeep from 'clone-deep';
import type {
  AnyMachine,
  CommonAddOptionsParam_F,
  CommonConfig,
  CommonElements,
  GetIO_F,
  SimpleMachineOptions2,
} from './types';

export abstract class CommonMachine<
  const C extends CommonConfig = CommonConfig,
  const Pc = any,
  const Tc extends PrimitiveObject = PrimitiveObject,
  const E extends EventsMap = EventsMap,
  const A extends ActorsConfigMap = ActorsConfigMap,
  const Ta extends string = string,
  const Eo extends EventObject = EventObject,
  const AllPaths extends string = string,
  const Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> implements AnyMachine<E, A, Pc, Tc> {
  /**
   * The configuration of the machine for this {@linkcode Machine}.
   *
   * @see {@linkcode Config}
   * @see {@linkcode C}
   */
  #config: C;

  get __config() {
    return _unknown<C>();
  }

  get config() {
    return this.#config;
  }

  protected __flat: any;

  /**
   * The public accessor of the flat map of the configuration for this {@linkcode Machine}.
   *
   * @see {@linkcode FlatMapN}
   * @see {@linkcode Config}
   * @see {@linkcode C}
   */
  get flat() {
    return this.__flat;
  }

  #decomposed: any;

  get decomposed() {
    return this.#decomposed as Decompose<
      C,
      { sep: '.'; start: false; object: 'both' }
    >;
  }

  /**
   * @deprecated
   *
   * This property provides the decomposed state for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @see {@linkcode State}
   * @see {@linkcode Decompose}
   * @see {@linkcode Eo}
   * @see {@linkcode Tc}
   * @see {@linkcode Ta}
   */
  get __decomposedState() {
    return _unknown<
      Decompose<
        State<Eo, Tc, Ta>,
        { sep: '.'; start: false; object: 'both' }
      >
    >();
  }

  /**
   * The map of events for this {@linkcode Machine}.
   *
   * @see {@linkcode EventsMap}
   * @see {@linkcode E}
   */
  __eventsMap!: E;

  /**
   * Public accessor for the events map for this {@linkcode Machine}.
   *
   * @see {@linkcode EventsMap}
   * @see {@linkcode E}   */
  get eventsMap() {
    return this.__eventsMap;
  }

  /**
   * The map of promisees for this {@linkcode Machine}.
   *
   * @see {@linkcode PromiseeMap}
   * @see {@linkcode A}
   */
  protected __actorsMap!: A;

  /**
   * Public accessor for the promisees map for this {@linkcode Machine}.
   *
   * @see {@linkcode PromiseeMap}
   * @see {@linkcode A}
   */
  get actorsMap() {
    return this.__actorsMap;
  }

  /**
   * @deprecated
   *
   * This property provides the events map for this {@linkcode Machine} as a type.
   *
   * @see {@linkcode ToEvents}
   * @see {@linkcode E}
   * @see {@linkcode A}
   *
   * @remarks Used for typing purposes only.
   */
  get __events() {
    return _unknown<Eo>();
  }

  abstract __actionFn: any;

  /**
   * @deprecated
   *
   * This property provides any action key for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   */
  get __actionKey() {
    return this.#typingsByKey('actions');
  }

  /**
   * @deprecated
   *
   * This property provides the action parameters of action function for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @see {@linkcode E}
   * @see {@linkcode Pc}
   * @see {@linkcode PrimitiveObject}
   * @see {@linkcode Tc}
   */
  get __actionParams() {
    return _unknown<{ pContext: Pc; context: Tc; map: E }>();
  }

  /**
   * @deprecated
   *
   * This property provides the state for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @see {@linkcode State}
   * @see {@linkcode ToEventsR2}
   * @see {@linkcode PrimitiveObject}
   * @see {@linkcode ActorsConfigMap}
   * @see {@linkcode E}
   * @see {@linkcode A}   * @see {@linkcode Pc}
   * @see {@linkcode Tc}
   */
  get __state() {
    return _unknown<State<Eo, Tc, Ta>>();
  }

  /**
   * @deprecated
   *
   * This property provides the state extended for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @see {@linkcode StateExtended}
   * @see {@linkcode ToEvents}
   * @see {@linkcode PrimitiveObject}
   * @see {@linkcode ActorsConfigMap}
   * @see {@linkcode E}
   * @see {@linkcode A}
   * @see {@linkcode Pc}
   * @see {@linkcode Tc}
   */
  get __stateExtended() {
    return _unknown<StateExtended<Eo, Pc, Tc, Ta>>();
  }

  /**
   * @deprecated
   *
   * This property provides the state payload for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @see {@linkcode StateP}
   * @see {@linkcode ToEventsR2}
   * @see {@linkcode PrimitiveObject}
   * @see {@linkcode ActorsConfigMap}
   * @see {@linkcode E}
   * @see {@linkcode A}
   * @see {@linkcode Pc}
   * @see {@linkcode Tc}
   */
  get __stateP() {
    return _unknown<StateP<Eo, Tc, Ta>>();
  }

  /**
   * @deprecated
   *
   * This property provides the extended state payload for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @see {@linkcode StatePextended}
   * @see {@linkcode ToEventsR2}
   * @see {@linkcode PrimitiveObject}
   * @see {@linkcode ActorsConfigMap}
   * @see {@linkcode E}
   * @see {@linkcode A}
   * @see {@linkcode Pc}
   * @see {@linkcode Tc}
   */
  get __statePextended() {
    return _unknown<StatePextended<Eo, Pc, Tc, Ta>>();
  }

  #typingsByKey = <
    K extends AllowedNames<AnyMachine<E, A, Pc, Tc>, object | undefined>,
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
   */
  get __guardKey() {
    return this.#typingsByKey('guards');
  }

  abstract __predicate: any;

  /**
   * @deprecated
   *
   * This property provides any delay key for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   */
  get __delayKey() {
    return this.#typingsByKey('delays');
  }

  /**
   * @deprecated
   *
   * This property provides the delay function for this {@linkcode CommonMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   
   */
  abstract __delay: any;

  /**
   * @deprecated
   *
   * This property provides any {@linkcode DefinedValue} for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @see {@linkcode DefinedValue}
   * @see {@linkcode PrimitiveObject}
   * @see {@linkcode Pc}
   * @see {@linkcode Tc}
   */
  get __definedValue() {
    return _unknown<DefinedValue<Pc, Tc>>();
  }

  /**
   * @deprecated
   *
   * This property provides any child key for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   */
  get __childKey() {
    return this.#typingsByKey('children');
  }

  /**
   * @deprecated
   *
   * Return this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   */
  get __machine() {
    return _unknown<this>();
  }

  get __tag() {
    return _unknown<Ta>();
  }

  // #region private
  #actions?: Mo['actions'];

  #guards?: Mo['guards'];

  #delays?: Mo['delays'];

  #actors?: Mo['actors'];

  /**
   * Context for this {@linkcode Machine}.
   *
   * @see {@linkcode PrimitiveObject}
   * @see {@linkcode Tc}
   */
  protected __context!: Tc;

  /**
   * Private context for this {@linkcode Machine}.
   *
   * @see {@linkcode Pc}
   */
  protected __pContext!: Pc;

  #tags: Ta[];

  get tags() {
    return this.#tags;
  }

  #initialKeys: string[] = [];

  /**
   * The initial node config of this {@linkcode Machine}.
   */
  #initialConfig: any;
  // #endregion

  readonly longRuns: boolean;

  #getInitialKeys = () => {
    const entries = Object.entries<any>(this.__flat);
    entries.forEach(([key, { initial }]) => {
      const check1 = initial !== undefined;
      if (check1) {
        const toPush = `${key}${DEFAULT_DELIMITER}${initial}`;
        this.#initialKeys.push(toPush);
      }
    });
  };

  /**
   * Creates an instance of Machine.
   *
   * @param config : of type {@linkcode Config} [C] - The configuration for the machine.
   *
   * @remarks
   * This constructor initializes the machine with the provided configuration.
   * It flattens the configuration and prepares it for further operations ({@linkcode flat}).
   */
  constructor(config: C) {
    this.#config = config;
    this.#decomposed = decompose(config, {
      start: false,
      object: 'both',
    });
    this.__flat = flatMap.low(this.#config as any, true);

    this.#tags = Object.values<any>(this.__flat)
      .map(({ tags }) => toArray.typed(tags))
      .filter(Boolean)
      .flat() as any;
    this.#initialConfig = initialConfig(this.#config);
    this.#getInitialKeys();
    this.longRuns = this.#config.__longRuns === true;
  }

  /**
   * The accessor of context for this {@linkcode Machine}.
   *
   * @see {@linkcode PrimitiveObject}
   * @see {@linkcode Tc}
   */
  get context() {
    const out = this.__elements.context;
    return out;
  }

  /**
   * The accessor of private context for this {@linkcode Machine}.
   *
   * @see {@linkcode Pc}
   */
  get pContext() {
    const out = this.__elements.pContext;
    return out;
  }

  get actions() {
    return this.#actions;
  }

  get guards() {
    return this.#guards;
  }

  get delays() {
    return this.#delays;
  }

  get children() {
    return this.#actors?.children;
  }

  get emitters() {
    return this.#actors?.emitters;
  }

  /**
   * @deprecated
   *
   * This property provides all possible paths for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   */
  get __allPaths() {
    return _unknown<AllPaths>();
  }

  isInitial = (target: string) => {
    return this.#initialKeys.includes(target);
  };

  retrieveParentFromInitial = (target: string): any => {
    const check1 = this.isInitial(target);
    const flat: any = this.__flat;
    if (check1) {
      const parent = target.substring(
        0,
        target.lastIndexOf(DEFAULT_DELIMITER),
      );
      const check2 = this.isInitial(parent);

      if (check2) return this.retrieveParentFromInitial.bind(this)(parent);
      return flat[parent];
    }
    return flat[target];
  };

  #addActions = (actions?: Mo['actions']) =>
    (this.#actions = merge(this.#actions, actions));

  #addGuards = (guards?: Mo['guards']) =>
    (this.#guards = merge(this.#guards, guards));

  #addDelays = (delays?: Mo['delays']) =>
    (this.#delays = merge(this.#delays, delays));

  #addChildren = (children?: NotUndefined<Mo['actors']>['children']) =>
    (this.#actors = merge(this.#actors, { children }));

  #addEmitters = (emitters?: NotUndefined<Mo['actors']>['emitters']) =>
    (this.#actors = merge(this.#actors, { emitters }));

  abstract createOptions: (
    helper: CommonAddOptionsParam_F<Mo>,
  ) => Mo | undefined;

  /**
   * Provides options for the machine.
   *
   * @param option a function that provides options for the machine.
   * Options can include actions, guards, delays, promises, and child machines.
   */
  addOptions(helper: CommonAddOptionsParam_F<Mo>) {
    const out = this.createOptions(helper as any);

    this.#addActions(out?.actions);
    this.#addGuards(out?.guards);
    this.#addDelays(out?.delays);
    this.#addChildren(out?.actors?.children);
    this.#addEmitters(out?.actors?.emitters);

    return out;
  }

  /**
   * Renews the machine with the provided key and value.
   * @param key the key of the element to provide.
   * @param value the value of the element to provide.
   * If not provided, the current elements will be returned.
   * @returns a new instance of this {@linkcode Machine} with the provided key and value.
   *
   * @see {@linkcode Elements}
   *
   * @see type inferences :
   *
   *  {@linkcode Config} , {@linkcode C} , {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode types} , {@linkcode Tc} , {@linkcode SimpleMachineOptions2} , {@linkcode MachineOptions} , {@linkcode Mo}
   */
  protected abstract __renew: () => this;

  /**
   * Returns a new instance from this {@linkcode Machine} with all its {@linkcode Elements}.
   */
  get renew() {
    const out = this.__renew();
    return out;
  }

  /**
   * Provides options for the machine.
   *
   * @param helper a function that provides options for the machine.
   * Options can include actions, guards, delays, promises, and child machines.
   * @returns a new instance of the machine with the provided options applied.
   */
  provideOptions<T extends Mo>(helper: CommonAddOptionsParam_F<T>) {
    const out = this.renew;
    console.log('RENE');
    out.addOptions(helper);

    return out;
  }

  /**
   * Get all meaningful elements of the machine.
   *
   * @see {@linkcode Elements}
   *
   * @see type inferences :
   *
   * @see {@linkcode Config} , {@linkcode C} , {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc} , {@linkcode SimpleMachineOptions2} , {@linkcode MachineOptions} , {@linkcode Mo}
   */
  protected get __elements(): CommonElements<C, E, A, Pc, Tc, Mo> {
    const config = structuredClone(this.#config);
    const pContext = cloneDeep(this.__pContext);
    const context = structuredClone(this.__context);
    const actions = cloneDeep(this.#actions);
    const guards = cloneDeep(this.#guards);
    const delays = cloneDeep(this.#delays);
    const actorsMap = cloneDeep(this.__actorsMap);
    const events = cloneDeep(this.__eventsMap);
    const actors = cloneDeep(this.#actors);

    return {
      config,
      pContext,
      context,
      actions,
      guards,
      delays,
      actors,
      events,
      actorsMap,
    };
  }

  addPrivateContext = (pContext: Pc) => {
    this.__pContext = pContext;
  };

  addContext = (context: Tc) => {
    this.__context = context;
  };

  /**
   * @deprecated
   * @remarks used internally
   */
  abstract _provideEvents: <T extends EventsMap>(map: T) => CommonMachine;
  /**
   * @deprecated
   * @remarks used internally
   */
  abstract _provideActors: <T extends ActorsConfigMap>(
    map: T,
  ) => CommonMachine;

  /**
   * Converts a {@linkcode StateValue} to a {@linkcode NodeConfigWithInitials} with the {@linkcode NodeConfigWithInitials} postConfig of this {@linkcode Machine}.
   *
   * @param from the {@linkcode StateValue} to convert.
   * @returns the converted {@linkcode NodeConfigWithInitials}.
   *
   * @see {@linkcode valueToNodeConfig}
   */
  valueToConfig = (from: StateValue) => {
    return valueToNodeConfig(this.#config, from);
  };

  /**
   * The accessor of the initial node config of this {@linkcode Machine}.
   */
  get initialConfig() {
    return this.#initialConfig;
  }

  /**
   * The accessor of the initial {@linkcode StateValue} of this {@linkcode Machine}.
   *
   * @see {@linkcode nodeToValue}
   */
  get initialValue() {
    return nodeToValue(this.#initialConfig as any);
  }

  /**
   * Alias of {@linkcode valueToConfig} method.
   */
  toNode = this.valueToConfig;

  get options() {
    const guards = this.#guards;
    const actions = this.#actions;
    const delays = this.#delays;
    const actors = this.#actors;

    const out = _unknown<Mo>({
      guards,
      actions,
      delays,

      actors,
    });

    return out;
  }

  /**
   * Function helper to check if a value matches the provided values
   *
   * @see type inferences :
   *
   * {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
   *
   * @see {@linkcode isValue}
   */
  protected get __isValue() {
    return isValue<Eo, Pc, Tc, Ta>;
  }

  /**
   * Function helper to check if a value is not one of the provided values.
   *
   * @see type inferences :
   *
   *  {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
   *
   * @see {@linkcode isNotValue}
   */
  protected get __isNotValue() {
    return isNotValue<Eo, Pc, Tc, Ta>;
  }

  /**
   * Function helper to check if a value is defined
   *
   * @see type inferences :
   *
   * {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
   *
   * @see {@linkcode isDefinedS}
   */
  protected get __isDefined() {
    return isDefinedS<Eo, Pc, Tc, Ta>;
  }

  /**
   * Function helper to check if a value is undefined or null
   * @see type inferences :
   *
   * {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
   *
   * @see {@linkcode isDefinedS}
   */
  protected get __isNotDefined() {
    return isNotDefinedS<Eo, Pc, Tc, Ta>;
  }

  /**
   * Function helper to send an event to a child service.
   *
   * @param _ an optional parameter of type {@linkcode AnyMachine} [{@linkcode T}] to specify the machine context. Only used for type inference.
   *
   * @see type inferences :
   *
   * {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
   *
   * @see {@linkcode reduceFnMap}
   */
  protected abstract __sendTo: <M extends AnyMachine>(_?: M) => Fn;

  protected abstract __voidAction: Fn;
  protected abstract __timeAction: Fn<[string], Fn<[string]>>;
  protected __cloneStateExtended = (
    state: StateExtended<Eo, Pc, Tc, Ta>,
  ) => {
    return structuredClone(state);
  };
}

/**
 * Helper to retrieve entry or exit actions from a node.
 *
 * @see {@linkcode GetIO_F}
 * @see {@linkcode toArray.typed}
 * @see {@linkcode isAtomic}
 * @see {@linkcode isCompound}
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
 */
export const getEntries = partialCall.paramArray(getIO, 'entry');

/**
 * Retrieves all exit actions from a node.
 */
export const getExits = partialCall.paramArray(getIO, 'exit');
