import * as v from 'valibot';

/**
 * Valibot schema for common actor properties (e.g. description).
 */
export const CommonActorSchema = v.object({
  description: v.optional(v.string()),
});
