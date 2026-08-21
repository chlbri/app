import { interpret } from '@bemedev/app';
import _machine1 from './asyncActions.1.machine';
import _machine2 from './asyncActions.2.machine';
import _machine3 from './asyncActions.3.machine';
import _machine4 from './asyncActions.4.machine';
import _machine5 from './asyncActions.5.machine';
import _machine6 from './asyncActions.6.machine';
import _machine7 from './asyncActions.7.machine';

beforeAll(() => vi.useRealTimers());

describe('Machine createOptions - error handlers', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });
  describe('#01 => assign', () => {
    const theError = 'assign error';

    describe('#01 => calls errorFn when fn throws', () => {
      const errorAction = vi.fn((state: any) => state);
      const errorFn = vi.fn((_err: any) => errorAction);

      const machine = _machine1.provideOptions(({ assign }) => ({
        actions: {
          myAction: assign(
            'context',
            {
              TEST: async () => {
                throw theError;
              },
            },
            { catch: errorFn },
          ),
        },
      }));

      const service = interpret(machine, { context: 42 });

      test('#00 => is not ready', () => {
        expect(service.isReady).toBe(false);
      });

      test('#01 => start', service.start);
      test('#02 => is ready', () => expect(service.isReady).toBe(true));

      test('#03 => send event without throwing', async () => {
        await service.send('TEST');
      });

      test('#04 => errorFn is called once', () => {
        expect(errorFn).toHaveBeenCalledOnce();
      });

      test('#05 => errorFn receives the thrown error as first arg', () => {
        expect(errorFn).toHaveBeenCalledWith('assign error');
      });

      test('#06 => errorAction receives the extended state', () => {
        expect(errorAction).toHaveBeenCalledWith({
          context: 42,
          pContext: undefined,
          status: 'busy',
          tags: [],
          value: 'idle',
          event: { type: 'TEST', payload: {} },
        });
      });
    });

    describe('#02 => errorFn return value affects the state', () => {
      let errorAction: any;
      const errorFn: any = vi.fn((_err: any) => errorAction);

      const machine = _machine2.provideOptions(({ assign }) => {
        errorAction = vi.fn(assign('context', () => -1));
        return {
          actions: {
            myAction: assign(
              'context',
              async () => {
                throw theError;
              },
              { catch: errorFn },
            ),
          },
        };
      });

      const service = interpret(machine, { context: 42 });

      test('#01 => start', service.start);

      test('#02 => send event without throwing', async () => {
        await service.send('TEST');
      });

      test('#03 => error handler modifies context', () => {
        expect(service.context).toEqual(-1);
      });

      test('#04 => errorFn is called once', () => {
        expect(errorFn).toHaveBeenCalledOnce();
      });
    });

    describe('#03 => with max defined, still calls errorFn when fn throws', () => {
      const errorAction = vi.fn((state: any) => state);
      const errorFn = vi.fn((_err: any) => errorAction);

      const machine = _machine3.provideOptions(({ assign }) => ({
        actions: {
          myAction: assign(
            'context',
            async () => {
              throw theError;
            },
            { catch: errorFn, max: 5000 },
          ),
        },
      }));

      const service = interpret(machine, { context: 7 });

      test('#01 => start', service.start);

      test('#02 => send event without throwing', async () => {
        await service.send('TEST');
      });

      test('#03 => errorFn is called once', () => {
        expect(errorFn).toHaveBeenCalledOnce();
      });
    });
  });

  describe('#02 => voidAction', () => {
    const theError = 'void error';

    describe('#01 => calls errorFn when fn throws', () => {
      const errorAction = vi.fn(() => ({}));
      const errorFn = vi.fn(() => errorAction);

      const machine = _machine4.provideOptions(({ voidAction }) => ({
        actions: {
          myAction: voidAction(
            async () => {
              throw theError;
            },
            { catch: errorFn },
          ),
        },
      }));

      const service = interpret(machine, { context: 10 });

      test('#00 => is not ready', () => {
        expect(service.isReady).toBe(false);
      });

      test('#01 => start', service.start);
      test('#02 => is ready', () => expect(service.isReady).toBe(true));

      test('#03 => send event without throwing', async () => {
        await service.send('TEST');
      });

      test('#04 => errorFn is called once', () => {
        expect(errorFn).toHaveBeenCalledOnce();
      });

      test('#05 => errorFn receives the thrown error as first arg', () => {
        expect(errorFn).toHaveBeenCalledWith('void error');
      });

      test('#06 => errorAction receives extended state', () => {
        expect(errorAction).toHaveBeenCalledWith({
          context: 10,
          pContext: undefined,
          status: 'busy',
          tags: [],
          value: 'idle',
          event: { type: 'TEST', payload: {} },
        });
      });

      test('#07 => errorAction returns empty object', () => {
        expect(errorAction).toHaveReturnedWith({});
      });
    });

    describe('#02 => errorFn return value affects the state', () => {
      const errorAction = vi.fn((_state: any) => ({}));
      const errorFn = vi.fn((_err: any) => errorAction);

      const machine = _machine5.provideOptions(({ voidAction }) => ({
        actions: {
          myAction: voidAction(
            async ({ event }) => {
              console.log('Event that caused the error:', event);
              throw theError;
            },
            { catch: errorFn },
          ),
        },
      }));

      const service = interpret(machine, { context: 10 });

      test('#01 => start', service.start);

      test('#02 => send event without throwing', async () => {
        await service.send('TEST');
      });

      test("#03 => error handler doesn't modify context", () => {
        expect(service.context).toEqual(10);
      });

      test('#04 => errorFn is called once', () => {
        expect(errorFn).toHaveBeenCalledOnce();
      });
    });

    describe('#03 => with max defined, still calls errorFn when fn throws', () => {
      const errorAction = vi.fn((state: any) => state);
      const errorFn = vi.fn((_err: any) => errorAction);

      const machine = _machine6.provideOptions(({ voidAction }) => ({
        actions: {
          myAction: voidAction(
            {
              TEST: async () => {
                throw theError;
              },
            },
            { catch: errorFn, max: 5000 },
          ),
        },
      }));

      const service = interpret(machine, { context: 3 });

      test('#01 => start', service.start);

      test('#02 => send event without throwing', async () => {
        await service.send('TEST');
      });

      test('#03 => errorFn is called once', () => {
        expect(errorFn).toHaveBeenCalledOnce();
      });
    });

    describe('#04 => NO error', () => {
      const theData = { message: 'Success' };
      const passFn = vi.fn(async data => console.log(data));

      const machine = _machine7.provideOptions(({ voidAction }) => ({
        actions: {
          myAction: voidAction(
            { TEST: () => passFn(theData) },
            { catch: () => () => ({}), max: 5000 },
          ),
        },
      }));

      const service = interpret(machine, { context: 3 });

      test('#01 => start', service.start);

      test('#02 => send event without throwing', () => {
        return service.send('TEST');
      });

      test('#03 => errorFn is called once', () => {
        expect(passFn).toHaveBeenCalledOnce();
      });

      test('#04 => errorFn receives the thrown error', () => {
        expect(passFn).toHaveBeenCalledWith(theData);
      });
    });
  });

  describe('#03 => sendTo', () => {
    const payload = 'sendTo error';
    const state = {
      context: 5,
      pContext: undefined,
      payload,
      status: 'busy',
      tags: undefined,
      value: 'idle',
    };

    describe('#01 => calls errorFn when fn throws', () => {
      const errorAction = vi.fn((state: any) => state);
      const errorFn = vi.fn((_err: any) => errorAction);

      const machine = _machine7.provideOptions(({ sendTo }) => {
        const _sendTo = sendTo();
        return {
          actions: {
            myAction: _sendTo(
              async () => {
                throw payload;
              },
              { catch: errorFn },
            ),
          },
        };
      });

      const service = interpret(machine, { context: state.context });

      test('#00 => is not ready', () => {
        expect(service.isReady).toBe(false);
      });

      test('#01 => start', service.start);
      test('#02 => is ready', () => expect(service.isReady).toBe(true));

      test('#03 => send event without throwing', async () => {
        await service.send('TEST');
      });

      test('#04 => errorFn is called once', () => {
        expect(errorFn).toHaveBeenCalledOnce();
      });

      test('#05 => errorFn receives the thrown error as first arg', () => {
        expect(errorFn).toHaveBeenCalledWith('sendTo error');
      });

      test('#06 => errorAction receives extended state', () => {
        expect(errorAction).toHaveBeenCalledWith({
          context: 5,
          pContext: undefined,
          status: 'busy',
          tags: [],
          value: 'idle',
          event: { type: 'TEST', payload: {} },
        });
      });
    });

    describe('#02 => errorFn return value affects the state', () => {
      const errorAction = vi.fn((_state: any) => ({}));
      const errorFn = vi.fn((_err: any) => errorAction);

      const machine = _machine6.provideOptions(({ sendTo }) => ({
        actions: {
          myAction: sendTo()(
            async () => {
              throw payload;
            },
            { catch: errorFn },
          ),
        },
      }));

      const service = interpret(machine, { context: state.context });

      test('#01 => start', service.start);

      test('#02 => send event without throwing', async () => {
        await service.send('TEST');
      });

      test("#03 => error handler doesn't modify context", () => {
        expect(service.context).toEqual(state.context);
      });

      test('#04 => errorFn is called once', () => {
        expect(errorFn).toHaveBeenCalledOnce();
      });
    });

    describe('#03 => with max defined, still calls errorFn when fn throws', () => {
      const errorAction = vi.fn(() => ({}));
      const errorFn = vi.fn((_err: any) => errorAction);

      const machine = _machine5.provideOptions(({ sendTo }) => ({
        actions: {
          myAction: sendTo()(
            async () => {
              throw payload;
            },
            { catch: errorFn, max: 5000 },
          ),
        },
      }));

      const service = interpret(machine, { context: 1 });

      test('#01 => start', service.start);

      test('#02 => send event without throwing', async () => {
        await service.send('TEST');
      });

      test('#03 => errorFn is called once', () => {
        expect(errorFn).toHaveBeenCalledOnce();
      });

      test('#04 => errorAction returns empty object', () => {
        expect(errorAction).toHaveNthReturnedWith(1, {});
      });
    });
  });

  describe('#04 => then handlers', () => {
    describe('#01 => assign with then handler', () => {
      const catchFn = vi.fn();
      const machine = _machine1.provideOptions(({ assign }) => ({
        actions: {
          myAction: assign(
            'context',
            async () => {
              return 10;
            },
            {
              catch: catchFn,
              then: assign('context', ({ context }) => context + 100),
            },
          ),
        },
      }));

      const service = interpret(machine, { context: 5 });

      test('#01 => start', service.start);

      test('#02 => send event without throwing', async () => {
        await service.send('TEST');
      });

      test('#03 => service context is updated by both main action and then handler', () => {
        expect(service.context).toBe(110);
      });

      test('#04 => catchFn is not called', () => {
        expect(catchFn).not.toHaveBeenCalled();
      });
    });

    describe('#02 => voidAction with then handler', () => {
      const catchFn = vi.fn();
      let effectCalled = false;
      const machine = _machine1.provideOptions(({ voidAction, assign }) => ({
        actions: {
          myAction: voidAction(
            async () => {
              effectCalled = true;
            },
            {
              catch: catchFn,
              then: assign('context', ({ context }) => context + 50),
            },
          ),
        },
      }));

      const service = interpret(machine, { context: 5 });

      test('#01 => start', service.start);

      test('#02 => send event without throwing', async () => {
        await service.send('TEST');
      });

      test('#03 => voidAction executes effect', () => {
        expect(effectCalled).toBe(true);
      });

      test('#04 => then handler updates context', () => {
        expect(service.context).toBe(55);
      });

      test('#05 => catchFn is not called', () => {
        expect(catchFn).not.toHaveBeenCalled();
      });
    });
  });
});
