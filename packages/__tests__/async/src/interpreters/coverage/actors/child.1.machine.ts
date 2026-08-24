import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/coverage/actors/child.1.machine',
  {
    activities: {
      DELAY: ['inc'],
      DELAY2: { actions: 'inc2', guards: 'returnTrue' },
    },
  },
  { context: type({ iter1: 'number', iter2: 'number' }) },
);
