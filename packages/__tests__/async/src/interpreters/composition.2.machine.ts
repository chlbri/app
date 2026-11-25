import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/app-contract/typings';

export default createMachine(
  'src/__tests__/interpreters/composition.2.machine',
  { initial: 'idle', states: { idle: { on: { NEXT: { actions: 'inc' } } } } },
  { eventsMap: type({ NEXT: 'never' }) },
);
