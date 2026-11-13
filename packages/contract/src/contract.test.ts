import { type } from '@bemedev/typings';
import {
  createContract,
  type ContractContext,
  type ContractEventArg,
  type ContractEvents,
  type ContractEventType,
  type ContractName,
  type ContractPaths,
  type ContractPContext,
  type ContractSync,
} from './index';

const config = {
  initial: 'idle',
  states: {
    idle: { on: { LOGIN: '/authenticated' } },
    authenticated: { initial: 'loading', states: { loading: {} } },
  },
} as const;

const types = {
  context: type({ count: 'number' }),
  pContext: type({ token: 'string' }),
  eventsMap: type({ LOGIN: 'never' }),
} as const;

const contract = createContract('auth', config, types);

describe('#01 => createContract', () => {
  test('#01 => exposes the contract name', () => {
    expect(contract.name).toBe('auth');
  });

  test('#02 => keeps the config reference', () => {
    expect(contract.config).toBe(config);
  });

  test('#03 => keeps the types reference', () => {
    expect(contract.types).toBe(types);
  });

  test('#04 => is frozen', () => {
    expect(Object.isFrozen(contract)).toBe(true);
  });

  test('#05 => does not expose options', () => {
    expect('options' in contract).toBe(false);
  });

  test('#06 => defaults types to an empty object', () => {
    const empty = createContract('empty', { initial: 'idle', states: { idle: {} } });

    expect(empty.types).toEqual({});
  });

  test('#07 => accepts transitions, guarded actions and actors', () => {
    const rich = createContract('rich', {
      initial: 'idle',
      states: {
        idle: {
          on: { GO: { target: '/done', actions: 'doIt', guards: 'canGo' } },
          after: { 100: '/done' },
          actors: { child: { on: { NEXT: '/done' } } },
        },
        done: {},
      },
    });

    expect(rich.name).toBe('rich');
  });
});

describe('#02 => contract types', () => {
  test('#01 => name', () => {
    expectTypeOf<ContractName<typeof contract>>().toEqualTypeOf<'auth'>();
  });

  test('#02 => paths', () => {
    expectTypeOf<ContractPaths<typeof contract>>().toEqualTypeOf<
      '/' | '/idle' | '/authenticated' | '/authenticated/loading'
    >();
  });

  test('#03 => context', () => {
    expectTypeOf<ContractContext<typeof contract>>().toEqualTypeOf<{
      count: number;
    }>();
  });

  test('#04 => pContext', () => {
    expectTypeOf<ContractPContext<typeof contract>>().toEqualTypeOf<{
      token: string;
    }>();
  });

  test('#05 => event type', () => {
    expectTypeOf<
      Extract<ContractEventType<typeof contract>, 'LOGIN'>
    >().toEqualTypeOf<'LOGIN'>();
  });

  test('#06 => event payload', () => {
    type Login = Extract<ContractEvents<typeof contract>, { type: 'LOGIN' }>;
    expectTypeOf<Login['payload']>().toEqualTypeOf<never>();
  });

  test('#07 => event argument', () => {
    expectTypeOf<
      Extract<ContractEventArg<typeof contract>, 'LOGIN'>
    >().toEqualTypeOf<'LOGIN'>();
  });

  test('#08 => default sync flag', () => {
    expectTypeOf<ContractSync<typeof contract>>().toEqualTypeOf<undefined>();
  });

  test('#09 => explicit sync flag', () => {
    const syncContract = createContract(
      'sync',
      { initial: 'idle', states: { idle: {} } },
      { sync: true },
    );

    expectTypeOf<ContractSync<typeof syncContract>>().toEqualTypeOf<true>();
  });
});
