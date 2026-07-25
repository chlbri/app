import {
  DEFAULT_MAX_SELF_TRANSITIONS,
  DEFAULT_MIN_ACTIVITY_TIME,
  TIME_TO_RINIT_SELF_COUNTER,
} from '@bemedev/app/constants';
import _machine1 from './exceed.fsm';
import { interpret } from '@bemedev/app';
import { constructTests } from '../constructTests';

describe('#03 => Exceed selfTransitionsCounter', () => {
  const machine = _machine1.provideOptions(({ isValue, assign }) => ({
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
    const service = interpret(machine, {
      context: { condition: false, iterator: 0 },
      mode: 'strict',
    });

    const { unhandledRejection } = constructTests(vi, service);
    test(...unhandledRejection(service.start, error));
  });
});
