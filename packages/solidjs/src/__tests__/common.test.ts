import { interpret } from '@bemedev/app';
import { pipe } from '../interpreters/pipe';
import _machine from './common.machine';

vi.useFakeTimers();
vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('SolidInterpreter (common.ts) comprehensive coverage', () => {
  const machine = _machine.provideOptions(({ assign }) => ({
    actions: {
      increment: assign('context', ({ context }) => ({
        count: context.count + 1,
      })),
    },
  }));

  describe('Basic signals, getters and transitions', () => {
    const service = interpret(machine, { context: { count: 0 } });
    const solid = pipe(service);
    const subFn = vi.fn();
    const countMemo = solid.context();
    const valueMemo = solid.value();
    const tagsMemo = solid.tags();
    const dpsMemo = solid.dps();
    const isIdle = solid.matches('idle');
    const containsIdle = solid.contains('idle', 'active');
    const isActive = solid.matches('active', 'active/speed_low');
    const matchesSpeedLow = solid.matches('active/speed_low');
    const containsSpeedHigh = solid.contains('active/speed_high', 'idle');

    let sub: any;

    test('#00 => subscribe & start', () => {
      sub = solid.subscribe(subFn);
      solid.start();
      expect(subFn).toHaveBeenCalled();
      expect(solid.status()()).toBe('working');
    });

    test('#01 => pause & resume', () => {
      solid.pause();
      expect(solid.status()()).toBe('busy');
      solid.resume();
      expect(solid.status()()).toBe('working');
    });

    test('#02 => getters/signals', () => {
      expect(countMemo()).toEqual({ count: 0 });
      expect(valueMemo()).toEqual('idle');
      expect(tagsMemo()).toEqual(['idle_tag']);
      expect(dpsMemo()).toEqual(['idle']);
    });

    test('#03 => matches, contains, hasTags', () => {
      expect(isIdle()).toBe(true);
      expect(containsIdle()).toBe(true);
      expect(solid.hasTags('idle_tag')).toBe(true);
      expect(solid.hasTags('non_existent' as any)).toBe(false);
    });

    test('#04 => transition to active', () => {
      solid.send('START');
      expect(valueMemo()).toEqual({ active: 'speed_low' });
      expect(solid.hasTags('active_tag')).toBe(true);
      expect(solid.hasTags('low_tag')).toBe(true);
      expect(isActive()).toBe(true);
      expect(matchesSpeedLow()).toBe(true);
      expect(containsSpeedHigh()).toBe(false);
    });

    test('#05 => trigger action', () => {
      solid.send('INC');
      expect(countMemo()).toEqual({ count: 1 });
    });

    test('#06 => stop & dispose', () => {
      sub.unsubscribe();
      solid.stop();
      expect(solid.status()()).toBe('stopped');
      solid.dispose();
    });
  });

  describe('Watcher and reducer', () => {
    const service = interpret(machine, { context: { count: 10 } });
    const solid = pipe(service);
    const valueWatcher = solid.watcher(state => state.value);
    const valSignal = valueWatcher();
    const contextReducer = solid.reducer(state => state.context);
    const countMemo = contextReducer(ctx => ctx.count);

    test('#00 => watcher and reducer initial values', () => {
      solid.start();
      expect(valSignal()).toBe('idle');
      expect(countMemo()).toBe(10);
    });

    test('#01 => watcher and reducer values after transition', () => {
      solid.send('START');
      expect(valSignal()).toEqual({ active: 'speed_low' });

      solid.send('INC');
      expect(countMemo()).toBe(11);
      solid.dispose();
    });
  });

  describe('Symbol.dispose and Symbol.asyncDispose', () => {
    const service1 = interpret(machine, { context: { count: 0 } });
    const solidDisposeCall = pipe(service1);

    const service2 = interpret(machine, { context: { count: 0 } });
    const solidAsyncDisposeCall = pipe(service2);

    test('#00 => Symbol.dispose', () => {
      solidDisposeCall.start();
      expect(solidDisposeCall.status()()).toBe('working');
      solidDisposeCall[Symbol.dispose]();
      expect(() => solidDisposeCall.status()()).toThrow(TypeError);
    });

    test('#01 => Symbol.asyncDispose', async () => {
      solidAsyncDisposeCall.start();
      expect(solidAsyncDisposeCall.status()()).toBe('working');
      await solidAsyncDisposeCall[Symbol.asyncDispose]();
      expect(() => solidAsyncDisposeCall.status()()).toThrow(TypeError);
    });
  });

  describe('No tags case', () => {
    const service = interpret(machine, { context: { count: 0 } });
    const solid = pipe(service);

    test('#00 => transitions and tags check', () => {
      solid.start();
      expect(solid.hasTags('idle_tag')).toBe(true);

      solid.send('START');
      expect(solid.hasTags('active_tag')).toBe(true);

      solid.send('STOP');
      expect(solid.hasTags('active_tag')).toBe(false);
      expect(solid.tags()()).toBeUndefined();
      expect(solid.hasTags('any_tag' as any)).toBe(false);

      solid.dispose();
    });
  });
});
