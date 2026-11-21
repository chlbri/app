import type { Contract } from '@bemedev/app/contract';
import type {
  AsyncInterpreter,
  SimpleMachineOptions2,
  SyncInterpreter,
} from '@bemedev/app/types';
// import type { VitestUtils } from 'vitest';
import type { ConstructTestsResult, Option } from './types';

/**
 * Type definition for the `constructTests` test builder function.
 *
 * The service type is contract-first: `Ct` is inferred from the interpreter,
 * and every generated helper derives its events, contexts and tags from it.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the tested machine.
 * @template | {@linkcode SimpleMachineOptions2} `L` - Accumulated options.
 * @template `T` - Custom helper return type extending `object`.
 *
 * @param service - Interpreter service instance (type {@linkcode SyncInterpreter} or type {@linkcode AsyncInterpreter}).
 * @param helper - Optional helper builder callback receiving type {@linkcode Option}.
 * @param startIndex - Optional initial test step index.
 *
 * @returns Result object of type {@linkcode ConstructTestsResult}.
 */
export type ConstructTests_F = <
  const Ct extends Contract = Contract,
  const L extends SimpleMachineOptions2 = SimpleMachineOptions2,
  const T extends object = object,
>(
  // vi: VitestUtils,
  service: SyncInterpreter<Ct, L> | AsyncInterpreter<Ct, L>,
  helper?: (option: Option<Ct, L, (typeof service)['TYPE']>) => T,
  startIndex?: number,
) => ConstructTestsResult<Ct, T>;
