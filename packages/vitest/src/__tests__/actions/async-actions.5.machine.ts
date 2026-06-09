import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/actions/async-actions.5.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          PING: { actions: 'ping', target: '/' },
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
