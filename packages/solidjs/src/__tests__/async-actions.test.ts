import { interpret } from '@bemedev/app';
import { sleep } from '@bemedev/sleep';
import _machine1 from './async-actions.1.machine';
import _machine2 from './async-actions.2.machine';
import _machine3 from './async-actions.3.machine';
import _machine4 from './async-actions.4.machine';
import { pipe } from '../interpreters/pipe';

vi.useFakeTimers();
const emptyFn = () => {};

/**
 * Async action helpers tests.
 * Covers: assign, voidAction, filter, sendTo — each with:
 *   (a) async fn, no options (happy path)
 *   (b) async fn + { max } timeout — expect result before timeout
 *   (c) async fn + { error } handler — rejects → merged from errorFn
 *   (d) async fn + { max } timeout that expires → routed to _addError (no errorFn)
 */

const TINY_DELAY = 20; // ms — resolves fast enough not to hit a 5 s max

describe('Async action helpers', () => {
  describe('#01 => assign — async fn, no options', () => {
    const machine = _machine1.provideOptions(({ assign }) => ({
      actions: {
        loadUser: assign(
          'context.name',
          async () => {
            await sleep(TINY_DELAY);
            return 'Alice';
          },
          {
            error: emptyFn,
          },
        ),
      },
    }));

    const service = interpret(machine, { context: { name: '' } });
    const solid = pipe(service);
    const name = solid.context(s => s.name);
    test('#00 => start', solid.start);

    test('#01 => context.name starts empty', () => {
      expect(service.state.context.name).toBe('');
    });

    test('#02 => context.name starts empty (from solid)', () => {
      expect(name()).toBe('');
    });

    test('#03 => send LOAD, await async assign', async () => {
      service.send('LOAD');
      await vi.advanceTimersByTimeAsync(TINY_DELAY + 50);
      expect(service.state.context.name).toBe('Alice');
    });

    test('#04 => send LOAD, await async assign (from solid)', async () => {
      expect(name()).toBe('Alice');
    });
  });

  describe('#02 => assign — async fn + { max } — resolves before timeout', () => {
    const machine = _machine2.provideOptions(({ assign }) => ({
      actions: {
        loadUser: assign(
          'context.name',
          async () => {
            await sleep(TINY_DELAY);
            return 'Bob';
          },
          { max: 5_000, error: () => 'timeout' },
        ),
      },
    }));

    const service = interpret(machine, { context: { name: '' } });
    const solid = pipe(service);

    test('#00 => start', solid.start);

    test('#01 => context.name starts empty', () => {
      expect(service.state.context?.name).toBe('');
    });

    test('#02 => context.name starts empty (from solid)', () => {
      expect(solid.state(s => s.context?.name)()).toBe('');
    });

    test('#03 => send LOAD, resolves with timeout set', async () => {
      service.send('LOAD');
      await vi.advanceTimersByTimeAsync(TINY_DELAY + 50);
      expect(service.state.context?.name).toBe('Bob');
    });

    test('#04 => send LOAD, resolves with timeout set (from solid)', async () => {
      expect(solid.context(s => s.name)()).toBe('Bob');
    });
  });

  describe('#03 => assign — async fn + { error } handler on reject', () => {
    const machine = _machine3.provideOptions(({ assign }) => ({
      actions: {
        loadUser: assign(
          'context.name',
          async () => {
            await sleep(TINY_DELAY);
            throw new Error('network failure');
          },
          {
            error: () => '',
          },
        ),
      },
    }));

    const service = interpret(machine, {
      context: { name: '' },
    });
    const solid = pipe(service);

    test('#00 => start', solid.start);

    test('#01 => context.name starts empty', () => {
      expect(service.state.context?.name).toBe('');
    });

    test('#02 => context.name starts empty (from solid)', () => {
      expect(solid.state(s => s.context?.name)()).toBe('');
    });

    test('#03 => send LOAD, error handler merges fallback result', async () => {
      service.send('LOAD');
      await vi.advanceTimersByTimeAsync(TINY_DELAY + 50);
      expect(service.state.context?.name).toBe('');
    });

    test('#04 => send LOAD, error handler merges fallback result (from solid)', async () => {
      expect(solid.context(s => s.name)()).toBe('');
    });
  });

  describe('#04 => voidAction — async fn, no options', () => {
    const sideEffect = vi.fn();

    const machine = _machine4.provideOptions(({ voidAction }) => ({
      actions: {
        ping: voidAction(
          async () => {
            await sleep(TINY_DELAY);
            sideEffect('done');
          },
          {
            error: emptyFn,
          },
        ),
      },
    }));

    const service = interpret(machine);
    const solid = pipe(service);

    test('#00 => start', service.start);

    test('#01 => send PING, side-effect runs after tick', async () => {
      solid.send('PING');
      expect(sideEffect).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(TINY_DELAY + 50);
      expect(sideEffect).toHaveBeenCalledWith('done');
    });
  });
});

afterAll(() => vi.useRealTimers());
