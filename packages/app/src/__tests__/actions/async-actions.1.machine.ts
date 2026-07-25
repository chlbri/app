import { createMachine } from '#exports/createMachine';
import * as v from 'valibot';

export default createMachine(
  'src/__tests__/actions/async-actions.1.machine',
  {
    initial: 'idle',
    states: {
      idle: { on: { LOAD: { actions: 'loadUser', target: '/' } } },
    },
  },
  { context: v.object({ name: v.string() }) },
);
