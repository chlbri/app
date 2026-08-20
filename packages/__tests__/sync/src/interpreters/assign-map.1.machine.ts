import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/assign-map.1.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          SET_VALUE: { actions: 'setValue' },
          SET_COUNT: { actions: 'setCount' },
          RESET: { actions: 'reset' },
          UNKNOWN_EVENT: { actions: 'handleUnknown' },
        },
      },
    },
  },
  {
    context: type({
      value: 'string',
      count: 'number',
    }),
    eventsMap: type({
      SET_VALUE: { val: 'string' },
      SET_COUNT: { num: 'number' },
      RESET: 'undefined',
      UNKNOWN_EVENT: 'undefined',
    }),
    sync: true,
  },
);
