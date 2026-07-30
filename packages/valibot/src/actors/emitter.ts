import * as v from 'valibot';
import { SingleOrArrayT_Schema } from '../transitions/edges';
import { CommonActorSchema } from './common';
import { FinallyConfigSchema } from './finally';

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
