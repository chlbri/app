import { sleep } from '@bemedev/app/utils';
import type { VitestUtils } from 'vitest';

export const fakeWaiter = async (vi: VitestUtils, ms = 0, times = 1) => {
  const check = vi.isFakeTimers();
  const duration = ms * times;
  if (check) await vi.advanceTimersByTimeAsync(duration);
  else await sleep(duration);
};

export const mockConsole = (vi: VitestUtils) => {
  const fnLog = vi.spyOn(console, 'log');
  const fnError = vi.spyOn(console, 'error');

  beforeAll(() => {
    const fn = () => void 0;
    fnLog.mockImplementation(fn);
    fnError.mockImplementation(fn);
  });

  afterAll(() => {
    fnLog.mockRestore();
    fnError.mockRestore();
  });
};
