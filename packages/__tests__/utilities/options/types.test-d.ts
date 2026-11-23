import { createContract } from '@bemedev/app-contract';
import {
  createOptions,
  createUtilities,
  same,
  type AsyncAddons,
  type SyncAddons,
} from '@bemedev/app-options';
import { createMachine } from '@bemedev/app';

const config = {
  initial: 'idle',
  states: { idle: { on: { START: '/done' } }, done: {} },
} as const;

const syncContract = createContract(config, { sync: true });

const formatPlugin = createUtilities({}, () => ({
  format: same((value: number) => `#${value}`),
}));

expectTypeOf<SyncAddons<typeof syncContract>['assign']>().toBeFunction();

expectTypeOf<AsyncAddons<typeof syncContract>['assign']>().toBeFunction();

createOptions(
  syncContract,
  formatPlugin,
)(({ format }) => {
  expectTypeOf(format).toEqualTypeOf<(value: number) => string>();
  return {};
});

const direct = createMachine(config, { sync: true, plugins: [formatPlugin] });

direct.createOptions(({ format }) => {
  expectTypeOf(format).toEqualTypeOf<(value: number) => string>();
  return {};
});

// @ts-expect-error - unknown helper on createOptions
createOptions(syncContract)(({ unknownHelper }) => ({}));

// @ts-expect-error - unknown helper on a machine with a direct plugin
direct.createOptions(({ unknownHelper }) => ({}));

test('#01 => utility typings', () => {
  expect(true).toBe(true);
});
