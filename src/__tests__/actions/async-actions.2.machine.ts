import { type } from '@bemedev/typings';
import { createMachine } from '../../exports/machine';

export default createMachine(
  'src/__tests__/actions/async-actions.2.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          LOAD: { actions: 'loadUser', target: '/idle' },
        },
      },
    },
  },
  {
    context: type({
      name: 'string',
    }),
  },
);
