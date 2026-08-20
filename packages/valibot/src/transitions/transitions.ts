import * as v from 'valibot';
import { ActorConfig_Schema } from '../actors/actor';
import { recordV } from '../utils/record';
import { AlwaysConfig_Schema, DelayedTransitions_Config } from './edges';

/**
 * Valibot schema builder for transition definitions including `on`, `always`, `after`, and `actors`.
 *
 * @template {ReadonlyArray<string>} T - Array of valid state path string literals.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Object schema for state transitions and actors.
 *
 * @see {@linkcode DelayedTransitions_Config}, {@linkcode AlwaysConfig_Schema}, {@linkcode ActorConfig_Schema}, {@linkcode recordV}
 */
export const Transitions_Schema = <T extends ReadonlyArray<string>>(...paths: T) => {
  const on = v.optional(DelayedTransitions_Config(...paths));

  return v.object({
    on,
    always: v.optional(AlwaysConfig_Schema(...paths)),
    after: on,
    actors: v.optional(recordV(v.string(), ActorConfig_Schema(...paths))),
  });
};
