import { createMachine } from '@bemedev/app';
import { plugin } from '@bemedev/app-bemedev-plugins';
import { type } from '@bemedev/app-contract/typings';

export default createMachine(
  'src/__tests__/actions/async-actions.1.machine',
  {
    initial: 'idle',
    states: { idle: { on: { LOAD: { actions: 'loadUser', target: '/' } } } },
  },
  { context: type({ name: 'string' }), plugins: [plugin] },
);
