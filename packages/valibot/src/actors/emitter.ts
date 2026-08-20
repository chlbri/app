import * as v from 'valibot';
import { SingleOrArrayT_Schema } from '../transitions/edges';
import { CommonActorSchema } from './common';
import { FinallyConfigSchema } from './finally';

/**
 * Valibot schema builder for emitter actor configurations (handling next, error, complete events).
 *
 * @template `T` - Array of valid state path string literals extending `ReadonlyArray<string>`.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Valibot schema for validating emitter actor configuration.
 *
 * @see {@linkcode CommonActorSchema}, {@linkcode SingleOrArrayT_Schema}, {@linkcode FinallyConfigSchema}
 */
export const EmitterConfig_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  return v.strictObject({
    ...CommonActorSchema.entries,
    next: SingleOrArrayT_Schema(...paths),
    error: v.optional(SingleOrArrayT_Schema(...paths)),
    complete: v.optional(FinallyConfigSchema),
  });
};
