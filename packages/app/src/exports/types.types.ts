import type { InterpretArgs } from '#common/interpreter';
import type {
  AnyMachine,
  CommonConfig,
  CommonConfig2,
  CommonConfig3,
  NoExtraKeysConfig,
} from '#common/machine';
import type {
  ActorsConfigMap,
  EventObject,
  EventsMap,
  ToEventObject,
  ToEvents,
} from '#events';
import type { AsyncInterpreterFrom } from '#interpreter';
import type { Register, RegisterOptions } from '#registry';
import type { Contract, ContractMachineOptions } from '@bemedev/app-options';
import type { inferT, PrimitiveObject, StandardOutput } from '@bemedev/typings';
import type { AsyncMachine } from '../asyncMachine/machine';
import type { SyncInterpreterFrom } from '../sync/interpreter';
import type { SyncMachine } from '../sync/machine';

/**
 * Contract surface used to select the machine options type before the full
 * contract object is assembled.
 */
type OutContractSurface<
  C extends CommonConfig3,
  Pc,
  Tc extends PrimitiveObject,
  E extends EventsMap,
  A extends ActorsConfigMap,
  Tags extends string,
  Eo extends EventObject,
  AllPaths extends string,
  Sync extends true | undefined,
> = {
  config: C;
  types: {
    events: Eo;
    eventMap: E;
    actorsMap: A;
    context: Tc;
    pContext: Pc;
    paths: AllPaths;
    tags: Tags;
    sync: Sync;
  };
};

/**
 * Assembles the contract typing surface produced by `createMachine`.
 *
 * It is the single input of {@linkcode OutMachine}: the machine class is
 * selected from the contract `sync` flag, and every class member is derived
 * from it.
 *
 * @template `C` - Machine configuration type.
 * @template `Pc` - Public context type.
 * @template `Tc` - Internal context type.
 * @template `E` - Events map.
 * @template `A` - Actors map.
 * @template `Tags` - Tags type.
 * @template `Eo` - Event object type.
 * @template `AllPaths` - String union of all state paths.
 * @template `Sync` - Flag indicating sync machine execution.
 * @template `O` - Machine options surface.
 */
export type OutContract<
  C extends CommonConfig3 = CommonConfig3,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = EventsMap,
  A extends ActorsConfigMap = ActorsConfigMap,
  Tags extends string = string,
  Eo extends EventObject = EventObject,
  AllPaths extends string = string,
  Sync extends true | undefined = undefined,
  O extends ContractMachineOptions<
    OutContractSurface<C, Pc, Tc, E, A, Tags, Eo, AllPaths, Sync>,
    RegisterOptions
  > = ContractMachineOptions<
    OutContractSurface<C, Pc, Tc, E, A, Tags, Eo, AllPaths, Sync>,
    RegisterOptions
  >,
> = Contract<
  C,
  {
    events: Eo;
    eventMap: E;
    actorsMap: A;
    context: Tc;
    pContext: Pc;
    paths: AllPaths;
    tags: Tags;
    sync: Sync;
  },
  O
>;

/**
 * Resolves to class {@linkcode SyncMachine} or class {@linkcode AsyncMachine}
 * depending on the contract `sync` flag.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type OutMachine<Ct extends Contract = Contract> =
  Ct['types']['sync'] extends true ? SyncMachine<Ct> : AsyncMachine<Ct>;

/**
 * Function overload signature for creating an unnamed state machine.
 *
 * @template | {@linkcode CommonConfig2} `C` - Machine configuration type.
 * @template `Pc` - Public context output type schema.
 * @template `Tc` - Internal context output type schema.
 * @template `E` - Events output type schema.
 * @template `A` - Actors output type schema.
 * @template `_E` - Inferred events map type.
 * @template `_A` - Inferred actors map type.
 * @template `_Pc` - Inferred public context type.
 * @template `_Tc` - Inferred internal context type.
 * @template `Tags` - State tags type.
 * @template | {@linkcode EventObject} `Eo` - Resulting event object type.
 * @template `Sync` - Sync execution flag.
 *
 * @param config - The machine configuration object.
 * @param types - Optional type definition schemas for context, events, actors, and sync mode.
 *
 * @returns Resolved machine instance of type {@linkcode OutMachine}.
 */
export type CreateMachineNoName_F = <
  const C extends CommonConfig2,
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
  Tags extends string = string,
  Eo extends EventObject = ToEventObject<ToEvents<_E, _A>>,
  Sync extends true | undefined = undefined,
>(
  config: NoExtraKeysConfig<C>,
  types?: { context?: Tc; pContext?: Pc; eventsMap?: E; actorsMap?: A; sync?: Sync },
) => OutMachine<
  OutContract<
    C,
    _Pc,
    _Tc,
    _E,
    _A,
    Tags,
    Eo,
    string,
    Sync,
    ContractMachineOptions<
      OutContractSurface<C, _Pc, _Tc, _E, _A, Tags, Eo, string, Sync>,
      RegisterOptions
    >
  >
>;

/**
 * Function overload signature for creating a named state machine backed by interface {@linkcode Register}.
 *
 * @template `Name` - Registered machine identifier.
 * @template `Current` - Resolved registry entry for `Name`.
 * @template `C` - Machine configuration type.
 * @template `Pc` - Public context output type schema.
 * @template `Tc` - Internal context output type schema.
 * @template `E` - Events output type schema.
 * @template `A` - Actors output type schema.
 * @template `_E` - Inferred events map type.
 * @template `_A` - Inferred actors map type.
 * @template `_Pc` - Inferred public context type.
 * @template `_Tc` - Inferred internal context type.
 * @template `Tags` - Allowed tags for state nodes.
 * @template | {@linkcode EventObject} `Eo` - Resulting event object type.
 * @template `Sync` - Sync execution flag.
 *
 * @param _ - Registered machine name string.
 * @param config - The machine configuration object.
 * @param types - Optional type definition schemas.
 *
 * @returns Resolved machine instance of type {@linkcode OutMachine}.
 */
export type CreateMachineNamed_F = <
  Name extends keyof Register & string,
  Current extends Register[Name] = Register[Name],
  const C extends CommonConfig<Current['paths']['map']> = CommonConfig<
    Current['paths']['map']
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
  Tags extends Exclude<Current['options']['tags'], undefined> = Exclude<
    Current['options']['tags'],
    undefined
  >,
  Eo extends EventObject = ToEventObject<ToEvents<_E, _A>>,
  Sync extends true | undefined = undefined,
>(
  _: Name,
  config: NoExtraKeysConfig<C>,
  types?: { context?: Tc; pContext?: Pc; eventsMap?: E; actorsMap?: A; sync?: Sync },
) => OutMachine<
  OutContract<
    C,
    _Pc,
    _Tc,
    _E,
    _A,
    Tags,
    Eo,
    Current['paths']['all'],
    Sync,
    ContractMachineOptions<
      OutContractSurface<
        C,
        _Pc,
        _Tc,
        _E,
        _A,
        Tags,
        Eo,
        Current['paths']['all'],
        Sync
      >,
      Current['options']
    >
  >
>;

/**
 * Machine resolved from a contract.
 *
 * It is exactly {@linkcode OutMachine}: the contract `sync` flag selects class
 * {@linkcode SyncMachine} or class {@linkcode AsyncMachine}, and every member
 * type is derived from the contract.
 *
 * @template | {@linkcode Contract} `C` - Contract of the machine.
 */
export type ContractMachine<C extends Contract> = OutMachine<C>;

/**
 * Function signature for creating a state machine from a contract.
 *
 * The `Contract` type parameters are promoted to the function generics, and
 * the contract is reassembled inside the `contract` argument, so the machine
 * type is resolved from the contract surface directly.
 *
 * Options built by `@bemedev/app-options` are attached to the returned machine
 * with `machine.addOptions(() => options)`.
 *
 * @param contract - Contract of type `Contract`.
 *
 * @returns Resolved machine instance of type {@linkcode ContractMachine}.
 */
export type CreateMachineContract_F = <C extends Contract>(
  contract: C,
) => ContractMachine<C>;

/**
 * Combined function signature for creating a state machine.
 *
 * Accepts a contract, or the named/unnamed machine forms.
 *
 * @see -- type {@linkcode CreateMachineNamed_F}, -- type {@linkcode CreateMachineNoName_F}, -- type {@linkcode CreateMachineContract_F}
 */
export type CreateMachine_F = CreateMachineNamed_F &
  CreateMachineNoName_F &
  CreateMachineContract_F;

/**
 * Conditional type resolving to type {@linkcode SyncInterpreterFrom} or type {@linkcode AsyncInterpreterFrom} based on machine type.
 *
 * @template | {@linkcode AnyMachine} `M` - Target state machine type.
 */
export type OutInterpreter<M extends AnyMachine> = M['TYPE'] extends 'sync'
  ? SyncInterpreterFrom<M>
  : AsyncInterpreterFrom<M>;

/**
 * Function signature for instantiating an interpreter for a machine instance.
 *
 * @template | {@linkcode AnyMachine} `M` - Target machine type.
 *
 * @param args - Arguments matching type {@linkcode InterpretArgs} for the target machine.
 *
 * @returns Interpreter of type {@linkcode OutInterpreter}.
 */
export type CreateInterpreter_F = <M extends AnyMachine>(
  ...args: InterpretArgs<M>
) => OutInterpreter<M>;
