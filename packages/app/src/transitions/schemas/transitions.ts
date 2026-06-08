import { recordV } from '#utils/schemas';
import * as v from 'valibot';
import { ActorConfig_Schema } from '../../actors/schemas';
import { AlwaysConfig_Schema, DelayedTransitions_Config } from './edges';

export const Transitions_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  const on = v.optional(DelayedTransitions_Config(...paths));

  return v.object({
    on,
    always: v.optional(AlwaysConfig_Schema(...paths)),
    after: on,
    actors: v.optional(recordV(v.string(), ActorConfig_Schema(...paths))),
  });
};
