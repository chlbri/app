import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/assign-map.6.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        entry: 'setValue',
        on: {
          SET_VALUE: { actions: 'setValue' },
        },
      },
    },
  },
  {
    context: type({
      value: 'string',
    }),
    eventsMap: type({
      SET_VALUE: { val: 'string' },
    }),
    sync: true,
  },
);
