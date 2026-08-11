import type {
  AsyncAction,
  FromActionConfig,
  WithDescriber,
} from '#actions';
import type { EventObject } from '#events';
import type { FromGuard, GuardConfig } from '#guards';
import type { AsyncTransitions, TransitionsConfig } from '#transitions';
import type {
  Equals,
  Keys,
  UnionToIntersection,
} from '@bemedev/app-utils-bemedev';
import type { PrimitiveObject } from '@bemedev/typings';
import type {
  EmptyObject,
  Identify,
  RecordS,
  ReduceArray,
  SingleOrArrayL,
} from '~types';

/**
 * State node type categories: atomic, compound, or parallel.
 */
export type StateType = 'atomic' | 'compound' | 'parallel';

/**
 * Type alias for state node configuration type {@linkcode NodeConfig2}.
 */
export type SNC = NodeConfig2;

/**
 * Configuration structure or describer for state activity.
 */
export type ActivityMap =
  | {
      guards?: SingleOrArrayL<GuardConfig>;
      actions: SingleOrArrayL<WithDescriber>;
      description?: string;
    }
  | WithDescriber;

/**
 * Array or single instance of activity configurations.
 */
export type ActivityArray =
  | [
      ...{
        guards: SingleOrArrayL<GuardConfig>;
        actions: SingleOrArrayL<WithDescriber>;
        description?: string;
      }[],
      ActivityMap,
    ]
  | ActivityMap;

/**
 * Map of activity names to activity configuration arrays.
 */
export type ActivityConfig = Record<string, ActivityArray>;

/**
 * Helper extracting actions from an activity configuration array.
 *
 * @template {ActivityArray} TS - Activity array type.
 */
export type ActionsFromActivity<TS extends ActivityArray> = TS extends any
  ? ReduceArray<TS> extends infer TR
    ? TR extends { actions: SingleOrArrayL<WithDescriber> }
      ? FromGuard<ReduceArray<TR['actions']>>
      : FromActionConfig<ReduceArray<Extract<TR, WithDescriber>>>
    : never
  : never;

/**
 * Helper extracting guards from an activity configuration array.
 *
 * @template {ActivityArray} TS - Activity array type.
 */
export type GuardsFromActivity<TS extends ActivityArray> = TS extends any
  ? ReduceArray<TS> extends infer TR
    ? TR extends { guards: SingleOrArrayL<GuardConfig> }
      ? FromGuard<ReduceArray<TR['guards']>>
      : never
    : never
  : never;

/**
 * Extracts action keys from an activity configuration container.
 *
 * @template T - Container object with `activities`.
 */
export type ExtractActionsFromActivity<
  T extends { activities: ActivityConfig },
> = T['activities'] extends infer TA extends ActivityConfig
  ? { [key in keyof TA]: ActionsFromActivity<TA[key]> }[keyof TA]
  : never;

/**
 * Extracts guard keys from an activity configuration container.
 *
 * @template T - Container object with `activities`.
 */
export type ExtractGuardsFromActivity<
  T extends { activities: ActivityConfig },
> = T['activities'] extends infer TA extends ActivityConfig
  ? { [key in keyof TA]: GuardsFromActivity<TA[key]> }[keyof TA]
  : never;

/**
 * Extracts delay keys from an activity configuration container.
 *
 * @template T - Target object with optional `activities`.
 */
export type ExtractDelaysFromActivity<T> = 'activities' extends keyof T
  ? T['activities'] extends infer TA extends ActivityConfig
    ? TA extends any
      ? keyof TA
      : never
    : never
  : never;

/**
 * Base configuration options shared by all state nodes.
 */
export type BaseConfig = {
  readonly description?: string;
  readonly entry?: SingleOrArrayL<WithDescriber>;
  readonly exit?: SingleOrArrayL<WithDescriber>;
  readonly tags?: SingleOrArrayL<string>;
  readonly activities?: ActivityConfig;
};

/**
 * Common configuration combining base options and transition declarations.
 *
 * @template {string} Paths - State path union. Defaults to `string`.
 */
export type CommonNodeConfig<Paths extends string = string> = BaseConfig &
  TransitionsConfig<Paths>;

/**
 * Full state node configuration for atomic, compound, or parallel state nodes.
 *
 * @template {string} Paths - State path union. Defaults to `string`.
 */
export type NodeConfig2<Paths extends string = string> =
  CommonNodeConfig<Paths> &
    (
      | {
          readonly type?: 'atomic';
          readonly initial?: never;
          readonly states?: never;
        }
      | {
          readonly type?: 'compound';
          readonly initial: string;
          readonly states: RecordS<NodeConfig2<Paths>>;
        }
      | {
          readonly type: 'parallel';
          readonly initial?: never;
          readonly states: RecordS<NodeConfig2<Paths>>;
        }
    );

/**
 * Loose node configuration structure allowing optional properties.
 *
 * @template {string} Paths - State path union. Defaults to `string`.
 */
export type NodeConfig3<Paths extends string = string> =
  CommonNodeConfig<Paths> & {
    readonly type?: StateType;
    readonly initial?: string;
    readonly states?: RecordS<NodeConfig3<Paths>>;
  };

/**
 * Target definition hierarchy map.
 */
export type TargetDef = {
  readonly targets: string;
  readonly initial?: string;
  readonly states?: RecordS<TargetDef>;
};

/**
 * Node configuration mapped to a target definition type `T`.
 *
 * @template {TargetDef} T - Target definition type.
 */
export type NodeConfig<T extends TargetDef> = CommonNodeConfig<
  T['targets']
> &
  (undefined extends T['states']
    ? {
        readonly type?: 'atomic';
        readonly initial?: never;
        readonly states?: never;
      }
    : {
        readonly states: {
          [
            key in keyof T['states']
          ]: T['states'][key] extends infer TK extends TargetDef
            ? NodeConfig<TK>
            : CommonNodeConfig & {
                readonly type?: 'atomic';
                readonly initial?: never;
                readonly states?: never;
              };
        };
      } & (undefined extends T['initial']
        ? { readonly type: 'parallel'; readonly initial?: never }
        : Pick<T, 'initial'> & { type?: 'compound' }));

/**
 * Atomic state node configuration.
 *
 * @template {string} Paths - Allowed state path union.
 */
export type NodeConfigAtomic2<Paths extends string = string> =
  CommonNodeConfig<Paths> & {
    readonly type?: 'atomic';
    readonly initial?: never;
    readonly states?: never;
  };

/**
 * Compound state node configuration.
 *
 * @template {string} Paths - Allowed state path union.
 */
export type NodeConfigCompound2<Paths extends string = string> =
  CommonNodeConfig<Paths> & {
    readonly type?: 'compound';
    readonly initial: string;
    readonly states: RecordS<NodeConfig2<Paths>>;
  };

/**
 * Parallel state node configuration.
 *
 * @template {string} Paths - Allowed state path union.
 */
export type NodeConfigParallel2<Paths extends string = string> =
  CommonNodeConfig<Paths> & {
    readonly type: 'parallel';
    readonly initial?: never;
    readonly states: RecordS<NodeConfig2<Paths>>;
  };

/**
 * Union representing string or nested state value map.
 */
export type StateValue = string | StateValueMap;

/**
 * Record map of state names to nested state values.
 */
export interface StateValueMap {
  [key: string]: StateValue;
}

// #region Flat

// #region States
/**
 * Working status lifecycle strings of a machine.
 */
export type WorkingStatus =
  | 'idle'
  | 'starting'
  | 'started'
  | 'paused'
  | 'working'
  | 'sending'
  | 'stopped'
  | 'busy';

/**
 * Internal helper to extract state tags from a flat node map.
 *
 * @template | {@linkcode FlatMapN} `Flat` - Flat map of state nodes.
 */
type _ExtractTagsFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]: Flat[key] extends infer S extends {
    tags: SingleOrArrayL<string>;
  }
    ? ReduceArray<S['tags']>
    : never;
}[keyof Flat];

/**
 * Helper extracting all tags from a flattened state map type `Flat`.
 *
 * @template {FlatMapN} Flat - Flat map node configuration type.
 */
export type ExtractTagsFromFlat<Flat extends FlatMapN> =
  _ExtractTagsFromFlat<Flat> extends infer Tags
    ? Equals<Tags, never> extends true
      ? string
      : Equals<Tags, unknown> extends true
        ? string
        : Tags
    : string;

/**
 * Common state properties structure.
 *
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - Tags string type.
 */
export type CommonState<
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { context: Tc; status: WorkingStatus; value: StateValue; tags: T[] };

/**
 * Full active state object containing event and context data.
 *
 * @template {EventObject} E - Event object type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - Tags string type.
 */
export type State<
  E extends EventObject = EventObject,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { event: E } & CommonState<Tc, T>;

/**
 * State object with custom event payload.
 *
 * @template E - Payload type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - Tags string type.
 */
export type StateP<
  E = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { payload: E } & CommonState<Tc, T>;

/**
 * Extended active state object including private context `pContext`.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - Tags string type.
 */
export type StateExtended<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { pContext: Pc } & State<E, Tc, T>;

/**
 * Extended state object with payload and private context.
 *
 * @template E - Payload type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - Tags string type.
 */
export type StatePextended<
  E = any,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { pContext: Pc } & StateP<E, Tc, T>;
// #endregion

/**
 * Internal helper to compute a recursive flat map of state node configurations.
 *
 * @template | {@linkcode NodeConfig3} `T` - Node configuration object.
 * @template | {@linkcode boolean} `withChildren` - Whether to include child states.
 * @template | {@linkcode string} `Remaining` - Current path prefix.
 */
type FlatMapNodeConfig<
  T extends NodeConfig3,
  withChildren extends boolean = true,
  Remaining extends string = '/',
> = 'states' extends keyof T
  ? {
      readonly [
        key in keyof T['states'] as `${Remaining}${key & string}`
      ]: withChildren extends true
        ? T['states'][key]
        : Omit<T['states'][key], 'states'>;
    } & {
      [key in keyof T['states']]: T['states'][key] extends infer S extends
        NodeConfig2 & { states: RecordS<NodeConfig2> }
        ? FlatMapNodeConfig<
            S,
            withChildren,
            `${Remaining}${key & string}/`
          >
        : EmptyObject;
    }[keyof T['states']]
  : EmptyObject;

/**
 * Flattened map of all state paths to their respective node configurations.
 *
 * @template {NodeConfig3} T - Root node configuration.
 * @template {boolean} withChildren - Flag indicating whether child states are included.
 */
export type FlatMapN<
  T extends NodeConfig3 = NodeConfig3,
  withChildren extends boolean = true,
> = UnionToIntersection<FlatMapNodeConfig<T, withChildren>> & {
  readonly '/': T;
};
// #endregion

/** Internal pattern type for always transition event keys. */
type AlwaysEnd = `${string}.always` | `${string}.always.[${number}]`;

/**
 * Filters keys that end with always transition string patterns.
 *
 * @template {Keys} T - Keys type.
 */
export type EndWithAlways<T extends Keys> = Extract<T, AlwaysEnd>;

/**
 * Alias for type {@linkcode EndWithAlways}.
 *
 * @template {Keys} T - Keys type.
 */
export type EndwA<T extends Keys> = EndWithAlways<T>;

/**
 * Internal state node structure holding executed functions and sub-nodes.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - Tags string type.
 */
export type Node<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  /**
   * Node path identifier.
   */
  id?: string;
  /**
   * Optional description text.
   */
  description?: string;
  /**
   * Node category type.
   */
  type: StateType;
  /**
   * Entry actions.
   */
  entry: AsyncAction<E, Pc, Tc, T>[];
  /**
   * Exit actions.
   */
  exit: AsyncAction<E, Pc, Tc, T>[];
  /**
   * Tag strings.
   */
  tags: string[];
  /**
   * Child state nodes.
   */
  states: Identify<Node<E, Pc, Tc, T>>[];
  /**
   * Default initial child state name.
   */
  initial?: string;
} & AsyncTransitions<E, Pc, Tc, T>;
