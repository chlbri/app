import { createMachine } from '#exports/createMachine';

export default createMachine(
  'src/__tests__/interpreters/children.5.machine',
  {
    actors: { child: { on: { NEXT: { actions: ['notify'] } } } },
    initial: 'idle',
    states: { idle: { on: { NEXT: { actions: ['sendChildNext'] } } } },
  },
);
