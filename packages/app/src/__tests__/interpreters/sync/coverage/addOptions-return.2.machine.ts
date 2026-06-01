import { createMachine } from '#exports/createMachine';
import { typings } from '#utils';

export default createMachine(
  'src/__tests__/interpreters/coverage/addOptions-return.2.machine',
  {
    initial: 'idle',
    states: {
      idle: {},
    },
  },
  {
    context: typings.context('number'),
    sync: true,
  },
);
