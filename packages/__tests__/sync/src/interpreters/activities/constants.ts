import { createMachine } from '@bemedev/app';

export const DELAY = 1000;

export const machine = createMachine(
  {
    initial: 'state1',
    states: {
      state1: {
        activities: {
          DELAY: {
            name: 'activity1',
            description: 'This is a test activity',
          },
        },
        on: { NEXT: '/state2' },
      },
      state2: { on: { NEXT: '/state1' } },
    },
  },
  { sync: true },
);
