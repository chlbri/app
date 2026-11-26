import { createMachine } from '@bemedev/app';

const idM = { name: 'machineNotDefined' };

export default createMachine('src/__tests__/machine/cov.3.machine', {
  initial: 'idle',
  states: { idle: {} },
  actors: { [idM.name]: { on: {} } },
});
