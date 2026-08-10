import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/tags/tags.machine',
  {
    initial: 'idle',
    states: {
      idle: { tags: ['idle'], on: { NEXT: '/working' } },
      working: {
        tags: ['working', 'busy'],
        on: { NEXT: '/final', PREV: '/idle' },
      },
      final: {},
    },
  },
  { eventsMap: type({ NEXT: 'never', PREV: 'never' }) },
);
