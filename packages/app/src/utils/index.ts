import equal from 'fast-deep-equal';

export { decompose, decomposeSV, recompose } from '@bemedev/decompose';

export type {
  Decompose,
  DecomposeKeys,
  DecomposeOptions,
} from '@bemedev/decompose';

export * from './environment';
export * from './merge';
export * from './nothing';
export * from './objects';
export * from './reduceFnMap';
export * from './constructEventMap';
export * from './reduceDescriber';
export * from './resolve';
export * from './strings';
export * from './toFunction';
export * from './undefined';
export * from './typings';
export * from './parseTree';
export * from './parseTree.types';
export { buildPaths } from './parseTree.helpers';
export * from './readonly';
export * from './checkValues';
export * from './soa';
export * from './reduceDescribers';
export * from './fn';
export * from './typings';
export * from '@bemedev/sleep';

export const deepEqual = <T>(a: T, b: T) => equal(a, b);
export * from 'nanoid';
