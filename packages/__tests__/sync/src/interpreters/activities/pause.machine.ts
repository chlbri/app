import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/activities/pause.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        entry: 'inc',
        on: {
          PAUSE: { actions: 'pause' },
          RESUME: { actions: 'resume' },
          STOP: { actions: 'stop' },
          NEXT: '/next',
        },
      },
      next: { always: '/idle' },
    },
  },
  { context: type({ iterator: 'number' }), sync: true },
);
