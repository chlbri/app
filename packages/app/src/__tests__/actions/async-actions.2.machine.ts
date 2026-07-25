import { type } from '@bemedev/typings';
import { createMachine } from '../../exports/createMachine';

export default createMachine(
  'src/__tests__/actions/async-actions.2.machine',
  {
    initial: 'idle',
    states: {
      idle: { on: { LOAD: { actions: 'loadUser', target: '/' } } },
    },
  },
  { context: type({ name: 'string' }) },
);
