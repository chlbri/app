import { createMachine } from '#machine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/composition.2.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          NEXT: { actions: 'inc' },
        },
      },
    },
  },
  {
    eventsMap: type({
      NEXT: 'never',
    }),
  },
);
