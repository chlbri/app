import * as v from 'valibot';
import {
  TransitionConfigMapASchema,
  TransitionConfigMapFSchema,
} from './map';
import { TargetSchema } from './utils';

export const TransitionConfigA_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  return v.union([
    TargetSchema(paths),
    TransitionConfigMapASchema(...paths),
  ]);
};

export const TransitionConfigF_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  return v.union([
    TargetSchema(paths),
    TransitionConfigMapFSchema(...paths),
  ]);
};

export const TransitionConfig_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  return v.union([
    TargetSchema(paths),
    TransitionConfigMapASchema(...paths),
    TransitionConfigMapFSchema(...paths),
  ]);
};
