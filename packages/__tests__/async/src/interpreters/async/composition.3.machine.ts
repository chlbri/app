import { createMachine } from '@bemedev/app';

export default createMachine(
  'src/__tests__/interpreters/composition.3.machine',
  {
    initial: 'idle',
    states: { idle: { after: { NEXT: { actions: 'inc' } } } },
  },
);
