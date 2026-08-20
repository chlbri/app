import type {
  ActorsConfigMap,
  AsyncInterpreter,
  CommonConfig3,
  EventObject,
  EventsMap,
  SimpleMachineOptions2,
  SyncInterpreter,
  PrimitiveObject,
} from '@bemedev/app/types';
// import type { VitestUtils } from 'vitest';
import type { ConstructTestsResult, Option } from './types';

/**
 * Type definition for the `constructTests` test builder function.
 *
 * @template | {@linkcode CommonConfig3} `C` - Machine configuration type extending type {@linkcode CommonConfig3}.
 * @template `Pc` - Protected context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type extending type {@linkcode PrimitiveObject}.
 * @template | {@linkcode EventsMap} `E` - Events map type extending type {@linkcode EventsMap}.
 * @template | {@linkcode ActorsConfigMap} `A` - Actors configuration map extending type {@linkcode ActorsConfigMap}.
 * @template `Ta` - Tag type extending `string`.
 * @template | {@linkcode EventObject} `Eo` - Event object type extending type {@linkcode EventObject}.
 * @template `AllPaths` - All paths union type extending `string`.
 * @template | {@linkcode SimpleMachineOptions2} `Mo` - Machine options type extending type {@linkcode SimpleMachineOptions2}.
 * @template | {@linkcode SimpleMachineOptions2} `L` - Local machine options type extending type {@linkcode SimpleMachineOptions2}.
 * @template `T` - Custom helper return type extending `object`.
 *
 * @param vi - Vitest utility instance.
 * @param service - Interpreter service instance (type {@linkcode SyncInterpreter} or type {@linkcode AsyncInterpreter}).
 * @param helper - Optional helper builder callback receiving type {@linkcode Option}.
 * @param startIndex - Optional initial test step index.
 *
 * @returns Result object of type {@linkcode ConstructTestsResult}.
 */
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
  // vi: VitestUtils,
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
