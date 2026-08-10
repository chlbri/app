import { createMachine } from '@bemedev/app';
import { typings } from '@bemedev/app/utils';

export const WAITERS = { short: 200, medium: 500, long: 1000 };

export default createMachine(
  'src/__tests__/emitters/emitter1.machine',
  {
    initial: 'inactive',
    actors: {
      interval: {
        next: { actions: ['assigN'] },
        complete: { actions: ['mockCompleteAction'] },
      },
    },
    states: {
      inactive: { on: { NEXT: '/active' } },
      active: { on: { NEXT: '/inactive' } },
    },
  },
  {
    context: typings.context('number'),
    actorsMap: typings.actorsMap({
      emitters: { interval: { next: 'number', error: 'undefined' } },
    }),
  },
);
