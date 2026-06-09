import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/common.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        tags: ['idle_tag'],
        on: {
          START: '/active',
        },
      },
      active: {
        initial: 'speed_low',
        tags: ['active_tag'],
        states: {
          speed_low: {
            tags: ['low_tag'],
            on: {
              ACCELERATE: '/active/speed_high',
              STOP: '/final',
            },
          },
          speed_high: {
            tags: ['high_tag'],
            on: {
              DECELERATE: '/active/speed_low',
              STOP: '/final',
            },
          },
        },
        on: {
          INC: {
            actions: 'increment',
          },
        },
      },
      final: {},
    },
  },
  {
    context: type({
      count: 'number',
    }),
    eventsMap: type({
      START: 'never',
      STOP: 'never',
      ACCELERATE: 'never',
      DECELERATE: 'never',
      INC: 'never',
    }),
    sync: true,
  },
);
