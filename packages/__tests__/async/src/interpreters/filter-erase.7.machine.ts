import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/filter-erase.7.machine',
  {
    initial: 'init_state',
    states: {
      init_state: {
        entry: 'filterInit',
        on: { TRIGGER_ALWAYS: '/always_state', TRIGGER_AFTER: '/after_state' },
      },
      always_state: { always: { actions: 'filterAlways', target: '/final_state' } },
      after_state: {
        after: { DELAY: { actions: 'filterAfter', target: '/final_state' } },
      },
      final_state: {},
    },
  },
  {
    context: type(({ array }) => ({ numbers: array('number') })),
    eventsMap: type({ TRIGGER_ALWAYS: 'undefined', TRIGGER_AFTER: 'undefined' }),
  },
);
