import equal from 'fast-deep-equal';

export { decompose, decomposeSV, recompose } from '@bemedev/decompose';

export type { Decompose, DecomposeKeys, DecomposeOptions } from '@bemedev/decompose';
export { identity } from '@bemedev/app-utils-bemedev';

export { merge2 } from '@bemedev/app-options/internal';
export { IS_TEST } from '@bemedev/app-plugins/internal';
export * from './objects';
export * from './reduceDescriber';
export * from './resolve';
export * from './strings';
export * from './undefined';
export * from './typings';
export { flatMap } from '../states/functions/flatMap';
export * from './readonly';
export * from './checkValues';
export * from './fn';
export * from './typings';
export * from '@bemedev/sleep';

/**
 * Performs a deep equality comparison between two values of type `T`.
 *
 * @template `T` - Type of the values being compared.
 * @param a - First value.
 * @param b - Second value.
 *
 * @returns `true` if `a` and `b` are deeply equal, `false` otherwise.
 */
export const deepEqual = <T>(a: T, b: T) => equal(a, b);
