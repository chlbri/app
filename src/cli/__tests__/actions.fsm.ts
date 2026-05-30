import { createMachine } from '#exports/createMachine';
import { typings } from '#utils/typings';

export default createMachine(
  'actions',
  {
    initial: 'idle',
    states: { idle: {} },
  },
  {
    pContext: typings.pContext({
      count: 'number',
    }),
  },
);
