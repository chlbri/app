import { isFnPromise } from '#utils';
import type { Fn } from '~types';

/**
 * Runtime validation function to check if a value is an async function map.
 * An async function map contains functions that return Promises.
 */
export function isAsyncFnMap(value: unknown): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const obj = value as Record<string, unknown>;
  const functions = Object.values(obj).filter(
    (v): v is Fn => typeof v === 'function',
  );

  // Must have at least one function
  if (functions.length === 0) {
    return false;
  }

  // Check if any function returns a Promise
  for (const fn of functions) {
    const check = isFnPromise(fn);
    if (check) return true;
  }

  return false;
}
