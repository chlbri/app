import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/actions/async-actions.1.machine',
  {
    initial: 'idle',
    states: {
      idle: { on: { LOAD: { actions: 'loadUser', target: '/' } } },
    },
  },
  { context: type({ name: 'string' }) },
);
