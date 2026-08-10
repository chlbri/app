import { createMachine } from '@bemedev/app';
import { typings } from '@bemedev/app/utils';

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
    context: typings.context('number'),
    eventsMap: typings.eventsMap({
      NEXT: 'undefined',
      TRIPLE: 'undefined',
    }),
    sync: true,
  },
);
