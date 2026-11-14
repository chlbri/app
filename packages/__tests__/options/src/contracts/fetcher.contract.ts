import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

/**
 * Async fetcher machine.
 *
 * Exercises the `catch` option of an async `assign`, turning a rejection into
 * a context update.
 */
export default createContract(
  'fetcher',
  {
    initial: 'idle',
    states: {
      idle: { on: { FETCH: { target: '/loading', actions: 'load' } } },
      loading: { on: { RETRY: '/idle' } },
    },
  },
  {
    context: type({ status: 'string' }),
    eventsMap: type({ FETCH: 'never', RETRY: 'never' }),
  },
);
