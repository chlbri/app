import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/app-contract/typings';
import { notU } from '@bemedev/app/utils';
import { createPausable } from '@bemedev/rx-pausable';
import { interval } from 'rxjs/internal/observable/interval';
import { map } from 'rxjs/internal/operators/map';
import { take } from 'rxjs/internal/operators/take';
import { WAITERS } from './emitter1.machine';

export default createMachine(
  'src/__tests__/emitters/emitter3.machine',
  {
    initial: 'inactive',
    states: {
      inactive: { on: { NEXT: { target: '/active', guards: 'returnTrue' } } },
      active: {
        on: { NEXT: '/inactive' },
        actors: {
          interval1: {
            next: { actions: ['assigN'] },
            complete: ['mockCompleteAction'],
          },
        },
      },
    },
  },
  {
    context: type(({ optional }) => optional('number')),
    sync: true,

    actorsMap: type({
      emitters: { interval1: { next: 'number', error: 'undefined' } },
    }),
  },
).provideOptions(({ assign }) => ({
  actions: {
    assigN: assign({
      'interval1::next': ({ payload, context }) => {
        return notU(context) + payload;
      },
    }),
  },

  guards: { returnTrue: true },
  actors: {
    emitters: {
      interval1: () =>
        createPausable(
          interval(WAITERS.short).pipe(
            take(5),
            map(v => v + 1),
            map(v => v * 5),
          ),
        ),
    },
  },
}));
