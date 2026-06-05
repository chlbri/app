import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

const actions = { exit: 'inc', entry: 'inc' } as const;

export const realMachineTypings1 = {
  context: type('number'),

  eventsMap: type({
    NEXT: 'undefined',
    PREVIOUS: 'undefined',
  }),

  sync: true,
} as const;

export default createMachine(
  'src/__tests__/machine/real.1.machine',
  {
    initial: 'idle',
    ...actions,
    states: {
      idle: {
        ...actions,
        on: {
          NEXT: '/parallel',
        },
        description: 'First state',
      },
      compound: {
        ...actions,
        on: {
          NEXT: '/idle',
        },
        initial: 'idle',
        states: {
          idle: {
            ...actions,
            on: {
              NEXT: '/compound/next',
            },
          },
          next: {
            ...actions,
            on: {
              PREVIOUS: '/compound/idle',
              NEXT: '/parallel',
            },
          },
        },
      },
      parallel: {
        ...actions,
        on: {
          PREVIOUS: '/compound/next',
        },
        type: 'parallel',
        states: {
          atomic: {
            initial: 'idle',
            ...actions,
            on: {
              NEXT: '/idle',
            },

            states: {
              idle: {
                entry: 'inc',
                on: {
                  NEXT: '/parallel/atomic/next',
                },
              },
              next: {
                ...actions,
                on: {
                  PREVIOUS: '/parallel/atomic/idle',
                },
              },
            },
          },
          compound: {
            ...actions,
            on: {
              NEXT: '/compound/next',
            },
            initial: 'idle',
            states: {
              idle: {
                ...actions,
                on: {
                  NEXT: '/parallel/compound/next',
                },
              },
              next: {
                ...actions,
                on: {
                  NEXT: '/compound/idle',
                },
              },
            },
          },
        },
      },
    },
  },
  realMachineTypings1,
);
