import { createMachine } from '@bemedev/app';
import { plugin } from '@bemedev/app-bemedev-plugins';
import { type } from '@bemedev/app-contract/typings';

export default createMachine(
  'src/__tests__/actions/action.batch.cov.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          INC1: { actions: 'inc1' },
          INC2: { actions: 'inc2' },
          INC5: { actions: 'inc5' },
        },
      },
    },
  },
  { context: type('number'), plugins: [plugin] },
);
