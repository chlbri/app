import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/coverage/addOptions-return.3.machine',
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
          ],
        },
      },
      positive: {},
    },
  },
  {
    context: type('number'),
    eventsMap: type({
      CHECK: 'never',
    }),
  },
);
