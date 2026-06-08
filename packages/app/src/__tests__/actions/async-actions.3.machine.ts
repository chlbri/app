import { createMachine } from '#exports/createMachine';
import { typings } from '#utils';

export default createMachine(
  'src/__tests__/actions/async-actions.3.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          LOAD: { actions: 'loadUser' },
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
