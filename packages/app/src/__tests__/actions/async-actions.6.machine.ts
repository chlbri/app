import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/actions/async-actions.6.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          FILTER: { actions: 'filterEven' },
        },
      },
    },
  },
  {
    context: type(({ array }) => ({
      items: array('number'),
    })),
  },
);
