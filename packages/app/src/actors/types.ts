import type { WithDescriber } from '#actions';
import type {
  DelayedTransitions,
  NoExtraKeysTransitionConfigSoA,
  SingleOrArrayT,
  TransitionConfigMapA,
} from '#transitions';
import type { NOmit, Require } from '@bemedev/app-utils-bemedev';
import type { Describer } from '~types';

export type CommonActor = {
  readonly description?: string;
};

export type _FinallyConfig = NOmit<TransitionConfigMapA, 'target'>;

export type FinallyConfigArray = readonly [
  ...Require<_FinallyConfig, 'guards'>[],
  _FinallyConfig | WithDescriber,
];

type _NoExtraKeysFinallyConfig<T> = T extends string
  ? T
  : T extends Describer
    ? T & {
        [K in Exclude<keyof T, keyof Describer>]?: never;
      }
    : T & {
        [K in Exclude<keyof T, keyof _FinallyConfig>]?: never;
      };

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
 * @see {@linkcode TransitionConfigMapA} for the type of transition configurations.
 * @see {@linkcode WithDescriber} for the type of action configurations.
 */
export type FinallyConfig =
  | (_FinallyConfig | WithDescriber)
  | FinallyConfigArray;

export type NoExtraKeysFinallyConfig<T extends FinallyConfig> =
  T extends FinallyConfigArray
    ? NoExtraKeysFinallyConfigArray<T>
    : _NoExtraKeysFinallyConfig<T>;

export type EmitterConfig<Paths = string> = CommonActor & {
  readonly next: SingleOrArrayT<Paths>;
  readonly error?: SingleOrArrayT<Paths>;
  readonly complete?: FinallyConfig;
};

export type NoExtraKeysEmitterConfig<T extends EmitterConfig> =
  CommonActor & {
    readonly next: NoExtraKeysTransitionConfigSoA<T['next']>;
    readonly error?: NoExtraKeysTransitionConfigSoA<T['error']>;
    readonly complete?: NoExtraKeysFinallyConfig<
      NonNullable<T['complete']>
    >;
  };

export type ExtractSrcFromActor<T extends { src: string }> = T['src'];

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

export type NoExtraKeysChildConfig<T extends ChildConfig> = T & {
  [key1 in Extract<keyof T, 'on'>]: {
    [key2 in keyof T[key1]]?: NoExtraKeysTransitionConfigSoA<
      T[key1][key2]
    >;
  };
};

export type ActorConfig<Paths = string> =
  | EmitterConfig<Paths>
  | ChildConfig<Paths>;

export type NoExtraKeysActorConfig<T> = T extends EmitterConfig
  ? NoExtraKeysEmitterConfig<T>
  : T extends ChildConfig
    ? NoExtraKeysChildConfig<T>
    : ActorConfig;
