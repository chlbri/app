import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

/**
 * Sync wizard machine.
 *
 * Exercises `isDefined` and `guardBatch` on a multi-step flow.
 */
export default createContract(
  'wizard',
  {
    initial: 'personal',
    states: {
      personal: {
        on: {
          SET_NAME: { actions: 'setName' },
          NEXT: { target: '/address', guards: 'canGo' },
        },
      },
      address: {
        on: {
          SET_ADDRESS: { actions: 'setAddress' },
          BACK: '/personal',
          NEXT: { target: '/review', guards: 'canReview' },
        },
      },
      review: {
        on: { BACK: '/address', SUBMIT: { target: '/done', guards: 'canReview' } },
      },
      done: {},
    },
  },
  {
    context: type({ name: 'string', address: 'string' }),
    eventsMap: type({
      SET_NAME: { name: 'string' },
      SET_ADDRESS: { address: 'string' },
      NEXT: 'never',
      BACK: 'never',
      SUBMIT: 'never',
    }),
    sync: true,
  },
);
