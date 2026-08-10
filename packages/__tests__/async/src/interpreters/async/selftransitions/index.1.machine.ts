import { createMachine } from '@bemedev/app';

export default createMachine(
  'src/__tests__/interpreters/selftransitions/index.1.machine',
  {
    initial: 'idle',
    states: { idle: { after: { DELAY: '/active' } }, active: {} },
  },
);
