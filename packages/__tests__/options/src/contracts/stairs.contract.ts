import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

/**
 * Sync compound machine.
 *
 * Exercises nested states, their generated paths and transitions targeting a
 * compound node.
 */
export default createContract(
  'stairs',
  {
    initial: 'ground',
    states: {
      ground: { on: { UP: '/first' } },
      first: {
        initial: 'landing',
        states: { landing: { on: { UP: '/second' } }, closet: {} },
        on: { DOWN: '/ground' },
      },
      second: { on: { DOWN: '/first' } },
    },
  },
  { eventsMap: type({ UP: 'never', DOWN: 'never' }), sync: true },
);
