import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/actions/async-actions.8.machine',
  {
    initial: 'idle',
    states: { idle: { on: { INC: { actions: 'inc' } } } },
  },
  { context: type('number') },
);
