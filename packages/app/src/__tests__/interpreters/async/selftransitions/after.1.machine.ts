import { createMachine } from '#exports/createMachine';
import { createConfig } from '#common/functions';

const simpleConfig = createConfig({
  initial: 'idle',
  states: { idle: { after: { DELAY: '/active' } }, active: {} },
});

export default createMachine(
  'src/__tests__/interpreters/selftransitions/after.1.machine',
  simpleConfig,
);
