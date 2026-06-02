import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/app/bemedev';

export default createMachine(
  'src/__tests__/actions/async-actions.4.machine',
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
    eventsMap: type({
      PING: 'undefined',
    }),
  },
);
