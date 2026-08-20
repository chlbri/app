import type { ActionResult, AsyncAction2, WithDescriber } from '#actions';
import type { NoExtraKeysActorConfig } from '#actors';
import type { ActorsConfigMap, EventObject, EventsMap, EventStrings } from '#events';

import type {
  FlatMapN,
  NodeConfig2,
  NodeConfig,
  NodeConfigCompound2,
  NodeConfigParallel2,
  StateValue,
  TargetDef,
  NodeConfig3,
  StateExtended,
  StatePextended,
} from '#states';
import type {
  AsyncTransition,
  NoExtraKeysTransitionConfigSoA,
  TransitionsConfig,
} from '#transitions';
import type { Fn } from '#utils';
import type { Identitfy, NotUndefined } from '@bemedev/app-utils-bemedev';
import type {
  DecomposeString,
  Decompose as _Decompose,
} from '@bemedev/function-swap';
import type { ObjectT, PrimitiveObject, Sh, StandardKey } from '@bemedev/typings';
import type { EmptyObject, FnMap, FnR, MaybePromise, RecordS } from '~types';

/**
 * Type guard for enforcing no extra keys on target definitions.
 *
 * @template {TargetDef} T - Target definition input type.
 */
export type NoExtraKeysTargetDef<T extends TargetDef> = T & {
  [K in Exclude<keyof T, keyof TargetDef>]: never;
} & {
  states?: {
    [K in keyof T['states']]: T['states'][K] extends infer TK extends TargetDef
      ? NoExtraKeysTargetDef<TK>
      : never;
  };
};

/**
 * Transforms target definition into initial state map structure.
 *
 * @template {TargetDef} T - Target definition type.
 */
export type TransformTargetDef<T extends TargetDef> = (undefined extends T['initial']
  ? EmptyObject
  : { readonly initial: T['initial'] }) &
  (undefined extends T['states']
    ? EmptyObject
    : {
        readonly states: {
          [Key in keyof T['states']]: T['states'][Key] extends infer TK extends
            TargetDef
            ? TransformTargetDef<TK>
            : never;
        };
      });

/**
 * Transforms target definition and node config into updated node config.
 *
 * @template {NodeConfig2} N - Base node configuration type.
 * @template {TargetDef} T - Target definition type.
 */
export type TransformTargetDef2<
  N extends NodeConfig2,
  T extends TargetDef,
> = (undefined extends T['initial']
  ? N
  : Omit<N, 'initial'> & { readonly initial: T['initial'] } & TransitionsConfig<
        T['targets']
      >) &
  (undefined extends T['states']
    ? EmptyObject
    : {
        readonly states: {
          [Key in keyof T['states']]: T['states'][Key] extends infer TK extends
            TargetDef
            ? TransformTargetDef<TK>
            : never;
        };
      });

/**
 * Union of non-atomic node configurations (compound or parallel).
 */
export type CommonConfigNode = NodeConfigCompound2 | NodeConfigParallel2;

/**
 * Machine configuration with strict and longRuns flags.
 *
 * @template {TargetDef} Paths - Target definition type.
 */
export type CommonConfig<Paths extends TargetDef = TargetDef> = NodeConfig<Paths> & {
  readonly strict?: boolean;
  readonly __longRuns?: boolean;
};

/**
 * Machine configuration version 2 with strict and longRuns flags.
 *
 * @template {string} Paths - State path union.
 */
export type CommonConfig2<Paths extends string = string> = NodeConfig2<Paths> & {
  readonly strict?: boolean;
  readonly __longRuns?: boolean;
};

/**
 * Loose machine configuration version 3 with strict and longRuns flags.
 *
 * @template {string} Paths - State path union.
 */
export type CommonConfig3<Paths extends string = string> = NodeConfig3<Paths> & {
  readonly strict?: boolean;
  readonly __longRuns?: boolean;
};

/**
 * Enforces no extra keys across full machine configuration object.
 *
 * @template {CommonConfig3} T - Configuration type.
 */
export type NoExtraKeysConfig<T extends CommonConfig3> = T & {
  [K in Exclude<keyof T, keyof CommonConfig3>]: never;
} & {
  readonly states?: {
    [K in keyof T['states']]?: T['states'][K] extends infer TK extends CommonConfig3
      ? NoExtraKeysConfig<TK>
      : never;
  };
} & {
  readonly on?: {
    [key in keyof T['on']]?: NoExtraKeysTransitionConfigSoA<T['on'][key]>;
  };
  readonly after?: {
    [key in keyof T['after']]?: NoExtraKeysTransitionConfigSoA<T['after'][key]>;
  };
  readonly always?: NoExtraKeysTransitionConfigSoA<T['always']>;
  readonly actors?: {
    [key in keyof T['actors']]?: NoExtraKeysActorConfig<T['actors'][key]>;
  };
};

/**
 * Machine category classification (synchronous or asynchronous).
 */
export type MachineType = 'sync' | 'async';

/**
 * Simple representation of a machine with meaningful properties.
 *
 * @template {EventsMap} E - Type of events map.
 * @template {ActorsConfigMap} A - Type of actors configuration map.
 * @template Pc - Type of private context.
 * @template {PrimitiveObject} Tc - Type of context.
 *
 * @see {@linkcode StateValue}, {@linkcode Fn}
 */
export interface AnyMachine<
  E extends EventsMap = EventsMap,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> {
  /**
   * Machine options object.
   */
  options: any;

  /**
   * Machine configuration object.
   */
  config: CommonConfig3;

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
  context: Tc;

  /**
   * Machine private context object.
   */
  pContext: Pc;

  /**
   * Map of machine events.
   */
  eventsMap: E;

  /**
   * Map of machine actor configurations.
   */
  actorsMap: A;

  /**
   * Internal event object type marker.
   */
  __events: any;

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
  __allPaths: string;

  /**
   * Internal state tag string type marker.
   */
  __tag: string;

  /**
   * Array of state tag strings defined on the machine.
   */
  tags: string[];

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
}

/**
 * Options resolution function parameter type.
 *
 * @template {SimpleMachineOptions2} Mo - Machine options type.
 */
export type CommonAddOptionsParam_F<
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = Fn<any[], Mo | undefined>;

/**
 * Options addition function signature.
 *
 * @template {SimpleMachineOptions2} Mo - Machine options type.
 */
export type CommonAddOptions_F<
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = (option: CommonAddOptionsParam_F<Mo>) => Mo | undefined;

/**
 * Core elements of a state machine initialization payload.
 *
 * @template C - Configuration type.
 * @template Pc - Private context.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {SimpleMachineOptions2} Mo - Options type.
 */
export type CommonElements<
  C extends { readonly strict?: boolean; readonly __longRuns?: boolean } = {
    readonly strict?: boolean;
    readonly __longRuns?: boolean;
  },
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = {
  config: C;
  pContext: Pc;
  context: Tc;
  actions?: Mo['actions'];
  guards?: Mo['guards'];
  delays?: Mo['delays'];
  actors?: Mo['actors'];
};

/**
 * Second version of simple machine options.
 *
 * @see {@linkcode Partial}, {@linkcode Record}
 */
export type SimpleMachineOptions2 = Partial<
  Record<'actions' | 'guards' | 'delays', any> &
    Record<'actors', { children?: RecordS<any>; emitters?: RecordS<any> }>
>;

/**
 * Helper function for extracting entry or exit actions from a node.
 */
export type GetIO_F = (key: 'exit' | 'entry', node?: any) => WithDescriber[];

/**
 * Internal standard output properties type picker.
 *
 * @template {ObjectT} T - Target object type.
 */
type StandardOutput2<T extends ObjectT> = Pick<Sh<T>, StandardKey>;

/**
 * Alias for standard output mapping type.
 *
 * @template {ObjectT} T - Object type.
 */
export type StdO2<T extends ObjectT> = StandardOutput2<T>;

/**
 * Common function signature for timer actions.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
export type CommonTimeAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (name: string) => (id: string) => AsyncAction2<E, Pc, Tc, T>;

/**
 * Generic machine creator function signature.
 *
 * @template T - Target machine type.
 */
export type CommonCreateMachine_F<T = any> = (config: any) => T;

/**
 * Represents a scheduled action with its data and execution time.
 *
 * @template Pc - Type of private context.
 * @template {PrimitiveObject} Tc - Type of context.
 *
 * @see {@linkcode ActionResult}
 */
export type ScheduledData<Pc = any, Tc extends PrimitiveObject = PrimitiveObject> = {
  data: ActionResult<Pc, Tc>;
  ms: number;
  id: string;
};

/**
 * Map of child names to child actor machine functions.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
export type ChildrenMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = RecordS<CommonChildFunction<E, Pc, Tc, T>>;

/**
 * Child machine function map signature.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 * @template R - Machine return type.
 */
export type CommonChildFunction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnMap<E, Pc, Tc, T, R, `${string}::on::${string}`>;

/**
 * Child machine single function signature returning maybe promise of `R`.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 * @template R - Machine return type.
 */
export type CommonChildFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnR<E, Pc, Tc, T, MaybePromise<R>>;

/**
 * Extract child event payload type by child key `K`.
 *
 * @template {string} K - Child key name.
 * @template {ActorsConfigMap} A - Actors configuration map type.
 */
export type ChildEvents<
  K extends string,
  A extends ActorsConfigMap = ActorsConfigMap,
> = NotUndefined<A['children']>[K] extends infer P ? P : never;

/**
 * Internal type for extracting event keys from flat map nodes.
 *
 * @template {FlatMapN} Flat - Type of flat map of nodes.
 */
type _GetEventKeysFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]: Flat[key] extends { on: infer V } ? keyof V : never;
}[keyof Flat];

/**
 * Provide a record of all events by key and {@linkcode PrimitiveObject} payload.
 *
 * @template {FlatMapN} Flat - Type of flat map of nodes.
 *
 * @see {@linkcode _GetEventKeysFromFlat}
 */
export type GetEventsFromFlat<Flat extends FlatMapN> = Record<
  _GetEventKeysFromFlat<Flat>,
  PrimitiveObject
>;

/**
 * Get all events from a machine config.
 *
 * @template {CommonConfig3} C - Type of machine config.
 *
 * @see {@linkcode FlatMapN}, {@linkcode GetEventsFromFlat}, {@linkcode ConfigFrom}
 */
export type GetEventsFromConfig<C extends CommonConfig3> = GetEventsFromFlat<
  FlatMapN<C>
>;

/**
 * Child configuration definition alias for events map.
 */
export type ChildConfigDef = EventsMap;

/**
 * Map of child names to child configuration definitions.
 *
 * @template {string} S - Key string type.
 */
export type ChildConfigMap<S extends string = string> = Record<S, ChildConfigDef>;

/**
 * Child actor object representation.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 * @template R - Child return type.
 */
export type CommonChild<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = {
  src: CommonChildFunction2<E, Pc, Tc, T, R>;
  description?: string;
  id: string;
  on: Identitfy<RecordS<AsyncTransition<E, Pc, Tc, T>>>[];
  contexts: string[];
};

/**
 * Helper function for swapping state signatures in functional transitions.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
export type SwapFunction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <const F2 extends Fn, const Ev extends E['type'] = string>(
  fn: F2,
  event?: Ev,
) => (
  types: DecomposeString<
    [
      EventStrings extends Ev
        ? StateExtended<E, Pc, Tc, T>
        : Required<StatePextended<Extract<E, { type: Ev }>['payload'], Pc, Tc, T>>,
    ],
    _Decompose<Parameters<F2>>
  >,
) => FnR<E, Pc, Tc, T, ReturnType<F2>>;
