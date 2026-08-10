import { createMachine } from '@bemedev/app';
import { createConfig } from '@bemedev/app';

const simpleConfig = createConfig({
  initial: 'idle',
  states: { idle: { after: { DELAY: '/active' } }, active: {} },
});

export default createMachine(
  'src/__tests__/interpreters/selftransitions/after.1.machine',
  simpleConfig,
);
