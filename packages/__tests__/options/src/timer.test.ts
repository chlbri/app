import { createOptions } from '@bemedev/app-options';

import timer from './contracts/timer.contract';
import { interpretContract, machineWithOptions } from './fixtures';

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

describe('#01 => timer', () => {
  const options = createOptions(timer)(() => ({ delays: { DELAY: 100 } }));
  const service = interpretContract(machineWithOptions(timer, options));

  test('#01 => starts idle', () => {
    service.start();
    expect(service.state.value).toBe('idle');
  });

  test('#02 => START enters the waiting state', () => {
    service.send('START');
    expect(service.state.value).toBe('waiting');
  });

  test('#03 => the after transition fires after the delay', async () => {
    await vi.advanceTimersByTimeAsync(0);
    expect(service.state.value).toBe('waiting');

    await vi.advanceTimersByTimeAsync(100);
    expect(service.state.value).toBe('done');
  });
});
