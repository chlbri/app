import { createMachine, interpret } from '@bemedev/app';
import { constructTests } from '@bemedev/app-vitest';
import { DEFAULT_MAX_TIME_PROMISE } from '@bemedev/app/constants';
import { returnFalse } from '@bemedev/app/guards';
import { type } from '@bemedev/typings';

const DELAY = 1000;

describe('after', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  test('#01 => simple', async () => {
    const machine = createMachine(
      {
        initial: 'idle',
        states: { idle: { after: { DELAY: '/active' } }, active: {} },
      },
      { sync: true },
    );

    machine.addOptions(() => ({ delays: { DELAY } }));

    const service = interpret(machine);
    service.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(service.state.value).toEqual('idle');

    await vi.advanceTimersByTimeAsync(DELAY);
    expect(service.state.value).toEqual('active');
  });

  test('#02 => complex, two delays', async () => {
    const machine = createMachine(
      {
        initial: 'idle',
        states: {
          idle: { after: { DELAY1: '/result1', DELAY2: '/result2' } },
          result1: {},
          result2: {},
        },
      },
      { sync: true },
    );

    machine.addOptions(() => ({
      delays: { DELAY1: DELAY * 3, DELAY2: DELAY * 2 },
    }));

    const service = interpret(machine);
    service.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(service.state.value).toEqual('idle');

    await vi.advanceTimersByTimeAsync(DELAY);
    expect(service.state.value).toEqual('idle');

    await vi.advanceTimersByTimeAsync(DELAY);
    expect(service.state.value).toEqual('result2');
  });

  test('#03 => complex, two delays with parameters', async () => {
    const machine = createMachine(
      {
        initial: 'idle',
        states: {
          idle: {
            after: {
              DELAY: { guards: 'returnFalse', target: '/result1' },
              DELAY2: '/result2',
            },
          },
          result1: {},
          result2: {},
        },
      },
      { sync: true },
    );

    machine.addOptions(() => ({
      delays: { DELAY, DELAY2: DELAY * 4 },
      guards: { returnFalse },
    }));

    const service = interpret(machine);
    service.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(service.state.value).toEqual('idle');

    await vi.advanceTimersByTimeAsync(DELAY);
    expect(service.state.value).toEqual('idle');

    await vi.advanceTimersByTimeAsync(DELAY * 3);
    expect(service.state.value).toEqual('result2');
  });

  test('#04 => Inside the remainings', async () => {
    const machine = createMachine(
      {
        initial: 'idle',
        states: {
          idle: {
            after: { DELAY2: { target: '/active' } },
            on: { NEXT: '/active' },
          },
          active: { on: { NEXT: '/idle' } },
        },
      },
      { sync: true },
    );

    machine.addOptions(() => ({ delays: { DELAY2: DELAY * 3 } }));

    const service = interpret(machine);
    service.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(service.state.value).toEqual('idle');

    await vi.advanceTimersByTimeAsync(DELAY);
    service.send('NEXT');
    await vi.advanceTimersByTimeAsync(0);
    expect(service.state.value).toEqual('active');

    await vi.advanceTimersByTimeAsync(DELAY * 4);
    expect(service.state.value).toEqual('active');

    service.send('NEXT');
    await vi.advanceTimersByTimeAsync(0);
    expect(service.state.value).toEqual('idle');

    await vi.advanceTimersByTimeAsync(DELAY * 3);
    expect(service.state.value).toEqual('active');
  });

  test('#05 => after transition - delay is too long', async () => {
    const machine = createMachine(
      {
        initial: 'idle',
        states: { idle: { after: { DELAY: '/active' } }, active: {} },
      },
      { sync: true },
    );

    machine.addOptions(() => ({
      delays: { DELAY: DEFAULT_MAX_TIME_PROMISE * 1.1 },
    }));

    const service = interpret(machine);
    service.start();
    expect(service.state.value).toEqual('idle');

    expect(service._warningsCollector?.size).toBe(1);
    expect(service._warningsCollector).toContain(
      'Delay DELAY is too long',
    );
    vi.advanceTimersByTime(DEFAULT_MAX_TIME_PROMISE * 1.2);
    vi.advanceTimersToNextTimer();
    console.warn(service._warningsCollector);
    service.stop();
  });

  test('#06 => not-defined', async () => {
    const machine = createMachine(
      {
        initial: 'idle',
        states: { idle: { after: { DELAY: '/active' } }, active: {} },
      },
      { sync: true },
    );

    const service = interpret(machine);
    service.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(service.state.value).toEqual('idle');

    await vi.advanceTimersByTimeAsync(100_000);
    expect(service.state.value).toEqual('idle');
  });

  describe('#07 => always and after conflict on state with context', async () => {
    const machine = createMachine(
      {
        initial: 'idle',
        states: {
          idle: {
            always: [
              { guards: 'checkCount', target: '/alwaysTarget' },
              { guards: 'returnFalse', target: '/neverTarget' },
            ],
            after: { DELAY: '/afterTarget' },
          },
          alwaysTarget: {},
          afterTarget: {},
          neverTarget: {},
        },
      },
      { context: type({ count: 'number', limit: 'number' }), sync: true },
    ).provideOptions(() => ({
      delays: { DELAY },
      guards: {
        returnFalse: false,
        checkCount: ({ context }) => context.count >= context.limit,
      },
    }));

    describe('#01 => Always target', () => {
      const service1 = interpret(machine, {
        context: { count: 5, limit: 5 },
      });

      const { start, waiter, useStateValue, changeIndex } = constructTests(
        vi,
        service1,
        ({ waiter }) => ({ waiter: waiter(DELAY) }),
      );
      test(...start());
      test(...useStateValue('alwaysTarget'));
      test(...waiter());
      test(...useStateValue('alwaysTarget'));
      test(...waiter(10));
      test(...useStateValue('alwaysTarget'));
      test('#06 => count is "5"', () =>
        expect(service1.context.count).toBe(5));
      test(...changeIndex(prev => prev + 2));
      test(...waiter());
      test(...useStateValue('alwaysTarget'));
      test(...waiter(10));
      test(...useStateValue('alwaysTarget'));
    });

    describe('#02 => After target', () => {
      const service1 = interpret(machine, {
        context: { count: 2, limit: 5 },
      });

      const { start, waiter, useStateValue } = constructTests(
        vi,
        service1,
        ({ waiter }) => ({ waiter: waiter(DELAY) }),
      );
      test(...start());
      test(...useStateValue('idle'));
      test(...waiter());
      test(...useStateValue('afterTarget'));
      test(...waiter(10));
      test(...useStateValue('afterTarget'));
    });
  });
});

afterAll(() => vi.useRealTimers());
