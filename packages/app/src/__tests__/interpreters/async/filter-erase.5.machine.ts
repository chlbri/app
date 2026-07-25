import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/filter-erase.5.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          SET_USER: { actions: 'setUser' },
          CLEAR_EMAIL: { actions: 'clearEmail' },
        },
      },
    },
  },
  {
    context: type(({ optional }) => ({
      user: { name: 'string', email: optional('string') },
    })),

    eventsMap: type({
      SET_USER: { name: 'string', email: 'string' },
      CLEAR_EMAIL: 'never',
    }),
  },
);
