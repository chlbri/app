import { createSyncMachine } from '../../sync/machine';

export default createSyncMachine(
  'src/__tests__/actions/actions.2.machine',
  {
    initial: 'state1',
    states: {
      state1: {
        always: {
          actions: {
            name: 'action1',
            description: 'Just an action',
          },
          target: '/state2',
        },
      },
      state2: {
        on: {
          NEXT: '/state1',
        },
      },
    },
  },
);
