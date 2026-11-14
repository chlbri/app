import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

/**
 * Sync parallel machine.
 *
 * Exercises a parallel root node and the resulting composite state value.
 */
export default createContract(
  'parallel',
  {
    type: 'parallel',
    states: {
      left: {
        initial: 'off',
        states: {
          off: { on: { TOGGLE: '/left/on' } },
          on: { on: { TOGGLE: '/left/off' } },
        },
      },
      right: {
        initial: 'idle',
        states: { idle: { on: { ADVANCE: '/right/advanced' } }, advanced: {} },
      },
    },
  },
  { eventsMap: type({ TOGGLE: 'never', ADVANCE: 'never' }), sync: true },
);
