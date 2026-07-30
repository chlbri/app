import * as v from 'valibot';

export const CommonActorSchema = v.object({
  description: v.optional(v.string()),
});
