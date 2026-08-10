import { createMachine } from '@bemedev/app';
import { typings } from '@bemedev/app/utils';

export default createMachine(
  'src/__tests__/interpreters/coverage/addOptions-return.2.machine',
  { initial: 'idle', states: { idle: {} } },
  { context: typings.context('number') },
);
