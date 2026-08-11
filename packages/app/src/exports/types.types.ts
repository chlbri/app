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
import type { AsyncMachine } from '../asyncMachine/machine';
import type { AsyncMachineOptions2 } from '../asyncMachine';
import type { Register, RegisterOptions } from '#registry';
import type {
  inferT,
  PrimitiveObject,
  StandardOutput,
} from '@bemedev/typings';
import type { SyncInterpreterFrom } from '../sync/interpreter';
import type { SyncMachine, SyncMachineOptions2 } from '../sync/machine';

/**
 * Resolves to type {@linkcode SyncMachine} or type {@linkcode AsyncMachine} depending on the `Sync` type parameter.
 *
 * @template {CommonConfig3} C - Common configuration type.
 * @template Pc - Public context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {EventsMap} E - Events map.
 * @template {ActorsConfigMap} A - Actors map.
 * @template {string} Ta - Tags type.
 * @template {EventObject} Eo - Event object type.
 * @template {string} AllPaths - String union of all state paths.
 * @template {RegisterOptions} Options - Registry options type.
 * @template {true | undefined} Sync - Flag indicating sync machine execution.
 */
export type OutMachine<
  C extends CommonConfig3 = CommonConfig3,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = EventsMap,
  A extends ActorsConfigMap = ActorsConfigMap,
  Ta extends string = string,
  Eo extends EventObject = EventObject,
  AllPaths extends string = string,
  Options extends RegisterOptions = RegisterOptions,
  Sync extends true | undefined = undefined,
> = Sync extends true
  ? SyncMachine<
      C,
      Pc,
      Tc,
      E,
      A,
      Ta,
      Eo,
      AllPaths,
      SyncMachineOptions2<Pc, Tc, Ta, Eo, Options>
    >
  : AsyncMachine<
      C,
      Pc,
      Tc,
      E,
      A,
      Ta,
      Eo,
      AllPaths,
      AsyncMachineOptions2<Pc, Tc, Ta, Eo, Options>
    >;

/**
 * Function overload signature for creating an unnamed state machine.
 *
 * @template {CommonConfig2} C - Machine configuration type.
 * @template {StandardOutput<any>} Pc - Public context output type schema.
 * @template {StandardOutput<PrimitiveObject>} Tc - Internal context output type schema.
 * @template {StandardOutput<Record<string, PrimitiveObject>>} E - Events output type schema.
 * @template {StandardOutput<ActorsConfigMap>} A - Actors output type schema.
 * @template _E - Inferred events map type.
 * @template _A - Inferred actors map type.
 * @template _Pc - Inferred public context type.
 * @template _Tc - Inferred internal context type.
 * @template {string} Tags - State tags type.
 * @template {EventObject} Eo - Resulting event object type.
 * @template {true | undefined} Sync - Sync execution flag.
 *
 * @param config - The machine configuration object.
 * @param types - Optional type definition schemas for context, events, actors, and sync mode.
 *
 * @returns Resolved machine instance of type {@linkcode OutMachine}.
 */
export type CreateMachineNoName_F = <
  const C extends CommonConfig2,
  const Pc extends StandardOutput<any> = StandardOutput<any>,
  const Tc extends StandardOutput<PrimitiveObject> =
    StandardOutput<undefined>,
  const E extends StandardOutput<Record<string, PrimitiveObject>> =
    StandardOutput<Record<string, never>>,
  const A extends StandardOutput<ActorsConfigMap> =
    StandardOutput<ActorsConfigMap>,
  _E extends inferT<E> = inferT<E>,
  _A extends inferT<A> = inferT<A>,
  _Pc extends inferT<Pc> = inferT<Pc>,
  _Tc extends inferT<Tc> = inferT<Tc>,
  Tags extends string = string,
  Eo extends EventObject = ToEventObject<ToEvents<_E, _A>>,
  Sync extends true | undefined = undefined,
>(
  config: NoExtraKeysConfig<C>,
  types?: {
    context?: Tc;
    pContext?: Pc;
    eventsMap?: E;
    actorsMap?: A;
    sync?: Sync;
  },
) => OutMachine<
  C,
  _Pc,
  _Tc,
  _E,
  _A,
  Tags,
  Eo,
  string,
  RegisterOptions,
  Sync
>;

/**
 * Function overload signature for creating a named state machine backed by type {@linkcode Register}.
 *
 * @template {keyof Register & string} Name - Registered machine identifier.
 * @template {Register[Name]} Current - Resolved registry entry for `Name`.
 * @template {CommonConfig<Current['paths']['map']>} C - Machine configuration type.
 * @template {StandardOutput<Current['pContext']>} Pc - Public context output type schema.
 * @template {StandardOutput<PrimitiveObject>} Tc - Internal context output type schema.
 * @template {StandardOutput<Record<Current['events'], PrimitiveObject>>} E - Events output type schema.
 * @template {StandardOutput<ActorsConfigMap<Current['options']['children'], Current['options']['emitters']>>} A - Actors output type schema.
 * @template _E - Inferred events map type.
 * @template _A - Inferred actors map type.
 * @template _Pc - Inferred public context type.
 * @template _Tc - Inferred internal context type.
 * @template {Exclude<Current['options']['tags'], undefined>} Tags - Allowed tags for state nodes.
 * @template {EventObject} Eo - Resulting event object type.
 * @template {true | undefined} Sync - Sync execution flag.
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
  const Tc extends StandardOutput<PrimitiveObject> =
    StandardOutput<undefined>,
  const E extends StandardOutput<
    Record<Current['events'], PrimitiveObject>
  > = StandardOutput<Record<Current['events'], never>>,
  const A extends StandardOutput<
    ActorsConfigMap<
      Current['options']['children'],
      Current['options']['emitters']
    >
  > = StandardOutput<
    ActorsConfigMap<
      Current['options']['children'],
      Current['options']['emitters']
    >
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
  types?: {
    context?: Tc;
    pContext?: Pc;
    eventsMap?: E;
    actorsMap?: A;
    sync?: Sync;
  },
) => OutMachine<
  C,
  _Pc,
  _Tc,
  _E,
  _A,
  Tags,
  Eo,
  Current['paths']['all'],
  Current['options'],
  Sync
>;

/**
 * Combined function signature for creating a state machine (named or unnamed).
 *
 * @see -- type {@linkcode CreateMachineNamed_F}, -- type {@linkcode CreateMachineNoName_F}
 */
export type CreateMachine_F = CreateMachineNamed_F & CreateMachineNoName_F;

/**
 * Conditional type resolving to type {@linkcode SyncInterpreterFrom} or type {@linkcode AsyncInterpreterFrom} based on machine type.
 *
 * @template {AnyMachine} M - Target state machine type.
 */
export type OutInterpreter<M extends AnyMachine> = M['TYPE'] extends 'sync'
  ? SyncInterpreterFrom<M>
  : AsyncInterpreterFrom<M>;

/**
 * Function signature for instantiating an interpreter for a machine instance.
 *
 * @template {AnyMachine} M - Target machine type.
 *
 * @param args - Arguments matching type {@linkcode InterpretArgs} for the target machine.
 *
 * @returns Interpreter of type {@linkcode OutInterpreter}.
 */
export type CreateInterpreter_F = <M extends AnyMachine>(
  ...args: InterpretArgs<M>
) => OutInterpreter<M>;
