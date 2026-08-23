import equal from 'fast-deep-equal';

export { decompose, decomposeSV, recompose } from '@bemedev/decompose';

export type { Decompose, DecomposeKeys, DecomposeOptions } from '@bemedev/decompose';

export * from './environment';
export * from './merge2';
export * from './byKey2';
export * from './nothing';
export * from './objects';
export * from './reduceFnMap';
export * from './constructEventMap';
export * from './reduceDescriber';
export * from './resolve';
export * from './strings';
export * from './toFunction';
export * from './undefined';
export * from './identity';
export * from './typings';
export { flatMap } from '../states/functions/flatMap';
export * from './readonly';
export * from './checkValues';
export * from './soa';
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
