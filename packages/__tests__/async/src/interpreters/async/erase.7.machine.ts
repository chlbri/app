import { createMachine } from '@bemedev/app';
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
    context: type(({ optional }) => optional('string')),
    eventsMap: type({ SET_DATA: 'string', CLEAR_ALL: 'undefined' }),
  },
);
