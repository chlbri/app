import { createMachine } from '#machine';
import { typings } from '#utils';

export const asyncActionsTypings1 = {
  eventsMap: typings.eventsMap({
    TEST: 'never',
  }),
  context: typings.context('number'),
} as const;

export default createMachine(
  'src/__tests__/machine/asyncActions.1.machine',
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
