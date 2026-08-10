import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/machine/longRuns.cov.5.machine',
  {
    __longRuns: true,
    initial: 'idle',
    states: { idle: { after: { DELAY: '/active' } }, active: {} },
  },
  { context: type('number') },
);
