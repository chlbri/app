import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/composition.4.machine',
  {
    initial: 'idle',
    states: { idle: { after: { DELAY: { actions: 'inc2' } } } },
  },
  { context: type({ iterator: 'number' }) },
);
