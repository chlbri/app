import type { Cb } from '@bemedev/app/bemedev';
import { useCallback, useEffect, useRef, useState } from 'react';

export const ONE_SECOND = 1000;

/**
 * A custom hook that counts down from a given duration in seconds.
 * @param duration - The duration in seconds.
 * @returns An object containing the count, start, stop, and reset functions.
 */
export const useSecondTicks = (total: number, cb: Cb = () => {}) => {
  const [count, setCount] = useState(total);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCount(prev => {
        if (prev === 1) return total;
        return prev - 1;
      });
    }, ONE_SECOND);
  }, []);

  useEffect(() => {
    const interval = setInterval(cb, total * ONE_SECOND);
    return () => clearInterval(interval);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setCount(total);
  }, []);

  useEffect(() => {
    start();
    return () => {
      stop();
      reset();
    };
  }, []);

  return { count, start, stop, reset };
};
