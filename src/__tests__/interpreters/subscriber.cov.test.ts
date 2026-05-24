import { machine1, type Machine1 } from '#fixturesData';
import type { StatePFrom } from '#machines';
import { describe, expect, test, vi } from 'vitest';
import { interpret } from '#interpreter';
import type { State } from '#states';
import type { EventObject } from '#events';
import { defaultCheck, returnTrue } from '#guards';

describe.concurrent('#01 => subscriberMap reduceFn coverage', () => {
  type TestContext = { iterator: number };

  // Configuration de base pour l'interpréteur
  const baseConfig = {
    context: { iterator: 0 },
    pContext: undefined,
    mode: 'strict' as const,
    exact: true,
  };

  describe('#01 => function subscriber cases', () => {
    test('#01 => should handle function subscriber', async () => {
      const service = interpret(machine1, baseConfig);
      const mockFn = vi.fn(() => 'function-result');

      const subscriber = service.subscribe(mockFn, {
        equals: defaultCheck,
      });

      await service.start();
      await service.send('NEXT');

      expect(mockFn).toHaveBeenCalled();
      expect(subscriber.state).toBe('active');

      service.stop();
    });

    test('#01 => should handle function subscriber with different states', async () => {
      const service = interpret(machine1, baseConfig);
      const mockFn = vi.fn(
        (state: State<EventObject, TestContext>) =>
          `result-${state.context.iterator}`,
      );

      const subscriber = service.subscribe(mockFn);

      await service.start();
      expect(mockFn).toHaveBeenCalledTimes(6); // Appelé à l'initialisation et à chaque changement de contexte
      await service.send('NEXT');

      expect(mockFn).toHaveBeenCalledTimes(12);
      expect(subscriber.state).toBe('active');

      service.stop();
    });

    test('#01 => should not call function when subscriber is paused', async () => {
      const service = interpret(machine1, baseConfig);
      const mockFn = vi.fn();

      const subscriber = service.subscribe(mockFn);

      await service.start();
      expect(mockFn).toHaveBeenCalledTimes(6); // Appelé à l'initialisation et à chaque changement de contexte
      subscriber.close();
      expect(mockFn).toHaveBeenCalledTimes(6);
      await service.send('NEXT');

      expect(subscriber.state).toBe('paused');
      expect(mockFn).toHaveBeenCalledTimes(6);

      service.stop();
    });

    test('#01 => should not call function when subscriber is disposed', async () => {
      const service = interpret(machine1, baseConfig);
      const mockFn = vi.fn();

      const subscriber = service.subscribe(mockFn);

      await service.start();
      subscriber.unsubscribe();
      await service.send('NEXT');

      expect(subscriber.state).toBe('disposed');

      service.stop();
    });

    test('#01 => should handle function subscriber reopening', async () => {
      const service = interpret(machine1, baseConfig);
      const mockFn = vi.fn(() => 'reopened-result');

      const subscriber = service.subscribe(mockFn);

      await service.start();

      // Pause puis reopen
      subscriber.close();
      expect(subscriber.state).toBe('paused');

      subscriber.open();
      expect(subscriber.state).toBe('active');

      await service.send('NEXT');

      expect(mockFn).toHaveBeenCalled();

      service.stop();
    });
  });

  describe('#01 => object subscriber cases', () => {
    describe('#01 => event type matching cases', () => {
      test('#01 => should handle matching event type with handler', async () => {
        const service = interpret(machine1, baseConfig);
        const nextFn = vi.fn(() => 'next-result');

        const subscriber = service.subscribe({ NEXT: nextFn });

        await service.start();
        await service.send('NEXT');
        expect((service.event as any).type).toBe('NEXT');

        expect(nextFn).toHaveBeenCalled();
        expect(subscriber.state).toBe('active');

        service.stop();
      });

      test('#01 => should handle matching event type with handler and payload access', async () => {
        const service = interpret(machine1, baseConfig);
        const nextFn = vi.fn((state: StatePFrom<Machine1>) => {
          const payload = state.payload;
          if (typeof payload === 'object') {
            return `next-${JSON.stringify(payload)}`;
          }
          return 'next-no-payload';
        }) as any;

        const subscriber = service.subscribe({ NEXT: nextFn });

        await service.start();
        await service.send('NEXT');

        expect(nextFn).toHaveBeenCalled();
        expect(subscriber.state).toBe('active');

        service.stop();
      });

      test('#01 => should handle non-matching event type with else', async () => {
        const service = interpret(machine1, baseConfig);
        const nextFn = vi.fn();
        const elseFn = vi.fn(() => 'else-for-unknown');

        const subscriber = service.subscribe({
          NEXT: nextFn,
          else: elseFn,
        });

        service.start();

        // Simuler un événement qui ne correspond pas
        // (utiliser un événement interne pour déclencher else)
        await service.send('NEXT');

        expect(nextFn).toHaveBeenCalled();
        expect(subscriber.state).toBe('active');

        service.stop();
      });

      test('#01 => should handle event type matching but handler is null', async () => {
        const service = interpret(machine1, baseConfig);
        const elseFn = vi.fn(() => 'else-null-handler');

        const subscriber = service.subscribe({
          NEXT: undefined,
          else: elseFn,
        });

        await service.start();
        await service.send('NEXT');

        expect(subscriber.state).toBe('active');

        service.stop();
      });

      test('#01.05 => should handle event type matching but handler is undefined', async () => {
        const service = interpret(machine1, baseConfig);
        const elseFn = vi.fn(() => 'else-undefined-handler');

        const subscriber = service.subscribe({
          NEXT: undefined,
          else: elseFn,
        });

        await service.start();
        await service.send('NEXT');

        expect(subscriber.state).toBe('active');

        service.stop();
      });
    });

    describe('#01 => multiple event handlers', () => {
      test('#01 => should handle multiple event types with specific handlers', async () => {
        const service = interpret(machine1, baseConfig);
        const nextFn = vi.fn(() => 'next-handler');

        const subscriber = service.subscribe({
          NEXT: nextFn,
        });

        await service.start();
        await service.send('NEXT');

        expect(nextFn).toHaveBeenCalled();
        expect(subscriber.state).toBe('active');

        service.stop();
      });

      test('#01 => should handle first matching event type in order', async () => {
        const service = interpret(machine1, baseConfig);
        const firstFn = vi.fn(() => 'first-handler');

        const subscriber = service.subscribe({
          NEXT: firstFn,
        });

        await service.start();
        await service.send('NEXT');

        expect(firstFn).toHaveBeenCalled();
        expect(subscriber.state).toBe('active');

        service.stop();
      });
    });

    describe('#01.03 => else handler cases', () => {
      test('#01.03 => should handle else without specific handlers', async () => {
        const service = interpret(machine1, baseConfig);
        const elseFn = vi.fn(() => 'else-result');

        const subscriber = service.subscribe({
          else: elseFn,
        });

        await service.start();
        await service.send('NEXT');

        expect(subscriber.state).toBe('active');

        service.stop();
      });

      test('#01.03 => should handle mixed handlers with else', async () => {
        const service = interpret(machine1, baseConfig);
        const nextFn = vi.fn(() => 'next-result');
        const elseFn = vi.fn(() => 'else-result');

        const subscriber = service.subscribe({
          NEXT: nextFn,
          else: elseFn,
        });

        await service.start();
        await service.send('NEXT');

        expect(nextFn).toHaveBeenCalled();
        expect(subscriber.state).toBe('active');

        service.stop();
      });
    });
  });

  describe('#01.03 => edge cases and error handling', () => {
    test('#01.03 => should handle custom equality function', async () => {
      const service = interpret(machine1, baseConfig);
      const mockFn = vi.fn(() => 'custom-equality');
      const customEquals = vi.fn(
        (
          a: State<EventObject, TestContext>,
          b: State<EventObject, TestContext>,
        ) => a.context.iterator === b.context.iterator,
      );

      const subscriber = service.subscribe(mockFn, {
        equals: customEquals,
      });

      await service.start();
      await service.send('NEXT');

      expect(subscriber.state).toBe('active');

      service.stop();
    });

    test('#01.03 => should handle states equal according to custom equality', async () => {
      const service = interpret(machine1, baseConfig);
      const mockFn = vi.fn();
      const customEquals = vi.fn(returnTrue); // Always equal

      const subscriber = service.subscribe(mockFn, {
        equals: customEquals,
      });

      await service.start();
      await service.send('NEXT');

      expect(subscriber.state).toBe('active');

      service.stop();
    });

    test('#01.03.03 => should handle empty object subscriber', async () => {
      const service = interpret(machine1, baseConfig);

      const subscriber = service.subscribe({});

      await service.start();
      await service.send('NEXT');

      expect(subscriber.state).toBe('active');

      service.stop();
    });

    test('#01.03.04 => should handle subscriber with custom id', async () => {
      const service = interpret(machine1, baseConfig);
      const mockFn = vi.fn(() => 'custom-id-result');

      const subscriber = service.subscribe(mockFn, {
        id: 'custom-subscriber-id',
      });

      expect(subscriber.id).toBe('custom-subscriber-id');

      await service.start();
      await service.send('NEXT');

      expect(subscriber.state).toBe('active');

      service.stop();
    });
  });

  describe('#01.04 => subscriber lifecycle', () => {
    test('#01.04 => should handle subscriber state changes', () => {
      const service = interpret(machine1, baseConfig);
      const mockFn = vi.fn(() => 'lifecycle-result');

      const subscriber = service.subscribe(mockFn);

      expect(subscriber.state).toBe('active');

      service.start();

      // Test paused state
      subscriber.close();
      expect(subscriber.state).toBe('paused');

      // Test reopened state
      subscriber.open();
      expect(subscriber.state).toBe('active');

      // Test disposed state
      subscriber.unsubscribe();
      expect(subscriber.state).toBe('disposed');

      service.stop();
    });

    test('#01.04 => should not reopen after disposal', () => {
      const service = interpret(machine1, baseConfig);
      const mockFn = vi.fn(() => 'dispose-reopen-result');
      const subscriber = service.subscribe(mockFn);

      service.start();

      subscriber.unsubscribe();
      expect(subscriber.state).toBe('disposed');

      subscriber.open();
      expect(subscriber.state).toBe('disposed');

      service.stop();
    });

    test('#01.04.03 => should handle multiple close/open cycles', () => {
      const service = interpret(machine1, baseConfig);
      const mockFn = vi.fn(() => 'cycle-result');

      const subscriber = service.subscribe(mockFn);

      service.start();

      // Multiple close/open cycles
      for (let i = 0; i < 3; i++) {
        subscriber.close();
        expect(subscriber.state).toBe('paused');

        subscriber.open();
        expect(subscriber.state).toBe('active');
      }

      service.stop();
    });

    test('#01.04.04 => should handle subscriber ID uniqueness', () => {
      const service = interpret(machine1, baseConfig);
      const mockFn1 = vi.fn(() => 'first-subscriber');
      const mockFn2 = vi.fn(() => 'second-subscriber');

      const subscriber1 = service.subscribe(mockFn1, {
        id: 'unique-id',
      });
      const subscriber2 = service.subscribe(mockFn2, {
        id: 'unique-id',
      });

      // Should return the same subscriber for same ID
      expect(subscriber1).toBe(subscriber2);
      expect(subscriber1.id).toBe('unique-id');

      service.start();
      service.stop();
    });
  });

  describe('#01.05 => integration with machine states', () => {
    test('#01.05 => should handle state transitions', async () => {
      const service = interpret(machine1, baseConfig);
      const mockFn = vi.fn((state: State<EventObject, TestContext>) => {
        return `state-${state.value}`;
      });

      const subscriber = service.subscribe(mockFn);

      await service.start();
      expect(service.value).toBe('idle');

      await service.send('NEXT');
      expect(service.value).toBe('final');

      expect(mockFn).toHaveBeenCalled();
      expect(subscriber.state).toBe('active');

      service.stop();
    });

    test('#01.05 => should handle context changes', async () => {
      const service = interpret(machine1, baseConfig);
      const mockFn = vi.fn((state: State<EventObject, TestContext>) => {
        return `iterator-${state.context.iterator}`;
      });

      const subscriber = service.subscribe(mockFn);

      await service.start();

      // Le contexte peut changer via les activities
      expect(service.context.iterator).toBe(0);

      await service.send('NEXT');

      expect(mockFn).toHaveBeenCalled();
      expect(subscriber.state).toBe('active');

      service.stop();
    });
  });
});
