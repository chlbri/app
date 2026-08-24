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

describe('TESTS', () => {
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
        eventsMap: type({ ADD_CONDITION: 'never', REMOVE_CONDITION: 'never' }),

        context: type({ iterator: 'number', condition: 'boolean' }),

        sync: true,
      },
    ).provideOptions(({ isValue, assign }) => ({
      actions: {
        addCondition: assign('condition', () => true),
        removeCondition: assign('condition', () => false),
        inc: assign('iterator', ({ context }) => {
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
      describe('#01 => Start throws error', () => {
        const service = interpret(machine, {
          context: { condition: false, iterator: 0 },
          mode: 'strict',
        });

        const { unhandledRejection } = constructTests(service);
        test(...unhandledRejection(service.start, error));
      });
    });
  });

  describe('#00 => Start throws an express error', () => {
    const machine = createMachine({ entry: 'throw' }, { sync: true }).provideOptions(
      ({ action }) => ({
        actions: {
          throw: action(() => {
            throw 'error';
          }),
        },
      }),
    );

    const service = interpret(machine, { mode: 'strict' });
    const { unhandledRejection } = constructTests(service);
    test(...unhandledRejection(service.start, 'error'));
  });
});
