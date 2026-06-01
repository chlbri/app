import { createMachine } from '#exports/createMachine';
import { asyncActionsTypings1 } from './asyncActions.1.machine';

export default createMachine(
  'src/__tests__/machine/asyncActions.2.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          TEST: {
            actions: 'myAction',
          },
        },
      },
    },
  },
  asyncActionsTypings1,
);
