import type { ActionResult, AsyncAction2, WithDescriber } from '#actions';
import type { ActorsConfigMap, EventObject, EventsMap } from '#events';

import type {
  FlatMapN,
  NodeConfig2,
  NodeConfig,
  NodeConfigCompound2,
  NodeConfigParallel2,
  StateValue,
  TargetDef,
  NodeConfig3,
} from '#states';
import type { AsyncTransition, TransitionsConfig } from '#transitions';
import type { Fn } from '#utils';
import type { Identitfy, NotUndefined } from '@bemedev/app-utils-bemedev';
import type {
  ObjectT,
  PrimitiveObject,
  Sh,
  StandardKey,
} from '@bemedev/typings';
import type {
  EmptyObject,
  FnMap,
  FnR,
  MaybePromise,
  RecordS,
} from '~types';

export type NoExtraKeysTargetDef<T extends TargetDef> = T & {
  [K in Exclude<keyof T, keyof TargetDef>]: never;
} & {
  states?: {
    [K in keyof T['states']]: T['states'][K] extends infer TK extends
      TargetDef
      ? NoExtraKeysTargetDef<TK>
      : never;
  };
};

export type TransformTargetDef<T extends TargetDef> =
  (undefined extends T['initial']
    ? EmptyObject
    : {
        readonly initial: T['initial'];
      }) &
    (undefined extends T['states']
      ? EmptyObject
      : {
          readonly states: {
            [Key in keyof T['states']]: T['states'][Key] extends infer TK extends
              TargetDef
              ? TransformTargetDef<TK>
              : never;
          };
        });

export type TransformTargetDef2<
  N extends NodeConfig2,
  T extends TargetDef,
> = (undefined extends T['initial']
  ? N
  : Omit<N, 'initial'> & {
      readonly initial: T['initial'];
    } & TransitionsConfig<T['targets']>) &
  (undefined extends T['states']
    ? EmptyObject
    : {
        readonly states: {
          [Key in keyof T['states']]: T['states'][Key] extends infer TK extends
            TargetDef
            ? TransformTargetDef<TK>
            : never;
        };
      });

export type CommonConfigNode = NodeConfigCompound2 | NodeConfigParallel2;

export type CommonConfig<Paths extends TargetDef = TargetDef> =
  NodeConfig<Paths> & {
    readonly strict?: boolean;
    readonly __longRuns?: boolean;
  };

export type CommonConfig2<Paths extends string = string> =
  NodeConfig2<Paths> & {
    readonly strict?: boolean;
    readonly __longRuns?: boolean;
  };

export type CommonConfig3<Paths extends string = string> =
  NodeConfig3<Paths> & {
    readonly strict?: boolean;
    readonly __longRuns?: boolean;
  };

export type NoExtraKeysConfig<T extends CommonConfig3> = T & {
  [K in Exclude<keyof T, keyof CommonConfig3>]: never;
} & {
  readonly states?: {
    [K in keyof T['states']]?: T['states'][K] extends infer TK extends
      CommonConfig3
      ? NoExtraKeysConfig<TK>
      : never;
  };
};

export type MachineType = 'sync' | 'async';

/**
 * Simple representation of a machine with meaningful properties.
 *
 * @template :  {@linkcode EventsMap} [E] - type of the events map
 * @template :  {@linkcode ActorsConfigMap} [A] - type of the actors configuration map
 * @template :  any [Pc] - type of the private context
 * @template :  {@linkcode PrimitiveObject} [Tc] - type of the context
 *
 * @see {@linkcode NodeConfigWithInitials}  for the structure of node configurations with initials.
 * @see {@linkcode StateValue} for the type of state values.
 * @see {@linkcode Fn} for creating functions
 *
 */
export interface AnyMachine<
  E extends EventsMap = EventsMap,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> {
  options: any;
  config: CommonConfig3;
  readonly TYPE: MachineType;
  flat: Record<string, any>;
  context: Tc;
  pContext: Pc;
  eventsMap: E;
  actorsMap: A;
  __events: any;
  __state: any;
  __decomposedState: any;
  addOptions: any;
  actions: any;
  guards: any;
  delays: any;
  __allPaths: string;
  __tag: string;
  tags: string[];
  children: any;
  renew: any;
  initialConfig: any;
  initialValue: StateValue;

  isInitial: Fn<[string], boolean>;
  retrieveParentFromInitial: Fn<[string], any>;
  toNode: Fn<[StateValue], any>;
}

export type CommonAddOptionsParam_F<
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = Fn<any[], Mo | undefined>;

export type CommonAddOptions_F<
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = (option: CommonAddOptionsParam_F<Mo>) => Mo | undefined;

export type CommonElements<
  C extends {
    readonly strict?: boolean;
    readonly __longRuns?: boolean;
  } = {
    readonly strict?: boolean;
    readonly __longRuns?: boolean;
  },
  E extends EventsMap = EventsMap,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = {
  config: C;
  pContext: Pc;
  eventsMap: E;
  actorsMap: A;
  context: Tc;
  actions?: Mo['actions'];
  guards?: Mo['guards'];
  delays?: Mo['delays'];
  actors?: Mo['actors'];
};

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

export type GetIO_F = (
  key: 'exit' | 'entry',
  node?: any,
) => WithDescriber[];

type StandardOutput2<T extends ObjectT> = Pick<Sh<T>, StandardKey>;

export type StdO2<T extends ObjectT> = StandardOutput2<T>;

export type CommonTimeAction_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = (name: string) => (id: string) => AsyncAction2<E, Pc, Tc, T>;

export type CommonCreateMachine_F<T = any> = (
  config: any,
  types?: {
    eventsMap?: any;
    actorsMap?: any;
  },
) => T;

/**
 * Represents a scheduled action with its data and execution time.
 *
 * @template :  any [Pc] - type of the private context
 * @template :  {@linkcode PrimitiveObject} [Tc] - type of the context
 *
 * @see {@linkcode ActionResult} for the result of the action.
 */
export type ScheduledData<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = { data: ActionResult<Pc, Tc>; ms: number; id: string };

export type ChildrenMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = RecordS<CommonChildFunction<E, Pc, Tc, T>>;

export type CommonChildFunction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnMap<E, Pc, Tc, T, R, `${string}::on::${string}`>;

export type CommonChildFunction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnR<E, Pc, Tc, T, MaybePromise<R>>;

export type ChildEvents<
  K extends string,
  A extends ActorsConfigMap = ActorsConfigMap,
> = NotUndefined<A['children']>[K] extends infer P ? P : never;

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
 * @template : {@linkcode AsyncConfig} [C] - type of the machine config
 * @returns A type representing all events from the machine config.
 *
 * @see {@linkcode FlatMapN} for the flat map structure.
 * @see {@linkcode GetEventsFromFlat} for extracting events from the flat map.
 * @see {@linkcode ConfigFrom} for extracting the config from the config.
 */
export type GetEventsFromConfig<C extends CommonConfig3> =
  GetEventsFromFlat<FlatMapN<C>>;

export type ChildConfigDef = EventsMap;

export type ChildConfigMap<S extends string = string> = Record<
  S,
  ChildConfigDef
>;

export type CommonChild<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
> = {
  src: CommonChildFunction2<E, Pc, Tc, T, R>;
  description?: string;
  id: string;
  on: Identitfy<RecordS<AsyncTransition<E, Pc, Tc, T>>>[];
  contexts: string[];
};
