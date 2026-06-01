import { DEFAULT_NOTHING } from '@bemedev/app/constants';
import { IS_TEST, sleep } from '@bemedev/app/utils';
import type { VitestUtils } from 'vitest';

export const fakeWaiter = (ms = 0, times = 1) => {
  const duration = ms * times;
  return sleep(duration);
};

export const asyncNothing = async () => {
  if (IS_TEST) {
    console.log(`${DEFAULT_NOTHING} call ${DEFAULT_NOTHING}`);
    return DEFAULT_NOTHING;
  }
  return;
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
