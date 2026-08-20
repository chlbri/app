import * as v from 'valibot';
import { ChildConfig_Schema } from './child';
import { EmitterConfig_Schema } from './emitter';

/**
 * Valibot schema builder for actor configurations (child or emitter).
 *
 * @template `T` - Array of valid state path string literals extending `ReadonlyArray<string>`.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Valibot union schema for child or emitter actor configuration.
 *
 * @see {@linkcode ChildConfig_Schema}, {@linkcode EmitterConfig_Schema}
 */
export const ActorConfig_Schema = <T extends ReadonlyArray<string>>(...paths: T) => {
  return v.union([ChildConfig_Schema(...paths), EmitterConfig_Schema(...paths)]);
};
