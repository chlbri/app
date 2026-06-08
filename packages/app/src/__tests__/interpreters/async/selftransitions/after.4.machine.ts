import { createMachine } from '#exports/createMachine';

export default createMachine(
  'src/__tests__/interpreters/selftransitions/after.4.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        after: {
          DELAY2: { target: '/active' },
        },
        on: {
          NEXT: '/active',
        },
      },
      active: {
        on: {
          NEXT: '/idle',
        },
      },
    },
  },
);
