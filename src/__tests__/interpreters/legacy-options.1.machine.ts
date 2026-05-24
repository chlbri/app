import { createMachine } from '#machine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/legacy-options.1.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          NEXT: {
            actions: 'increment',
          },
          DOUBLE: {
            actions: 'doubleIncrement',
          },
        },
      },
    },
  },
  {
    context: type('number'),

    eventsMap: type({
      NEXT: 'never',
      DOUBLE: 'never',
    }),
  },
);
