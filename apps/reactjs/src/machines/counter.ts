import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export const counterMachine = createMachine(
  {
    initial: 'idle',
    states: {
      idle: { tags: ['idle_state'], on: { START: '/active' } },
      active: {
        initial: 'speed_low',
        tags: ['active_state'],
        states: {
          speed_low: { tags: ['mode_eco', 'low_speed'] },
          speed_high: { tags: ['mode_turbo', 'high_speed'] },
        },
        on: {
          INC: { actions: 'increment' },
          DEC: { actions: 'decrement' },
          ACCELERATE: {
            target: '/active/speed_high',
            actions: 'accelerate',
          },
          DECELERATE: {
            target: '/active/speed_low',
            actions: 'decelerate',
          },
          STOP: '/final',
        },
      },
      final: { tags: ['completed'], on: { RESET: '/idle' } },
    },
  },
  {
    context: type({ count: 'number', speed: 'number' }),
    eventsMap: type({
      START: 'never',
      STOP: 'never',
      ACCELERATE: 'never',
      DECELERATE: 'never',
      INC: 'never',
      DEC: 'never',
      RESET: 'never',
    }),
    sync: true,
  },
).provideOptions(({ assign }) => ({
  actions: {
    increment: assign(
      'context.count',
      ({ context: { count, speed } }) => count + speed,
    ),

    decrement: assign('context.count', ({ context: { count, speed } }) =>
      Math.max(count - speed, 0),
    ),

    accelerate: assign(
      'context.speed',
      ({ context }) => context.speed + 1,
    ),

    decelerate: assign('context.speed', ({ context }) =>
      Math.max(context.speed - 1, 1),
    ),
  },
}));
