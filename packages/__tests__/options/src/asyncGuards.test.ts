import { createOptions } from '@bemedev/app-options';

import asyncGuards from './contracts/asyncGuards.contract';
import { interpretContract, machineWithOptions } from './fixtures';

const options = createOptions(asyncGuards)(({ guardBatch, isValue }) => ({
  guards: {
    canRun: guardBatch(
      isValue('context.count', 1),
      async ({ context }) => context.count > 0,
    ),
  },
}));

describe('#01 => asyncGuards', () => {
  describe('#01 => passing guard', () => {
    const machine = machineWithOptions(asyncGuards, options);
    const service = interpretContract(machine, { context: { count: 1 } });

    test('#01 => RUN reaches done', async () => {
      await service.start();
      await service.send('RUN');
      expect(service.state.value).toBe('done');
    });
  });

  describe('#02 => failing guard', () => {
    const machine = machineWithOptions(asyncGuards, options);
    const service = interpretContract(machine, { context: { count: 2 } });

    test('#01 => RUN stays idle', async () => {
      service.start();
      await service.send('RUN');
      expect(service.state.value).toBe('idle');
    });
  });
});
