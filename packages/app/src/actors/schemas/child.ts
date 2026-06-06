import * as v from 'valibot';
import { CommonActorSchema } from './common';

export const ContextsSchema = v.record(v.string(), v.string());
export const ChildConfigSchema = v.intersect([
  CommonActorSchema,
  v.union([
    v.object({ contexts: v.optional(ContextsSchema) }),
    v.object({ contexts: ContextsSchema }),
  ]),
]);
