import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

/**
 * Sync counter machine.
 *
 * Exercises `assign` (single key and constant), guarded by a plain event flow.
 */
export default createContract(
  'counter',
  {
    initial: 'idle',
    states: {
      idle: { on: { START: '/active' } },
      active: {
        tags: 'counting',
        on: {
          INC: { actions: 'increment' },
          RESET: { actions: 'reset' },
          STOP: '/idle',
        },
      },
    },
  },
  {
    context: type({ count: 'number' }),
    eventsMap: type({ START: 'never', INC: 'never', RESET: 'never', STOP: 'never' }),
    sync: true,
  },
);
