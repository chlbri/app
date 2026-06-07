import type { WithDescriber } from '#actions';
import type {
  DelayedTransitions,
  SingleOrArrayT,
  TransitionConfigMapA,
} from '#transitions';
import type { Require } from '@bemedev/app-utils-bemedev';

export type CommonActor = {
  readonly description?: string;
};

/**
 * The finally part of a completion configuration.
 *
 * @see {@linkcode TransitionConfigMapA} for the type of transition configurations.
 * @see {@linkcode WithDescriber} for the type of action configurations.
 */
export type FinallyConfig =
  Omit<TransitionConfigMapA, 'target'> extends infer F extends Omit<
    TransitionConfigMapA,
    'target'
  >
    ?
        | (F | WithDescriber)
        | readonly [...Require<F, 'guards'>[], F | WithDescriber]
    : never;

export type _EmitterConfig<Paths = string> = CommonActor & {
  readonly next: SingleOrArrayT<Paths>;
  readonly error?: SingleOrArrayT<Paths>;
  readonly complete?: FinallyConfig;
};

export type EmitterConfig<Paths = string> =
  _EmitterConfig<Paths> extends infer E
    ? E & { [K in Exclude<keyof E, keyof _EmitterConfig<Paths>>]: never }
    : never;

export type ExtractSrcFromActor<T extends { src: string }> = T['src'];

export type _ChildConfig<Paths = string> = CommonActor &
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

export type ChildConfig<Paths = string> =
  _ChildConfig<Paths> extends infer C
    ? C & { [K in Exclude<keyof C, keyof _ChildConfig<Paths>>]: never }
    : never;

export type ActorConfig<Paths = string> =
  | EmitterConfig<Paths>
  | ChildConfig<Paths>;
