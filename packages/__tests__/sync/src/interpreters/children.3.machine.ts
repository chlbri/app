import { createMachine } from '@bemedev/app';

export default createMachine(
  'src/__tests__/interpreters/children.3.machine',
  {
    initial: 'idle',
    actors: { child: { contexts: { '.': 'iterator' } } },
    states: { idle: {}, working: { on: { NEXT: '/idle' } } },
  },
  { sync: true },
);
