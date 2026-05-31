import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/legacy-options.4.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          ADD: {
            actions: 'add',
          },
          MULTIPLY: {
            actions: 'multiply',
          },
        },
      },
    },
  },
  {
    context: type('number'),

    eventsMap: type({
      ADD: 'never',
      MULTIPLY: 'never',
    }),
    sync: true,
  },
);
