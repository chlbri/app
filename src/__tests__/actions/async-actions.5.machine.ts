import { createMachine } from '#machine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/actions/async-actions.5.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          PING: { actions: 'ping', target: '/idle' },
        },
      },
    },
  },
  {
    context: type({
      errored: 'boolean',
    }),
  },
);
