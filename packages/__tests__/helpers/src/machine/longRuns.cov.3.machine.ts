import { createMachine } from '@bemedev/app';
import { typings } from '@bemedev/app/utils';

export default createMachine(
  'src/__tests__/machine/longRuns.cov.3.machine',
  {
    initial: 'idle',
    states: {
      idle: { on: { TEST: { target: '/', actions: 'slowAction' } } },
    },
  },
  { context: typings.context('number') },
);
