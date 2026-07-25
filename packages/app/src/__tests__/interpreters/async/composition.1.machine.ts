import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/composition.1.machine',
  {
    on: {
      ADD_CONDITION: { actions: 'addCondition' },
      REMOVE_CONDITION: { actions: 'removeCondition' },
    },
    initial: 'idle',
    states: {
      idle: {
        entry: 'inc',
        always: { guards: ['condition', 'limit'], target: '/working' },
        after: { DELAY: '/working' },
      },
      working: {
        entry: 'inc',
        always: { guards: ['condition', 'limit'], target: '/idle' },
        after: { DELAY: '/idle' },
      },
    },
  },
  {
    eventsMap: type({ ADD_CONDITION: 'never', REMOVE_CONDITION: 'never' }),

    context: type({ iterator: 'number', condition: 'boolean' }),
  },
);
