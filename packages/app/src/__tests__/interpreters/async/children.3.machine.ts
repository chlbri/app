import { createMachine } from '#exports/createMachine';

export default createMachine(
  'src/__tests__/interpreters/children.3.machine',
  {
    initial: 'idle',
    actors: { child: { contexts: { '.': 'iterator' } } },
    states: { idle: {}, working: { on: { NEXT: '/idle' } } },
  },
);
