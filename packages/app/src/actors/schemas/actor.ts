import * as v from 'valibot';
import { ChildConfig_Schema } from './child';
import { EmitterConfig_Schema } from './emitter';

export const ActorConfig_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  return v.union([ChildConfig_Schema, EmitterConfig_Schema(...paths)]);
};
