import { createMachine } from '#machine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/filter-erase.1.machine',
  {
    initial: 'state1',
    states: {
      state1: {
        on: {
          ADD: {
            actions: 'addNumbers',
          },
          FILTER: {
            actions: 'filterEven',
            target: '/state2',
          },
        },
      },
      state2: {
        on: {
          RESET: '/state1',
        },
      },
    },
  },
  {
    context: type(({ array }) => ({
      numbers: array('number'),
    })),

    eventsMap: type(({ array }) => ({
      ADD: { values: array('number') },
      FILTER: 'never',
      RESET: 'never',
    })),
  },
);
