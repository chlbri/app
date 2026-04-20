import { createMachine } from '#machine';
import { type } from '@bemedev/typings';

const machine = createMachine(
  'src/__tests__/machine/addOptions-return.4.machine',
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

export default machine;
