import type {
  AsyncAction,
  FromActionConfig,
  NoExtraKeysActionSoa,
  SyncAction,
} from '#actions';

import type {
  _TransitionConfigMap,
  ActorConfig,
  ArrayTransitions,
  ArrayTransitionsF,
  ChildConfig,
  Contract,
  EmitterConfig,
  GuardConfig,
  RecordS,
  SingleOrArrayL,
  TransitionConfigMapA,
  TransitionConfigMapF,
  TransitionConfigMapFG,
  TransitionConfigMapG,
  TransitionsConfig,
} from '@bemedev/app-contract';

import type {
  AsyncPredicate,
  FromGuard,
  NoExtraKeysGuardConfigSoA,
  SyncPredicate,
} from '#guards';

import type {
  AnyArray,
  IndexesOfArray,
  NotUndefined,
  SoA,
} from '@bemedev/app-contract/bemedev';

import type { CommonChild } from '#common/machine';
import type { AsyncEmitter } from '#emitters';
import type { Identify, ReduceArray } from '~types';

export type {
  _TransitionConfigMap,
  AlwaysConfig,
  ArrayTransitions,
  ArrayTransitionsF,
  DelayedTransitions,
  SingleOrArrayT,
  TransitionConfig,
  TransitionConfigF,
  TransitionConfigMap,
  TransitionConfigMapA,
  TransitionConfigMapF,
  TransitionConfigMapFG,
  TransitionConfigMapG,
  TransitionsConfig,
} from '@bemedev/app-contract';

// type TargetDef = {
//   readonly targets: string;
//   readonly initial?: string;
//   readonly states?: RecordS<TargetDef>;
// };

/**
 * Enforces no extra keys on transition configuration object or string target.
 *
 * @template `T` - Transition config input.
 */
export type NoExtraKeysTransitionConfig<T extends _TransitionConfigMap | string> =
  T extends string
    ? T
    : T & {
        [key in Extract<keyof T, 'actions'>]: NoExtraKeysActionSoa<T[key]>;
      } & {
        [key in Extract<keyof T, 'guards'>]: NoExtraKeysGuardConfigSoA<T[key]>;
      } & {
        [key in Exclude<keyof T, keyof _TransitionConfigMap>]?: never;
      };

/**
 * Enforces no extra keys on array of transition configurations.
 *
 * @template | {@linkcode _TransitionConfigMap} `T` - Transition config array.
 */
export type NoExtraKeysTransitionConfigArray<
  T extends ReadonlyArray<_TransitionConfigMap | string>,
> = T extends readonly [
  infer S extends _TransitionConfigMap | string,
  ...infer R extends ReadonlyArray<_TransitionConfigMap | string>,
]
  ? readonly [NoExtraKeysTransitionConfig<S>, ...NoExtraKeysTransitionConfigArray<R>]
  : [];

/**
 * Enforces no extra keys across single or array of transition configurations.
 *
 * @template `T` - Input transition type.
 */
export type NoExtraKeysTransitionConfigSoA<T> = T extends
  | ArrayTransitionsF
  | ArrayTransitions
  ? NoExtraKeysTransitionConfigArray<T>
  : T extends
        | string
        | TransitionConfigMapA
        | TransitionConfigMapF
        | TransitionConfigMapFG
        | TransitionConfigMapG
    ? NoExtraKeysTransitionConfig<T>
    : _TransitionConfigMap | string;

/**
 * Extracts actions from a transition configuration.
 *
 * @template `T` - The transition configuration type.
 * @returns The actions extracted from the transition configuration.
 *
 * @see -- type {@linkcode FromActionConfig}, -- type {@linkcode ReduceArray}, -- type {@linkcode SingleOrArrayL}
 */
export type ExtractActionsFromTransition<
  T extends { actions: SingleOrArrayL<string> },
> =
  ReduceArray<T['actions']> extends infer R extends string
    ? FromActionConfig<R>
    : never;

/**
 * Extracts guards from a transition configuration.
 *
 * @template `T` - The transition configuration type.
 * @returns The guards extracted from the transition configuration.
 *
 * @see -- type {@linkcode GuardConfig}, {@linkcode FromGuard}, -- type {@linkcode ReduceArray}, -- type {@linkcode SingleOrArrayL}
 */
export type ExtractGuardKeysFromTransition<
  T extends { guards: SingleOrArrayL<GuardConfig> },
> =
  ReduceArray<T['guards']> extends infer R extends GuardConfig
    ? FromGuard<R>
    : never;

/**
 * Transition configuration requiring actions or string path.
 *
 * @template `Paths` - State path union.
 */
export type TransitionConfigA<Paths = string> = TransitionConfigMapA<Paths> | Paths;

/**
 * String target path or transition configuration map helper.
 *
 * @template `Paths` - State path union.
 */
export type _TransitionConfig<Paths = string> = Paths | _TransitionConfigMap<Paths>;

/**
 * Extracts event key path strings from a type {@linkcode DelayedTransitions} object.
 *
 * @template `T` - The delayed transitions configuration object.
 */
export type GetEventKeysFromDelayed<T> = {
  [key in keyof T & string]: T[key] extends AnyArray
    ? `${key}.[${IndexesOfArray<T[key]>}]`
    : key;
}[keyof T & string];

/**
 * Extracts action keys from a {@linkcode DelayedTransitions}.
 *
 * @template `T` - The delayed transitions type.
 *
 *
 * @see -- type {@linkcode ExtractActionsFromTransition}, -- type {@linkcode ReduceArray}, -- type {@linkcode SingleOrArrayL}, -- type {@linkcode ExtractGuardKeysFromTransition}
 */
export type ExtractActionKeysFromDelayed<T> = ExtractActionsFromTransition<
  Extract<ReduceArray<T[keyof T]>, { actions: SingleOrArrayL<string> }>
>;

/**
 * Extracts guards from a {@linkcode DelayedTransitions}.
 *
 * @template `T` - The delayed transitions type.
 *
 *
 * @see -- type {@linkcode ExtractGuardKeysFromTransition}, -- type {@linkcode ReduceArray}, -- type {@linkcode SingleOrArrayL}, -- type {@linkcode GuardConfig}, -- type {@linkcode ExtractActionsFromTransition}
 */
export type ExtractGuardKeysFromDelayed<T> = ExtractGuardKeysFromTransition<
  Extract<ReduceArray<T[keyof T]>, { guards: SingleOrArrayL<GuardConfig> }>
>;

/**
 * Represents a JSON configuration for delayed transitions.
 *
 * @template `Paths` - State path union. Defaults to `string`.
 *
 * @remarks This type is used to define transitions that occur after a delay.
 * It can include actions, guards, and actor configurations.
 *
 * @see -- type {@linkcode DelayedTransitions}, -- type {@linkcode AlwaysConfig}, -- type {@linkcode SingleOrArrayL}
 */
/**
 * Internal partial transitions configuration structure.
 *
 * @template `Paths` - State path union string type.
 */
export type _TransitionsConfig<Paths extends string = string> = Partial<
  Record<'on' | 'after', Record<string, SoA<_TransitionConfig<Paths>>>> & {
    actors: RecordS<ActorConfig<Paths>>;
    always: SoA<_TransitionConfig<Paths>>;
  }
>;

/**
 * Extracts event key strings from an emitter configuration.
 *
 * @template `T` - Emitter configuration type {@linkcode EmitterConfig}.
 */
export type GetEventKeysFromEmitter<T extends EmitterConfig> =
  GetEventKeysFromDelayed<Pick<T, 'next' | 'error'>>;

/**
 * Extracts event key strings from a child machine configuration.
 *
 * @template `T` - Child configuration type {@linkcode ChildConfig}.
 */
export type GetEventKeysFromMachineConfig<T extends ChildConfig> =
  `on.${GetEventKeysFromDelayed<T['on']>}`;

/**
 * Extracts event key strings from an actor configuration.
 *
 * @template `T` - Actor configuration type.
 */
export type GetEventKeysFromActor<T> = T extends EmitterConfig
  ? GetEventKeysFromEmitter<T>
  : T extends ChildConfig
    ? GetEventKeysFromMachineConfig<T>
    : never;

/**
 * Extracts all event key paths from a transitions configuration `T`.
 *
 * @template `T` - Transitions configuration type.
 */
export type GetEventKeysFromTransitions<T> =
  | ('on' extends keyof T
      ? `on.${GetEventKeysFromDelayed<NotUndefined<T['on']>>}`
      : never)
  | ('after' extends keyof T
      ? `after.${GetEventKeysFromDelayed<NotUndefined<T['after']>>}`
      : never)
  | ('always' extends keyof T
      ? T['always'] extends infer TA extends AnyArray
        ? `always.[${IndexesOfArray<TA>}]`
        : 'always'
      : never)
  | ('actors' extends keyof T
      ? `${NotUndefined<T['actors']> extends infer TP
          ? `actors.${{
              [key in keyof TP & string]: `${key}.${GetEventKeysFromActor<TP[key]>}`;
            }[keyof TP & string]}`
          : never}`
      : never);

/**
 * Extracts delay keys from a {@linkcode TransitionsConfig}.
 *
 * @template | {@linkcode TransitionsConfig} `T` - The transitions configuration type.
 *
 * @returns The keys of the delays extracted from the transitions configuration.
 *
 * @see -- type {@linkcode ReduceArray}, -- type {@linkcode NotUndefined}
 */
export type ExtractDelayKeysFromTransitions<T extends TransitionsConfig> =
  T['after'] extends undefined ? never : keyof T['after'];

/**
 * Internal helper to extract actions from transition map structure.
 *
 * @template `T` - Transition map type.
 */
type _ExtractActionsFromMap<T> = ExtractActionsFromTransition<
  Extract<ReduceArray<NotUndefined<T>>, { actions: SingleOrArrayL<string> }>
>;

/**
 * Extracts actions from the finally part of a completion configuration.
 *
 * @template `T` - Completion configuration type.
 */
type _ExtractActionsFromFinally<T> =
  ReduceArray<T> extends infer Tr
    ? Tr extends string
      ? FromActionConfig<Tr>
      : _ExtractActionsFromMap<Tr>
    : never;

/**
 * Extracts action keys from an emitter configuration.
 *
 * @template `T` - Emitter configuration type {@linkcode EmitterConfig}.
 */
export type ExtractActionKeysFromEmitter<T extends EmitterConfig> =
  | _ExtractActionsFromMap<T['next']>
  | _ExtractActionsFromMap<T['error']>
  | _ExtractActionsFromFinally<NotUndefined<T['complete']>>;

/**
 * Extracts action keys from a child configuration.
 *
 * @template `T` - Child configuration type {@linkcode ChildConfig}.
 */
export type ExtractActionKeysFromChild<T extends ChildConfig> =
  ExtractActionKeysFromDelayed<T['on']>;

/**
 * Extracts action keys from an actor configuration.
 *
 * @template `T` - Actor configuration type.
 */
export type ExtractActionKeysFromActor<T> = T extends EmitterConfig
  ? ExtractActionKeysFromEmitter<T>
  : T extends ChildConfig
    ? ExtractActionKeysFromChild<T>
    : never;

/**
 * Extracts actions keys from a {@linkcode TransitionsConfig}.
 *
 * @template | {@linkcode TransitionsConfig} `T` - The transitions configuration type.
 *
 * @returns The actions keys extracted from the transitions configuration.
 *
 * @see -- type {@linkcode ExtractActionsFromTransition}, -- type {@linkcode ExtractActionKeysFromDelayed}, -- type {@linkcode ReduceArray}, -- type {@linkcode SingleOrArrayL}, -- type {@linkcode NotUndefined}
 */
export type ExtractActionKeysFromTransitions<T extends TransitionsConfig> =
  | ExtractActionKeysFromDelayed<T['on']>
  | ExtractActionKeysFromDelayed<T['after']>
  | ExtractActionsFromTransition<
      Extract<ReduceArray<T['always']>, { actions: SingleOrArrayL<string> }>
    >
  | (NotUndefined<T['actors']> extends infer Ta
      ? {
          [K in keyof Ta]: ExtractActionKeysFromActor<Ta[K]>;
        }[keyof Ta]
      : never);

/**
 * Internal helper to extract guard keys from transition map structure.
 *
 * @template `T` - Transition map type.
 */
type _ExtractGuardKeysFromMap<T> = ExtractGuardKeysFromTransition<
  Extract<ReduceArray<NotUndefined<T>>, { guards: SingleOrArrayL<GuardConfig> }>
>;

/**
 * Extracts guard keys from an emitter configuration.
 *
 * @template `T` - Emitter configuration type {@linkcode EmitterConfig}.
 */
export type ExtractGuardKeysFromEmitter<T extends EmitterConfig> =
  | _ExtractGuardKeysFromMap<T['next']>
  | _ExtractGuardKeysFromMap<T['error']>
  | ExtractGuardKeysFromDelayed<T['complete']>;

/**
 * Extracts guard keys from a child machine configuration.
 *
 * @template `T` - Child configuration type {@linkcode ChildConfig}.
 */
export type ExtractGuardsKeysFromChild<T extends ChildConfig> =
  ExtractGuardKeysFromDelayed<T['on']>;

/**
 * Extracts guard keys from an actor configuration.
 *
 * @template `T` - Actor configuration type.
 */
export type ExtractGuardsKeysFromActor<T> = T extends EmitterConfig
  ? ExtractGuardKeysFromEmitter<T>
  : T extends ChildConfig
    ? ExtractGuardsKeysFromChild<T>
    : never;

/**
 * Extracts guard keys from a {@linkcode TransitionsConfig}.
 *
 * @template | {@linkcode TransitionsConfig} `T` - The transitions configuration type.
 *
 * @returns The guard keys extracted from the transitions configuration.
 *
 * @see -- type {@linkcode ExtractGuardKeysFromTransition}, -- type {@linkcode ExtractGuardKeysFromDelayed}, -- type {@linkcode ReduceArray}, -- type {@linkcode SingleOrArrayL}, -- type {@linkcode GuardConfig}, -- type {@linkcode NotUndefined}
 */
export type ExtractGuardKeysFromTransitions<T extends TransitionsConfig> =
  | ExtractGuardKeysFromDelayed<T['on']>
  | ExtractGuardKeysFromDelayed<T['after']>
  | ExtractGuardKeysFromTransition<
      Extract<ReduceArray<T['always']>, { guards: SingleOrArrayL<GuardConfig> }>
    >
  | (NotUndefined<T['actors']> extends infer Ta
      ? {
          [K in keyof Ta]: ExtractGuardsKeysFromActor<Ta[K]>;
        }[keyof Ta]
      : never);

/**
 * Extracts source keys from transitions configuration matching a specific filter shape.
 *
 * @template `T` - Transitions configuration type {@linkcode TransitionsConfig}.
 * @template `Filter` - Filter shape object type.
 * @template `A` - Actors record type.
 */
export type ExtractSrcKeyFromTransitions<
  T extends TransitionsConfig,
  Filter extends object = object,
  A extends NotUndefined<T['actors']> = NotUndefined<T['actors']>,
> = {
  [K in keyof A]: A[K] extends Filter ? K : never;
}[keyof A];

/**
 * Extracts emitter source keys from transitions configuration.
 *
 * @template `T` - Transitions configuration type {@linkcode TransitionsConfig}.
 */
export type ExtractEmitterSrcKeyFromTransitions<T extends TransitionsConfig> =
  ExtractSrcKeyFromTransitions<T, { next: any }>;

/**
 * Extracts child keys from actors configuration object `T`.
 *
 * @template `T` - Actors configuration record.
 */
export type ExtractChildKeysFromActors<
  T extends NotUndefined<TransitionsConfig['actors']>,
> = {
  [key in keyof T]: T[key] extends infer Tk extends ChildConfig
    ? {
        src: key;
        contexts: NotUndefined<Tk['contexts']>;
        on: keyof NotUndefined<Tk['on']>;
      }
    : never;
}[keyof T];

/**
 * Extracts child machine keys from transitions configuration `T`.
 *
 * @template `T` - Transitions configuration type {@linkcode TransitionsConfig}.
 */
export type ExtractChildKeysFromTransitions<T extends TransitionsConfig> =
  ExtractChildKeysFromActors<NotUndefined<T['actors']>>;

/**
 * Represents a transition in a state machine with full defined functions.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 *
 * @see -- type {@linkcode AsyncAction}, -- type {@linkcode AsyncPredicate}
 */
export type AsyncTransition<Ct extends Contract = Contract> = {
  readonly target?: string;
  readonly actions: AsyncAction<Ct>[];
  readonly guards: AsyncPredicate<Ct>[];
};

/**
 * Represents a synchronous transition configuration in a state machine.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type SyncTransition<Ct extends Contract = Contract> = {
  readonly target?: string;
  readonly actions: SyncAction<Ct>[];
  readonly guards: SyncPredicate<Ct>[];
};

/**
 * Represents all transitions inside a state config with full defined functions.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 *
 * @see -- type {@linkcode AsyncTransition}, -- type {@linkcode Identify}
 */
export type AsyncTransitions<Ct extends Contract = Contract> = {
  on: Identify<AsyncTransition<Ct>>[];
  always: AsyncTransition<Ct>[];
  after: Identify<AsyncTransition<Ct>>[];
  emitters: AsyncEmitter<Ct>[];
  children: CommonChild<Ct>[];
};

/**
 * Represents all synchronous transitions inside a state config with fully
 * defined functions.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type SyncTransitions<Ct extends Contract = Contract> = {
  on: Identify<SyncTransition<Ct>>[];
  always: SyncTransition<Ct>[];
  after: Identify<SyncTransition<Ct>>[];
  emitters: AsyncEmitter<Ct>[];
  children: CommonChild<Ct>[];
};
