import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/legacy-options.8.machine',
  {
    initial: 'idle',
    states: { idle: { on: { NEXT: { actions: 'increment' } } } },
  },
  {
    context: type('number'),

    eventsMap: type({ NEXT: 'never' }),
  },
);
