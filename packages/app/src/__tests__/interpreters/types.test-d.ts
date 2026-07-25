import type {
  ConfigFrom,
  ContextFrom,
  EventsFrom,
  EventsMapFrom,
  PrivateContextFrom,
} from '#common/interpreter';
import type { Config3, Machine3 } from '#fixturesData';

import type { EmptyObject } from '@bemedev/decompose';

type TTConfig = ConfigFrom<Machine3>;

expectTypeOf<TTConfig>().toEqualTypeOf<Config3>();

type TTPrivate = PrivateContextFrom<Machine3>;
expectTypeOf<TTPrivate>().branded.toEqualTypeOf<{ data: string }>();

type TTC = ContextFrom<Machine3>;
expectTypeOf<TTC>().toEqualTypeOf<{ age: number }>();

type TTEm = EventsMapFrom<Machine3>;
expectTypeOf<TTEm>().branded.toEqualTypeOf<{
  EVENT: { password: string; username: string };
  EVENT2: boolean;
  EVENT3: { login: string; pwd: string };
}>();

type TTE = EventsFrom<Machine3>;
expectTypeOf<TTE>().toEqualTypeOf<
  | { type: 'machine$$init'; payload: EmptyObject }
  | { type: 'machine$$exceeded'; payload: EmptyObject }
  | { type: 'machine$$always'; payload: EmptyObject }
  | { type: 'EVENT2'; payload: boolean }
  | { type: 'EVENT'; payload: { password: string; username: string } }
  | { type: 'EVENT3'; payload: { login: string; pwd: string } }
  | { type: 'machine1::on::NEXT'; payload: boolean }
>();

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
