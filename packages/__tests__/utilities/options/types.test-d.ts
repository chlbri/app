import { createContract } from '@bemedev/app-contract';
import {
  createOptions,
  same,
  type AsyncAddons,
  type SyncAddons,
  type UtilityPair,
  type UtilityPlugin,
} from '@bemedev/app-options';
import { createMachine } from '@bemedev/app';

const config = {
  initial: 'idle',
  states: { idle: { on: { START: '/done' } }, done: {} },
} as const;

const syncContract = createContract(config, { sync: true });

const formatPlugin = {
  name: 'format',
  create: () => ({ format: same((value: number) => `#${value}`) }),
} satisfies UtilityPlugin;

declare module '@bemedev/app-options' {
  interface Addons<Ct> {
    report: UtilityPair<(value: number) => string, (value: number) => string>;
  }
}

expectTypeOf<SyncAddons<typeof syncContract>['report']>().toEqualTypeOf<
  (value: number) => string
>();

expectTypeOf<AsyncAddons<typeof syncContract>['report']>().toEqualTypeOf<
  (value: number) => string
>();

createOptions(syncContract)(({ report }) => {
  expectTypeOf(report).toEqualTypeOf<(value: number) => string>();
  return {};
});

const augmented = createMachine(config, { sync: true });

augmented.createOptions(({ report }) => {
  expectTypeOf(report).toEqualTypeOf<(value: number) => string>();
  return {};
});

const direct = createMachine(config, { sync: true, plugins: [formatPlugin] });

direct.createOptions(({ format }) => {
  expectTypeOf(format).toEqualTypeOf<(value: number) => string>();
  return {};
});

// @ts-expect-error - unknown helper on createOptions
createOptions(syncContract)(({ unknownHelper }) => ({}));

// @ts-expect-error - unknown helper on an augmented machine
augmented.createOptions(({ unknownHelper }) => ({}));

// @ts-expect-error - unknown helper on a machine with a direct plugin
direct.createOptions(({ unknownHelper }) => ({}));

test('#01 => utility typings', () => {
  expect(true).toBe(true);
});
