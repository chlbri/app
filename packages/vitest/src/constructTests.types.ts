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
 * @template {CommonConfig3} C - Machine configuration type extending type {@linkcode CommonConfig3}.
 * @template Pc - Protected context type.
 * @template {PrimitiveObject} Tc - Context type extending type {@linkcode PrimitiveObject}.
 * @template {EventsMap} E - Events map type extending type {@linkcode EventsMap}.
 * @template {ActorsConfigMap} A - Actors configuration map extending type {@linkcode ActorsConfigMap}.
 * @template {string} Ta - Tag type extending `string`.
 * @template {EventObject} Eo - Event object type extending type {@linkcode EventObject}.
 * @template {string} AllPaths - All paths union type extending `string`.
 * @template {SimpleMachineOptions2} Mo - Machine options type extending type {@linkcode SimpleMachineOptions2}.
 * @template {SimpleMachineOptions2} L - Local machine options type extending type {@linkcode SimpleMachineOptions2}.
 * @template {object} T - Custom helper return type extending `object`.
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
