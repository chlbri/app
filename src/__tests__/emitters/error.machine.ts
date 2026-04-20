import { createMachine } from '#machine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/emitters/error.machine',
  {
    initial: 'idle',
    actors: {
      interval: {
        next: {
          actions: ['assigN'],
        },
        error: {
          actions: ['signals'],
        },
      },
    },
    states: {
      idle: {},
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
