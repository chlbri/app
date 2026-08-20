import type { Equals, Fn } from '@bemedev/app/bemedev';
import type {
  ActorsConfigMap,
  AsyncInterpreter,
  CommonConfig3,
  EmptyObject,
  EventArgObject,
  EventObject,
  EventsMap,
  ExtractSender,
  MachineType,
  PrimitiveObject,
  SimpleMachineOptions2,
  StateValue,
  SyncInterpreter,
} from '@bemedev/app/types';
import type { ProcessEventMap } from 'process';

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
    testFn: () => any | Promise<any>,
    error: string,
    timeout?: number,
  ) => TestArr;
} & {
  useStateValue: (value: StateValue, index?: number) => TestArr;
  useWarnings: (...warnings: string[]) => TestArr;
  useErrors: (...warnings: string[]) => TestArr;
};

/**
 * Result object returned by type {@linkcode ConstructTests_F} containing generated test methods.
 *
 * @template | {@linkcode EventObject} `Eo` - Event object type extending type {@linkcode EventObject}.
 * @template `T` - Custom helper return type extending `object`.
 * @template `Ta` - Tag type extending `string`.
 */
export type ConstructTestsResult<
  Eo extends EventObject,
  T extends object = object,
  Ta extends string = string,
> = T &
  CommonTestsResult & {
    send: (_event: EventArgObject<Eo>, index?: number) => TestArr;
  } & (Equals<Ta, never> extends true
    ? EmptyObject
    : { useTags: (...tags: Ta[]) => TestArr });

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
 * @template | {@linkcode MachineType} `Type` - Machine type ('sync' or 'async').
 */
export type Option<
  C extends CommonConfig3 = CommonConfig3,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = EventsMap,
  A extends ActorsConfigMap = ActorsConfigMap,
  Ta extends string = string,
  Eo extends EventObject = EventObject,
  AllPaths extends string = string,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
  Type extends MachineType = 'async',
> = {
  waiter: ConstructWaiter_F;
  contexts: ConstructContexts_F<Pc, Tc>;
  getIndex: (_index?: number) => string;
  tupleOf: OptionTupleOf;
  service: Type extends 'async'
    ? SyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L>
    : AsyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L>;

  sender: <const T extends Eo['type']>(
    type: T,
  ) => (...data: ExtractSender<Eo, T>) => TestArr;
};
