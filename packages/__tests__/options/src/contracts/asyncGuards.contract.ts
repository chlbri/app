import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

/**
 * Async guards machine.
 *
 * Exercises `guardBatch` mixing a sync `isValue` guard with an async predicate.
 */
export default createContract(
  'asyncGuards',
  {
    initial: 'idle',
    states: {
      idle: { on: { RUN: { target: '/done', guards: 'canRun' } } },
      done: {},
    },
  },
  { context: type({ count: 'number' }), eventsMap: type({ RUN: 'never' }) },
);
