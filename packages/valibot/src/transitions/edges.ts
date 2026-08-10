import type { RefineStringArray } from '@bemedev/app/types';
import type {
  AlwaysConfig,
  ArrayTransitions,
  ArrayTransitionsF,
} from '@bemedev/app/transitions';
import * as v from 'valibot';
import { NotArray_Schema } from '../utils/array';
import { recordV } from '../utils/record';
import {
  TransitionConfigF_Schema,
  TransitionConfig_Schema,
} from './config';
import {
  TransitionConfigMapFG_Schema,
  TransitionConfigMapG_Schema,
} from './map';

/**
 * Valibot schema builder for non-empty transition arrays.
 *
 * @template {ReadonlyArray<string>} T - Array of valid state path string literals.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Schema validating an array of transition configurations of type {@linkcode ArrayTransitions}.
 *
 * @see {@linkcode TransitionConfig_Schema}, {@linkcode TransitionConfigMapG_Schema}
 */
export const ArrayTransitions_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
): v.BaseSchema<
  ArrayTransitions<RefineStringArray<T>>,
  ArrayTransitions<RefineStringArray<T>>,
  any
> => {
  return v.pipe(
    v.array(TransitionConfig_Schema(...paths)),
    v.check(a => a.length > 0),
    v.check(a => {
      const [_, ...rest] = [...a].reverse();
      const schema = TransitionConfigMapG_Schema(...paths);
      const fn = (value: unknown) => v.safeParse(schema, value).success;
      return rest.every(fn);
    }),
  ) as any;
};

/**
 * Valibot schema builder for non-empty transition arrays requiring explicit targets.
 *
 * @template {ReadonlyArray<string>} T - Array of valid state path string literals.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Schema validating an array of transition configurations of type {@linkcode ArrayTransitionsF}.
 *
 * @see {@linkcode TransitionConfigF_Schema}, {@linkcode TransitionConfigMapFG_Schema}
 */
export const ArrayTransitionsF_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
): v.BaseSchema<
  ArrayTransitionsF<RefineStringArray<T>>,
  ArrayTransitionsF<RefineStringArray<T>>,
  any
> => {
  return v.pipe(
    v.array(TransitionConfigF_Schema(...paths)),
    v.check(a => a.length > 0),
    v.check(a => {
      const [_, ...rest] = [...a].reverse();
      const schema = TransitionConfigMapFG_Schema(...paths);
      const fn = (value: unknown) => v.safeParse(schema, value).success;
      return rest.every(fn);
    }),
  ) as any;
};

/**
 * Valibot schema builder for single transition configuration or array of transition configurations.
 *
 * @template {ReadonlyArray<string>} T - Array of valid state path string literals.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Union schema for single or array transition configuration.
 *
 * @see {@linkcode ArrayTransitions_Schema}, {@linkcode TransitionConfig_Schema}
 */
export const SingleOrArrayT_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  return v.union([
    ArrayTransitions_Schema(...paths),
    TransitionConfig_Schema(...paths),
  ]);
};

/**
 * Valibot schema builder for transient/always transition configurations.
 *
 * @template {ReadonlyArray<string>} T - Array of valid state path string literals.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Schema validating always transition configuration of type {@linkcode AlwaysConfig}.
 *
 * @see {@linkcode TransitionConfigF_Schema}, {@linkcode ArrayTransitionsF_Schema}
 */
export const AlwaysConfig_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
): v.BaseSchema<
  AlwaysConfig<RefineStringArray<T>>,
  AlwaysConfig<RefineStringArray<T>>,
  any
> => {
  return v.union([
    TransitionConfigF_Schema(...paths),
    ArrayTransitionsF_Schema(...paths),
  ]) as any;
};

/**
 * Valibot schema builder for delayed (`on` / `after`) transition configurations.
 *
 * @template {ReadonlyArray<string>} T - Array of valid state path string literals.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Schema validating delayed transitions map.
 *
 * @see {@linkcode NotArray_Schema}, {@linkcode recordV}, {@linkcode SingleOrArrayT_Schema}
 */
export const DelayedTransitions_Config = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  return v.pipe(
    v.any(),
    NotArray_Schema,
    recordV(v.string(), SingleOrArrayT_Schema(...paths)),
  );
};
