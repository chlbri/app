import { createOptions } from '@bemedev/app-options';

import fetcher from './contracts/fetcher.contract';
import { interpretContract, machineWithOptions } from './fixtures';

describe('#01 => fetcher', () => {
  const options = createOptions(fetcher)(({ assign }) => ({
    actions: {
      load: assign(
        'status',
        async () => {
          throw new Error('boom');
        },
        {
          catch: () => () => ({
            mergers: [{ key: 'status', source: { status: 'error' } }],
          }),
        },
      ),
    },
  }));

  const machine = machineWithOptions(fetcher, options);

  const service = interpretContract(machine, { context: { status: 'idle' } });

  test('#01 => starts idle', async () => {
    await service.start();
    expect(service.state.value).toBe('idle');
  });

  test('#02 => FETCH enters loading', async () => {
    await service.send('FETCH');
    expect(service.state.value).toBe('loading');
  });

  test('#03 => the catch handler updates the context', () => {
    expect(service.select('status')).toBe('error');
  });

  test('#04 => RETRY goes back to idle', async () => {
    await service.send('RETRY');
    expect(service.state.value).toBe('idle');
  });
});
