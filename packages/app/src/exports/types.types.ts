import type { IsAsyncConfig } from '#common/functions/types';
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
import type { AsyncMachine } from '#machine';
import type { AsyncMachineOptions2 } from '#machines';
import type { Register, RegisterOptions } from '#registry';
import type {
  inferT,
  PrimitiveObject,
  StandardOutput,
} from '@bemedev/typings';
import type { EmptyObject } from '~types';
import type { SyncInterpreterFrom } from '../sync/interpreter';
import type { SyncMachine, SyncMachineOptions2 } from '../sync/machine';

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
  } & (IsAsyncConfig<C> extends false ? { sync?: Sync } : EmptyObject),
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
  } & { sync?: Sync },
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

export type CreateMachine_F = CreateMachineNamed_F & CreateMachineNoName_F;

export type OutInterpreter<M extends AnyMachine> = M['TYPE'] extends 'sync'
  ? SyncInterpreterFrom<M>
  : AsyncInterpreterFrom<M>;

export type CreateInterpreter_F = <M extends AnyMachine>(
  ...args: InterpretArgs<M>
) => OutInterpreter<M>;
