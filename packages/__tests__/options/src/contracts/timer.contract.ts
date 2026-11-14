import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

/**
 * Sync timer machine.
 *
 * Exercises `after` transitions and the `delays` option category.
 */
export default createContract(
  'timer',
  {
    initial: 'idle',
    states: {
      idle: { on: { START: '/waiting' } },
      waiting: { after: { DELAY: '/done' } },
      done: {},
    },
  },
  { eventsMap: type({ START: 'never' }), sync: true },
);
