import equal from 'fast-deep-equal';
export { merge2 } from '@bemedev/app-options/internal';
export { IS_TEST } from '@bemedev/app-plugins/internal';
export { identity } from '@bemedev/app-utils-bemedev';
export { decompose, decomposeSV, recompose } from '@bemedev/decompose';
export type { Decompose, DecomposeKeys, DecomposeOptions } from '@bemedev/decompose';
export * from '@bemedev/sleep';
export { flatMap } from '../states/functions/flatMap';
export * from './checkValues';
export * from './fn';
export * from './objects';
export * from './readonly';
export * from './reduceDescriber';
export * from './resolve';
export * from './strings';
export * from './typings';
export * from './undefined';

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
