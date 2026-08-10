import { createMachine } from '@bemedev/app';

export default createMachine(
  'src/__tests__/interpreters/selftransitions/always.2.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        after: { DELAY3: '/notActive' },
        always: { guards: 'returnFalse', target: '/active' },
      },
      active: {},
      notActive: {},
    },
  },
);
