import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';
import * as v from 'valibot';

export default createMachine(
  'src/__tests__/interpreters/legacy-options.10.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          FIRST: { actions: 'first' },
          SECOND: { actions: 'second' },
        },
      },
    },
  },
  {
    context: v.number(),

    eventsMap: type({
      FIRST: 'never',
      SECOND: 'never',
    }),
    sync: true,
  },
);
