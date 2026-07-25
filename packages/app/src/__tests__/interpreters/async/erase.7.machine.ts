import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/eras.machine.7',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          SET_DATA: { actions: 'setData' },
          CLEAR_ALL: { actions: 'clearAll', target: '/cleared' },
        },
      },
      cleared: {},
    },
  },
  {
    context: type('string'),
    eventsMap: type({ SET_DATA: 'string', CLEAR_ALL: 'undefined' }),
  },
);
