import { interpret } from '@bemedev/app';
import _machine1 from './index.1.machine';
import _machine2 from './index.2.machine';

beforeAll(() => {
  vi.useFakeTimers();
});

describe('Self Transitions', () => {
  const DELAY = 1000;

  describe('#01 => should handle after self transitions', () => {
    const machine = _machine1;

    machine.addOptions(() => ({ delays: { DELAY } }));

    const service = interpret(machine);

    test('#01 => start', () => {
      service.start();
    });

    test('#02 => value is idle', () =>
      expect(service.value).toEqual('idle'));

    test('#03 => advance timer', async () => {
      await vi.advanceTimersByTimeAsync(DELAY);
    });

    test('#04 => value is active', () =>
      expect(service.value).toEqual('active'));
  });

  describe('#02 => should handle always self transitions', () => {
    const machine = _machine2;

    const service = interpret(machine);

    test('#01 => start', () => {
      service.start();
    });

    test('#02 => advance timer', async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    test('#03 => value is active', () =>
      expect(service.value).toEqual('active'));
  });
});

afterAll(() => vi.useRealTimers());
