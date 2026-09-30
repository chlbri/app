import { createMachine } from '@bemedev/app';
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
