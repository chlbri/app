import { createMachine } from '#machine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/filter-erase.4.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          SET_NAME: {
            actions: 'setName',
          },
          CLEAR_NAME: {
            actions: 'clearName',
            target: '/cleared',
          },
        },
      },
      cleared: {},
    },
  },
  {
    context: type(({ optional }) => ({
      name: optional('string'),
      data: 'number',
    })),

    eventsMap: type({
      SET_NAME: { name: 'string' },
      CLEAR_NAME: 'never',
    }),
  },
);
