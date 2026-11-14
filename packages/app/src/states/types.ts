import type { AsyncAction, FromActionConfig, WithDescriber } from '#actions';
import type { EventObject } from '#events';
import type { FromGuard, GuardConfig } from '#guards';
import type { AsyncTransitions } from '#transitions';
import type {
  Equals,
  Keys,
  UnionToIntersection,
} from '@bemedev/app-options/bemedev';
import type { PrimitiveObject } from '@bemedev/typings';
import type {
  EmptyObject,
  Identify,
  RecordS,
  ReduceArray,
  SingleOrArrayL,
} from '~types';

import type {
  ActivityArray,
  ActivityConfig,
  NodeConfig2,
  NodeConfig3,
  StateType,
} from '@bemedev/app-options';

export type {
  ActivityArray,
  ActivityConfig,
  ActivityMap,
  BaseConfig,
  CommonNodeConfig,
  CommonState,
  NodeConfig,
  NodeConfig2,
  NodeConfig3,
  NodeConfigAtomic2,
  NodeConfigCompound2,
  NodeConfigParallel2,
  State,
  StateExtended,
  StateP,
  StatePextended,
  StateType,
  StateValue,
  StateValueMap,
  TargetDef,
  WorkingStatus,
} from '@bemedev/app-options';

/**
 * Type alias for state node configuration type {@linkcode NodeConfig2}.
 */
export type SNC = NodeConfig2;

/**
 * Helper extracting actions from an activity configuration array.
 *
 * @template | {@linkcode ActivityArray} `TS` - Activity array type.
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
 * @template | {@linkcode ActivityArray} `TS` - Activity array type.
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
export type ExtractActionsFromActivity<T extends { activities: ActivityConfig }> =
  T['activities'] extends infer TA extends ActivityConfig
    ? { [key in keyof TA]: ActionsFromActivity<TA[key]> }[keyof TA]
    : never;

/**
 * Extracts guard keys from an activity configuration container.
 *
 * @template T - Container object with `activities`.
 */
export type ExtractGuardsFromActivity<T extends { activities: ActivityConfig }> =
  T['activities'] extends infer TA extends ActivityConfig
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

// #region Flat

// #region States
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
 * @template | {@linkcode FlatMapN} `Flat` - Flat map node configuration type.
 */
export type ExtractTagsFromFlat<Flat extends FlatMapN> =
  _ExtractTagsFromFlat<Flat> extends infer Tags
    ? Equals<Tags, never> extends true
      ? string
      : Equals<Tags, unknown> extends true
        ? string
        : Tags
    : string;

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
        ? FlatMapNodeConfig<S, withChildren, `${Remaining}${key & string}/`>
        : EmptyObject;
    }[keyof T['states']]
  : EmptyObject;

/**
 * Flattened map of all state paths to their respective node configurations.
 *
 * @template | {@linkcode NodeConfig3} `T` - Root node configuration.
 * @template `withChildren` - Flag indicating whether child states are included.
 */
export type FlatMapN<
  T extends NodeConfig3 = NodeConfig3,
  withChildren extends boolean = true,
> = UnionToIntersection<FlatMapNodeConfig<T, withChildren>> & { readonly '/': T };
// #endregion

/** Internal pattern type for always transition event keys. */
type AlwaysEnd = `${string}.always` | `${string}.always.[${number}]`;

/**
 * Filters keys that end with always transition string patterns.
 *
 * @template | {@linkcode Keys} `T` - Keys type.
 */
export type EndWithAlways<T extends Keys> = Extract<T, AlwaysEnd>;

/**
 * Alias for type {@linkcode EndWithAlways}.
 *
 * @template | {@linkcode Keys} `T` - Keys type.
 */
export type EndwA<T extends Keys> = EndWithAlways<T>;

/**
 * Internal state node structure holding executed functions and sub-nodes.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - Tags string type.
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
