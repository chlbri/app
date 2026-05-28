import { createMachine } from '#exports/createMachine';
import { typings } from '#utils';

export default createMachine(
  'src/__tests__/machine/longRuns.cov.4.machine',
  {
    __longRuns: true,
    initial: 'idle',
    states: {
      idle: {
        on: { TEST: { target: 'idle', actions: 'slowAction' } },
      },
    },
  },
  {
    context: typings.context('number'),
  },
);
