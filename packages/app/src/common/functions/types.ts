import type { Equals, Fn, Keys, NotUndefined } from '@bemedev/app-utils-bemedev';
import type { FnMap, FnMapR } from '~types';

/**
 * Helper checking if a state configuration object contains async transitions or child states.
 *
 * @template `T` - State node configuration object.
 */
export type IsAsyncConfig<T> = T extends { after: any }
  ? true
  : T extends { states: object }
    ? T['states'] extends infer T2
      ? {
          [K in keyof T2]-?: IsAsyncConfig<T2[K]> extends true ? true : never;
        }[keyof T2] extends infer T3
        ? Equals<T3, never> extends true
          ? false
          : true
        : never
      : never
    : false;

/**
 * Helper checking if a type `T` is a Promise instance.
 *
 * @template `T` - Input type.
 */
export type IsPromise<T> =
  Equals<any, T> extends true ? false : T extends Promise<any> ? true : false;

/**
 * Helper checking if a function type `T` returns a Promise.
 *
 * @template `T` - Function type.
 */
export type IsAsyncFn<T> = T extends Fn ? IsPromise<ReturnType<T>> : false;

/**
 * Internal helper checking if a function map returns a Promise.
 *
 * @template `T` - Function map type.
 */
type _IsAsyncFnMap<T> =
  T extends FnMap<any, any, any, any, infer R> ? IsPromise<R> : false;

/**
 * Internal helper checking if a reduced function map returns a Promise.
 *
 * @template `T` - Function map type.
 */
type _IsAsyncFnMapR<T> =
  T extends FnMapR<any, any, any, infer R> ? IsPromise<R> : false;

/**
 * Helper checking if a function map or handler `T` contains async handler functions.
 *
 * @template `T` - Function map or function type.
 */
export type IsAsyncFnMap<T> =
  _IsAsyncFnMap<T> extends true
    ? true
    : _IsAsyncFnMapR<T> extends true
      ? true
      : IsAsyncFn<T> extends true
        ? true
        : T extends Record<Keys, Fn>
          ? {
              [K in keyof T]-?: IsAsyncFn<NotUndefined<T[K]>> extends true
                ? true
                : never;
            }[keyof T] extends infer T2
            ? Equals<T2, never> extends true
              ? false
              : true
            : false
          : false;
