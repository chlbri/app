import { createContract } from '@bemedev/app-contract';
import { createUtilities, same } from '@bemedev/app-options';
import { createMachine } from '@bemedev/app';
import { expectTypeOf } from 'vite-plus/test';

describe('TESTS', () => {
  const config = {
    initial: 'idle',
    states: { idle: { on: { START: '/done' } }, done: {} },
  } as const;

  const syncContract = createContract(config, { sync: true });

  const twicePlugin = createUtilities({}, () => ({
    twice: same((value: number) => value * 2),
  }));

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

  describe('#02 => contract machine', () => {
    test('#01 => exposes the built-in helpers', () => {
      const machine = createMachine(syncContract);

      const options = machine.createOptions(({ guardBatch }) => ({
        guards: { check: guardBatch(() => true) as any },
      }));

      expect(typeof options.guards!.check).toBe('function');
    });

    test('#02 => typings', () => {
      const machine = createMachine(syncContract);

      machine.createOptions(({ isDefined, assign }) => {
        expectTypeOf(isDefined).toBeFunction();
        expectTypeOf(assign).toBeFunction();
        return {};
      });
    });
  });
});
