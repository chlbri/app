import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/legacy-options.12.machine',
  {
    initial: 'idle',
    states: { idle: { on: { INCREMENT: { actions: 'increment' } } } },
  },
  {
    context: type('number'),

    eventsMap: type({ INCREMENT: 'never' }),
  },
);
