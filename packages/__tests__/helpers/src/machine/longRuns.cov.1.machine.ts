import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';
export default createMachine(
  'src/__tests__/machine/longRuns.cov.1.machine',
  { __longRuns: true, initial: 'idle', states: { idle: {} }, on: {} },
  { context: type('number') },
);
