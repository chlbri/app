import { type } from '@bemedev/typings';
import { createContract } from './index';

import type {
  AsyncMachineOptions2,
  AsyncSimpleMachineOptions,
  EmptyObject,
  EventStrings,
  StateValue,
  SyncMachineOptions2,
  SyncSimpleMachineOptions,
  WorkingStatus,
} from './internal';

import type {
  ContractContext,
  ContractEventArg,
  ContractEvents,
  ContractEventType,
  ContractOptions,
  ContractPaths,
  ContractPContext,
  ContractSync,
} from './types';

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

const contract = createContract(config, types);

describe('#01 => createContract', () => {
  test('#01 => keeps the config reference', () => {
    expect(contract.config).toBe(config);
  });

  test('#02 => keeps the types reference', () => {
    expect(contract.types).toBe(types);
  });

  test('#03 => is frozen', () => {
    expect(Object.isFrozen(contract)).toBe(true);
  });

  test('#04 => does not expose options', () => {
    expect('options' in contract).toBe(false);
  });

  test('#05 => does not expose a name', () => {
    expect('name' in contract).toBe(false);
  });

  test('#06 => defaults types to an empty object', () => {
    const empty = createContract({ initial: 'idle', states: { idle: {} } });

    expect(empty.types).toEqual({});
  });

  test('#07 => accepts transitions, guarded actions and actors', () => {
    const rich = createContract({
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

    expect(rich.config).toMatchObject({ initial: 'idle' });
  });
});

describe('#02 => contract types', () => {
  const syncContract = createContract(
    { initial: 'idle', states: { idle: {} } },
    { sync: true },
  );

  test('#01 => paths', () => {
    expectTypeOf<ContractPaths<typeof contract>>().toEqualTypeOf<
      '/' | '/idle' | '/authenticated' | '/authenticated/loading'
    >();
  });

  test('#02 => context', () => {
    expectTypeOf<ContractContext<typeof contract>>().toEqualTypeOf<{
      count: number;
    }>();
  });

  test('#03 => pContext', () => {
    expectTypeOf<ContractPContext<typeof contract>>().toEqualTypeOf<{
      token: string;
    }>();
  });

  test('#04 => event type', () => {
    expectTypeOf<
      Extract<ContractEventType<typeof contract>, 'LOGIN'>
    >().toEqualTypeOf<'LOGIN'>();
  });

  test('#05 => event payload', () => {
    type Login = Extract<ContractEvents<typeof contract>, { type: 'LOGIN' }>;
    expectTypeOf<Login['payload']>().toEqualTypeOf<never>();
  });

  test('#06 => event argument', () => {
    expectTypeOf<
      Extract<ContractEventArg<typeof contract>, 'LOGIN'>
    >().toEqualTypeOf<'LOGIN'>();
  });

  test('#07 => default sync flag', () => {
    expectTypeOf<ContractSync<typeof contract>>().toEqualTypeOf<undefined>();
  });

  test('#08 => explicit sync flag', () => {
    expectTypeOf<ContractSync<typeof syncContract>>().toEqualTypeOf<true>();
  });

  test('#09 => async options surface', () => {
    expectTypeOf<ContractOptions<typeof contract>>().toEqualTypeOf<
      AsyncSimpleMachineOptions<
        ContractPContext<typeof contract>,
        ContractContext<typeof contract>,
        string,
        ContractEvents<typeof contract>
      >
    >();
  });

  test('#10 => sync options surface', () => {
    expectTypeOf<ContractOptions<typeof syncContract>>().toEqualTypeOf<
      SyncSimpleMachineOptions<
        ContractPContext<typeof syncContract>,
        ContractContext<typeof syncContract>,
        string,
        ContractEvents<typeof syncContract>
      >
    >();
  });
});

declare module '@bemedev/app-contract' {
  interface Register {
    'named.contract': {
      paths: {
        map: {
          targets: '/' | '/authenticated';
          initial: 'idle';
          states: {
            idle: { targets: '/' | '/authenticated' };
            authenticated: { targets: '/' };
          };
        };
        all: '/' | '/idle' | '/authenticated';
      };
      events: 'LOGIN';
      options: {
        children: never;
        emitters: never;
        tags: never;
        actions: 'login';
        guards: never;
        delays: never;
      };
      pContext: { token: string };
    };
  }
}

describe('#03 => named contract', () => {
  const named = createContract('named.contract', {
    initial: 'idle',
    states: {
      idle: { on: { LOGIN: { target: '/authenticated', actions: ['login'] } } },
      authenticated: {},
    },
  });

  test('#01 => keeps the config reference', () => {
    expect(named.config).toMatchObject({ initial: 'idle' });
  });

  test('#02 => resolves paths from the registry', () => {
    expectTypeOf<ContractPaths<typeof named>>().toEqualTypeOf<
      '/' | '/idle' | '/authenticated'
    >();
  });

  test('#03 => resolves pContext from the registry', () => {
    expectTypeOf<ContractPContext<typeof named>>().toEqualTypeOf<{
      token: string;
    }>();
  });

  test('#04 => resolves events from the registry', () => {
    type Login = Extract<ContractEvents<typeof named>, { type: 'LOGIN' }>;
    expectTypeOf<Login['payload']>().toEqualTypeOf<never>();
  });

  test('#05 => resolves strict async options from the registry', () => {
    expectTypeOf<ContractOptions<typeof named>>().toEqualTypeOf<
      AsyncMachineOptions2<
        ContractPContext<typeof named>,
        ContractContext<typeof named>,
        never,
        ContractEvents<typeof named>,
        {
          children: never;
          emitters: never;
          tags: never;
          actions: 'login';
          guards: never;
          delays: never;
        }
      >
    >();
  });

  test('#06 => resolves strict sync options from the registry', () => {
    const syncNamed = createContract(
      'named.contract',
      { initial: 'idle', states: { idle: { on: { LOGIN: '/authenticated' } } } },
      { sync: true },
    );

    expectTypeOf<ContractOptions<typeof syncNamed>>().toEqualTypeOf<
      SyncMachineOptions2<
        ContractPContext<typeof syncNamed>,
        ContractContext<typeof syncNamed>,
        never,
        ContractEvents<typeof syncNamed>,
        {
          children: never;
          emitters: never;
          tags: never;
          actions: 'login';
          guards: never;
          delays: never;
        }
      >
    >();
  });

  describe('#04 => Params of an option', () => {
    type Params = Parameters<
      NonNullable<NonNullable<ContractOptions<typeof named>['actions']>['login']>
    >[0];

    test('#01 => keyof State', () => {
      type KeyParams = keyof Params;
      expectTypeOf<KeyParams>().toEqualTypeOf<
        'event' | 'pContext' | 'context' | 'status' | 'value' | 'tags'
      >();
    });

    test('#02 => event', () => {
      expectTypeOf<Params['event']>().toEqualTypeOf<
        | { type: 'LOGIN'; payload: never; __internal?: EventStrings }
        | { type: 'machine$$init'; payload: EmptyObject; __internal?: EventStrings }
        | {
            type: `${string}/machine$$after`;
            payload: EmptyObject;
            __internal?: EventStrings;
          }
        | {
            type: `${string}/machine$$always`;
            payload: EmptyObject;
            __internal?: EventStrings;
          }
      >();
    });

    test('#03 => pContext', () => {
      expectTypeOf<Params['pContext']>().toEqualTypeOf<{ token: string }>();
    });

    test('#04 => context', () => {
      expectTypeOf<Params['context']>().toEqualTypeOf<undefined>();
    });

    test('#05 => status', () => {
      expectTypeOf<Params['status']>().toEqualTypeOf<WorkingStatus>();
    });

    test('#06 => tags', () => {
      expectTypeOf<Params['tags']>().toEqualTypeOf<never[]>();
    });

    test('#07 => value', () => {
      expectTypeOf<Params['value']>().toEqualTypeOf<StateValue>();
    });
  });
});
