import * as v from 'valibot';
import { AlwaysConfig_Schema, DelayedTransitions_Config } from './edges';
import { ActorConfig_Schema } from '../../actors/schemas';

export const Transitions_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  const on = v.optional(DelayedTransitions_Config(...paths));

  return v.object({
    on,
    always: v.optional(AlwaysConfig_Schema(...paths)),
    after: on,
    actors: v.optional(v.record(v.string(), ActorConfig_Schema(...paths))),
  });
};
