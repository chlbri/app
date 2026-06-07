import { ActionConfig_Schema } from '#actions';
import { GuardConfig_Schema } from '#guards';
import { SoaLSchema } from '#utils/schemas/soa';
import * as v from 'valibot';
import { TargetSchema } from './utils';

export const _TransitionConfigMapSchema = <
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

export const TransitionConfigMapASchema = <
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

export const TransitionConfigMapFSchema = <
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

export const TransitionConfigMapGSchema = <
  const T extends ReadonlyArray<string>,
>(
  ...paths: T
) => {
  const out = v.union([
    v.strictObject({
      ...v.omit(TransitionConfigMapASchema(...paths), ['guards']).entries,
      guards: SoaLSchema(GuardConfig_Schema),
    }),
    v.strictObject({
      ...v.omit(TransitionConfigMapFSchema(...paths), ['guards']).entries,
      guards: SoaLSchema(GuardConfig_Schema),
    }),
  ]);

  return out;
};
export const TransitionConfigMapFGSchema = <
  const T extends ReadonlyArray<string>,
>(
  ...paths: T
) => {
  return v.strictObject({
    ...v.omit(TransitionConfigMapFSchema(...paths), ['guards']).entries,
    guards: SoaLSchema(GuardConfig_Schema),
  });
};

export const TransitionConfigMapSchema = <T extends ReadonlyArray<string>>(
  ...paths: T
) => {
  return v.union([
    TransitionConfigMapASchema(...paths),
    TransitionConfigMapFSchema(...paths),
  ]);
};
