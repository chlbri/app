import { createMachine } from '#machine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/legacy-options.6.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          FIRST: { actions: 'first' },
          SECOND: { actions: 'second' },
          THIRD: { actions: 'third' },
        },
      },
    },
  },
  {
    context: type('number'),

    eventsMap: type({
      FIRST: 'never',
      SECOND: 'never',
      THIRD: 'never',
    }),
  },
);
