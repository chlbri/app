import type { Action2, ActionResult, WithDescriber } from '#actions';
import type { ActorsConfigMap, EventObject, EventsMap } from '#events';

import type { NodeConfig, StateValue } from '#states';
import type { Fn } from '#utils';
import type {
  ObjectT,
  PrimitiveObject,
  Sh,
  StandardKey,
} from '@bemedev/typings';
import type { RecordS } from '~types';

export type NoExtraKeysConfigDef<T extends ConfigDef> = T & {
  [K in Exclude<keyof T, keyof ConfigDef>]: never;
} & {
  states?: {
    [K in keyof T['states']]: T['states'][K] extends infer TK extends
      ConfigDef
      ? NoExtraKeysConfigDef<TK>
      : never;
  };
};

export type ConfigDef = {
  readonly targets: string;
  readonly initial?: string;
  readonly states?: RecordS<ConfigDef>;
};

export type TransformConfigDef<T extends ConfigDef> = {
  readonly initial?: T['initial'];
  readonly states?: {
    [Key in keyof T['states']]: T['states'][Key] extends infer TK extends
      ConfigDef
      ? TransformConfigDef<TK>
      : never;
  };
};

export type CommonConfig<
  Paths extends NoExtraKeysConfigDef<ConfigDef> =
    NoExtraKeysConfigDef<ConfigDef>,
> = NodeConfig<Paths['targets']> & {
  readonly strict?: boolean;
  readonly __longRuns?: boolean;
} & TransformConfigDef<Paths>;

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
  config: CommonConfig;
  TYPE: MachineType;
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
> = (name: string) => (id: string) => Action2<E, Pc, Tc, T>;

export type CommonCreateMachine_F = (
  config: any,
  types?: {
    eventsMap?: any;
    actorsMap?: any;
  },
) => any;

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
