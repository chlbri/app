import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/app-contract/typings';

export const WAITERS = { short: 200, medium: 500, long: 1000 };

export default createMachine(
  'src/__tests__/emitters/emitter1.machine',
  {
    initial: 'inactive',
    actors: {
      interval: {
        next: { actions: ['assigN'], guards: 'returnTrue' },
        complete: { actions: ['mockCompleteAction'] },
      },
    },
    states: {
      inactive: { on: { NEXT: '/active' } },
      active: { on: { NEXT: '/inactive' } },
    },
  },
  {
    context: type('number'),
    sync: true,

    actorsMap: type({
      emitters: { interval: { next: 'number', error: 'undefined' } },
    }),
  },
);
