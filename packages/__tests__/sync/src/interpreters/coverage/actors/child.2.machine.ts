import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/coverage/actors/child.2.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: { NEXT: '/working' },
        actors: { child: { contexts: { '.': 'all', iter1: 'iter1' } } },
      },
      working: {
        on: { NEXT: '/idle' },
        actors: { child: { contexts: { iter2: 'iter2' } } },
      },
    },
  },
  {
    pContext: type({
      iter1: 'number',
      iter2: 'number',
      all: { iter1: 'number', iter2: 'number' },
    }),
    sync: true,
  },
);
