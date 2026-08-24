import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export const trafficMachine = createMachine(
  {
    type: 'parallel',
    states: {
      speed: {
        initial: 'normal',
        states: {
          normal: {
            tags: 'normal',
            on: {
              ACCELERATE: { actions: 'accelerate', target: '/speed/fast' },
            },
          },
          fast: {
            tags: 'fast',
            on: {
              SLOW_DOWN: {
                actions: 'decelerate',
                target: '/speed/normal',
              },
            },
          },
        },
      },

      flow: {
        initial: 'red',
        states: {
          red: {
            tags: ['stop_light'],
            on: { NEXT: '/flow/green' },
            after: { WAITER_RED: '/flow/green' },
          },
          yellow: {
            tags: ['caution_light'],
            on: { NEXT: '/flow/red' },
            after: { WAITER_YELLOW: '/flow/red' },
            exit: ['count'],
          },
          green: {
            tags: ['go_light'],
            on: { NEXT: '/flow/yellow' },
            after: { WAITER_GREEN: '/flow/yellow' },
          },
        },
      },
    },
  },
  {
    context: type({ cycles: 'number' }),
    pContext: type(({ optional }) => ({
      timers: { yellow: 'number', green: 'number', red: 'number' },
      defaults: optional({
        yellow: 'number',
        green: 'number',
        red: 'number',
      }),
      speed: 'number',
    })),
    eventsMap: type({
      NEXT: 'never',
      ACCELERATE: 'never',
      SLOW_DOWN: 'never',
    }),
    sync: true,
  },
).provideOptions(({ assign, action }) => ({
  actions: {
    accelerate: action(state => {
      state.pContext.speed = 2;
    }),
    decelerate: action(state => {
      state.pContext.speed = 1;
    }),
    count: assign('cycles', ({ context }) => context.cycles + 1),
  },

  delays: {
    WAITER_GREEN: ({ pContext: { speed, timers } }) => {
      return timers.green / speed;
    },

    WAITER_RED: ({ pContext: { speed, timers } }) => {
      return timers.red / speed;
    },

    WAITER_YELLOW: ({ pContext: { speed, timers } }) => {
      return timers.yellow / speed;
    },
  },
}));
