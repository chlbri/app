import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/app-contract/typings';

export default createMachine(
  'src/__tests__/actions/async-actions.3.machine',
  { initial: 'idle', states: { idle: { on: { LOAD: { actions: 'loadUser' } } } } },
  { context: type({ name: 'string' }), eventsMap: type({ LOAD: 'undefined' }) },
);
