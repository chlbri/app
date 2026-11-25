import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/app-contract/typings';
import { helpers } from '@bemedev/app-contract/typings';

const person = helpers.any({ name: 'string', age: 'number', active: 'boolean' });

export default createMachine(
  'src/__tests__/interpreters/filter-erase.2.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          ADD_PEOPLE: { actions: 'addPeople' },
          FILTER_ACTIVE: { actions: 'filterActive', target: '/filtered' },
        },
      },
      filtered: {},
    },
  },
  {
    context: type(({ array }) => ({ people: array(person) })),

    eventsMap: type(({ array }) => ({
      ADD_PEOPLE: { people: array(person) },
      FILTER_ACTIVE: 'never',
    })),
    sync: true,
  },
);
