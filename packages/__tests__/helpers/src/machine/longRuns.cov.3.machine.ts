import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/app-contract/typings';

export default createMachine(
  'src/__tests__/machine/longRuns.cov.3.machine',
  {
    initial: 'idle',
    states: { idle: { on: { TEST: { target: '/', actions: 'slowAction' } } } },
  },
  { context: type('number') },
);
