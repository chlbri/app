import { createConfig, createMachine, interpret } from '@bemedev/app';
import { type } from '@bemedev/typings';
import { describe, expect, test } from 'vitest';

describe('SyncMachine - guardBatch', () => {
  const config = createConfig({
    initial: 'idle',
    states: {
      idle: {
        on: {
          TEST_AND: {
            target: '/andSuccess',
            guards: 'checkAnd',
          },
          TEST_OR: {
            target: '/orSuccess',
            guards: 'checkOr',
          },
          TEST_COMPLEX: {
            target: '/complexSuccess',
            guards: 'checkComplex',
          },
        },
      },
      andSuccess: {},
      orSuccess: {},
      complexSuccess: {},
    },
  });

  const typings = {
    context: type({
      age: 'number',
      role: 'string',
      active: 'boolean',
    }),
    eventsMap: type({
      TEST_AND: 'never',
      TEST_OR: 'never',
      TEST_COMPLEX: 'never',
    }),
  } as const;

  const machine = createMachine(config, {
    ...typings,
    sync: true,
  }).provideOptions(({ guardBatch, isValue }) => ({
    guards: {
      checkAnd: guardBatch(
        isValue('context.role', 'admin'),
        isValue('context.active', true),
      ),
      checkOr: guardBatch(
        isValue('context.active', true),
        {
          or: [
            isValue('context.role', 'admin'),
            isValue('context.role', 'editor'),
          ],
        },
      ),
      checkComplex: guardBatch(
        ({ context }) => (context?.age ?? 0) >= 18,
        {
          or: [
            isValue('context.role', 'admin'),
            guardBatch(
              isValue('context.role', 'editor'),
              isValue('context.active', true),
            ),
          ],
        },
      ),
    },
  }));

  describe('#01 => checkAnd (AND logical gate)', () => {
    test('#01 => fails when one guard is false', () => {
      const service = interpret(machine, {
        context: { age: 20, role: 'admin', active: false },
      });
      service.start();
      service.send('TEST_AND');
      expect(service.state.value).toBe('idle');
    });

    test('#02 => succeeds when all guards are true', () => {
      const service = interpret(machine, {
        context: { age: 20, role: 'admin', active: true },
      });
      service.start();
      service.send('TEST_AND');
      expect(service.state.value).toBe('andSuccess');
    });
  });

  describe('#02 => checkOr (AND with OR member)', () => {
    test('#01 => fails when AND member is false', () => {
      const service = interpret(machine, {
        context: { age: 20, role: 'admin', active: false },
      });
      service.start();
      service.send('TEST_OR');
      expect(service.state.value).toBe('idle');
    });

    test('#02 => succeeds when first OR option matches', () => {
      const service = interpret(machine, {
        context: { age: 20, role: 'admin', active: true },
      });
      service.start();
      service.send('TEST_OR');
      expect(service.state.value).toBe('orSuccess');
    });

    test('#03 => succeeds when second OR option matches', () => {
      const service = interpret(machine, {
        context: { age: 20, role: 'editor', active: true },
      });
      service.start();
      service.send('TEST_OR');
      expect(service.state.value).toBe('orSuccess');
    });

    test('#04 => fails when no OR option matches', () => {
      const service = interpret(machine, {
        context: { age: 20, role: 'viewer', active: true },
      });
      service.start();
      service.send('TEST_OR');
      expect(service.state.value).toBe('idle');
    });
  });

  describe('#03 => checkComplex (nested guardBatch in OR)', () => {
    test('#01 => fails when age condition is not met', () => {
      const service = interpret(machine, {
        context: { age: 16, role: 'admin', active: true },
      });
      service.start();
      service.send('TEST_COMPLEX');
      expect(service.state.value).toBe('idle');
    });

    test('#02 => succeeds with first OR branch (admin)', () => {
      const service = interpret(machine, {
        context: { age: 25, role: 'admin', active: false },
      });
      service.start();
      service.send('TEST_COMPLEX');
      expect(service.state.value).toBe('complexSuccess');
    });

    test('#03 => succeeds with second OR branch (active editor)', () => {
      const service = interpret(machine, {
        context: { age: 30, role: 'editor', active: true },
      });
      service.start();
      service.send('TEST_COMPLEX');
      expect(service.state.value).toBe('complexSuccess');
    });

    test('#04 => fails with inactive editor', () => {
      const service = interpret(machine, {
        context: { age: 30, role: 'editor', active: false },
      });
      service.start();
      service.send('TEST_COMPLEX');
      expect(service.state.value).toBe('idle');
    });
  });
});
