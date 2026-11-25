import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/app-contract/typings';

export default createMachine(
  'src/__tests__/interpreters/coverage/addOptions-return.2.machine',
  { initial: 'idle', states: { idle: {} } },
  { context: type('number'), sync: true },
);
