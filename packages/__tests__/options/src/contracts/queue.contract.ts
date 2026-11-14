import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

/**
 * Sync queue machine.
 *
 * Exercises `batch`, `_for` and chained `assign` helpers.
 */
export default createContract(
  'queue',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          PUSH: { actions: 'push' },
          FLUSH: { target: '/busy', actions: 'flush' },
        },
      },
      busy: { on: { DONE: '/idle' } },
    },
  },
  {
    context: type({ pending: 'number', processed: 'number' }),
    eventsMap: type({ PUSH: 'never', FLUSH: 'never', DONE: 'never' }),
    sync: true,
  },
);
