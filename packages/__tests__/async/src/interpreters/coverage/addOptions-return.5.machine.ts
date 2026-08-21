import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/coverage/addOptions-return.5.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: { FIRST: { actions: 'first' }, SECOND: { actions: 'second' } },
      },
    },
  },
  {
    context: type('number'),
    eventsMap: type({ FIRST: 'never', SECOND: 'never' }),
  },
);
