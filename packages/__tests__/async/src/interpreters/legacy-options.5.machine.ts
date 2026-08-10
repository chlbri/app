import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';

export default createMachine(
  'src/__tests__/interpreters/legacy-options.5.machine',
  { initial: 'idle', states: { idle: {} } },
  { context: type('number') },
);
