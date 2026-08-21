import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

const context = type('number');

export default createMachine(
  'src/__tests__/interpreters/coverage/index.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        entry: ['inc'],
        on: {
          INC: { actions: ['inc', 'neverRun'] },
          'INC.PRIVATE': { actions: 'incPrivate' },
          NEXT: {
            description: 'Next',
            actions: ['inc', 'incPrivate'],
            target: '/final',
          },
        },
      },
      final: {},
    },
  },
  { context, pContext: context, sync: true },
);
