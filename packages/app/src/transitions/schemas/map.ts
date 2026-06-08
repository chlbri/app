import { ActionConfig_Schema } from '#actions';
import { GuardConfig_Schema } from '#guards';
import { SoaLSchema } from '#utils/schemas/soa';
import * as v from 'valibot';
import { TargetSchema } from './utils';

export const _TransitionConfigMap_Schema = <
  T extends ReadonlyArray<string>,
>(
  ...paths: T
) => {
  const target = v.optional(TargetSchema(paths));

  return v.strictObject({
    target,
    actions: v.optional(SoaLSchema(ActionConfig_Schema)),
    guards: v.optional(SoaLSchema(GuardConfig_Schema)),
    description: v.optional(v.string()),
  });
};

export const TransitionConfigMapA_Schema = <
  const T extends ReadonlyArray<string>,
>(
  ...paths: T
) => {
  const target = v.optional(TargetSchema(paths));

  return v.strictObject({
    target,
    actions: SoaLSchema(ActionConfig_Schema),
    guards: v.optional(SoaLSchema(GuardConfig_Schema)),
    description: v.optional(v.string()),
  });
};

export const TransitionConfigMapF_Schema = <
  const T extends ReadonlyArray<string>,
>(
  ...paths: T
) => {
  const target = TargetSchema(paths);

  return v.strictObject({
    target,
    actions: v.optional(SoaLSchema(ActionConfig_Schema)),
    guards: v.optional(SoaLSchema(GuardConfig_Schema)),
    description: v.optional(v.string()),
  });
};

export const TransitionConfigMap_Schema = <
  T extends ReadonlyArray<string>,
>(
  ...paths: T
) => {
  return v.union([
    TransitionConfigMapA_Schema(...paths),
    TransitionConfigMapF_Schema(...paths),
  ]);
};

export const TransitionConfigMapG_Schema = <
  const T extends ReadonlyArray<string>,
>(
  ...paths: T
) => {
  const out = v.union([
    v.strictObject({
      ...v.omit(TransitionConfigMapA_Schema(...paths), ['guards']).entries,
      guards: SoaLSchema(GuardConfig_Schema),
    }),
    v.strictObject({
      ...v.omit(TransitionConfigMapF_Schema(...paths), ['guards']).entries,
      guards: SoaLSchema(GuardConfig_Schema),
    }),
  ]);

  return out;
};
export const TransitionConfigMapFG_Schema = <
  const T extends ReadonlyArray<string>,
>(
  ...paths: T
) => {
  return v.strictObject({
    ...v.omit(TransitionConfigMapF_Schema(...paths), ['guards']).entries,
    guards: SoaLSchema(GuardConfig_Schema),
  });
};
