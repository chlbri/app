import type { UnionToIntersection } from '@bemedev/app-utils-bemedev';
import type { STR } from './types';

/** Action error descriptor mapping. */
const action = {
  normal: 'action',
  capital: 'Action',
} as const satisfies STR;

/** Guard error descriptor mapping. */
const guard = { normal: 'guard', capital: 'Guard' } as const satisfies STR;

/** Delay error descriptor mapping. */
const delay = { normal: 'delay', capital: 'Delay' } as const satisfies STR;

/** Promise error descriptor mapping. */
const promise = {
  normal: 'promise',
  capital: 'Promise',
} as const satisfies STR;

/** Machine error descriptor mapping. */
const machine = {
  normal: 'machine',
  capital: 'Machine',
} as const satisfies STR;

/** Sentinel string for undefined error state. */
const notDefined = 'is undefined' as const;
/** Sentinel string for undescribed error state. */
const notDescribed = 'is not described' as const;
/** Sentinel string for unprovided error state. */
const notProvided = 'is not provided' as const;

/**
 * Creates error object for undefined state.
 *
 * @template T - Type name string.
 * @param type - Category type string.
 *
 * @returns Error object container.
 */
const notDefinedF = <T extends string>(type: T) => {
  const string = `${type} ${notDefined}` as const;
  return { string, error: new Error(string) };
};

/**
 * Creates error object for undescribed state.
 *
 * @template T - Type name string.
 * @param type - Category type string.
 *
 * @returns Error object container.
 */
const notDescribedF = <T extends string>(type: T) => {
  const string = `${type} ${notDescribed}` as const;
  return { string, error: new Error(string) };
};

/**
 * Creates error object for unprovided state.
 *
 * @template T - Type name string.
 * @param type - Category type string.
 *
 * @returns Error object container.
 */
const notProvidedF = <T extends string>(type: T) => {
  const string = `${type} ${notProvided}` as const;
  return { string, error: new Error(string) };
};

/**
 * Helper to generate error object structures across specified category descriptors.
 *
 * @template T - Tuple array of category descriptors.
 * @param types - Category descriptor objects.
 *
 * @returns Object map of category error handlers.
 */
const produceErrors = <const T extends STR[]>(...types: T) => {
  const out = {};

  types.forEach(value => {
    Object.assign(out, {
      [value.normal]: {
        notDefined: notDefinedF(value['capital']),
        notDescribed: notDescribedF(value['capital']),
        notProvided: notProvidedF(value['capital']),
      },
    });
  });

  type Out = T[number] extends infer N extends STR
    ? N extends any
      ? {
          [key in N['normal']]: {
            notDefined: ReturnType<typeof notDefinedF<N['capital']>>;
            notDescribed: ReturnType<typeof notDescribedF<N['capital']>>;
            notProvided: ReturnType<typeof notProvidedF<N['capital']>>;
          };
        }
      : never
    : never;

  return out as UnionToIntersection<Out>;
};

/**
 * Contains error messages for various machine components.
 * Each component (action, guard, delay, promise, machine) has three types of errors:
 * - `notDefined`: Indicates that the component is not defined.
 * - `notDescribed`: Indicates that the component is not described.
 * - `notProvided`: Indicates that the component is not provided.
 */
export const ERRORS = produceErrors(
  action,
  guard,
  delay,
  promise,
  machine,
);
