import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

/**
 * Async authentication machine.
 *
 * Exercises an async `assign` reading the event payload, a guard on the
 * private context, and the async machine flavor (no `sync` flag).
 */
export default createContract(
  'auth',
  {
    initial: 'anonymous',
    states: {
      anonymous: {
        on: {
          LOGIN: {
            target: '/authenticated',
            actions: 'setUser',
            guards: 'hasToken',
          },
        },
      },
      authenticated: { on: { LOGOUT: '/anonymous' } },
    },
  },
  {
    context: type({ user: 'string' }),
    pContext: type({ token: 'string' }),
    eventsMap: type({ LOGIN: { name: 'string' }, LOGOUT: 'never' }),
  },
);
