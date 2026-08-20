import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/assign-map.2.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          UPDATE_ALL: { actions: 'updateAll' },
          PARTIAL_UPDATE: { actions: 'partialUpdate' },
          RESET_ALL: { actions: 'resetAll' },
        },
      },
    },
  },
  {
    context: type({
      name: 'string',
      age: 'number',
      role: 'string',
    }),
    eventsMap: type({
      UPDATE_ALL: { name: 'string', age: 'number', role: 'string' },
      PARTIAL_UPDATE: { name: 'string' },
      RESET_ALL: 'undefined',
    }),
    sync: true,
  },
);
