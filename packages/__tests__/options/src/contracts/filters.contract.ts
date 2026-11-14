import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

/**
 * Sync filters machine.
 *
 * Exercises the `filter` and `erase` action helpers on a context array.
 */
export default createContract(
  'filters',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          FILTER: { actions: 'filterScores' },
          ERASE: { actions: 'eraseScores' },
        },
      },
    },
  },
  {
    context: type(({ array }) => ({ scores: array('number') })),
    eventsMap: type({ FILTER: 'never', ERASE: 'never' }),
    sync: true,
  },
);
