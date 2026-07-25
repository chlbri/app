import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/actions/sendToActions/sendToActions2.machine',
  {
    entry: 'init',
    initial: 'idle',
    states: {
      idle: {
        on: {
          DECREMENT: { actions: 'dec' },
          INCREMENT: { actions: 'inc' },
          REDECREMENT: { actions: 'sendDec' },
          NEXT: '/next',
        },
      },
      next: {
        on: {
          NEXT: '/idle',
          'INCREMENT.FORCE': { actions: 'forceSendInc' },
          REDECREMENT: { actions: 'sendDec' },
        },
      },
    },
  },
  { context: type(({ partial }) => partial({ iterator: 'number' })) },
);
