import { createMachine, type SyncInterpreterFrom } from '@bemedev/app';
import { eventToType } from '@bemedev/app/events';
import { type } from '@bemedev/typings';

export const counterMachine = createMachine(
  {
    initial: 'idle',
    on: { TOGGLE_LOG_EXPAND: { actions: ['toggleLogExpand'] } },
    states: {
      idle: {
        tags: ['idle_state'],
        on: { START: { target: '/active', actions: ['log'] } },
      },
      active: {
        initial: 'speed_low',
        tags: ['active_state'],
        states: {
          speed_low: { tags: ['mode_eco', 'low_speed'] },
          speed_high: { tags: ['mode_turbo', 'high_speed'] },
        },
        on: {
          INC: { actions: ['increment', 'log'] },
          DEC: { actions: ['decrement', 'log'] },
          ACCELERATE: {
            target: '/active/speed_high',
            actions: ['accelerate', 'log'],
          },
          DECELERATE: {
            target: '/active/speed_low',
            actions: ['decelerate', 'log'],
          },
          STOP: { target: '/final', actions: ['log'] },
        },
      },
      final: {
        tags: ['completed'],
        on: { RESET: { target: '/idle', actions: ['log'] } },
      },
    },
  },
  {
    context: type(({ array }) => ({
      count: 'number',
      speed: 'number',
      logs: array({
        id: 'string',
        timestamp: 'string',
        event: 'string',
        state: 'any',
        expanded: 'boolean',
      }),
    })),
    eventsMap: type({
      START: 'never',
      STOP: 'never',
      ACCELERATE: 'never',
      DECELERATE: 'never',
      INC: 'never',
      DEC: 'never',
      RESET: 'never',
      TOGGLE_LOG_EXPAND: 'string',
    }),
    sync: true,
  },
).provideOptions(({ assign }) => ({
  actions: {
    increment: assign(
      'count',
      ({ context: { count, speed } }) => count + speed,
    ),

    decrement: assign('count', ({ context: { count, speed } }) =>
      Math.max(count - speed, 0),
    ),

    accelerate: assign(
      'speed',
      ({ context }) => context.speed + 1,
    ),

    decelerate: assign('speed', ({ context }) =>
      Math.max(context.speed - 1, 1),
    ),

    log: assign('logs', ({ context, value, event }) => {
      const eventType = eventToType(event);

      return [
        {
          id: `${eventType}-${context.logs.length}`,
          timestamp: new Date().toLocaleTimeString(),
          event: eventType,
          state: value,
          expanded: false,
        },
        ...context.logs,
      ];
    }),

    toggleLogExpand: assign('logs', {
      TOGGLE_LOG_EXPAND: ({ context, payload }) => {
        return context.logs.map(log => {
          const check = log.id === payload;
          return check ? { ...log, expanded: !log.expanded } : log;
        });
      },
    }),
  },

}));

export type Service = SyncInterpreterFrom<typeof counterMachine>;
