import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/machine/addOptions-return.4.machine',
  {
    initial: 'idle',
    states: { idle: { on: { INCREMENT: { actions: 'increment' } } } },
  },
  { eventsMap: type({ INCREMENT: 'never' }), context: type('number') },
);
