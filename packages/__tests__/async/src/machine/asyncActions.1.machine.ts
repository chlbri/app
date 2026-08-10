import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export const asyncActionsTypings1 = {
  eventsMap: type({ TEST: 'never' }),
  context: type('number'),
} as const;

export default createMachine(
  'src/__tests__/machine/asyncActions.1.machine',
  {
    initial: 'idle',
    states: { idle: { on: { TEST: { actions: 'myAction' } } } },
  },
  asyncActionsTypings1,
);
