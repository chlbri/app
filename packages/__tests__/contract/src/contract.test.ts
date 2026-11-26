import {
  createContract,
  type AsyncMachineOptions2,
  type ContractContext,
  type ContractEventArg,
  type ContractEvents,
  type ContractEventType,
  type ContractOptions,
  type ContractPaths,
  type ContractPContext,
  type ContractSync,
  type EventStrings,
  type SyncMachineOptions2,
  type SyncSimpleMachineOptions,
  type WorkingStatus,
} from '@bemedev/app-contract';

import type { StateValue } from '@bemedev/app-contract/bemedev';

import contract, { config, types } from './auth.contract';

/** Empty object with no keys, matching the initial/after/always event payloads. */
type EmptyObject = Record<never, never>;

// const contract = createContract(config, types);

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

  test('#08 => describe attaches descriptions and returns itself', () => {
    const described = createContract({ initial: 'idle', states: { idle: {} } });
    const descriptions = {
      general: ['A simple contract'],
      actors: { children: {}, emotters: {} },
      delays: {},
      actions: {},
      guards: {},
      states: { idle: ['The idle state'] },
    };

    const returned = described.describe(descriptions);

    expect(returned).toBe(described);
    expect(described.descriptions).toBe(descriptions);
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
    expectTypeOf<ContractOptions<typeof contract>>().toMatchTypeOf<
      AsyncMachineOptions2<
        typeof contract,
        {
          children: never;
          emitters: never;
          tags: never;
          actions: never;
          delays: never;
          guards: never;
        }
      >
    >();
  });

  test('#10 => sync options surface', () => {
    expectTypeOf<ContractOptions<typeof syncContract>>().toMatchTypeOf<
      SyncSimpleMachineOptions<typeof syncContract>
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
    expectTypeOf<ContractOptions<typeof named>>().toMatchTypeOf<
      AsyncMachineOptions2<
        typeof named,
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

    expectTypeOf<ContractOptions<typeof syncNamed>>().toMatchTypeOf<
      SyncMachineOptions2<
        typeof syncNamed,
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
