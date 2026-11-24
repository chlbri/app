import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/app-contract/typings';
import { DELAY } from './constants';

// #region machine1
export const machine1 = createMachine(
  {
    initial: 'idle',
    states: {
      idle: {
        activities: { DELAY: 'inc' },
        on: { NEXT: { description: 'Next', target: '/final' } },
      },

      final: {},
    },
  },
  {
    context: type({ iterator: 'number' }),

    eventsMap: type({ NEXT: 'never' }),
  },
);

machine1.addOptions(({ assign }) => ({
  actions: { inc: assign('iterator', ({ context }) => context.iterator + 1) },

  delays: { DELAY },
}));

export type Machine1 = typeof machine1;
// #endregion
