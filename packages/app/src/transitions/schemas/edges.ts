import * as v from 'valibot';
import {
  TransitionConfigF_Schema,
  TransitionConfig_Schema,
} from './config';
import {
  TransitionConfigMapFGSchema,
  TransitionConfigMapGSchema,
} from './map';
import type {
  AlwaysConfig,
  ArrayTransitions,
  RefineStringArray,
} from '~types';
import { TargetSchema } from './utils';

export const ArrayTransitions_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
): v.BaseSchema<
  ArrayTransitions<RefineStringArray<T>>,
  ArrayTransitions<RefineStringArray<T>>,
  any
> => {
  return v.pipe(
    v.array(TransitionConfig_Schema(...paths)),
    v.check(a => a.length > 0),
    v.check(a => {
      const [_, ...rest] = a.reverse();
      const schema = TransitionConfigMapGSchema(...paths);
      const fn = (value: unknown) => v.safeParse(schema, value).success;
      return rest.every(fn);
    }),
  ) as any;
};
export const ArrayTransitionsF_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
): v.BaseSchema<
  ArrayTransitions<RefineStringArray<T>>,
  ArrayTransitions<RefineStringArray<T>>,
  any
> => {
  return v.pipe(
    v.array(TransitionConfigF_Schema(...paths)),
    v.check(a => a.length > 0),
    v.check(a => {
      const [_, ...rest] = a.reverse();
      const schema = TransitionConfigMapFGSchema(...paths);
      const fn = (value: unknown) => v.safeParse(schema, value).success;
      return rest.every(fn);
    }),
  ) as any;
};

export const SingleOrArrayT_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  return v.union([
    TransitionConfigF_Schema(...paths),
    ArrayTransitions_Schema(...paths),
  ]);
};

export const AlwaysConfig_Schema = <T extends ReadonlyArray<string>>(
  ...paths: T
): v.BaseSchema<
  AlwaysConfig<RefineStringArray<T>>,
  AlwaysConfig<RefineStringArray<T>>,
  any
> => {
  return v.union([
    TransitionConfigF_Schema(...paths),
    ArrayTransitionsF_Schema(...paths),
  ]) as any;
};

export const DelayedTransitions_Config = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  return v.record(TargetSchema(paths), ArrayTransitions_Schema(...paths));
};
