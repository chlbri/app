import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/legacy-options.9.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          CHECK: [
            {
              guards: 'isPositive',
              target: '/positive',
            },
            {
              guards: 'isNegative',
              target: '/negative',
            },
          ],
        },
      },
      positive: {},
      negative: {},
    },
  },
  {
    context: type('number'),

    eventsMap: type({
      CHECK: 'never',
    }),
  },
);
