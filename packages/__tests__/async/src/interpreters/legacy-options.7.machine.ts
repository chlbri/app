import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/app-contract/typings';

export default createMachine(
  'src/__tests__/interpreters/legacy-options.7.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          NEXT: { actions: 'increment' },
          TRIPLE: { actions: 'tripleIncrement' },
        },
      },
    },
  },

  {
    context: type('number'),
    eventsMap: type({ NEXT: 'undefined', TRIPLE: 'undefined' }),
  },
);
