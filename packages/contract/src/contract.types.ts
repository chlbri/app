import { inferT, PrimitiveObject, StandardOutput } from '@bemedev/typings/types';
import type {
  ActorsConfigMap,
  CommonConfig2,
  ContractMachineOptions,
  ContractSimpleMachineOptions,
  EventObject,
  ToEventObject,
  ToEvents,
} from './internal';
import { Register } from './registry';
import type { Contract, StatePaths } from './types';

import type { DescriptionProps } from './descriptions';

/**
 * Internal contract surface used to select the options type before the
 * contract is fully assembled.
 */
type ContractSurface<
  Config,
  Eo extends EventObject,
  E extends Record<string, PrimitiveObject>,
  A extends ActorsConfigMap,
  Pc,
  Tc extends PrimitiveObject,
  Tags extends string,
  Paths extends string,
  Sync extends true | undefined,
> = {
  config: Config;
  types: {
    events: Eo;
    eventMap: E;
    actorsMap: A;
    context: Tc;
    pContext: Pc;
    paths: Paths;
    tags: Tags;
    sync: Sync;
  };
  describe: (props: DescriptionProps<Contract>) => any;
};

/**
 * Function signature for creating an unnamed contract.
 *
 * The arguments intentionally match the unnamed overload of `createMachine`
 * from `@bemedev/app`: a JSON config and optional type schemas.
 *
 * @template | {@linkcode CommonConfig2} `Config` - Machine configuration type.
 * @template | {@linkcode StandardOutput} `Pc` - Private context output type schema.
 * @template | {@linkcode StandardOutput} `Tc` - Public context output type schema.
 * @template | {@linkcode StandardOutput} `E` - Events output type schema.
 * @template | {@linkcode StandardOutput} `A` - Actors output type schema.
 * @template | {@linkcode inferT} `_E` - Inferred events map type.
 * @template | {@linkcode inferT} `_A` - Inferred actors map type.
 * @template | {@linkcode inferT} `_Pc` - Inferred private context type.
 * @template | {@linkcode inferT} `_Tc` - Inferred public context type.
 * @template | {@linkcode EventObject} `Eo` - Resulting event object type.
 * @template `Sync` - Sync execution flag.
 *
 * @param config - The machine configuration object.
 * @param types - Optional type definition schemas.
 *
 * @returns Resolved contract of type {@linkcode Contract}.
 */
export type CreateContractNoName_F = <
  const Config extends CommonConfig2,
  const Pc extends StandardOutput<any> = StandardOutput<any>,
  const Tc extends StandardOutput<PrimitiveObject> = StandardOutput<undefined>,
  const E extends StandardOutput<Record<string, PrimitiveObject>> = StandardOutput<
    Record<string, never>
  >,
  const A extends StandardOutput<ActorsConfigMap> = StandardOutput<ActorsConfigMap>,
  _E extends inferT<E> = inferT<E>,
  _A extends inferT<A> = inferT<A>,
  _Pc extends inferT<Pc> = inferT<Pc>,
  _Tc extends inferT<Tc> = inferT<Tc>,
  Eo extends EventObject = ToEventObject<ToEvents<_E, _A>>,
  Sync extends true | undefined = undefined,
>(
  config: Config,
  types?: { context?: Tc; pContext?: Pc; eventsMap?: E; actorsMap?: A; sync?: Sync },
) => Contract<
  Config,
  {
    events: Eo;
    eventMap: _E;
    actorsMap: _A;
    context: _Tc;
    pContext: _Pc;
    paths: StatePaths<Config>;
    tags: string;
    sync: Sync;
  },
  ContractSimpleMachineOptions<
    ContractSurface<Config, Eo, _E, _A, _Pc, _Tc, string, StatePaths<Config>, Sync>
  >
>;

/**
 * Function signature for creating a named contract backed by interface
 * {@linkcode Register}.
 *
 * The registered entry drives the typing surface: its `paths.all` union is the
 * resolved type {@linkcode ContractPaths}, its `events` union feeds the events map,
 * its `pContext` types the private context, and its `options` unions narrow the
 * returned type {@linkcode MachineOptions}. Names missing from type
 * {@linkcode Register} resolve from the config instead.
 *
 * @template | {@linkcode Register} `Name` - Registered contract identifier.
 * @template | {@linkcode Register} `Current` - Resolved registry entry for `Name`.
 * @template | {@linkcode CommonConfig2} `Config` - Machine configuration type.
 * @template | {@linkcode StandardOutput} `Pc` - Private context output type schema.
 * @template | {@linkcode StandardOutput} `Tc` - Public context output type schema.
 * @template | {@linkcode StandardOutput} `E` - Events output type schema.
 * @template | {@linkcode StandardOutput} `A` - Actors output type schema.
 * @template | {@linkcode inferT} `_E` - Inferred events map type.
 * @template | {@linkcode inferT} `_A` - Inferred actors map type.
 * @template | {@linkcode inferT} `_Pc` - Inferred private context type.
 * @template | {@linkcode inferT} `_Tc` - Inferred public context type.
 * @template | {@linkcode EventObject} `Eo` - Resulting event object type.
 * @template `Tags` - Tag union declared by the registered options.
 * @template `Sync` - Sync execution flag.
 *
 * @param _ - Registered contract name string.
 * @param config - The machine configuration object.
 * @param types - Optional type definition schemas.
 *
 * @returns Resolved contract of type {@linkcode Contract}.
 */
export type CreateContractNamed_F = <
  Name extends keyof Register & string,
  Current extends Register[Name] = Register[Name],
  const Config extends CommonConfig2<Current['paths']['all']> = CommonConfig2<
    Current['paths']['all']
  >,
  const Pc extends StandardOutput<Current['pContext']> = StandardOutput<
    Current['pContext']
  >,
  const Tc extends StandardOutput<PrimitiveObject> = StandardOutput<undefined>,
  const E extends StandardOutput<Record<Current['events'], PrimitiveObject>> =
    StandardOutput<Record<Current['events'], never>>,
  const A extends StandardOutput<
    ActorsConfigMap<Current['options']['children'], Current['options']['emitters']>
  > = StandardOutput<
    ActorsConfigMap<Current['options']['children'], Current['options']['emitters']>
  >,
  _E extends inferT<E> = inferT<E>,
  _A extends inferT<A> = inferT<A>,
  _Pc extends inferT<Pc> = inferT<Pc>,
  _Tc extends inferT<Tc> = inferT<Tc>,
  Eo extends EventObject = ToEventObject<ToEvents<_E, _A>>,
  Tags extends string = Exclude<Current['options']['tags'], undefined>,
  Sync extends true | undefined = undefined,
>(
  _: Name,
  config: Config,
  types?: { context?: Tc; pContext?: Pc; eventsMap?: E; actorsMap?: A; sync?: Sync },
) => Contract<
  Config,
  {
    events: Eo;
    eventMap: _E;
    actorsMap: _A;
    context: _Tc;
    pContext: _Pc;
    paths: string extends Current['paths']['all']
      ? StatePaths<Config>
      : Current['paths']['all'];
    tags: Tags;
    sync: Sync;
  },
  ContractMachineOptions<
    ContractSurface<
      Config,
      Eo,
      _E,
      _A,
      _Pc,
      _Tc,
      Tags,
      string extends Current['paths']['all']
        ? StatePaths<Config>
        : Current['paths']['all'],
      Sync
    >,
    Current['options']
  >
>;

/**
 * Combined function signature for creating a contract (named or unnamed).
 *
 * @see -- type {@linkcode CreateContractNamed_F}, -- type {@linkcode CreateContractNoName_F}
 */
export type CreateContract_F = CreateContractNamed_F & CreateContractNoName_F;
