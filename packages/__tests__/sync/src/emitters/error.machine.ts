import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/emitters/error.machine',
  {
    initial: 'idle',
    actors: {
      interval: {
        next: { actions: ['assigN'] },
        error: { actions: ['signals'] },
      },
    },
    states: { idle: {} },
  },
  {
    context: type('number'),
    sync: true,

    actorsMap: type({
      ccxc: 'any',
      emitters: { interval: { next: 'number', error: 'never' } },
    }),
  },
);
