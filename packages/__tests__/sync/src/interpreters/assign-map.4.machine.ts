import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/assign-map.4.machine',
  {
    initial: 'init_state',
    states: {
      init_state: {
        entry: 'initRoot',
        on: {
          TRIGGER_ALWAYS: '/always_state',
        },
      },
      always_state: {
        always: {
          actions: 'alwaysRoot',
          target: '/final_state',
        },
      },
      final_state: {},
    },
  },
  {
    context: type({
      name: 'string',
      age: 'number',
    }),
    eventsMap: type({
      TRIGGER_ALWAYS: 'undefined',
    }),
    sync: true,
  },
);
