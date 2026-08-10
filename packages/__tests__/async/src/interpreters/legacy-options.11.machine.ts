import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/legacy-options.11.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: { ADD: { actions: 'add' }, MULTIPLY: { actions: 'multiply' } },
      },
    },
  },
  {
    context: type('number'),

    eventsMap: type({ ADD: 'never', MULTIPLY: 'never' }),
  },
);
