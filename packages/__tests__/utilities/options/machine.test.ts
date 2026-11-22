import { createContract } from '@bemedev/app-contract';
import {
  configureOptions,
  same,
  type UtilityPair,
  type UtilityPlugin,
} from '@bemedev/app-options';
import { createMachine } from '@bemedev/app';
import { expectTypeOf } from 'vite-plus/test';

declare module '@bemedev/app-options' {
  interface Addons<Ct> {
    count: UtilityPair<() => number, () => number>;
  }
}

describe('TESTS', () => {
  const config = {
    initial: 'idle',
    states: { idle: { on: { START: '/done' } }, done: {} },
  } as const;

  const syncContract = createContract(config, { sync: true });

  const twicePlugin = {
    name: 'twice',
    create: () => ({ twice: same((value: number) => value * 2) }),
  } satisfies UtilityPlugin;

  const countPlugin = {
    name: 'count',
    create: () => ({ count: same(() => 0) }),
  } satisfies UtilityPlugin;

  afterEach(() => configureOptions());

  describe('#01 => utility added directly to a machine', () => {
    test('#01 => sync implementation', () => {
      const machine = createMachine(config, { sync: true, plugins: [twicePlugin] });

      const options = machine.createOptions(({ twice }) => ({
        actions: { doubled: twice(3) as any },
      }));

      expect(options.actions!.doubled).toBe(6);
    });

    test('#02 => sync typings', () => {
      const machine = createMachine(config, { sync: true, plugins: [twicePlugin] });

      machine.createOptions(({ twice }) => {
        expectTypeOf(twice).toEqualTypeOf<(value: number) => number>();
        return {};
      });
    });

    test('#03 => async implementation and typings', () => {
      const machine = createMachine(config, { plugins: [twicePlugin] });

      const options = machine.createOptions(({ twice }) => {
        expectTypeOf(twice).toEqualTypeOf<(value: number) => number>();
        return { actions: { doubled: twice(5) as any } };
      });

      expect(options.actions!.doubled).toBe(10);
    });

    test('#04 => provideOptions keeps the utility', () => {
      const machine = createMachine(config, { sync: true, plugins: [twicePlugin] });

      const next = machine.provideOptions(({ twice }) => ({
        actions: { doubled: twice(4) as any },
      }));

      expect(next.actions!.doubled).toBe(8);
    });
  });

  describe('#02 => utility added to the machine through Addons augmentation', () => {
    test('#01 => implementation', () => {
      configureOptions(countPlugin);

      const machine = createMachine(config, { sync: true });

      const options = machine.createOptions(({ count }) => ({
        actions: { value: count() as any },
      }));

      expect(options.actions!.value).toBe(0);
    });

    test('#02 => typings without a plugin tuple', () => {
      configureOptions(countPlugin);

      const machine = createMachine(config, { sync: true });

      machine.createOptions(({ count }) => {
        expectTypeOf(count).toEqualTypeOf<() => number>();
        return {};
      });
    });

    test('#03 => typing remains available from a contract machine', () => {
      configureOptions(countPlugin);

      const machine = createMachine(syncContract);

      machine.createOptions(({ count }) => {
        expectTypeOf(count).toEqualTypeOf<() => number>();
        return {};
      });
    });

    test('#04 => async machines remap the augmented addons too', () => {
      configureOptions(countPlugin);

      const machine = createMachine(config, {});

      machine.createOptions(({ count }) => {
        expectTypeOf(count).toEqualTypeOf<() => number>();
        return {};
      });
    });
  });
});
