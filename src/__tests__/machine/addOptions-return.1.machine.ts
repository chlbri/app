import { createMachine } from '#machine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/machine/addOptions-return.1.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          INCREMENT: {
            actions: 'increment',
          },
        },
      },
    },
  },
  {
    eventsMap: type({
      INCREMENT: 'never',
    }),
    context: type('number'),
  },
);
