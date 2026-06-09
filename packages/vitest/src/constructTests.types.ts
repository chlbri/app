import type {
  ActorsConfigMap,
  AsyncInterpreter,
  CommonConfig3,
  EventObject,
  EventsMap,
  SimpleMachineOptions2,
  SyncInterpreter,
} from '@bemedev/app/types';
import type { PrimitiveObject } from '@bemedev/typings';
import type { VitestUtils } from 'vitest';
import type { ConstructTestsResult, Option } from './types';

export type ConstructTests_F = <
  const C extends CommonConfig3 = CommonConfig3,
  const Pc = any,
  const Tc extends PrimitiveObject = PrimitiveObject,
  const E extends EventsMap = EventsMap,
  const A extends ActorsConfigMap = ActorsConfigMap,
  const Ta extends string = string,
  const Eo extends EventObject = EventObject,
  const AllPaths extends string = string,
  const Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  const L extends SimpleMachineOptions2 = SimpleMachineOptions2,
  const T extends object = object,
>(
  vi: VitestUtils,
  service:
    | SyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L>
    | AsyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L>,
  helper?: (
    option: Option<
      C,
      Pc,
      Tc,
      E,
      A,
      Ta,
      Eo,
      AllPaths,
      Mo,
      L,
      (typeof service)['TYPE']
    >,
  ) => T,
  startIndex?: number,
) => ConstructTestsResult<Eo, T, Ta>;
