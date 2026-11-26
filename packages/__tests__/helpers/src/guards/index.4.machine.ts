import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/app-contract/typings';

export default createMachine(
  'src/__tests__/guards/index.4.machine',
  {
    initial: 'state1',
    states: {
      state1: {
        always: {
          guards: [
            'returnTrue',
            {
              or: [
                'returnFalse',
                { and: [{ name: 'returnTrue' }, 'returnTrue2'] },
                { name: 'returnFalse2' },
              ],
            },
          ],
          target: '/state2',
        },
      },
      state2: {},
    },
  },
  { pContext: type({ data: 'string' }), context: type({ data: 'number' }) },
);
