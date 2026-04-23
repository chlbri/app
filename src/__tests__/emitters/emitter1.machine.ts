import { createMachine } from '#machine';
import { type } from '@bemedev/typings';

export const WAITERS = {
  short: 200,
  medium: 500,
  long: 1000,
};

export default createMachine(
  'src/__tests__/emitters/emitter1.machine',
  {
    initial: 'inactive',
    actors: {
      interval: {
        next: {
          actions: ['assigN'],
        },
        complete: {
          actions: ['mockCompleteAction'],
        },
      },
    },
    states: {
      inactive: {
        on: {
          NEXT: '/active',
        },
      },
      active: {
        on: {
          NEXT: '/inactive',
        },
      },
    },
  },
  {
    context: type('number'),
    actorsMap: type({
      emitters: {
        interval: {
          next: 'number',
          error: 'never',
        },
      },
    }),
  },
);
