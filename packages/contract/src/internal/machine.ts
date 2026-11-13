/**
 * Vendored machine configuration types.
 *
 * Copied from the machine configuration surface so contracts can describe the
 * JSON config without importing `@bemedev/app`.
 */

import type { RecordS, Require, SingleOrArrayL } from './primitives';

/** Describer object used to name and document actions or guards. */
export type Describer = { name: string; description: string };

/** Action or guard reference, either a string or a describer object. */
export type WithDescriber = string | Describer;

/** Logical AND guard structure. */
export type GuardAnd = { and: GuardUnion[] };

/** Logical OR guard structure. */
export type GuardOr = { or: GuardUnion[] };

/** Union of guard descriptors and logical AND/OR configurations. */
export type GuardUnion = WithDescriber | GuardAnd | GuardOr;

/** JSON configuration for a guard. */
export type GuardConfig = GuardUnion;

/**
 * Simplest transition configuration map.
 *
 * @template `Paths` - Allowed target paths.
 */
export type _TransitionConfigMap<Paths = string> = {
  readonly target?: Paths;
  readonly actions?: SingleOrArrayL<WithDescriber>;
  readonly guards?: SingleOrArrayL<GuardConfig>;
  readonly description?: string;
};

/**
 * Transition configuration map requiring actions.
 *
 * @template `Paths` - Allowed target paths.
 */
export type TransitionConfigMapA<Paths = string> = Require<
  _TransitionConfigMap<Paths>,
  'actions'
>;

/**
 * Transition configuration map requiring a target.
 *
 * @template `Paths` - Allowed target paths.
 */
export type TransitionConfigMapF<Paths = string> = Require<
  _TransitionConfigMap<Paths>,
  'target'
>;

/**
 * Union of target-required and action-required transition maps.
 *
 * @template `Paths` - Allowed target paths.
 */
export type TransitionConfigMap<Paths = string> =
  | TransitionConfigMapF<Paths>
  | TransitionConfigMapA<Paths>;

/**
 * Transition map requiring guards.
 *
 * @template `Paths` - Allowed target paths.
 */
export type TransitionConfigMapG<Paths = string> = Require<
  TransitionConfigMap<Paths>,
  'guards'
>;

/**
 * Target-required transition map requiring guards.
 *
 * @template `Paths` - Allowed target paths.
 */
export type TransitionConfigMapFG<Paths = string> = Require<
  TransitionConfigMapF<Paths>,
  'guards'
>;

/**
 * A target path or a transition configuration map.
 *
 * @template `Paths` - Allowed target paths.
 */
export type TransitionConfig<Paths = string> = Paths | TransitionConfigMap<Paths>;

/**
 * A target path or a target-required transition map.
 *
 * @template `Paths` - Allowed target paths.
 */
export type TransitionConfigF<Paths = string> = Paths | TransitionConfigMapF<Paths>;

/**
 * Array of transitions ending with a target transition.
 *
 * @template `Paths` - Allowed target paths.
 */
export type ArrayTransitions<Paths = string> = readonly [
  ...TransitionConfigMapG<Paths>[],
  TransitionConfig<Paths>,
];

/**
 * Array of target transitions ending with a target transition.
 *
 * @template `Paths` - Allowed target paths.
 */
export type ArrayTransitionsF<Paths = string> = readonly [
  ...TransitionConfigMapFG<Paths>[],
  TransitionConfigF<Paths>,
];

/**
 * A single transition or an array of transitions.
 *
 * @template `Paths` - Allowed target paths.
 */
export type SingleOrArrayT<Paths = string> =
  | ArrayTransitions<Paths>
  | TransitionConfig<Paths>;

/**
 * Always transition configuration.
 *
 * @template `Paths` - Allowed target paths.
 */
export type AlwaysConfig<Paths = string> =
  | ArrayTransitionsF<Paths>
  | TransitionConfigF<Paths>;

/**
 * Record of delayed transitions.
 *
 * @template `Paths` - Allowed target paths.
 */
export type DelayedTransitions<Paths = string> = RecordS<SingleOrArrayT<Paths>>;

/** Base actor configuration. */
export type CommonActor = { readonly description?: string };

/** Completion transition map without a target. */
export type _FinallyConfig = Omit<TransitionConfigMapA, 'target'>;

/** Tuple of completion transitions. */
export type FinallyConfigArray = readonly [
  ...Require<_FinallyConfig, 'guards'>[],
  _FinallyConfig | WithDescriber,
];

/** Completion configuration for an emitter. */
export type FinallyConfig = (_FinallyConfig | WithDescriber) | FinallyConfigArray;

/**
 * Emitter actor configuration.
 *
 * @template `Paths` - Allowed target paths.
 */
export type EmitterConfig<Paths = string> = CommonActor & {
  readonly next: SingleOrArrayT<Paths>;
  readonly error?: SingleOrArrayT<Paths>;
  readonly complete?: FinallyConfig;
};

/**
 * Child actor configuration.
 *
 * @template `Paths` - Allowed target paths.
 */
export type ChildConfig<Paths = string> = CommonActor &
  (
    | {
        readonly on: DelayedTransitions<Paths>;
        readonly contexts?: Record<string, string>;
      }
    | {
        readonly on?: DelayedTransitions<Paths>;
        readonly contexts: Record<string, string>;
      }
  );

/**
 * Actor configuration (emitter or child actor).
 *
 * @template `Paths` - Allowed target paths.
 */
export type ActorConfig<Paths = string> = EmitterConfig<Paths> | ChildConfig<Paths>;

/** Activity configuration map or describer. */
export type ActivityMap =
  | {
      guards?: SingleOrArrayL<GuardConfig>;
      actions: SingleOrArrayL<WithDescriber>;
      description?: string;
    }
  | WithDescriber;

/** Activity configuration array. */
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

/** Map of activity names to activity configurations. */
export type ActivityConfig = Record<string, ActivityArray>;

/** Base options shared by all state nodes. */
export type BaseConfig = {
  readonly description?: string;
  readonly entry?: SingleOrArrayL<WithDescriber>;
  readonly exit?: SingleOrArrayL<WithDescriber>;
  readonly tags?: SingleOrArrayL<string>;
  readonly activities?: ActivityConfig;
};

/**
 * Transitions declared by a state node.
 *
 * @template `Paths` - Allowed target paths.
 */
export type TransitionsConfig<Paths extends string = string> = {
  readonly on?: DelayedTransitions<Paths>;
  readonly always?: AlwaysConfig<Paths>;
  readonly after?: DelayedTransitions<Paths>;
  readonly actors?: RecordS<ActorConfig<Paths>>;
};

/**
 * Common configuration shared by every state node.
 *
 * @template `Paths` - Allowed target paths.
 */
export type CommonNodeConfig<Paths extends string = string> = BaseConfig &
  TransitionsConfig<Paths>;

/**
 * Full configuration for atomic, compound or parallel nodes.
 *
 * @template `Paths` - Allowed target paths.
 */
export type NodeConfig2<Paths extends string = string> = CommonNodeConfig<Paths> &
  (
    | { readonly type?: 'atomic'; readonly initial?: never; readonly states?: never }
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
 * Machine configuration with strict and longRuns flags.
 *
 * @template `Paths` - Allowed target paths.
 */
export type CommonConfig2<Paths extends string = string> = NodeConfig2<Paths> & {
  readonly strict?: boolean;
  readonly __longRuns?: boolean;
};
