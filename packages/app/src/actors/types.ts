import type { WithDescriber } from '#actions';
import type {
  DelayedTransitions,
  NoExtraKeysTransitionConfig,
  NoExtraKeysTransitionConfigSoA,
  SingleOrArrayT,
  TransitionConfigMapA,
} from '#transitions';
import type {
  NoExtraKeys,
  NOmit,
  Require,
} from '@bemedev/app-utils-bemedev';
import type { Describer } from '~types';

/**
 * Base common configuration interface for actors.
 */
export type CommonActor = { readonly description?: string };

/**
 * Internal type alias for completion transition map minus `target`.
 */
export type _FinallyConfig = NOmit<TransitionConfigMapA, 'target'>;

/**
 * Tuple array of completion transitions ending with action describer or configuration.
 */
export type FinallyConfigArray = readonly [
  ...Require<_FinallyConfig, 'guards'>[],
  _FinallyConfig | WithDescriber,
];

/**
 * Internal utility type to enforce no extra keys on finally transition configuration objects.
 *
 * @template T - Transition target or configuration type.
 */
type _NoExtraKeysFinallyConfig<T> = T extends string
  ? T
  : T extends Describer
    ? NoExtraKeys<T, Describer>
    : T extends _FinallyConfig
      ? NoExtraKeysTransitionConfig<T> &
          Record<
            Exclude<keyof T, 'guards' | 'actions' | 'description'>,
            never
          >
      : never;

/**
 * Enforces no extra keys on read-only tuple of completion configurations.
 *
 * @template {ReadonlyArray<_FinallyConfig | WithDescriber>} T - Read-only array of completion configs.
 */
export type NoExtraKeysFinallyConfigArray<
  T extends ReadonlyArray<_FinallyConfig | WithDescriber>,
> = T extends readonly [
  infer H extends _FinallyConfig | WithDescriber,
  ...infer Rest extends ReadonlyArray<_FinallyConfig | WithDescriber>,
]
  ? readonly [
      _NoExtraKeysFinallyConfig<H>,
      ...NoExtraKeysFinallyConfigArray<Rest>,
    ]
  : [];

/**
 * The finally part of a completion configuration.
 *
 * @see {@linkcode TransitionConfigMapA}, {@linkcode WithDescriber}
 */
export type FinallyConfig =
  | (_FinallyConfig | WithDescriber)
  | FinallyConfigArray;

/**
 * Enforces no extra keys on completion configurations.
 *
 * @template {FinallyConfig} T - Finally configuration type.
 */
export type NoExtraKeysFinallyConfig<T extends FinallyConfig> =
  T extends FinallyConfigArray
    ? NoExtraKeysFinallyConfigArray<T>
    : _NoExtraKeysFinallyConfig<T>;

/**
 * Emitter actor configuration interface.
 *
 * @template Paths - Allowed state target path string union. Defaults to `string`.
 */
export type EmitterConfig<Paths = string> = CommonActor & {
  /**
   * Transitions triggered on next payload emission.
   */
  readonly next: SingleOrArrayT<Paths>;
  /**
   * Optional transitions triggered on error.
   */
  readonly error?: SingleOrArrayT<Paths>;
  /**
   * Optional completion configuration.
   */
  readonly complete?: FinallyConfig;
};

/**
 * Enforces no extra keys on emitter actor configurations.
 *
 * @template {EmitterConfig} T - Input emitter config.
 */
export type NoExtraKeysEmitterConfig<T extends EmitterConfig> =
  CommonActor & {
    readonly next: NoExtraKeysTransitionConfigSoA<T['next']>;
    readonly error?: NoExtraKeysTransitionConfigSoA<T['error']>;
    readonly complete?: NoExtraKeysFinallyConfig<
      NonNullable<T['complete']>
    >;
  };

/**
 * Helper extracting source identifier `src` from an actor configuration.
 *
 * @template {object} T - Actor with `src` property.
 */
export type ExtractSrcFromActor<T extends { src: string }> = T['src'];

/**
 * Child actor configuration interface.
 *
 * @template Paths - Allowed target state paths. Defaults to `string`.
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
 * Enforces no extra keys on child actor configurations.
 *
 * @template {ChildConfig} T - Child config type.
 */
export type NoExtraKeysChildConfig<T extends ChildConfig> = T & {
  [key1 in Extract<keyof T, 'on'>]: {
    [key2 in keyof T[key1]]?: NoExtraKeysTransitionConfigSoA<
      T[key1][key2]
    >;
  };
};

/**
 * Union type representing actor configuration (emitter or child actor).
 *
 * @template Paths - State path union. Defaults to `string`.
 */
export type ActorConfig<Paths = string> =
  | EmitterConfig<Paths>
  | ChildConfig<Paths>;

/**
 * Enforces no extra keys on any actor configuration (emitter or child).
 *
 * @template T - Input actor config type.
 */
export type NoExtraKeysActorConfig<T> = T extends EmitterConfig
  ? NoExtraKeysEmitterConfig<T>
  : T extends ChildConfig
    ? NoExtraKeysChildConfig<T>
    : ActorConfig;
