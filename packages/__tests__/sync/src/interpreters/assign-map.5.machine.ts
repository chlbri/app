import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/assign-map.5.machine',
  {
    initial: 'init_state',
    states: {
      init_state: {
        entry: 'initAction',
        on: {
          TRIGGER_ALWAYS: '/always_state',
        },
      },
      always_state: {
        always: {
          actions: 'alwaysAction',
          target: '/final_state',
        },
      },
      final_state: {},
    },
  },
  {
    context: type({
      status: 'string',
    }),
    eventsMap: type({
      TRIGGER_ALWAYS: 'undefined',
    }),
    sync: true,
  },
);
