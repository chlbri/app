import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/constructTests.machine',
  {
    initial: 'state1',
    states: {
      state1: {
        tags: 'tag1',
        on: {
          NEXT: '/state2',
        },
      },
      state2: {
        tags: ['tag2', 'tag3'],
        activities: {
          myActivity: 'activity1',
        },
        on: {
          PREVIOUS: '/state1',
        },
      },
    },
  },
  {
    context: type({
      count: 'number',
      name: 'string',
    }),
  },
);
