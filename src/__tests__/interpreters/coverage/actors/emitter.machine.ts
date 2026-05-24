import { createMachine } from '#machine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/coverage/actors/emitter.machine',
  {
    initial: 'inactive',
    states: {
      inactive: {
        on: { NEXT: '/active' },
        actors: {
          interval: { next: { actions: ['assignN'] } },
        },
      },
      active: {
        on: { NEXT: '/inactive' },
        actors: {
          interval: { next: { actions: ['assignN'] } },
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
