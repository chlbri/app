import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/machine/longRuns.cov.2.machine',
  { initial: 'idle', states: { idle: {} } },
  {
    context: type('number'),
  },
);
