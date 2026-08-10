import { createMachine } from '@bemedev/app';
import { notU, typings } from '@bemedev/app/utils';
import { createPausable } from '@bemedev/rx-pausable';
import { type } from '@bemedev/typings';
import { interval } from 'rxjs/internal/observable/interval';
import { map } from 'rxjs/internal/operators/map';
import { take } from 'rxjs/internal/operators/take';
import { WAITERS } from './emitter1.machine';

export default createMachine(
  'src/__tests__/emitters/emitter3.machine',
  {
    initial: 'inactive',
    states: {
      inactive: { on: { NEXT: '/active' } },
      active: {
        on: { NEXT: '/inactive' },
        actors: {
          interval1: {
            next: {
              actions: [{ name: 'assigN', description: 'dsdsdds' }],
              guards: '',
            },
            description: 'Interval emitter for active state',
            complete: {
              name: 'mockCompleteAction',
              description: 'Mock complete action',
            },
          },
        },
      },
    },
  },
  {
    context: type(({ optional }) => optional('number')),
    actorsMap: typings.actorsMap({
      emitters: { interval1: { next: 'number', error: 'undefined' } },
    }),
  },
).provideOptions(({ assign }) => ({
  actions: {
    assigN: assign('context', {
      'interval1::next': ({ payload, context }) => {
        return notU(context) + payload;
      },
    }),
  },
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
