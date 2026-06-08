import * as v from 'valibot';
import {
  TransitionConfigMapA_Schema,
  TransitionConfigMapF_Schema,
} from './map';
import { TargetSchema } from './utils';

// export const TransitionConfigA_Schema = <T extends ReadonlyArray<string>>(
//   ...paths: T
// ) => {
//   return v.union([
//     TargetSchema(paths),
//     TransitionConfigMapA_Schema(...paths),
//   ]);
// };

export const TransitionConfigF_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  return v.union([
    TargetSchema(paths),
    TransitionConfigMapF_Schema(...paths),
  ]);
};

export const TransitionConfig_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  return v.union([
    TargetSchema(paths),
    TransitionConfigMapA_Schema(...paths),
    TransitionConfigMapF_Schema(...paths),
  ]);
};
