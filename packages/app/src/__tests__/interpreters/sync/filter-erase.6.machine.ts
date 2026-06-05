import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/filter-erase.6.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          SET_DATA: {
            actions: 'setData',
          },
          CLEAR_ALL: {
            actions: 'clearAll',
            target: '/cleared',
          },
        },
      },
      cleared: {},
    },
  },
  {
    context: type(({ partial }) =>
      partial({
        name: 'string',
        age: 'number',
        email: 'string',
      }),
    ),

    eventsMap: type({
      SET_DATA: { name: 'string', age: 'number', email: 'string' },
      CLEAR_ALL: 'undefined',
    }),
    sync: true,
  },
);
