import { createContract, type SyncAction2 } from '@bemedev/app-contract';
import {
  createOptions,
  same,
  type AsyncAddons,
  type OptionsHelpers,
  type SyncAddons,
  type UtilityPlugin,
} from '@bemedev/app-options';
import { createMachine } from '@bemedev/app';

const config = {
  initial: 'idle',
  states: { idle: { on: { START: '/done' } }, done: {} },
} as const;

const syncContract = createContract(config, { sync: true });
const asyncContract = createContract(config, {});

const doublePlugin = {
  name: 'double',
  create: () => ({ double: same((value: number) => value * 2) }),
} satisfies UtilityPlugin;

const otherPlugin = {
  name: 'other',
  create: () => ({ other: same((value: string) => value.length) }),
} satisfies UtilityPlugin;

expectTypeOf<OptionsHelpers<typeof syncContract, 'sync'>>().toEqualTypeOf<
  SyncAddons<typeof syncContract>
>();

expectTypeOf<OptionsHelpers<typeof asyncContract, 'async'>>().toEqualTypeOf<
  AsyncAddons<typeof asyncContract>
>();

createOptions(syncContract)(({ assign, isValue }) => {
  const action = assign('context.count', () => 0);
  expectTypeOf(action).toExtend<SyncAction2<typeof syncContract>>();
  expectTypeOf(isValue).toBeFunction();
  return {};
});

createOptions(
  syncContract,
  otherPlugin,
)(({ other, assign }) => {
  expectTypeOf(other).toEqualTypeOf<(value: string) => number>();
  expectTypeOf(assign).toBeFunction();
  return {};
});

const quadruplePlugin = {
  name: 'quadruple',
  requires: ['double'],
  create: ({ utilities }: any) => ({
    quadruple: same((value: number): number => utilities.double.sync(value)),
  }),
} satisfies UtilityPlugin;

createOptions(syncContract).use(
  quadruplePlugin,
  doublePlugin,
)(({ quadruple }) => {
  expectTypeOf(quadruple).toEqualTypeOf<(value: number) => number>();
  return {};
});

createOptions(syncContract).use(doublePlugin).use(otherPlugin)(
  ({ double, other }) => {
    expectTypeOf(double).toEqualTypeOf<(value: number) => number>();
    expectTypeOf(other).toEqualTypeOf<(value: string) => number>();
    return {};
  },
);

createOptions(syncContract).use(
  doublePlugin,
  otherPlugin,
)(({ double, other }) => {
  expectTypeOf(double).toEqualTypeOf<(value: number) => number>();
  expectTypeOf(other).toEqualTypeOf<(value: string) => number>();
  return {};
});

// @ts-expect-error - an unknown helper must not compile
createOptions(syncContract)(({ unknownHelper }) => ({}));

const machine = createMachine(config, { sync: true, plugins: [otherPlugin] });

machine.createOptions(({ other }) => {
  expectTypeOf(other).toEqualTypeOf<(value: string) => number>();
  return {};
});

const asyncMachine = createMachine(config, { plugins: [otherPlugin] });

asyncMachine.createOptions(({ other }) => {
  expectTypeOf(other).toEqualTypeOf<(value: string) => number>();
  return {};
});

test('#01 => plugin helpers are typed', () => {
  expect(true).toBe(true);
});
