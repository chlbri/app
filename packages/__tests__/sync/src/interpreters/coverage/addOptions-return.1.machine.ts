import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/coverage/addOptions-return.1.machine',
  {
    initial: 'idle',
    states: { idle: { on: { INCREMENT: { actions: 'increment' } } } },
  },
  {
    context: type('number'),
    eventsMap: type({ INCREMENT: 'never' }),
    sync: true,
  },
);
