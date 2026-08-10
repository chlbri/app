import { createMachine } from '@bemedev/app';

export default createMachine(
  'src/__tests__/actions/async-actions.4.machine',
  {
    initial: 'idle',
    states: { idle: { on: { PING: { actions: 'ping' } } } },
  },
);
