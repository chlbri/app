import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/children.1.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        activities: { DELAY: 'inc' },
      },
    },
  },
  {
    context: type('number'),
    sync: true,
  },
);
