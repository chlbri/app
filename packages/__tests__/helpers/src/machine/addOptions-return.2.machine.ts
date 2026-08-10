import { createMachine } from '@bemedev/app';

export default createMachine(
  'src/__tests__/machine/addOptions-return.2.machine',
  { initial: 'idle', states: { idle: {} } },
);
