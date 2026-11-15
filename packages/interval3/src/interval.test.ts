import { sleep } from '@bemedev/sleep';
import * as helpers from './helpers';
import {
  create,
  createInterval,
  createInterval3,
  type PauserListener,
} from './index';

describe('TESTS', () => {
  describe('#01 => Interval3 configuration', () => {
    const interval = () => 100;
    const callback = vi.fn();
    const timer = createInterval3({ id: 'config', interval, callback });

    test('#01 => exposes the id', () => expect(timer.id).toBe('config'));

    test('#02 => exposes the callback', () => expect(timer.callback).toBe(callback));

    test('#03 => exposes the interval computer', () =>
      expect(timer.interval).toBe(interval));

    test('#04 => defaults maxTicks to 10_000', () =>
      expect(timer.maxTicks).toBe(10_000));

    test('#05 => defaults pauser to undefined', () =>
      expect(timer.pauser).toBeUndefined());

    test('#06 => starts with zero ticks', () => expect(timer.ticks).toBe(0));

    test('#07 => starts idle', () => expect(timer.state).toBe('idle'));

    test('#08 => starts unsubscribed', () => expect(timer.subscribed).toBe(false));

    test('#09 => clamps maxTicks to one', () =>
      expect(
        createInterval3({ id: 'clamp', interval, callback, maxTicks: 0 }).maxTicks,
      ).toBe(1));

    test('#10 => aliases the factory', () => {
      expect(create).toBe(createInterval3);
      expect(createInterval).toBe(createInterval3);
    });
  });

  describe('#02 => recomputes the delay on every pass', () => {
    beforeAll(() => {
      vi.useFakeTimers();
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    const delays = [100, 300, 50];
    const interval = vi.fn(() => delays.shift() ?? 1_000);
    const callback = vi.fn();
    const timer = createInterval3({ id: 'dynamic', interval, callback });

    test('#01 => computes the delay before the first pass', () => {
      timer.start();
      expect(interval).toHaveBeenCalledTimes(1);
    });

    test('#02 => does not call the callback before the delay', async () => {
      await vi.advanceTimersByTimeAsync(99);
      expect(callback).not.toHaveBeenCalled();
    });

    test('#03 => calls the callback after the first delay', async () => {
      await vi.advanceTimersByTimeAsync(1);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(timer.ticks).toBe(1);
    });

    test('#04 => recomputes the delay for the second pass', () => {
      expect(interval).toHaveBeenCalledTimes(2);
    });

    test('#05 => honors the second delay', async () => {
      await vi.advanceTimersByTimeAsync(299);
      expect(callback).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(1);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    test('#06 => honors the third delay', async () => {
      await vi.advanceTimersByTimeAsync(49);
      expect(callback).toHaveBeenCalledTimes(2);

      await vi.advanceTimersByTimeAsync(1);
      expect(callback).toHaveBeenCalledTimes(3);
    });

    test('#07 => uses one delay per callback', () =>
      expect(interval).toHaveBeenCalledTimes(4));
  });

  describe('#03 => pause and resume', () => {
    beforeAll(() => {
      vi.useFakeTimers();
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    const interval = vi.fn(() => 100);
    const callback = vi.fn();
    const timer = createInterval3({ id: 'pause', interval, callback });

    test('#01 => starts active', () => expect(timer.start()).toBe('active'));

    test('#02 => ticks once', async () => {
      await vi.advanceTimersByTimeAsync(100);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('#03 => pauses', () => expect(timer.pause()).toBe('paused'));

    test('#04 => pause is idempotent', () => expect(timer.pause()).toBe('paused'));

    test('#05 => discards the pending pass', async () => {
      await vi.advanceTimersByTimeAsync(1_000);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(timer.ticks).toBe(1);
    });

    test('#06 => resumes', () => expect(timer.resume()).toBe('active'));

    test('#07 => waits for a fresh delay', async () => {
      await vi.advanceTimersByTimeAsync(99);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('#08 => ticks after the fresh delay', async () => {
      await vi.advanceTimersByTimeAsync(1);
      expect(callback).toHaveBeenCalledTimes(2);
      expect(timer.ticks).toBe(2);
    });
  });

  describe('#04 => maxTicks', () => {
    beforeAll(() => {
      vi.useFakeTimers();
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    const callback = vi.fn();
    const timer = createInterval3({
      id: 'max-ticks',
      interval: () => 100,
      callback,
      maxTicks: 3,
    });

    test('#01 => starts', () => expect(timer.start()).toBe('active'));

    test('#02 => pauses after the maximum ticks', async () => {
      await vi.advanceTimersByTimeAsync(300);
      expect(callback).toHaveBeenCalledTimes(3);
      expect(timer.ticks).toBe(3);
      expect(timer.state).toBe('paused');
    });

    test('#03 => stops calling the callback', async () => {
      await vi.advanceTimersByTimeAsync(1_000);
      expect(callback).toHaveBeenCalledTimes(3);
    });

    test('#04 => can be resumed', async () => {
      expect(timer.resume()).toBe('active');

      await vi.advanceTimersByTimeAsync(100);
      expect(callback).toHaveBeenCalledTimes(4);
      expect(timer.state).toBe('paused');
    });
  });

  describe('#05 => pauser', () => {
    beforeAll(() => {
      vi.useFakeTimers();
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    const callback = vi.fn();
    const pauser = vi.fn<PauserListener>((_state, ticks) => ticks >= 2);
    const timer = createInterval3({
      id: 'pauser',
      interval: () => 50,
      callback,
      pauser,
    });

    test('#01 => starts', () => expect(timer.start()).toBe('active'));

    test('#02 => receives the state and ticks', async () => {
      await vi.advanceTimersByTimeAsync(100);
      expect(pauser).toHaveBeenNthCalledWith(1, 'active', 0);
      expect(pauser).toHaveBeenNthCalledWith(2, 'active', 1);
    });

    test('#03 => pauses when truthy', () => {
      expect(timer.state).toBe('paused');
      expect(callback).toHaveBeenCalledTimes(2);
    });

    test('#04 => stays paused', async () => {
      await vi.advanceTimersByTimeAsync(1_000);
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('#06 => subscriptions', () => {
    beforeAll(() => {
      vi.useFakeTimers();
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    const listener = vi.fn();
    const other = vi.fn();
    const timer = createInterval3({
      id: 'subscribe',
      interval: () => 100,
      callback: () => {},
    });

    test('#01 => subscription is flagged', () => {
      timer.subscribe(listener);
      expect(timer.subscribed).toBe(true);
    });

    test('#02 => does not notify on subscription', () =>
      expect(listener).not.toHaveBeenCalled());

    test('#03 => notifies on start', () => {
      timer.start();
      expect(listener).toHaveBeenLastCalledWith('active', 0);
    });

    test('#04 => notifies on tick', async () => {
      await vi.advanceTimersByTimeAsync(100);
      expect(listener).toHaveBeenLastCalledWith('active', 1);
    });

    test('#05 => notifies on pause', () => {
      timer.pause();
      expect(listener).toHaveBeenLastCalledWith('paused', 1);
    });

    test('#06 => unsubscribes one listener', () => {
      const unsubscribe = timer.subscribe(other);
      expect(unsubscribe()).toBe(true);
      expect(timer.subscribed).toBe(true);
      expect(other).not.toHaveBeenCalled();
    });

    test('#07 => unsubscribes the last listener', () => {
      const unsubscribe = timer.subscribe(listener);
      expect(unsubscribe()).toBe(true);
      expect(timer.subscribed).toBe(false);
    });

    test('#08 => does not notify after unsubscribe', async () => {
      timer.resume();
      await vi.advanceTimersByTimeAsync(100);
      expect(listener).toHaveBeenLastCalledWith('paused', 1);
      expect(listener).toHaveBeenCalledTimes(3);
    });
  });

  describe('#07 => renew', () => {
    const interval = () => 100;
    const callback = vi.fn();
    const timer = createInterval3({ id: 'renew', interval, callback });

    test('#01 => changes the id', () =>
      expect(timer.renew({ id: 'renew-2' }).id).toBe('renew-2'));

    test('#02 => keeps the id', () =>
      expect(timer.renew({ id: 'renew' }).id).toBe('renew'));

    test('#03 => changes the interval computer', () => {
      const next = () => 500;
      expect(timer.renew({ id: 'renew', interval: next }).interval).toBe(next);
    });

    test('#04 => keeps the interval computer', () =>
      expect(timer.renew({ id: 'renew' }).interval).toBe(interval));

    test('#05 => changes maxTicks', () =>
      expect(timer.renew({ id: 'renew', maxTicks: 50 }).maxTicks).toBe(50));

    test('#06 => keeps maxTicks', () =>
      expect(timer.renew({ id: 'renew' }).maxTicks).toBe(10_000));

    test('#07 => changes the pauser', () => {
      const pauser = () => false;
      expect(timer.renew({ id: 'renew', pauser }).pauser).toBe(pauser);
    });

    test('#08 => keeps the pauser', () =>
      expect(timer.renew({ id: 'renew' }).pauser).toBeUndefined());

    test('#09 => changes the callback', () => {
      const next = vi.fn();
      expect(timer.renew({ id: 'renew', callback: next }).callback).toBe(next);
    });

    test('#10 => keeps the callback', () =>
      expect(timer.renew({ id: 'renew' }).callback).toBe(callback));
  });

  describe('#08 => dispose', () => {
    beforeAll(() => {
      vi.useFakeTimers();
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    const callback = vi.fn();
    const timer = createInterval3({ id: 'dispose', interval: () => 100, callback });

    test('#01 => starts and ticks', async () => {
      timer.start();
      await vi.advanceTimersByTimeAsync(100);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('#02 => disposes asynchronously', async () => {
      await timer[Symbol.asyncDispose]();
      expect(timer.state).toBe('disposed');
      expect(timer.subscribed).toBe(false);
    });

    test('#03 => does not restart', async () => {
      expect(timer.start()).toBe('disposed');
      expect(timer.pause()).toBe('disposed');
      expect(timer.resume()).toBe('disposed');

      await vi.advanceTimersByTimeAsync(1_000);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('#04 => disposes synchronously', () => {
      const sync = createInterval3({
        id: 'sync-dispose',
        interval: () => 100,
        callback: () => {},
      });

      sync[Symbol.dispose]();
      expect(sync.state).toBe('disposed');
    });
  });

  describe('#09 => helpers', () => {
    test('#01 => re-exports sleep', () => expect(helpers.sleep).toBe(sleep));
  });
});
