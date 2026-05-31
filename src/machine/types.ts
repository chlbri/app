import type { Action2, FromActionConfig } from '#actions';
import type { Equals, Keys } from '#bemedev/globals/types';
import { Identify } from '#bemedev/globals/types';
import type {
  ChildEvents,
  CommonConfig,
  ConfigDef,
  NoExtraKeysConfigDef,
} from '#common/machine';
import type { DelayFunction2 } from '#delays';
import type {
  EmitterDef,
  EmitterFunction2,
  EmitterReturn,
  EmittersMap,
} from '#emitters';
import type { ActorsConfigMap, EventObject, EventsMap } from '#events';
import type { PredicateS, PredicateS2 } from '#guards';
import type {
  ActivityConfig,
  ExtractActionsFromActivity,
  ExtractDelaysFromActivity,
  ExtractGuardsFromActivity,
  ExtractTagsFromFlat,
  FlatMapN,
  NodeConfigCompound,
  NodeConfigParallel,
} from '#states';
import type {
  ExtractActionKeysFromTransitions,
  ExtractChildKeysFromTransitions,
  ExtractDelayKeysFromTransitions,
  ExtractEmitterSrcKeyFromTransitions,
  ExtractGuardKeysFromTransitions,
  Transition,
  TransitionsConfig,
} from '#transitions';
import type { Recompose } from '@bemedev/decompose';
import type { PrimitiveObject } from '@bemedev/typings';
import type { Observable } from 'rxjs';
import type { FnR, KeyU, MaybePromise, ReduceArray } from '~types';
import type { RegisterOptions } from '../registry.types';
import { RecordS } from './../types/primitives';
import type { ConfigFrom } from '#common/interpreter';

/**
 * Type representing the main JSON config.
 *
 * @see {@linkcode NodeConfigCompound} for compound nodes.
 * @see {@linkcode NodeConfigParallel} for parallel nodes.
 */
export type ConfigNode = NodeConfigCompound | NodeConfigParallel;

/**
 * Type representing the main JSON node config of a state machine.
 *
 * @see {@linkcode ConfigNode} for more details.
 * @see {@linkcode CommonConfig}
 */
export type Config<
  Paths extends NoExtraKeysConfigDef<ConfigDef> =
    NoExtraKeysConfigDef<ConfigDef>,
> = CommonConfig<Paths>;

export type ExtractTagsFromConfig<T extends Config> = ExtractTagsFromFlat<
  FlatMapN<T>
>;

/**
 * Type representing all action keys from a flat map of nodes.
 * @template : {@linkcode FlatMapN} [Flat] - type of the flat map of nodes
 * @returns A type representing all action keys from this flat map.
 *
 * @see {@linkcode TransitionsConfig} for the structure of transitions.
 * @see {@linkcode ActivityConfig} for the structure of activities.
 * @see {@linkcode FromActionConfig} for extracting action names from action configurations.
 * @see {@linkcode ExtractActionKeysFromTransitions} for extracting actions from transitions.
 * @see {@linkcode ExtractActionsFromActivity} for extracting actions from activities.
 * @see {@linkcode ReduceArray} for reducing arrays to a single type.
 */
export type _GetKeyActionsFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]:
    | ExtractActionKeysFromTransitions<
        Extract<Flat[key], TransitionsConfig>
      >
    | ExtractActionsFromActivity<
        Extract<Flat[key], { activities: ActivityConfig }>
      >
    | FromActionConfig<
        ReduceArray<Extract<Flat[key], { entry: any }>['entry']>
      >
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
 * @template : {@linkcode FlatMapN} [Flat] - type of the flat map of nodes
 * @returns A type representing all guard keys from this flat map.
 *
 * @see {@linkcode TransitionsConfig} for the structure of transitions.
 * @see {@linkcode ActivityConfig} for the structure of activities.
 * @see {@linkcode ExtractGuardKeysFromTransitions} for extracting guards from transitions.
 * @see {@linkcode ExtractGuardsFromActivity} for extracting guards from activities.
 */
type _GetKeyGuardsFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]:
    | ExtractGuardKeysFromTransitions<
        Extract<Flat[key], TransitionsConfig>
      >
    | ExtractGuardsFromActivity<
        Extract<Flat[key], { activities: ActivityConfig }>
      > extends infer V
    ? unknown extends V
      ? never
      : V
    : never;
}[keyof Flat];

type _GetEmitterSrcKeyFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]: ExtractEmitterSrcKeyFromTransitions<
    Extract<Flat[key], TransitionsConfig>
  > extends infer V
    ? unknown extends V
      ? never
      : V
    : never;
}[keyof Flat];

type _GetChildKeysFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]: ExtractChildKeysFromTransitions<
    Extract<Flat[key], TransitionsConfig>
  >;
}[keyof Flat];

/**
 * Type representing all event types from a flat map of nodes.
 * @template : {@linkcode FlatMapN} [Flat] - type of the flat map of nodes
 * @returns A type representing all event types from this flat map.
 *
 */
type _GetEventKeysFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]: Flat[key] extends { on: infer V } ? keyof V : never;
}[keyof Flat];

/**
 * Type representing all delay keys from a flat map of nodes.
 * @template : {@linkcode FlatMapN} [Flat] - type of the flat map of nodes
 * @returns A type representing all delay keys from this flat map.
 *
 * @see {@linkcode TransitionsConfig} for the structure of transitions.
 * @see {@linkcode ActivityConfig} for the structure of activities.
 * @see {@linkcode ExtractDelayKeysFromTransitions} for extracting delays from transitions.
 * @see {@linkcode ExtractDelaysFromActivity} for extracting delays from activities.
 */
type _GetDelayKeysFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]:
    | ExtractDelayKeysFromTransitions<
        Extract<Flat[key], TransitionsConfig>
      >
    | ExtractDelaysFromActivity<Flat[key]> extends infer V
    ? unknown extends V
      ? never
      : V
    : never;
}[keyof Flat];

/**
 * Provide a record of all actions by key and {@linkcode Action} function.
 *
 * @template : {@linkcode FlatMapN} [Flat] - type of the flat map of nodes
 * @template : {@linkcode EventsMap} [E] - type of the events map
 * @template : {@linkcode ActorsConfigMap} [P] - type of the promisees map
 * @template Pc - type of the private context
 * @template : {@linkcode PrimitiveObject} [Tc] - type of the context
 *
 * @see {@linkcode _GetKeyActionsFromFlat} for extracting action keys from the flat map.
 */
export type GetActionsFromFlat<
  Flat extends FlatMapN,
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Record<_GetKeyActionsFromFlat<Flat>, Action2<E, Pc, Tc, T>>;

/**
 * Provide a record of all guards by key and {@linkcode PredicateS} function.
 *
 * @template : {@linkcode FlatMapN} [Flat] - type of the flat map of nodes
 * @template : {@linkcode EventsMap} [E] - type of the events map
 * @template : {@linkcode ActorsConfigMap} [P] - type of the promisees map
 * @template Pc - type of the private context
 * @template : {@linkcode PrimitiveObject} [Tc] - type of the context
 *
 * @see {@linkcode _GetKeyGuardsFromFlat} for extracting guard keys from the flat map.
 */
export type GetGuardsFromFlat<
  Flat extends FlatMapN,
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Record<_GetKeyGuardsFromFlat<Flat>, PredicateS<E, Pc, Tc, T>>;

export type GetEmitterSrcsKeyFromFlat<
  Flat extends FlatMapN,
  A extends ActorsConfigMap = ActorsConfigMap,
> = {
  [key in _GetEmitterSrcKeyFromFlat<Flat>]: Observable<
    EmitterReturn<key, A>
  >;
};

/**
 * Provide a record of all delays by key and {@linkcode DelayFunction} function.
 *
 * @template : {@linkcode FlatMapN} [Flat] - type of the flat map of nodes
 * @template : {@linkcode EventsMap} [E] - type of the events map
 * @template : {@linkcode ActorsConfigMap} [A] - type of the actors config map
 * @template Pc - type of the private context
 * @template : {@linkcode PrimitiveObject} [Tc] - type of the context
 *
 * @see {@linkcode _GetDelayKeysFromFlat} for extracting delay keys from the flat map.
 */
export type GetDelaysFromFlat<
  Flat extends FlatMapN,
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Record<_GetDelayKeysFromFlat<Flat>, DelayFunction2<E, Pc, Tc, T>>;

/**
 * Provide a record of all events by key and {@linkcode PrimitiveObject} payload.
 *
 * @template : {@linkcode FlatMapN} [Flat] - type of the flat map of nodes
 *
 * @see {@linkcode _GetEventKeysFromFlat} for extracting event keys from the flat map.
 */
export type GetEventsFromFlat<Flat extends FlatMapN> = Record<
  _GetEventKeysFromFlat<Flat>,
  PrimitiveObject
>;

/**
 * Get all events from a machine config.
 *
 * @template : {@linkcode Config} [C] - type of the machine config
 * @returns A type representing all events from the machine config.
 *
 * @see {@linkcode FlatMapN} for the flat map structure.
 * @see {@linkcode GetEventsFromFlat} for extracting events from the flat map.
 * @see {@linkcode ConfigFrom} for extracting the config from the config.
 */
export type GetEventsFromConfig<C extends Config> = GetEventsFromFlat<
  FlatMapN<C>
>;

/**
 * Get all events from a machine.
 *
 * @template : {@linkcode KeyU}<'config'> [T] - type of the machine
 *
 * @returns A type representing all events from the machine.
 *
 * @see {@linkcode ConfigFrom} for extracting the config from the machine.
 * @see {@linkcode GetEventsFromConfig} for extracting events from the machine.
 */
export type GetEventsFromMachine<T extends KeyU<'config'>> =
  GetEventsFromConfig<Extract<ConfigFrom<T>, Config>>;

export type GetEmittersSrcKeyFromFlat<Flat extends FlatMapN> = Record<
  _GetEmitterSrcKeyFromFlat<Flat>,
  EmitterDef
>;

export type GetEmittersSrcFromFlat<
  Flat extends FlatMapN,
  E extends EventObject = EventObject,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  [key in _GetEmitterSrcKeyFromFlat<Flat>]: EmitterFunction2<
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
 * @template : {@linkcode Config} [C] - type of the machine config
 * @returns A type representing all emitters from the machine config.
 *
 * @see {@linkcode FlatMapN} for the flat map structure.
 * @see {@linkcode GetEmittersSrcKeyFromFlat} for extracting promises from the flat map.
 * @see {@linkcode FlatMapN} for extracting the config from a machine config.
 */
export type GetEmittersSrcFromConfig<C extends Config> =
  GetEmittersSrcKeyFromFlat<FlatMapN<C>>;

/**
 * Get all emitters from a machine.
 *
 * @template : {@linkcode KeyU}<'config'> [T] - type of the machine
 *
 * @returns A type representing all emitters from the machine.
 *
 * @see {@linkcode ConfigFrom} for extracting the config from the machine.
 * @see {@linkcode GetEmittersSrcFromConfig} for extracting promises from the machine.
 */
export type GetEmittersSrcFromMachine<T extends KeyU<'config'>> =
  GetEmittersSrcFromConfig<Extract<ConfigFrom<T>, Config>>;

export type GetChildrenSrcKeysFromFlat<
  Flat extends FlatMapN,
  G extends _GetChildKeysFromFlat<Flat> = _GetChildKeysFromFlat<Flat>,
> = {
  [key in G['src']]: Record<Extract<G, { src: key }>['on'], any>;
};

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

export type ChildFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnR<E, Pc, Tc, T, MaybePromise<R>>;

export type GetChildrenSrcFromFlat<
  Flat extends FlatMapN,
  E extends EventObject = EventObject,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  G extends _GetChildKeysFromFlat<Flat> = _GetChildKeysFromFlat<Flat>,
> = {
  [key in G['src']]: ChildFunction2<
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
 * @template : {@linkcode Config} [C] - type of the machine config
 * @returns A type representing all child machines from the machine config.
 *
 * @see {@linkcode FlatMapN} for the flat map structure.
 * @see {@linkcode GetChildrenSrcKeysFromFlat} for extracting promises from the flat map.
 * @see {@linkcode FlatMapN} for extracting the config from a machine config.
 */
export type GetChildrenSrcFromConfig<C extends Config> =
  GetChildrenSrcKeysFromFlat<FlatMapN<C>>;

/**
 * Get all child machines from a machine.
 *
 * @template : {@linkcode KeyU}<'config'> [T] - type of the machine
 *
 * @returns A type representing all child machines from the machine.
 *
 * @see {@linkcode ConfigFrom} for extracting the config from the machine.
 * @see {@linkcode GetChildrenSrcFromConfig} for extracting child machines from the machine.
 */
export type GetChildrenSrcFromMachine<T extends KeyU<'config'>> =
  GetChildrenSrcFromConfig<Extract<ConfigFrom<T>, Config>>;

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

export type GetActorsFromConfig<
  C extends Config,
  E extends EventObject = EventObject,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = GetActorsFromFlat<FlatMapN<C>, E, A, Pc, Tc, T>;

export type GetActorsFromMachine<
  M extends KeyU<'config'>,
  E extends EventObject = EventObject,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = GetActorsFromConfig<Extract<ConfigFrom<M>, Config>, E, A, Pc, Tc, T>;

export type GetActorsSrcKeysFromFlat<Flat extends FlatMapN> = {
  children: GetChildrenSrcKeysFromFlat<Flat>;
  emitters: GetEmittersSrcKeyFromFlat<Flat>;
};

export type Recomposer<P extends Keys> =
  Equals<P, '.'> extends true
    ? any
    : Equals<P, ''> extends true
      ? any
      : Recompose<Record<Exclude<P, '' | '.'>, unknown>>;

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

export type GetActorKeysFromConfig<C extends Config> =
  GetActorsSrcKeysFromFlat<FlatMapN<C>>;

export type GetActorKeysFromConfig2<C extends Config> =
  GetActorsSrcKeysFromFlat2<FlatMapN<C>>;

export type GetActorKeysFromMachine<T extends KeyU<'config'>> =
  GetActorKeysFromConfig<Extract<ConfigFrom<T>, Config>>;

export type ChildConfigDef = EventsMap;

export type ChildConfigMap<S extends string = string> = Record<
  S,
  ChildConfigDef
>;

export type AsyncChild<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = {
  src: ChildFunction2<E, Pc, Tc, T, R>;
  description?: string;
  id: string;
  on: Identify<RecordS<Transition<E, Pc, Tc, T>>>[];
  contexts: string[];
};

/**
 * The big one !
 *
 * Type representing the options for a machine configuration.
 *
 * @template : {@linkcode Config} [C] - type of the machine config
 * @template : {@linkcode EventsMap} [E] - type of the events map
 * @template : {@linkcode ActorsConfigMap} [A] - type of the actors config map
 * @template Pc - type of the private context
 * @template : {@linkcode PrimitiveObject} [Tc] - type of the context
 * @template : {@linkcode FlatMapN} [Flat] - type of the flat map of nodes inside {@linkcode C}
 *
 * @returns A type representing the options for the machine configuration.
 * All options can be :
 * * `initials` - a record of initial states.
 * * `actions` - a partial record of actions, where keys are action names and values are action functions.
 * * `guards` - a partial record of guards, where keys are predicate names and values are predicate functions.
 * * `promises` - a partial record of promises, where keys are promise names and values are promise functions.
 * * `delays` - a partial record of delays, where keys are delay names and values are delay functions.
 * * `machines` - a partial record of child services, where keys are machine names and values are child services.
 *
 * @see {@linkcode GetInititalsFromFlat} for extracting initials from the flat map.
 * @see {@linkcode GetActionsFromFlat} for extracting actions from the flat map.
 * @see {@linkcode GetGuardsFromFlat} for extracting guards from the flat map.
 * @see {@linkcode GetPromiseSrcsFromFlat} for extracting promise sources from the flat map.
 * @see {@linkcode GetDelaysFromFlat} for extracting delays from the flat map.
 * @see {@linkcode GetMachinesFromConfig} for extracting child services from the machine config
 * @see {@linkcode Partial} - intern type to make all properties optional.
 */
export type MachineOptions<
  C extends Config = Config,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
  Flat extends FlatMapN<C, false> = FlatMapN<C, false>,
> = Partial<{
  actions: Partial<GetActionsFromFlat<Flat, Eo, Pc, Tc, T>>;
  guards: Partial<GetGuardsFromFlat<Flat, Eo, Pc, Tc, T>>;
  delays: Partial<GetDelaysFromFlat<Flat, Eo, Pc, Tc, T>>;
  actors: Partial<GetActorsFromFlat<Flat, Eo, A, Pc, Tc, T>>;
}>;

export type MachineOptions2<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
  O extends RegisterOptions = RegisterOptions,
> = Partial<{
  actions: Partial<Record<O['actions'], Action2<Eo, Pc, Tc, T>>>;
  guards: Partial<Record<O['guards'], PredicateS<Eo, Pc, Tc, T>>>;
  delays: Partial<Record<O['delays'], DelayFunction2<Eo, Pc, Tc, T>>>;
  actors: Partial<{
    children: Partial<
      Record<O['children'], ChildFunction2<Eo, Pc, Tc, T, any>>
    >;
    emitters: Partial<
      Record<O['emitters'], EmitterFunction2<Eo, Pc, Tc, T, any>>
    >;
  }>;
}>;

/**
 * Simple representation machine options
 *
 * @template : {@linkcode EventsMap} [E] - type of the events map
 * @template : {@linkcode ActorsConfigMap} [A] - type of the actors config map
 * @template Pc - type of the private context
 * @template : {@linkcode PrimitiveObject} [Tc] - type of the context
 *
 */
export type SimpleMachineOptions<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
> = Partial<{
  actions: Partial<RecordS<Action2<Eo, Pc, Tc, T>>>;
  guards: Partial<RecordS<PredicateS2<Eo, Pc, Tc, T>>>;
  delays: Partial<RecordS<DelayFunction2<Eo, Pc, Tc, T>>>;
  actors: Partial<{
    children: RecordS<ChildFunction2<Eo, Pc, Tc, T>>;
    emitters: EmittersMap<Eo, Pc, Tc, T>;
  }>;
}>;

/**
 * Second version of simple machine options.
 *
 * @see {@linkcode Partial}
 * @see {@linkcode Record}
 *
 * @remarks
 * This type is more flexible than {@linkcode SimpleMachineOptions}
 */
export type SimpleMachineOptions2 = Partial<
  Record<'actions' | 'guards' | 'delays', any> &
    Record<
      'actors',
      {
        children?: RecordS<any>;
        emitters?: RecordS<any>;
      }
    >
>;

export type ExtractContextsKeyFromChild<
  T extends { contexts: Record<string, string> },
> = keyof T['contexts'];

export type ExtractEventsKeyFromChild<
  T extends { on: Record<string, any> },
> = keyof T['on'];
