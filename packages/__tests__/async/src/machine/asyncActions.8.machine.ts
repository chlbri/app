import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export const asyncActionsTypings8 = {
  eventsMap: type({ TEST: 'never', TEST2: 'never' }),
  context: type({
    count: 'number',
    name: 'string',
  }),
} as const;

export default createMachine(
  'src/__tests__/machine/asyncActions.8.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          TEST: { actions: 'myAction' },
          TEST2: { actions: 'myAction' },
        },
      },
    },
  },
  asyncActionsTypings8,
);
