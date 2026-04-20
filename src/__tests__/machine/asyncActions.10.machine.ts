import { createMachine } from '#machine';
import { asyncActionsTypings1 } from './asyncActions.1.machine';

export default createMachine(
  'src/__tests__/machine/asyncActions.10.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          TEST: {
            target: 'idle',
            actions: 'myAction',
          },
        },
      },
    },
  },
  asyncActionsTypings1,
);
