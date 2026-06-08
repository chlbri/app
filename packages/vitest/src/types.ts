import type { PrimitiveObject } from '@bemedev/app/types';
import type { Equals, Fn } from '@bemedev/app/bemedev';
import type {
  EmptyObject,
  EventArgObject,
  EventObject,
  ExtractSender,
  StateValue,
} from '@bemedev/app/types';
import type { ProcessEventMap } from 'process';

export type TestArr = readonly [string, () => void];

export type RejectionHandler = (
  ...args: ProcessEventMap['unhandledRejection']
) => void;

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

export type ConstructTestsResult<
  Eo extends EventObject,
  T extends object = object,
  Ta extends string = string,
> = T &
  CommonTestsResult & {
    send: (_event: EventArgObject<Eo>, index?: number) => TestArr;
  } & (Equals<Ta, never> extends true
    ? EmptyObject
    : {
        useTags: (...tags: Ta[]) => TestArr;
      });

export type ConstructTestsResult2 = CommonTestsResult & {
  send: (_event: EventObject, index?: number) => TestArr;
  useTags: (...tags: string[]) => TestArr;
};

type OptionTupleOf = (
  invite: string,
  assertion: () => any,
) => [string, () => any];

type ConstructWaiter_F = (
  DELAY?: number,
) => (
  times?: number,
  index?: number,
) => readonly [string, () => Promise<void>];

type ConstructContexts_F<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = <R = { context: Tc; pContext: Pc }>(
  selector?: (result: { context: Tc; pContext: Pc }) => R,
  name?: string,
) => (value?: R, index?: number) => readonly [string, () => void];

export type Option<
  Eo extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = {
  waiter: ConstructWaiter_F;
  contexts: ConstructContexts_F<Pc, Tc>;
  getIndex: (_index?: number) => string;
  tupleOf: OptionTupleOf;

  sender: <const T extends Eo['type']>(
    type: T,
  ) => (...data: ExtractSender<Eo, T>) => TestArr;
};
