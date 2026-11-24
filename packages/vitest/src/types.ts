import type { Equals, Fn } from '@bemedev/app-utils-bemedev';
import { SimpleMachineOptions2, MachineType } from '@bemedev/app-plugins';
import type { OptionsPlugin, PrimitiveObject } from '@bemedev/app-options';
import type { ProcessEventMap } from 'process';

import type {
  Contract,
  ContractContext,
  ContractEvents,
  ContractPContext,
  ContractTags,
  StateValue,
  EventObject,
  EventArgObject,
} from '@bemedev/app-contract';

import type {
  AsyncInterpreter,
  EmptyObject,
  ExtractSender,
  SyncInterpreter,
} from '@bemedev/app/types';

/**
 * Tuple representing a test description and its corresponding execution callback.
 */
export type TestArr = readonly [string, () => void];

/**
 * Rejection handler function signature for process `unhandledRejection` events.
 */
export type RejectionHandler = (
  ...args: ProcessEventMap['unhandledRejection']
) => void;

/**
 * Common test result builder methods available on constructed test objects.
 */
type CommonTestsResult = Record<
  'start' | 'stop' | 'dispose' | 'pause' | 'resume',
  (index?: number) => TestArr
> & {
  changeIndex: (fn: Fn<[number], number>) => TestArr;
  unhandledRejection: (
    testFn: () => any,
    error: string,
    timeout?: number,
  ) => TestArr;
} & {
  useStateValue: (value: StateValue, index?: number) => TestArr;
  useWarnings: (...warnings: string[]) => TestArr;
  useErrors: (...warnings: string[]) => TestArr;
};

/**
 * Result object returned by type {@linkcode ConstructTests_F} containing
 * generated test methods.
 *
 * Every type is derived from the contract of the tested service.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the tested machine.
 * @template `T` - Custom helper return type extending `object`.
 */
export type ConstructTestsResult<
  Ct extends Contract = Contract,
  T extends object = object,
> = T &
  CommonTestsResult & {
    send: (_event: EventArgObject<ContractEvents<Ct>>, index?: number) => TestArr;
  } & (Equals<ContractTags<Ct>, never> extends true
    ? EmptyObject
    : { useTags: (...tags: ContractTags<Ct>[]) => TestArr });

/**
 * Internal result structure for type {@linkcode constructTests} execution.
 */
export type ConstructTestsResult2 = CommonTestsResult & {
  send: (_event: EventObject, index?: number) => TestArr;
  useTags: (...tags: string[]) => TestArr;
};

/**
 * Helper tuple builder function signature.
 */
type OptionTupleOf = (invite: string, assertion: () => any) => [string, () => any];

/**
 * Waiter function builder signature.
 */
type ConstructWaiter_F = (
  DELAY?: number,
) => (times?: number, index?: number) => readonly [string, () => Promise<void>];

/**
 * Context selector test builder function signature.
 *
 * @template `Pc` - Protected context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type extending type {@linkcode PrimitiveObject}.
 */
type ConstructContexts_F<Pc = any, Tc extends PrimitiveObject = PrimitiveObject> = <
  R = { context: Tc; pContext: Pc },
>(
  selector?: (result: { context: Tc; pContext: Pc }) => R,
  name?: string,
) => (value?: R, index?: number) => readonly [string, () => void];

/**
 * Configuration options object passed to custom test helper functions.
 *
 * Contexts, events, tags and the service type are all derived from the contract.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the tested machine.
 * @template | {@linkcode SimpleMachineOptions2} `L` - Accumulated options.
 * @template | {@linkcode MachineType} `Type` - Machine type ('sync' or 'async').
 * @template `Ps` - Plugins attached to the tested service.
 */
export type Option<
  Ct extends Contract = Contract,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
  Type extends MachineType = 'async',
  Ps extends readonly OptionsPlugin<any, any>[] = [],
> = {
  waiter: ConstructWaiter_F;
  contexts: ConstructContexts_F<ContractPContext<Ct>, ContractContext<Ct>>;
  getIndex: (_index?: number) => string;
  tupleOf: OptionTupleOf;
  service: Type extends 'async'
    ? AsyncInterpreter<Ct, L, Ps>
    : SyncInterpreter<Ct, L, Ps>;

  sender: <const T extends ContractEvents<Ct>['type']>(
    type: T,
  ) => (...data: ExtractSender<ContractEvents<Ct>, T>) => TestArr;
};
