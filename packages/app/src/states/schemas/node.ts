import * as v from 'valibot';
import { Transitions_Schema } from '../../transitions/schemas/transitions';
import { SoaLSchema } from '#utils/schemas/soa';
import { ActionConfig_Schema } from '#actions';
import type { NodeConfig, RefineStringArray } from '~types';

export const CommonNodeConfig_Schema = <
  T extends ReadonlyArray<string> = ReadonlyArray<string>,
>(
  ...paths: T
) => {
  return v.strictObject({
    ...Transitions_Schema(...paths).entries,
    description: v.optional(v.string()),
    entry: v.optional(SoaLSchema(ActionConfig_Schema)),
    exit: v.optional(SoaLSchema(ActionConfig_Schema)),
    tags: v.optional(SoaLSchema(v.string())),
    activities: v.optional(ActionConfig_Schema),
  });
};

export const NodeConfig_Schema = <
  T extends ReadonlyArray<string> = ReadonlyArray<string>,
>(
  ...paths: T
): v.BaseSchema<
  NodeConfig<RefineStringArray<T>>,
  NodeConfig<RefineStringArray<T>>,
  any
> => {
  return v.union([
    NodeConfigActomic_Schema(...paths),
    v.lazy(() => NodeConfigCompound_Schema(...paths)),
    v.lazy(() => NodeConfigParallel_Schema(...paths)),
  ]) as any;
};

export const NodeConfigActomic_Schema = <
  T extends ReadonlyArray<string> = ReadonlyArray<string>,
>(
  ...paths: T
) => {
  return v.strictObject({
    ...CommonNodeConfig_Schema(...paths).entries,
    type: v.optional(v.literal('atomic')),
  });
};

export const NodeConfigParallel_Schema = <
  T extends ReadonlyArray<string> = ReadonlyArray<string>,
>(
  ...paths: T
) => {
  return v.strictObject({
    ...CommonNodeConfig_Schema(...paths).entries,
    type: v.literal('parallel'),
    states: v.record(
      v.string(),
      v.lazy(() => NodeConfig_Schema(...paths)),
    ),
  });
};

export const NodeConfigCompound_Schema = <
  T extends ReadonlyArray<string> = ReadonlyArray<string>,
>(
  ...paths: T
) => {
  return v.strictObject({
    ...CommonNodeConfig_Schema(...paths).entries,
    type: v.optional(v.literal('compound')),
    initial: v.string(),
    states: v.record(
      v.string(),
      v.lazy(() => NodeConfig_Schema(...paths)),
    ),
  });
};
