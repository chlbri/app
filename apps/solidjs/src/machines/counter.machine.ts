import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export const counterMachine = createMachine(
  {
    initial: 'idle',
    on: { RESET: { actions: 'reset' }, STOP: '/idle' },
    states: {
      idle: { tags: ['stopped'], on: { START: '/active' } },
      active: {
        tags: ['running'],
        on: {
          INC: { actions: 'increment' },
          DEC: { actions: 'decrement' },
        },
      },
    },
  },
  {
    context: type({ count: 'number', step: 'number' }),
    eventsMap: type({
      STOP: 'never',
      START: 'never',
      INC: 'never',
      DEC: 'never',
      RESET: 'never',
    }),
    sync: true,
  },
).provideOptions(({ assign }) => ({
  actions: {
    increment: assign(
      'count',
      ({ context: { count, step } }) => count + step,
    ),

    decrement: assign('count', ({ context: { count, step } }) =>
      Math.max(count - step, 0),
    ),

    reset: assign('count', () => 0),
  },

}));
