import type { WithDescriber } from '#actions';
import type {
  NoExtraKeysTransitionConfig,
  NoExtraKeysTransitionConfigSoA,
} from '#transitions';
import type {
  _FinallyConfig,
  ActorConfig,
  ChildConfig,
  CommonActor,
  EmitterConfig,
  FinallyConfig,
  FinallyConfigArray,
} from '@bemedev/app-options';
import type { NoExtraKeys } from '@bemedev/app-utils-bemedev';
import type { Describer } from '~types';

export type {
  _FinallyConfig,
  ActorConfig,
  ChildConfig,
  CommonActor,
  EmitterConfig,
  FinallyConfig,
  FinallyConfigArray,
} from '@bemedev/app-options';

/**
 * Internal utility type to enforce no extra keys on finally transition configuration objects.
 *
 * @template `T` - Transition target or configuration type.
 */
type _NoExtraKeysFinallyConfig<T> = T extends string
  ? T
  : T extends Describer
    ? NoExtraKeys<T, Describer>
    : T extends _FinallyConfig
      ? NoExtraKeysTransitionConfig<T> &
          Record<Exclude<keyof T, 'guards' | 'actions' | 'description'>, never>
      : never;

/**
 * Enforces no extra keys on read-only tuple of completion configurations.
 *
 * @template | {@linkcode _FinallyConfig} `T` - Read-only array of completion configs.
 */
export type NoExtraKeysFinallyConfigArray<
  T extends ReadonlyArray<_FinallyConfig | WithDescriber>,
> = T extends readonly [
  infer H extends _FinallyConfig | WithDescriber,
  ...infer Rest extends ReadonlyArray<_FinallyConfig | WithDescriber>,
]
  ? readonly [_NoExtraKeysFinallyConfig<H>, ...NoExtraKeysFinallyConfigArray<Rest>]
  : [];

/**
 * Enforces no extra keys on completion configurations.
 *
 * @template | {@linkcode FinallyConfig} `T` - Finally configuration type.
 */
export type NoExtraKeysFinallyConfig<T extends FinallyConfig> =
  T extends FinallyConfigArray
    ? NoExtraKeysFinallyConfigArray<T>
    : _NoExtraKeysFinallyConfig<T>;

/**
 * Enforces no extra keys on emitter actor configurations.
 *
 * @template | {@linkcode EmitterConfig} `T` - Input emitter config.
 */
export type NoExtraKeysEmitterConfig<T extends EmitterConfig> = CommonActor & {
  readonly next: NoExtraKeysTransitionConfigSoA<T['next']>;
  readonly error?: NoExtraKeysTransitionConfigSoA<T['error']>;
  readonly complete?: NoExtraKeysFinallyConfig<NonNullable<T['complete']>>;
};

/**
 * Helper extracting source identifier `src` from an actor configuration.
 *
 * @template `T` - Actor with `src` property.
 */
export type ExtractSrcFromActor<T extends { src: string }> = T['src'];

/**
 * Enforces no extra keys on child actor configurations.
 *
 * @template | {@linkcode ChildConfig} `T` - Child config type.
 */
export type NoExtraKeysChildConfig<T extends ChildConfig> = T & {
  [key1 in Extract<keyof T, 'on'>]: {
    [key2 in keyof T[key1]]?: NoExtraKeysTransitionConfigSoA<T[key1][key2]>;
  };
};

/**
 * Enforces no extra keys on any actor configuration (emitter or child).
 *
 * @template `T` - Input actor config type.
 */
export type NoExtraKeysActorConfig<T> = T extends EmitterConfig
  ? NoExtraKeysEmitterConfig<T>
  : T extends ChildConfig
    ? NoExtraKeysChildConfig<T>
    : ActorConfig;
