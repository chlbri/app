import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

/**
 * Sync toggle machine.
 *
 * Exercises multi-key `assign` together with the `isValue` / `isNotValue`
 * guard helpers.
 */
export default createContract(
  'toggle',
  {
    initial: 'off',
    states: {
      off: { on: { TOGGLE: { target: '/on', actions: 'enable', guards: 'isOff' } } },
      on: { on: { TOGGLE: { target: '/off', actions: 'disable', guards: 'isOn' } } },
    },
  },
  {
    context: type({ enabled: 'boolean', changes: 'number' }),
    eventsMap: type({ TOGGLE: 'never' }),
    sync: true,
  },
);
