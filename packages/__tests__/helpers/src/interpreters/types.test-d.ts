import type {
  ConfigFrom,
  ContextFrom,
  EventsFrom,
  EventsMapFrom,
  PrivateContextFrom,
} from '@bemedev/app/types';
import type { Config3, Machine3 } from '../../../async/src/interpreters/data';

import type { EmptyObject } from '@bemedev/decompose';

type TTConfig = ConfigFrom<Machine3>;

type TTPrivate = PrivateContextFrom<Machine3>;

type TTC = ContextFrom<Machine3>;

type TTEm = EventsMapFrom<Machine3>;

type TTE = EventsFrom<Machine3>;

type EventByName<T, K extends string> = Extract<T, { type: K }>;

describe('Machine type extraction', () => {
  test('#01 => ConfigFrom accepts the literal config', () => {
    expectTypeOf<Config3>().toExtend<TTConfig>();
  });

  test('#02 => PrivateContextFrom', () => {
    expectTypeOf<TTPrivate>().branded.toEqualTypeOf<{ data: string }>();
  });

  test('#03 => ContextFrom', () => {
    expectTypeOf<TTC>().toEqualTypeOf<{ age: number }>();
  });

  test('#04 => EventsMapFrom', () => {
    expectTypeOf<TTEm>().branded.toEqualTypeOf<{
      EVENT: { password: string; username: string };
      EVENT2: boolean;
      EVENT3: { login: string; pwd: string };
    }>();
  });

  test('#05 => EventsFrom', () => {
    expectTypeOf<
      EventByName<TTE, 'machine$$init'>['payload']
    >().toEqualTypeOf<EmptyObject>();

    expectTypeOf<EventByName<TTE, 'EVENT'>['payload']>().toEqualTypeOf<{
      password: string;
      username: string;
    }>();

    expectTypeOf<EventByName<TTE, 'EVENT2'>['payload']>().toEqualTypeOf<boolean>();

    expectTypeOf<EventByName<TTE, 'EVENT3'>['payload']>().toEqualTypeOf<{
      login: string;
      pwd: string;
    }>();

    expectTypeOf<
      EventByName<TTE, 'machine1::on::NEXT'>['payload']
    >().toEqualTypeOf<boolean>();
  });
});

// type ActionKeys =
//   ActionKeysFrom<Machine3> extends infer P extends string
//     ? {
//         [K in P]: K;
//       }[P]
//     : never;
// expectTypeOf<ActionKeys>().branded.toEqualTypeOf<
//   | 'deal'
//   | 'deal17'
//   | 'dodo1'
//   | 'doré'
//   | 'dodo2'
//   | 'dodo3'
//   | 'doré1'
//   | 'dodo5'
//   | 'dodo6'
//   | 'dodo7'
//   | 'doré3'
// >();

// type GuardKeys = GuardKeysFrom<Machine3>;
// expectTypeOf<GuardKeys>().toEqualTypeOf<'guard2'>();

// type DelayKeys = DelayKeysFrom<Machine3>;
// expectTypeOf<DelayKeys>().toEqualTypeOf<
//   'DELAY' | 'DELAY2' | 'DELAY3' | 'DELAY5' | 'DELAY17'
// >();

// type MachineKeys = ChildrenKeysFrom<Machine3>;
// expectTypeOf<MachineKeys>().toEqualTypeOf<'machine1'>();
