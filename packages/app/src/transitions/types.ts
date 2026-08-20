import type {
  AsyncAction,
  FromActionConfig,
  NoExtraKeysWithDescriberSoa,
  SyncAction,
  WithDescriber,
} from '#actions';
import type { EventObject } from '#events';
import type {
  AsyncPredicate,
  FromGuard,
  GuardConfig,
  NoExtraKeysGuardConfigSoA,
  SyncPredicate,
} from '#guards';
import type {
  AnyArray,
  IndexesOfArray,
  NotUndefined,
  Require,
  SoA,
} from '@bemedev/app-utils-bemedev';
import type { Observable } from 'rxjs';
import type {
  ActorConfig,
  ChildConfig,
  EmitterConfig,
} from '../actors/types';

import type { CommonChild } from '#common/machine';
import type { AsyncEmitter } from '#emitters';
import type { PrimitiveObject } from '@bemedev/typings';
import type {
  Identify,
  RecordS,
  ReduceArray,
  SingleOrArrayL,
} from '~types';

// type TargetDef = {
//   readonly targets: string;
//   readonly initial?: string;
//   readonly states?: RecordS<TargetDef>;
// };

/**
 * Represents the simplest configuration map for a transition.
 * Used as Helper.
 *
 * @template Paths - Allowed state target paths. Defaults to `string`.
 */
export type _TransitionConfigMap<Paths = string> = {
  readonly target?: Paths;
  readonly actions?: SingleOrArrayL<WithDescriber>;
  readonly guards?: SingleOrArrayL<GuardConfig>;
  readonly description?: string;
};

/**
 * Enforces no extra keys on transition configuration object or string target.
 *
 * @template { _TransitionConfigMap | string} T - Transition config input.
 */
export type NoExtraKeysTransitionConfig<
  T extends _TransitionConfigMap | string,
> = T extends string
  ? T
  : T & {
      [key in Extract<keyof T, 'actions'>]: NoExtraKeysWithDescriberSoa<
        T[key]
      >;
    } & {
      [key in Extract<keyof T, 'guards'>]: NoExtraKeysGuardConfigSoA<
        T[key]
      >;
    } & {
      [key in Exclude<keyof T, keyof _TransitionConfigMap>]?: never;
    };

/**
 * Enforces no extra keys on array of transition configurations.
 *
 * @template {ReadonlyArray<_TransitionConfigMap | string>} T - Transition config array.
 */
export type NoExtraKeysTransitionConfigArray<
  T extends ReadonlyArray<_TransitionConfigMap | string>,
> = T extends readonly [
  infer S extends _TransitionConfigMap | string,
  ...infer R extends ReadonlyArray<_TransitionConfigMap | string>,
]
  ? readonly [
      NoExtraKeysTransitionConfig<S>,
      ...NoExtraKeysTransitionConfigArray<R>,
    ]
  : [];

/**
 * Enforces no extra keys across single or array of transition configurations.
 *
 * @template T - Input transition type.
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
 * @template T - The transition configuration type.
 * @returns The actions extracted from the transition configuration.
 *
 * @see {@linkcode WithDescriber}, {@linkcode FromActionConfig}, {@linkcode ReduceArray}, {@linkcode SingleOrArrayL}
 */
export type ExtractActionsFromTransition<
  T extends { actions: SingleOrArrayL<WithDescriber> },
> =
  ReduceArray<T['actions']> extends infer R extends WithDescriber
    ? FromActionConfig<R>
    : never;

/**
 * Extracts guards from a transition configuration.
 *
 * @template T - The transition configuration type.
 * @returns The guards extracted from the transition configuration.
 *
 * @see {@linkcode GuardConfig}, {@linkcode FromGuard}, {@linkcode ReduceArray}, {@linkcode SingleOrArrayL}
 */
export type ExtractGuardKeysFromTransition<
  T extends { guards: SingleOrArrayL<GuardConfig> },
> =
  ReduceArray<T['guards']> extends infer R extends GuardConfig
    ? FromGuard<R>
    : never;

/**
 * A type {@linkcode _TransitionConfigMap} that requires actions.
 *
 * @template Paths - State path union.
 */
export type TransitionConfigMapA<Paths = string> = Require<
  _TransitionConfigMap<Paths>,
  'actions'
>;

/**
 * Transition configuration requiring actions or string path.
 *
 * @template Paths - State path union.
 */
export type TransitionConfigA<Paths = string> =
  | TransitionConfigMapA<Paths>
  | Paths;

/**
 * A type {@linkcode _TransitionConfigMap} that requires target.
 *
 * @template Paths - State path union.
 */
export type TransitionConfigMapF<Paths = string> = Require<
  _TransitionConfigMap<Paths>,
  'target'
>;

/**
 * Transition configuration requiring target or string path.
 *
 * @template Paths - State path union.
 */
export type TransitionConfigF<Paths = string> =
  | TransitionConfigMapF<Paths>
  | Paths;

/**
 * Union of target-required and action-required transition maps.
 *
 * @template Paths - State path union.
 */
export type TransitionConfigMap<Paths = string> =
  | TransitionConfigMapF<Paths>
  | TransitionConfigMapA<Paths>;

/**
 * Transition configuration map requiring guards.
 *
 * @template Paths - State path union.
 */
export type TransitionConfigMapG<Paths = string> = Require<
  TransitionConfigMap<Paths>,
  'guards'
>;

/**
 * Transition configuration map requiring both target and guards.
 *
 * @template Paths - State path union.
 */
export type TransitionConfigMapFG<Paths = string> = Require<
  TransitionConfigMapF<Paths>,
  'guards'
>;

/**
 * A better version type {@linkcode _TransitionConfigMap}.
 *
 * This type is used to ensure that the transition configuration
 * has either a target or actions defined, but not both.
 *
 * @see {@linkcode TransitionConfigMapF}, {@linkcode TransitionConfigMapA}
 */
export type TransitionConfig<Paths = string> =
  | Paths
  | TransitionConfigMap<Paths>;

/**
 * String target path or transition configuration map helper.
 *
 * @template Paths - State path union.
 */
export type _TransitionConfig<Paths = string> =
  | Paths
  | _TransitionConfigMap<Paths>;

/**
 * An array of transitions that can be used in a state machine.
 *
 * @template Paths - State path union.
 *
 * @see {@linkcode TransitionConfigMapF}, {@linkcode TransitionConfigMapA}, {@linkcode TransitionConfig}, {@linkcode Require}
 */
export type ArrayTransitions<Paths = string> = readonly [
  ...TransitionConfigMapG<Paths>[],
  TransitionConfig<Paths>,
];

/**
 * Array of target-required transition configurations ending with target transition.
 *
 * @template Paths - State path union.
 */
export type ArrayTransitionsF<Paths = string> = readonly [
  ...TransitionConfigMapFG<Paths>[],
  TransitionConfigF<Paths>,
];

/**
 * A type that can be either an array of transitions or a single transition configuration.
 *
 * @see {@linkcode ArrayTransitions}, {@linkcode TransitionConfig}
 */
export type SingleOrArrayT<Paths = string> =
  | ArrayTransitions<Paths>
  | TransitionConfig<Paths>;

/**
 * Representation of an always transition config.
 *
 * @template Paths - State path union.
 *
 * @see {@linkcode ArrayTransitions}, {@linkcode TransitionConfigF}, {@linkcode Require}
 */
export type AlwaysConfig<Paths = string> =
  | ArrayTransitionsF<Paths>
  | TransitionConfigF<Paths>;

/**
 * A type used to represent a record of transitions.
 *
 * @remarks For the purpose of delay transition config.
 */
export type DelayedTransitions<Paths = string> = RecordS<
  SingleOrArrayT<Paths>
>;

/**
 * Extracts event key path strings from a type {@linkcode DelayedTransitions} object.
 *
 * @template T - The delayed transitions configuration object.
 */
export type GetEventKeysFromDelayed<T> = {
  [key in keyof T & string]: T[key] extends AnyArray
    ? `${key}.[${IndexesOfArray<T[key]>}]`
    : key;
}[keyof T & string];

/**
 * Extracts action keys from a {@linkcode DelayedTransitions}.
 *
 * @template T - The delayed transitions type.
 *
 * @see {@linkcode ExtractActionsFromTransition} for extracting actions from a transition configuration.
 * @see {@linkcode ReduceArray} for reducing arrays to their elements.
 * @see {@linkcode SingleOrArrayL} for handling single or array
 * @see {@linkcode WithDescriber} for the structure of action configurations.
 *
 * @see {@linkcode ExtractGuardKeysFromTransition} for extracting guards from a transition configuration.
 */
export type ExtractActionKeysFromDelayed<T> = ExtractActionsFromTransition<
  Extract<
    ReduceArray<T[keyof T]>,
    { actions: SingleOrArrayL<WithDescriber> }
  >
>;

/**
 * Extracts guards from a {@linkcode DelayedTransitions}.
 *
 * @template T - The delayed transitions type.
 *
 * @see {@linkcode ExtractGuardKeysFromTransition} for extracting guards from a transition configuration.
 * @see {@linkcode ReduceArray} for reducing arrays to their elements.
 * @see {@linkcode SingleOrArrayL} for handling single or array
 * @see {@linkcode GuardConfig} for the structure of guard configurations.
 *
 * @see {@linkcode ExtractActionsFromTransition} for extracting actions from a transition configuration.
 */
export type ExtractGuardKeysFromDelayed<T> =
  ExtractGuardKeysFromTransition<
    Extract<
      ReduceArray<T[keyof T]>,
      { guards: SingleOrArrayL<GuardConfig> }
    >
  >;

/**
 * Represents a JSON configuration for delayed transitions.
 *
 * @remarks This type is used to define transitions that occur after a delay.
 * It can include actions, guards, and promises.
 *
 * @see {@linkcode DelayedTransitions} for the structure of delayed transitions.
 * @see {@linkcode AlwaysConfig} for always transitions configuration.
 * @see {@linkcode PromiseeConfig} for promise configurations.
 * @see {@linkcode SingleOrArrayL} for handling single or array
 */

export type TransitionsConfig<Paths extends string = string> = {
  readonly on?: DelayedTransitions<Paths>;
  readonly always?: AlwaysConfig<Paths>;
  readonly after?: DelayedTransitions<Paths>;
  readonly actors?: RecordS<ActorConfig<Paths>>;
};

/**
 * Internal partial transitions configuration structure.
 *
 * @template Paths - State path union string type.
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
 * @template T - Emitter configuration type {@linkcode EmitterConfig}.
 */
export type GetEventKeysFromEmitter<T extends EmitterConfig> =
  GetEventKeysFromDelayed<Pick<T, 'next' | 'error'>>;

/**
 * Extracts event key strings from a child machine configuration.
 *
 * @template T - Child configuration type {@linkcode ChildConfig}.
 */
export type GetEventKeysFromMachineConfig<T extends ChildConfig> =
  `on.${GetEventKeysFromDelayed<T['on']>}`;

/**
 * Extracts event key strings from an actor configuration.
 *
 * @template T - Actor configuration type.
 */
export type GetEventKeysFromActor<T> = T extends EmitterConfig
  ? GetEventKeysFromEmitter<T>
  : T extends ChildConfig
    ? GetEventKeysFromMachineConfig<T>
    : never;

/**
 * Extracts all event key paths from a transitions configuration `T`.
 *
 * @template T - Transitions configuration type.
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
              [
                key in keyof TP & string
              ]: `${key}.${GetEventKeysFromActor<TP[key]>}`;
            }[keyof TP & string]}`
          : never}`
      : never);

/**
 * Extracts delay keys from a {@linkcode TransitionsConfig}.
 *
 * @template : {@linkcode TransitionsConfig} [T] - The transitions configuration type.
 * @returns The keys of the delays extracted from the transitions configuration.
 *
 * @see {@linkcode ExtractMaxFromPromisee} for extracting the maximum delay from promises.
 * @see {@linkcode ReduceArray} for reducing arrays to their elements.
 * @see {@linkcode Extract} for extracting specific types from a union.
 * @see {@linkcode NotUndefined} for ensuring the type is not undefined.
 */
export type ExtractDelayKeysFromTransitions<T extends TransitionsConfig> =
  T['after'] extends undefined ? never : keyof T['after'];

/**
 * Internal helper to extract actions from transition map structure.
 *
 * @template T - Transition map type.
 */
type _ExtractActionsFromMap<T> = ExtractActionsFromTransition<
  Extract<
    ReduceArray<NotUndefined<T>>,
    { actions: SingleOrArrayL<WithDescriber> }
  >
>;

/**
 * Extracts actions from the finally part of a completion configuration.
 */
type _ExtractActionsFromFinally<T> =
  ReduceArray<T> extends infer Tr
    ? Tr extends WithDescriber
      ? FromActionConfig<Tr>
      : _ExtractActionsFromMap<Tr>
    : never;

/**
 * Extracts action keys from an emitter configuration.
 *
 * @template T - Emitter configuration type {@linkcode EmitterConfig}.
 */
export type ExtractActionKeysFromEmitter<T extends EmitterConfig> =
  | _ExtractActionsFromMap<T['next']>
  | _ExtractActionsFromMap<T['error']>
  | _ExtractActionsFromFinally<NotUndefined<T['complete']>>;

/**
 * Extracts action keys from a child configuration.
 *
 * @template T - Child configuration type {@linkcode ChildConfig}.
 */
export type ExtractActionKeysFromChild<T extends ChildConfig> =
  ExtractActionKeysFromDelayed<T['on']>;

/**
 * Extracts action keys from an actor configuration.
 *
 * @template T - Actor configuration type.
 */
export type ExtractActionKeysFromActor<T> = T extends EmitterConfig
  ? ExtractActionKeysFromEmitter<T>
  : T extends ChildConfig
    ? ExtractActionKeysFromChild<T>
    : never;

/**
 * Extracts actions keys from a {@linkcode TransitionsConfig}.
 *
 * @template : {@linkcode TransitionsConfig} [T] - The transitions configuration type.
 * @returns The actions keys extracted from the transitions configuration.
 *
 * @see {@linkcode ExtractActionsFromTransition} for extracting actions from a transition configuration.
 * @see {@linkcode ExtractActionsFromDelayed} for extracting actions from delayed transitions.
 * @see {@linkcode ExtractActionKeysFromPromisee} for extracting actions from promises.
 * @see {@linkcode ReduceArray} for reducing arrays to their elements.
 * @see {@linkcode SingleOrArrayL} for handling single or array
 * @see {@linkcode WithDescriber} for the structure of action configurations.
 * @see {@linkcode NotUndefined} for ensuring the type is not undefined.
 * @see {@linkcode Extract}
 */
export type ExtractActionKeysFromTransitions<
  T extends TransitionsConfig,
> =
  | ExtractActionKeysFromDelayed<T['on']>
  | ExtractActionKeysFromDelayed<T['after']>
  | ExtractActionsFromTransition<
      Extract<
        ReduceArray<T['always']>,
        { actions: SingleOrArrayL<WithDescriber> }
      >
    >
  | (NotUndefined<T['actors']> extends infer Ta
      ? {
          [K in keyof Ta]: ExtractActionKeysFromActor<Ta[K]>;
        }[keyof Ta]
      : never);

/**
 * Internal helper to extract guard keys from transition map structure.
 *
 * @template T - Transition map type.
 */
type _ExtractGuardKeysFromMap<T> = ExtractGuardKeysFromTransition<
  Extract<
    ReduceArray<NotUndefined<T>>,
    { guards: SingleOrArrayL<GuardConfig> }
  >
>;

/**
 * Extracts guard keys from an emitter configuration.
 *
 * @template T - Emitter configuration type {@linkcode EmitterConfig}.
 */
export type ExtractGuardKeysFromEmitter<T extends EmitterConfig> =
  | _ExtractGuardKeysFromMap<T['next']>
  | _ExtractGuardKeysFromMap<T['error']>
  | ExtractGuardKeysFromDelayed<T['complete']>;

/**
 * Extracts guard keys from a child machine configuration.
 *
 * @template T - Child configuration type {@linkcode ChildConfig}.
 */
export type ExtractGuardsKeysFromChild<T extends ChildConfig> =
  ExtractGuardKeysFromDelayed<T['on']>;

/**
 * Extracts guard keys from an actor configuration.
 *
 * @template T - Actor configuration type.
 */
export type ExtractGuardsKeysFromActor<T> = T extends EmitterConfig
  ? ExtractGuardKeysFromEmitter<T>
  : T extends ChildConfig
    ? ExtractGuardsKeysFromChild<T>
    : never;

/**
 * Extracts guard keys from a {@linkcode TransitionsConfig}.
 *
 * @template : {@linkcode TransitionsConfig} [T] - The transitions configuration type.
 * @returns The guard keys extracted from the transitions configuration.
 *
 * @see {@linkcode ExtractGuardKeysFromTransition} for extracting guards from a transition configuration.
 * @see {@linkcode ExtractGuardKeysFromDelayed} for extracting guards from delayed transitions.
 * @see {@linkcode ExtractGuardKeysFromPromisee} for extracting guards from promises.
 * @see {@linkcode ReduceArray} for reducing arrays to their elements.
 * @see {@linkcode SingleOrArrayL} for handling single or array
 * @see {@linkcode GuardConfig} for the structure of guard configurations.
 * @see {@linkcode NotUndefined} for ensuring the type is not undefined.
 * @see {@linkcode Extract}
 */
export type ExtractGuardKeysFromTransitions<T extends TransitionsConfig> =
  | ExtractGuardKeysFromDelayed<T['on']>
  | ExtractGuardKeysFromDelayed<T['after']>
  | ExtractGuardKeysFromTransition<
      Extract<
        ReduceArray<T['always']>,
        { guards: SingleOrArrayL<GuardConfig> }
      >
    >
  | (NotUndefined<T['actors']> extends infer Ta
      ? {
          [K in keyof Ta]: ExtractGuardsKeysFromActor<Ta[K]>;
        }[keyof Ta]
      : never);

/**
 * Extracts source keys from transitions configuration matching a specific filter shape.
 *
 * @template T - Transitions configuration type {@linkcode TransitionsConfig}.
 * @template Filter - Filter shape object type.
 * @template A - Actors record type.
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
 * @template T - Transitions configuration type {@linkcode TransitionsConfig}.
 */
export type ExtractEmitterSrcKeyFromTransitions<
  T extends TransitionsConfig,
> = ExtractSrcKeyFromTransitions<T, { next: any }>;

/**
 * Extracts child keys from actors configuration object `T`.
 *
 * @template T - Actors configuration record.
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
 * @template T - Transitions configuration type {@linkcode TransitionsConfig}.
 */
export type ExtractChildKeysFromTransitions<T extends TransitionsConfig> =
  ExtractChildKeysFromActors<NotUndefined<T['actors']>>;

/**
 * Represents a transition in a state machine with full defined functions.
 *
 * @template : {@linkcode EventsMap} [E] - The events map used in the transition.
 * @template : {@linkcode PromiseeMap} [P] - The promisees map used in the transition.
 * @template : [Pc] - The private context type for the transition.
 * @template : {@linkcode types} [Tc] - The context for the transition.
 *
 * @see {@linkcode AsyncAction} for the structure of actions in the transition.
 * @see {@linkcode AsyncPredicate} for the structure of guards in the transition.
 */
export type AsyncTransition<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  readonly target?: string;
  readonly actions: AsyncAction<E, Pc, Tc, T>[];
  readonly guards: AsyncPredicate<E, Pc, Tc, T>[];
  readonly description?: string;
};

/**
 * Represents a synchronous transition configuration in a state machine.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncTransition<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  readonly target?: string;
  readonly actions: SyncAction<E, Pc, Tc, T>[];
  readonly guards: SyncPredicate<E, Pc, Tc, T>[];
  readonly description?: string;
};

/**
 * Structure representing an async emitter configuration.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @template R - Value emitted by Observable `src`.
 */
export type AsyncEmiter4<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
> = {
  src: Observable<R>;
  description?: string;
  then: AsyncTransition<E, Pc, Tc, T>[];
  catch: AsyncTransition<E, Pc, Tc, T>[];
  finally: AsyncTransition<E, Pc, Tc, T>[];
};

/**
 * Structure representing a synchronous emitter configuration.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 * @template R - Value emitted by Observable `src`.
 */
export type SyncEmiter4<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
> = {
  src: Observable<R>;
  description?: string;
  then: SyncTransition<E, Pc, Tc, T>[];
  catch: SyncTransition<E, Pc, Tc, T>[];
  finally: SyncTransition<E, Pc, Tc, T>[];
};

/**
 * Represents all transitions inside a state config with full defined functions.
 *
 * @template : {@linkcode EventsMap} [E] - The events map used in the transitions.
 * @template : [Pc] - The private context type for the transitions.
 * @template : {@linkcode PrimitiveObject} [Tc] - The context for the transitions
 *
 * @see {@linkcode AsyncTransition} for the structure of a single transition.
 * @see {@linkcode Identify} for identifying properties in the transitions.
 */
export type AsyncTransitions<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  on: Identify<AsyncTransition<E, Pc, Tc, T>>[];
  always: AsyncTransition<E, Pc, Tc, T>[];
  after: Identify<AsyncTransition<E, Pc, Tc, T>>[];
  emitters: AsyncEmitter<E, Pc, Tc, T>[];
  children: CommonChild<E, Pc, Tc, T>[];
};

/**
 * Represents all synchronous transitions inside a state config with fully defined functions.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template Tc - Type {@linkcode PrimitiveObject} context.
 * @template T - State tag string type.
 */
export type SyncTransitions<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  on: Identify<SyncTransition<E, Pc, Tc, T>>[];
  always: SyncTransition<E, Pc, Tc, T>[];
  after: Identify<SyncTransition<E, Pc, Tc, T>>[];
  emitters: AsyncEmitter<E, Pc, Tc, T>[];
  children: CommonChild<E, Pc, Tc, T>[];
};
