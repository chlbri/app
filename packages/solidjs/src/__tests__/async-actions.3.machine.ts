import { createMachine } from '@bemedev/app';
import { typings } from '@bemedev/app';

export default createMachine(
  'src/__tests__/actions/async-actions.3.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          LOAD: { actions: 'loadUser', target: '/idle' },
        },
      },
    },
  },
  {
    context: typings.context({
      name: 'string',
    }),
    eventsMap: typings.eventsMap({
      LOAD: 'undefined',
    }),
  },
);
