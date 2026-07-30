import type { FinallyConfig } from '@bemedev/app/types';
import * as v from 'valibot';
import { ActionConfig_Schema } from '../actions';
import { GuardConfig_Schema } from '../guards';
import { SoaLSchema } from '../utils/soa';

const _F_Schema = v.strictObject({
  actions: SoaLSchema(ActionConfig_Schema),
  guards: v.optional(SoaLSchema(GuardConfig_Schema)),
  description: v.optional(v.string()),
});

const _FG_Schema = v.strictObject({
  actions: SoaLSchema(ActionConfig_Schema),
  guards: SoaLSchema(GuardConfig_Schema),
  description: v.optional(v.string()),
});

export const _FinallyConfigSchema = v.union([
  _F_Schema,
  ActionConfig_Schema,
]);

export const FinallyConfigSchema = v.union([
  _FinallyConfigSchema,
  v.pipe(
    v.array(_FinallyConfigSchema),
    v.check(val => val.length > 0),
    v.check(val => {
      const [_, ...rest] = [...val].reverse();

      const fn = (value: unknown) => {
        return v.safeParse(_FG_Schema, value).success;
      };

      return rest.every(fn);
    }),
  ),
]) as v.BaseSchema<FinallyConfig, FinallyConfig, any>;
