import { DEFAULT_MAX_TIME_PROMISE } from '#constants';
import { defaultC, fakeWaiter } from '#fixtures';
import { returnFalse } from '#guards';
import { interpret } from '#exports/interpret';
import { createMachine } from '#exports/createMachine';

const DELAY = 1000;

describe('after', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  test('#01 => simple', async () => {
    const machine = createMachine(
      {
        initial: 'idle',
        states: {
          idle: {
            after: {
              DELAY: '/active',
            },
          },
          active: {},
        },
      },
      { sync: true },
    );

    machine.addOptions(() => ({
      delays: {
        DELAY,
      },
    }));

    const service = interpret(machine, defaultC);
    service.start();
    await fakeWaiter(0);
    expect(service.state.value).toEqual('idle');

    await fakeWaiter(DELAY);
    expect(service.state.value).toEqual('active');
  });

  test('#02 => complex, two delays', async () => {
    const machine = createMachine(
      {
        initial: 'idle',
        states: {
          idle: {
            after: {
              DELAY1: '/result1',
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
      delays: {
        DELAY1: DELAY * 3,
        DELAY2: DELAY * 2,
      },
    }));

    const service = interpret(machine);
    service.start();
    await fakeWaiter(0);
    expect(service.state.value).toEqual('idle');

    await fakeWaiter(DELAY);
    expect(service.state.value).toEqual('idle');

    await fakeWaiter(DELAY);
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
      delays: {
        DELAY,
        DELAY2: DELAY * 4,
      },
      guards: {
        returnFalse,
      },
    }));

    const service = interpret(machine, defaultC);
    service.start();
    await fakeWaiter(0);
    expect(service.state.value).toEqual('idle');

    await fakeWaiter(DELAY);
    expect(service.state.value).toEqual('idle');

    await fakeWaiter(DELAY * 3);
    expect(service.state.value).toEqual('result2');
  });

  test('#04 => Inside the remainings', async () => {
    const machine = createMachine(
      {
        initial: 'idle',
        states: {
          idle: {
            after: {
              DELAY2: { target: '/active' },
            },
            on: {
              NEXT: '/active',
            },
          },
          active: {
            on: {
              NEXT: '/idle',
            },
          },
        },
      },
      { sync: true },
    );

    machine.addOptions(() => ({
      delays: {
        DELAY2: DELAY * 3,
      },
    }));

    const service = interpret(machine, defaultC);
    service.start();
    await fakeWaiter(0);
    expect(service.state.value).toEqual('idle');

    await fakeWaiter(DELAY);
    service.send('NEXT');
    await fakeWaiter(0);
    expect(service.state.value).toEqual('active');

    await fakeWaiter(DELAY * 4);
    expect(service.state.value).toEqual('active');

    service.send('NEXT');
    await fakeWaiter(0);
    expect(service.state.value).toEqual('idle');

    await fakeWaiter(DELAY * 3);
    expect(service.state.value).toEqual('active');
  });

  test('#05 => after transition - delay is too long', async () => {
    const machine = createMachine(
      {
        initial: 'idle',
        states: {
          idle: { after: { DELAY: '/active' } },
          active: {},
        },
      },
      { sync: true },
    );

    machine.addOptions(() => ({
      delays: {
        DELAY: DEFAULT_MAX_TIME_PROMISE * 1.5,
      },
    }));

    const service = interpret(machine, defaultC);
    service.start();
    await fakeWaiter(0);
    expect(service.state.value).toEqual('idle');

    expect(service._warningsCollector?.size).toBe(1);
    expect(service._warningsCollector).toContain(
      'Delay DELAY is too long',
    );
    service.stop();
  });
});

afterAll(() => vi.useRealTimers());
