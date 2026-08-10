import * as v from 'valibot';
import { DelayedTransitions_Config } from '../transitions/edges';
import { recordV } from '../utils/record';
import { CommonActorSchema } from './common';

/**
 * Valibot schema for actor contexts record mapping keys to string values.
 *
 * @see {@linkcode recordV}
 */
export const ContextsSchema = recordV(v.string(), v.string());

/**
 * Valibot schema builder for child actor configuration.
 *
 * @template {ReadonlyArray<string>} T - Array of valid state path string literals.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Valibot schema for validating child actor configuration.
 *
 * @see {@linkcode CommonActorSchema}, {@linkcode ContextsSchema}, {@linkcode DelayedTransitions_Config}
 */
export const ChildConfig_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
) =>
  v.union([
    v.strictObject({
      ...CommonActorSchema.entries,
      contexts: v.optional(ContextsSchema),
      on: DelayedTransitions_Config(...paths),
    }),
    v.strictObject({
      ...CommonActorSchema.entries,
      contexts: ContextsSchema,
      on: v.optional(DelayedTransitions_Config(...paths)),
    }),
  ]);
