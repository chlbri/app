import type { NoExtraKeysActorConfig } from '#actors';
import type {
  ActorsConfigMap,
  AsyncAction2,
  FnMap,
  NodeConfig2,
  TargetDef,
  TransitionsConfig,
  WithDescriber,
} from '@bemedev/app-contract/internal';

import type { FlatMapN } from '#states';

import type { AsyncTransition, NoExtraKeysTransitionConfigSoA } from '#transitions';

import type {
  Fn,
  Identitfy,
  NotUndefined,
  Ru,
  SubType,
  SubTypeLow,
  TrueObject,
  ValuesOf,
} from '@bemedev/app-contract/bemedev';
import type { EmptyObject, PrimitiveObject } from '@bemedev/typings';

import type {
  CommonConfig3,
  Contract,
  ContractConfig,
  ContractContext,
  ContractOptions,
  ContractPContext,
  FnR,
  MaybePromise,
} from '@bemedev/app-contract';

import type { OptionsPlugin } from '@bemedev/app-options';
import type {
  DecomposeC,
  FnMapFilterArray,
  FnMapFilterObject,
  SimpleMachineOptions2,
} from '@bemedev/app-plugins/addons';
import type { RecordS } from '~types';

export type { DecomposeC, OptionsPlugin };

export type {
  ChildConfigDef,
  ChildConfigMap,
  CommonConfig,
  CommonConfig2,
  CommonConfig3,
  CommonConfigNode,
} from '@bemedev/app-contract';

/**
 * Type guard for enforcing no extra keys on target definitions.
 *
 * @template | {@linkcode TargetDef} `T` - Target definition input type.
 */
export type NoExtraKeysTargetDef<T extends TargetDef> = T & {
  [K in Exclude<keyof T, keyof TargetDef>]: never;
} & {
  states?: {
    [K in keyof T['states']]: T['states'][K] extends infer TK extends TargetDef
      ? NoExtraKeysTargetDef<TK>
      : never;
  };
};

/**
 * Transforms target definition into initial state map structure.
 *
 * @template | {@linkcode TargetDef} `T` - Target definition type.
 */
export type TransformTargetDef<T extends TargetDef> = (undefined extends T['initial']
  ? EmptyObject
  : { readonly initial: T['initial'] }) &
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

/**
 * Transforms target definition and node config into updated node config.
 *
 * @template | {@linkcode NodeConfig2} `N` - Base node configuration type.
 * @template | {@linkcode TargetDef} `T` - Target definition type.
 */
export type TransformTargetDef2<
  N extends NodeConfig2,
  T extends TargetDef,
> = (undefined extends T['initial']
  ? N
  : Omit<N, 'initial'> & { readonly initial: T['initial'] } & TransitionsConfig<
        T['targets']
      >) &
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

/**
 * Enforces no extra keys across full machine configuration object.
 *
 * @template | {@linkcode CommonConfig3} `T` - Configuration type.
 */
export type NoExtraKeysConfig<T extends CommonConfig3> = T & {
  [K in Exclude<keyof T, keyof CommonConfig3>]: never;
} & {
  readonly states?: {
    [K in keyof T['states']]?: T['states'][K] extends infer TK extends CommonConfig3
      ? NoExtraKeysConfig<TK>
      : never;
  };
} & {
  readonly on?: {
    [key in keyof T['on']]?: NoExtraKeysTransitionConfigSoA<T['on'][key]>;
  };
  readonly after?: {
    [key in keyof T['after']]?: NoExtraKeysTransitionConfigSoA<T['after'][key]>;
  };
  readonly always?: NoExtraKeysTransitionConfigSoA<T['always']>;
  readonly actors?: {
    [key in keyof T['actors']]?: NoExtraKeysActorConfig<T['actors'][key]>;
  };
};

/**
 * Options resolution function parameter type.
 *
 * @template | {@linkcode SimpleMachineOptions2} `Mo` - Machine options type.
 */
export type CommonAddOptionsParam_F<
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = Fn<any[], Mo | undefined>;

/**
 * Options addition function signature.
 *
 * @template | {@linkcode SimpleMachineOptions2} `Mo` - Machine options type.
 */
export type CommonAddOptions_F<
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = (option: CommonAddOptionsParam_F<Mo>) => Mo | undefined;

/**
 * Core elements of a state machine initialization payload.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type CommonElements<Ct extends Contract = Contract> = {
  config: ContractConfig<Ct>;
  pContext: ContractPContext<Ct>;
  context: ContractContext<Ct>;
  actions?: ContractOptions<Ct>['actions'];
  guards?: ContractOptions<Ct>['guards'];
  delays?: ContractOptions<Ct>['delays'];
  actors?: ContractOptions<Ct>['actors'];
};

/**
 * Helper function for extracting entry or exit actions from a node.
 */
export type GetIO_F = (key: 'exit' | 'entry', node?: any) => WithDescriber[];

/**
 * Common function signature for timer actions.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type CommonTimeAction_F<Ct extends Contract = Contract> = (
  name: string,
) => (id: string) => AsyncAction2<Ct>;

/**
 * `DecomposeC` is owned by `@bemedev/app-plugins/addons` and re-exported at
 * the top of this module.
 */

/**
 * Function type signature for creating an erase property action helper.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `A` - Action return type.
 *
 * @returns Action of type `A` erasing the supplied context keys.
 */
export type CommonEraseAction_F<Ct extends Contract = Contract, A = any> = <
  D = 0 extends 1 & ContractContext<Ct>
    ? Record<string, any>
    : SubTypeLow<DecomposeC<ContractContext<Ct>>, undefined>,
  K extends keyof D & string = keyof D & string,
>(
  ...keys: K[]
) => A;

/**
 * Function type signature for creating a filter property action helper.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `A` - Action return type.
 *
 * @returns Action of type `A` filtering the supplied context key.
 */
export type CommonFilterAction_F<Ct extends Contract = Contract, A = any> = <
  D = 0 extends 1 & ContractContext<Ct>
    ? Record<string, any>
    : SubType<DecomposeC<ContractContext<Ct>>, TrueObject | any[] | undefined>,
  K extends keyof D & string = keyof D & string,
>(
  key: K,
  fn: NotUndefined<D[K]> extends Array<infer Item>
    ? FnMapFilterArray<Ct, Item>
    : NotUndefined<D[K]> extends Ru
      ? FnMapFilterObject<Ct, ValuesOf<NotUndefined<D[K]>>>
      : never,
) => A;

/**
 * Generic machine creator function signature.
 *
 * @template `T` - Target machine type.
 */
export type CommonCreateMachine_F<T = any> = (
  contract: Contract,
  plugins?: readonly OptionsPlugin<any, any>[],
) => T;

/**
 * Map of child names to child actor machine functions.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type ChildrenMap<Ct extends Contract = Contract> = RecordS<
  CommonChildFunction<Ct>
>;

/**
 * Child machine function map signature.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `R` - Machine return type.
 */
export type CommonChildFunction<
  Ct extends Contract = Contract,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnMap<Ct, R, `${string}::on::${string}`>;

/**
 * Child machine single function signature returning maybe promise of `R`.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `R` - Machine return type.
 */
export type CommonChildFunction2<
  Ct extends Contract = Contract,
  R extends { eventsMap: any } = { eventsMap: any },
> = FnR<Ct, MaybePromise<R>>;

/**
 * Extract child event payload type by child key `K`.
 *
 * @template `K` - Child key name.
 * @template | {@linkcode ActorsConfigMap} `A` - Actors configuration map type.
 */
export type ChildEvents<
  K extends string,
  A extends ActorsConfigMap = ActorsConfigMap,
> = NotUndefined<A['children']>[K] extends infer P ? P : never;

/**
 * Internal type for extracting event keys from flat map nodes.
 *
 * @template | {@linkcode FlatMapN} `Flat` - Type of flat map of nodes.
 */
type _GetEventKeysFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]: Flat[key] extends { on: infer V } ? keyof V : never;
}[keyof Flat];

/**
 * Provide a record of all events by key and {@linkcode PrimitiveObject} payload.
 *
 * @template | {@linkcode FlatMapN} `Flat` - Type of flat map of nodes.
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
 * @template | {@linkcode CommonConfig3} `C` - Type of machine config.
 *
 * @see -- type {@linkcode FlatMapN}, -- type {@linkcode GetEventsFromFlat}, -- type {@linkcode ConfigFrom}
 */
export type GetEventsFromConfig<C extends CommonConfig3> = GetEventsFromFlat<
  FlatMapN<C>
>;

/**
 * Child actor object representation.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `R` - Child return type.
 */
export type CommonChild<
  Ct extends Contract = Contract,
  R extends { eventsMap: any } = { eventsMap: any },
> = {
  src: CommonChildFunction2<Ct, R>;
  id: string;
  on: Identitfy<RecordS<AsyncTransition<Ct>>>[];
  contexts: string[];
};
