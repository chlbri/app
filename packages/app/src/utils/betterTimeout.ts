import { DEFAULT_MAX_TIME_PROMISE } from '#constants';

export const MAX_TIME = DEFAULT_MAX_TIME_PROMISE;

export interface BetterTimeoutOptions {
  callback: () => void;
  onError?: (error: unknown) => any;
  ms: number;
  maxTime?: number;
}

/**
 * A callback-based timeout utility that uses setTimeout.
 * If the execution time exceeds the maxTime (default MAX_TIME), the onError callback is triggered.
 * Otherwise, the success callback is executed when the specified ms delay has elapsed.
 */
export function betterTimeout({
  callback,
  onError,
  ms,
  maxTime = MAX_TIME,
}: BetterTimeoutOptions): void {
  const isExceeded = ms > maxTime;
  const delay = isExceeded ? maxTime : ms;

  setTimeout(() => {
    try {
      if (isExceeded) throw new Error('MAX_EXCEEDED');
      callback();
    } catch (error) {
      onError?.(error);
    }
  }, delay);
}
