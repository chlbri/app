import { createMachine } from '#exports/createMachine';

export default createMachine('src/__tests__/guards/index.2.machine', {
  initial: 'state1',
  states: {
    state1: {
      always: {
        guards: 'guard1',
        target: '/state2',
      },
    },
    state2: {
      on: {
        NEXT: '/state1',
      },
    },
  },
});
