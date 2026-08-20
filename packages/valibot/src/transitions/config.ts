import * as v from 'valibot';
import { TransitionConfigMapA_Schema, TransitionConfigMapF_Schema } from './map';
import { TargetSchema } from './target';

/**
 * Valibot schema builder for transition configuration requiring explicit targets.
 *
 * @template `T` - Array of valid state path string literals extending `ReadonlyArray<string>`.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Union schema for target string or map with target property.
 *
 * @see {@linkcode TargetSchema}, {@linkcode TransitionConfigMapF_Schema}
 */
export const TransitionConfigF_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  return v.union([TargetSchema(paths), TransitionConfigMapF_Schema(...paths)]);
};

/**
 * Valibot schema builder for transition configuration (target string, action map, or full transition map).
 *
 * @template `T` - Array of valid state path string literals extending `ReadonlyArray<string>`.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Union schema for transition configurations.
 *
 * @see {@linkcode TargetSchema}, {@linkcode TransitionConfigMapA_Schema}, {@linkcode TransitionConfigMapF_Schema}
 */
export const TransitionConfig_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  return v.union([
    TargetSchema(paths),
    TransitionConfigMapA_Schema(...paths),
    TransitionConfigMapF_Schema(...paths),
  ]);
};
