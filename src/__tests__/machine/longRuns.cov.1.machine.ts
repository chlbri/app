import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/machine/longRuns.cov.1.machine',
  { __longRuns: true, initial: 'idle', states: { idle: {} } },
  {
    context: type('number'),
  },
);
