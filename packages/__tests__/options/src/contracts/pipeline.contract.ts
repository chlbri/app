import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

/**
 * Sync pipeline machine.
 *
 * Exercises an `always` transition and entry actions.
 */
export default createContract(
  'pipeline',
  {
    initial: 'start',
    states: {
      start: { always: '/processing' },
      processing: {
        entry: 'prepare',
        on: { FINISH: { target: '/completed', actions: 'complete' } },
      },
      completed: {},
    },
  },
  {
    context: type({ steps: 'number' }),
    eventsMap: type({ FINISH: 'never' }),
    sync: true,
  },
);
