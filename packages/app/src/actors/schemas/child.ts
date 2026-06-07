import * as v from 'valibot';
import { CommonActorSchema } from './common';
import { DelayedTransitions_Config } from '../../transitions/schemas/edges';

export const ContextsSchema = v.record(v.string(), v.string());
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
