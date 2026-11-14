import type { AsyncAction2, FromActionConfig } from '#actions';
import type { ConfigFrom } from '#common/interpreter';
import type {
  ChildEvents,
  CommonConfig,
  NoExtraKeysTargetDef,
} from '#common/machine';
import type { AsyncDelayFunction2 } from '#delays';
import type { AsyncEmitterFunction, EmitterDef, EmitterReturn } from '#emitters';
import type { ActorsConfigMap, EventObject } from '#events';
import type { AsyncPredicateS } from '#guards';
import type {
  ActivityConfig,
  ExtractActionsFromActivity,
  ExtractDelaysFromActivity,
  ExtractGuardsFromActivity,
  ExtractTagsFromFlat,
  FlatMapN,
  TargetDef,
} from '#states';
import type {
  AsyncTransition,
  ExtractActionKeysFromTransitions,
  ExtractChildKeysFromTransitions,
  ExtractDelayKeysFromTransitions,
  ExtractEmitterSrcKeyFromTransitions,
  ExtractGuardKeysFromTransitions,
  TransitionsConfig,
} from '#transitions';
import type { Equals, Keys } from '@bemedev/app-options/bemedev';
import { Identitfy } from '@bemedev/app-options/bemedev';
import type { Recompose } from '@bemedev/decompose';
import type { PrimitiveObject } from '@bemedev/typings';
import type { KeyU, ReduceArray } from '~types';
import { RecordS } from '../types/primitives';

import type { AsyncChildFunction2 } from '@bemedev/app-options';

export type {
  AsyncChildFunction2,
  AsyncMachineOptions2,
  AsyncSimpleMachineOptions,
} from '@bemedev/app-options';

/**
 * Type representing the main JSON node config of a state machine.
 *
 * @see -- type {@linkcode CommonConfig}
 */
export type AsyncConfig<
  Paths extends NoExtraKeysTargetDef<TargetDef> = NoExtraKeysTargetDef<TargetDef>,
> = CommonConfig<Paths>;

/**
 * Extracts state tags union from an async machine configuration `T`.
 *
 * @template `T` - Async configuration type {@linkcode AsyncConfig}.
 */
export type ExtractTagsFromConfig<T extends AsyncConfig> = ExtractTagsFromFlat<
  FlatMapN<T>
>;

/**
 * Type representing all action keys from a flat map of nodes.
 *
 * @template | {@linkcode FlatMapN} `Flat` - Flat map of nodes.
 *
 * @see -- type {@linkcode TransitionsConfig}, -- type {@linkcode ActivityConfig}, -- type {@linkcode FromActionConfig}, -- type {@linkcode ExtractActionKeysFromTransitions}, -- type {@linkcode ExtractActionsFromActivity}, -- type {@linkcode ReduceArray}
 */
export type _GetKeyActionsFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]:
    | ExtractActionKeysFromTransitions<Extract<Flat[key], TransitionsConfig>>
    | ExtractActionsFromActivity<Extract<Flat[key], { activities: ActivityConfig }>>
    | FromActionConfig<ReduceArray<Extract<Flat[key], { entry: any }>['entry']>>
    | FromActionConfig<
        ReduceArray<Extract<Flat[key], { exit: any }>['exit']>
      > extends infer V
    ? unknown extends V
      ? never
      : V
    : never;
}[keyof Flat];

/**
 * Type representing all guard keys from a flat map of nodes.
 *
 * @template | {@linkcode FlatMapN} `Flat` - Flat map of nodes.
 *
 * @see -- type {@linkcode TransitionsConfig}, -- type {@linkcode ActivityConfig}, -- type {@linkcode ExtractGuardKeysFromTransitions}, -- type {@linkcode ExtractGuardsFromActivity}
 */
type _GetKeyGuardsFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]:
    | ExtractGuardKeysFromTransitions<Extract<Flat[key], TransitionsConfig>>
    | ExtractGuardsFromActivity<
        Extract<Flat[key], { activities: ActivityConfig }>
      > extends infer V
    ? unknown extends V
      ? never
      : V
    : never;
}[keyof Flat];

/**
 * Internal helper type to extract emitter source keys from a flat map of nodes.
 *
 * @template | {@linkcode FlatMapN} `Flat` - Flat map of nodes.
 */
type _GetEmitterSrcKeyFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]: ExtractEmitterSrcKeyFromTransitions<
    Extract<Flat[key], TransitionsConfig>
  > extends infer V
    ? unknown extends V
      ? never
      : V
    : never;
}[keyof Flat];

/**
 * Internal helper type to extract child keys from a flat map of nodes.
 *
 * @template | {@linkcode FlatMapN} `Flat` - Flat map of nodes.
 */
type _GetChildKeysFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]: ExtractChildKeysFromTransitions<
    Extract<Flat[key], TransitionsConfig>
  >;
}[keyof Flat];

/**
 * Type representing all event types from a flat map of nodes.
 *
 * @template | {@linkcode FlatMapN} `Flat` - Type of the flat map of nodes.
 */
type _GetEventKeysFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]: Flat[key] extends { on: infer V } ? keyof V : never;
}[keyof Flat];

/**
 * Type representing all delay keys from a flat map of nodes.
 *
 * @template | {@linkcode FlatMapN} `Flat` - Flat map of nodes.
 *
 * @see -- type {@linkcode TransitionsConfig}, -- type {@linkcode ActivityConfig}, -- type {@linkcode ExtractDelayKeysFromTransitions}, -- type {@linkcode ExtractDelaysFromActivity}
 */
type _GetDelayKeysFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]:
    | ExtractDelayKeysFromTransitions<Extract<Flat[key], TransitionsConfig>>
    | ExtractDelaysFromActivity<Flat[key]> extends infer V
    ? unknown extends V
      ? never
      : V
    : never;
}[keyof Flat];

/**
 * Provide a record of all actions by key and {@linkcode Action} function.
 *
 * @template | {@linkcode FlatMapN} `Flat` - Flat map of nodes.
 * @template | {@linkcode EventsMap} `E` - Events map type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type.
 * @template `T` - State tag string type.
 *
 * @see -- type {@linkcode _GetKeyActionsFromFlat}
 */
export type GetActionsFromFlat<
  Flat extends FlatMapN,
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Record<_GetKeyActionsFromFlat<Flat>, AsyncAction2<E, Pc, Tc, T>>;

/**
 * Provide a record of all guards by key and {@linkcode AsyncPredicateS} function.
 *
 * @template | {@linkcode FlatMapN} `Flat` - Flat map of nodes.
 * @template | {@linkcode EventsMap} `E` - Events map type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type.
 * @template `T` - State tag string type.
 *
 * @see -- type {@linkcode _GetKeyGuardsFromFlat}
 */
export type GetGuardsFromFlat<
  Flat extends FlatMapN,
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Record<_GetKeyGuardsFromFlat<Flat>, AsyncPredicateS<E, Pc, Tc, T>>;

/**
 * Provide a record of all delays by key and {@linkcode DelayFunction} function.
 *
 * @template | {@linkcode FlatMapN} `Flat` - Flat map of nodes.
 * @template | {@linkcode EventsMap} `E` - Events map type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type.
 * @template `T` - State tag string type.
 *
 * @see -- type {@linkcode _GetDelayKeysFromFlat}
 */
export type GetDelaysFromFlat<
  Flat extends FlatMapN,
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Record<_GetDelayKeysFromFlat<Flat>, AsyncDelayFunction2<E, Pc, Tc, T>>;

/**
 * Provide a record of all events by key and {@linkcode PrimitiveObject} payload.
 *
 * @template | {@linkcode FlatMapN} `Flat` - Flat map of nodes.
 *
 * @see -- type {@linkcode _GetEventKeysFromFlat}
 */
export type GetEventsFromFlat<Flat extends FlatMapN> = Record<
  _GetEventKeysFromFlat<Flat>,
  PrimitiveObject
>;

/**
 * Get all events from a machine config.
 *
 * @template | {@linkcode AsyncConfig} `C` - Machine configuration type.
 *
 * @see -- type {@linkcode FlatMapN}, -- type {@linkcode GetEventsFromFlat}, -- type {@linkcode ConfigFrom}
 */
export type GetEventsFromConfig<C extends AsyncConfig> = GetEventsFromFlat<
  FlatMapN<C>
>;

/**
 * Get all events from a machine.
 *
 * @template `T` - Machine type exposing a `config` member.
 *
 * @see -- type {@linkcode ConfigFrom}, -- type {@linkcode GetEventsFromConfig}
 */
export type GetEventsFromMachine<T extends KeyU<'config'>> = GetEventsFromConfig<
  Extract<ConfigFrom<T>, AsyncConfig>
>;

/**
 * Record type mapping emitter source keys to emitter definition.
 *
 * @template `Flat` - Flat map of nodes.
 */
export type GetEmittersSrcKeyFromFlat<Flat extends FlatMapN> = Record<
  _GetEmitterSrcKeyFromFlat<Flat>,
  EmitterDef
>;

/**
 * Record type mapping emitter source keys to async emitter function signatures.
 *
 * @template `Flat` - Flat map of nodes.
 * @template `E` - Event object type.
 * @template `A` - Actors config map type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type.
 * @template `T` - State tag string type.
 */
export type GetEmittersSrcFromFlat<
  Flat extends FlatMapN,
  E extends EventObject = EventObject,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  [key in _GetEmitterSrcKeyFromFlat<Flat>]: AsyncEmitterFunction<
    E,
    Pc,
    Tc,
    T,
    EmitterReturn<key, A>
  >;
};

/**
 * Get all emitters from a machine config.
 *
 * @template | {@linkcode AsyncConfig} `C` - Machine configuration type.
 *
 * @see -- type {@linkcode FlatMapN}, -- type {@linkcode GetEmittersSrcKeyFromFlat}
 */
export type GetEmittersSrcFromConfig<C extends AsyncConfig> =
  GetEmittersSrcKeyFromFlat<FlatMapN<C>>;

/**
 * Get all emitters from a machine.
 *
 * @template `T` - Machine type exposing a `config` member.
 *
 * @see -- type {@linkcode ConfigFrom}, -- type {@linkcode GetEmittersSrcFromConfig}
 */
export type GetEmittersSrcFromMachine<T extends KeyU<'config'>> =
  GetEmittersSrcFromConfig<Extract<ConfigFrom<T>, AsyncConfig>>;

/**
 * Extracts child machine source keys mapping to their events record.
 *
 * @template `Flat` - Flat map of nodes.
 *
 * @template | {@linkcode _GetChildKeysFromFlat} `G` - Child actor keys extracted from `Flat`.
 */
export type GetChildrenSrcKeysFromFlat<
  Flat extends FlatMapN,
  G extends _GetChildKeysFromFlat<Flat> = _GetChildKeysFromFlat<Flat>,
> = {
  [key in G['src']]: Record<Extract<G, { src: key }>['on'], any>;
};

/**
 * Detailed child machine source keys extraction mapping contexts and events.
 *
 * @template `Flat` - Flat map of nodes.
 *
 * @template | {@linkcode _GetChildKeysFromFlat} `G` - Child actor keys extracted from `Flat`.
 */
export type GetChildrenSrcKeysFromFlat2<
  Flat extends FlatMapN,
  G extends _GetChildKeysFromFlat<Flat> = _GetChildKeysFromFlat<Flat>,
> = {
  [key in G['src']]: Extract<G, { src: key }> extends infer E extends G
    ? {
        on: Record<E['on'], any>;
        context: keyof E['contexts'];
        parentPcontext: E['contexts'][keyof E['contexts']];
      }
    : never;
};

/**
 * Record type mapping child keys to async child machine functions.
 *
 * @template `Flat` - Flat map of nodes.
 * @template `E` - Event object type.
 * @template `A` - Actors config map type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type.
 * @template `T` - State tag string type.
 *
 * @template | {@linkcode _GetChildKeysFromFlat} `G` - Child actor keys extracted from `Flat`.
 */
export type GetChildrenSrcFromFlat<
  Flat extends FlatMapN,
  E extends EventObject = EventObject,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  G extends _GetChildKeysFromFlat<Flat> = _GetChildKeysFromFlat<Flat>,
> = {
  [key in G['src']]: AsyncChildFunction2<
    E,
    Pc,
    Tc,
    T,
    {
      eventsMap: ChildEvents<key & string, A>;
      context: Recomposer<keyof Extract<G, { src: key }>['contexts']>;
    }
  >;
};

/**
 * Get all child machines from a machine config.
 *
 * @template | {@linkcode AsyncConfig} `C` - Machine configuration type.
 *
 * @see -- type {@linkcode FlatMapN}, -- type {@linkcode GetChildrenSrcKeysFromFlat}
 */
export type GetChildrenSrcFromConfig<C extends AsyncConfig> =
  GetChildrenSrcKeysFromFlat<FlatMapN<C>>;

/**
 * Get all child machines from a machine.
 *
 * @template `T` - Machine type exposing a `config` member.
 *
 * @see -- type {@linkcode ConfigFrom}, -- type {@linkcode GetChildrenSrcFromConfig}
 */
export type GetChildrenSrcFromMachine<T extends KeyU<'config'>> =
  GetChildrenSrcFromConfig<Extract<ConfigFrom<T>, AsyncConfig>>;

/**
 * Structure containing all children and emitters from a flat map.
 *
 * @template `Flat` - Flat map of nodes.
 * @template `E` - Event object type.
 * @template `A` - Actors config map type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type.
 * @template `T` - State tag string type.
 */
export type GetActorsFromFlat<
  Flat extends FlatMapN,
  E extends EventObject = EventObject,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  children: Partial<GetChildrenSrcFromFlat<Flat, E, A, Pc, Tc, T>>;
  emitters: Partial<GetEmittersSrcFromFlat<Flat, E, A, Pc, Tc, T>>;
};

/**
 * Structure containing all actors from a machine configuration `C`.
 *
 * @template `C` - Machine configuration type {@linkcode AsyncConfig}.
 * @template `E` - Event object type.
 * @template `A` - Actors config map type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type.
 * @template `T` - State tag string type.
 */
export type GetActorsFromConfig<
  C extends AsyncConfig,
  E extends EventObject = EventObject,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = GetActorsFromFlat<FlatMapN<C>, E, A, Pc, Tc, T>;

/**
 * Structure containing all actors from a machine type `M`.
 *
 * @template `M` - Machine object type.
 * @template `E` - Event object type.
 * @template `A` - Actors config map type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type.
 * @template `T` - State tag string type.
 */
export type GetActorsFromMachine<
  M extends KeyU<'config'>,
  E extends EventObject = EventObject,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = GetActorsFromConfig<Extract<ConfigFrom<M>, AsyncConfig>, E, A, Pc, Tc, T>;

/**
 * Actor source keys structure extracted from a flat map.
 *
 * @template `Flat` - Flat map of nodes.
 */
export type GetActorsSrcKeysFromFlat<Flat extends FlatMapN> = {
  children: GetChildrenSrcKeysFromFlat<Flat>;
  emitters: GetEmittersSrcKeyFromFlat<Flat>;
};

/**
 * Recomposes property key path `P` into an object type.
 *
 * @template `P` - Property path string keys.
 */
export type Recomposer<P extends Keys> =
  Equals<P, '.'> extends true
    ? any
    : Equals<P, ''> extends true
      ? any
      : Recompose<Record<Exclude<P, '' | '.'>, unknown>>;

/**
 * Detailed actor source keys structure extracted from a flat map.
 *
 * @template `Flat` - Flat map of nodes.
 *
 * @template | {@linkcode _GetChildKeysFromFlat} `G` - Child actor keys extracted from `Flat`.
 */
export type GetActorsSrcKeysFromFlat2<
  Flat extends FlatMapN,
  G extends _GetChildKeysFromFlat<Flat> = _GetChildKeysFromFlat<Flat>,
> = {
  children: {
    [key in G['src']]: Record<Extract<G, { src: key }>['on'], any>;
  };
  emitters: GetEmittersSrcKeyFromFlat<Flat>;
  pContext: Recomposer<G['contexts'][keyof G['contexts']]>;
};

/**
 * Actor keys extracted from machine configuration `C`.
 *
 * @template `C` - Machine configuration type {@linkcode AsyncConfig}.
 */
export type GetActorKeysFromConfig<C extends AsyncConfig> = GetActorsSrcKeysFromFlat<
  FlatMapN<C>
>;

/**
 * Detailed actor keys extracted from machine configuration `C`.
 *
 * @template `C` - Machine configuration type {@linkcode AsyncConfig}.
 */
export type GetActorKeysFromConfig2<C extends AsyncConfig> =
  GetActorsSrcKeysFromFlat2<FlatMapN<C>>;

/**
 * Actor keys extracted from machine type `T`.
 *
 * @template `T` - Machine type.
 */
export type GetActorKeysFromMachine<T extends KeyU<'config'>> =
  GetActorKeysFromConfig<Extract<ConfigFrom<T>, AsyncConfig>>;

/**
 * Structure representing an async child machine definition.
 *
 * @template `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type.
 * @template `T` - State tag string type.
 * @template `R` - Result type.
 */
export type AsyncChild<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = {
  src: AsyncChildFunction2<E, Pc, Tc, T, R>;
  description?: string;
  id: string;
  on: Identitfy<RecordS<AsyncTransition<E, Pc, Tc, T>>>[];
  contexts: string[];
};

/**
 * Extracts context keys from child machine object `T`.
 *
 * @template `T` - Child object shape with `contexts`.
 */
export type ExtractContextsKeyFromChild<
  T extends { contexts: Record<string, string> },
> = keyof T['contexts'];

/**
 * Extracts event keys from child machine object `T`.
 *
 * @template `T` - Child object shape with `on`.
 */
export type ExtractEventsKeyFromChild<T extends { on: Record<string, any> }> =
  keyof T['on'];
