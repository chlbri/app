import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/assign-map.3.machine',
  {
    initial: 'init_state',
    states: {
      init_state: {
        entry: 'initProp',
        on: {
          TRIGGER_ALWAYS: '/always_state',
        },
      },
      always_state: {
        always: {
          actions: 'alwaysProp',
          target: '/final_state',
        },
      },
      final_state: {},
    },
  },
  {
    context: type({
      propValue: 'string',
    }),
    eventsMap: type({
      TRIGGER_ALWAYS: 'undefined',
    }),
    sync: true,
  },
);
