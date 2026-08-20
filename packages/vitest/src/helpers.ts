import { sleep } from '@bemedev/sleep';
import type { VitestUtils } from 'vitest';

/**
 * Asynchronously waits for a specified duration using Vitest fake timers or real delay.
 *
 * @param vi - Vitest utility instance.
 * @param ms - Duration in milliseconds to wait.
 * @param times - Multiplier for duration.
 *
 * @see {@linkcode sleep}
 */
export const fakeWaiter = async (vi: VitestUtils, ms = 0, times = 1) => {
  const check = vi.isFakeTimers();
  const duration = ms * times;
  if (check) await vi.advanceTimersByTimeAsync(duration);
  else await sleep(duration);
};
