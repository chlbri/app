import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/activities/perform.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        activities: {
          DELAY: 'inc',
        },
        on: {
          PAUSE: { actions: 'pause' },
          RESUME: { actions: 'resume' },
          STOP: { actions: 'stop' },
        },
      },
    },
  },
  {
    context: type({
      iterator: 'number',
    }),
  },
);
