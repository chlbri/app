import type { Fn } from '@bemedev/app-utils-bemedev';

/**
 * Type guard to check if a given value is an asynchronous function returning a `Promise`.
 *
 * @param value - The value to inspect.
 *
 * @returns `true` if `value` is an `AsyncFunction`, `false` otherwise.
 */
export const isFnPromise = (
  value: unknown,
): value is Fn<any[], Promise<any>> => {
  return (
    !!value &&
    typeof value === 'function' &&
    value.constructor.name === 'AsyncFunction'
  );
};
