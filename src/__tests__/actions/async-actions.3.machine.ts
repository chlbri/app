import { createMachine } from '#machine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/actions/async-actions.3.machine',
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
