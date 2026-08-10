import {
  DEFAULT_MAX_SELF_TRANSITIONS,
  DEFAULT_MIN_ACTIVITY_TIME,
  TIME_TO_RINIT_SELF_COUNTER,
} from '@bemedev/app/constants';
import { createMachine } from '@bemedev/app';
import { interpret } from '@bemedev/app';
import { constructTests } from '@bemedev/app-vitest';
import { type } from '@bemedev/typings';

beforeAll(() => {
  vi.useFakeTimers();
});

const unhandledRejection = async (
  testFn: () => any | Promise<any>,
  handler: (error: any) => void,
  timeout = 100,
) => {
  process.on('unhandledRejection', handler);
  process.on('uncaughtException', handler);
  try {
    testFn();
    await new Promise(r => setTimeout(r, timeout));
  } catch (error) {
    handler(error);
  } finally {
    process.off('unhandledRejection', handler);
    process.off('uncaughtException', handler);
  }
};

describe('#03 => Exceed selfTransitionsCounter', () => {
  const machine = createMachine(
    {
      on: {
        ADD_CONDITION: { actions: 'addCondition' },
        REMOVE_CONDITION: { actions: 'removeCondition' },
      },
      initial: 'idle',
      states: {
        idle: {
          entry: 'inc',
          always: { guards: ['condition', 'limit'], target: '/working' },
        },
        working: {
          entry: 'inc',
          always: { guards: ['condition', 'limit'], target: '/idle' },
        },
      },
    },
    {
      eventsMap: type({
        ADD_CONDITION: 'never',
        REMOVE_CONDITION: 'never',
      }),

      context: type({ iterator: 'number', condition: 'boolean' }),

      sync: true,
    },
  ).provideOptions(({ isValue, assign }) => ({
    actions: {
      addCondition: ({ pContext, context }) => ({
        pContext,
        context: { ...context, condition: true },
      }),
      removeCondition: assign('context.condition', () => false),
      inc: assign('context.iterator', ({ context }) => {
        return context.iterator + 1;
      }),
    },
    guards: {
      condition: isValue('context.condition', false),
      limit: ({
        context: { iterator },
      }: {
        context: { iterator: number; condition: boolean };
      }) => {
        return iterator <= DEFAULT_MAX_SELF_TRANSITIONS;
      },
    },
    delays: { DELAY: DEFAULT_MIN_ACTIVITY_TIME },
  }));

  const error = `Too much self transitions, exceeded ${DEFAULT_MAX_SELF_TRANSITIONS} transitions`;

  describe('#01 => mode is normal', () => {
    const fn = vi.spyOn(console, 'error');

    const service = interpret(machine, {
      context: { condition: false, iterator: 0 },
      mode: 'normal',
    });

    const { start, useWaiter, useErrors } = constructTests(
      vi,
      service,
      ({ waiter }) => ({ useWaiter: waiter(TIME_TO_RINIT_SELF_COUNTER) }),
    );

    test(...start());
    test(...useWaiter());

    describe('#002 => Error is throwing', () => {
      describe('#001 => console.error', () => {
        test('#001 => called one time', () => {
          expect(fn).toBeCalledTimes(1);
        });

        test('#02 => called with the error', () => {
          expect(fn).toHaveBeenNthCalledWith(1, error);
        });
      });

      describe(...useErrors(error));
    });
  });

  describe('#01 => mode is strict', () => {
    test('#00 => Start throws error', async () => {
      const service = interpret(machine, {
        context: { condition: false, iterator: 0 },
        mode: 'strict',
      });

      unhandledRejection(service.start, val => {
        if (val instanceof Error) {
          expect(val.message).toBe(error);
        }
      });

      await vi.advanceTimersByTimeAsync(TIME_TO_RINIT_SELF_COUNTER);
    });
  });
});
