import type { Fn } from '@bemedev/app/utils';

const createFn = <T extends Fn>(fn: T) => fn;

const buildFn = <
  const T extends 'string' | 'number',
  V extends (arg: T extends 'string' ? string : number) => any,
>(
  _: T,
  value: V,
) => value;

const dd = buildFn(
  'number',
  createFn(d => d),
);

console.log(dd(34));
