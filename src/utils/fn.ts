import type { Fn } from '#bemedev/globals/types';

export const isFnPromise = (
  value: unknown,
): value is Fn<any[], Promise<any>> => {
  return (
    !!value &&
    typeof value === 'function' &&
    value.constructor.name === 'AsyncFunction'
  );
};
