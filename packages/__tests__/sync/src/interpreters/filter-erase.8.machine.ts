import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/filter-erase.8.machine',
  {
    initial: 'init_state',
    states: {
      init_state: {
        entry: 'filterInit',
        on: {
          TRIGGER_ALWAYS: '/always_state',
        },
      },
      always_state: {
        always: {
          actions: 'filterAlways',
          target: '/final_state',
        },
      },
      final_state: {},
    },
  },
  {
    context: type({
      scores: {
        user1: 'number',
        user2: 'number',
        user3: 'number',
      },
    }),

    eventsMap: type({
      TRIGGER_ALWAYS: 'undefined',
    }),
    sync: true,
  },
);
