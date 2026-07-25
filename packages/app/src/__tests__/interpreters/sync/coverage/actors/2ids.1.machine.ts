import { createMachine } from '#exports/createMachine';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/coverage/actors/2ids.1.machine',
  { activities: { DELAY: ['inc'], DELAY2: ['inc2'] } },
  { context: type({ iter1: 'number', iter2: 'number' }), sync: true },
);
