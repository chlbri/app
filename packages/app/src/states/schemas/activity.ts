import { ActionConfig_Schema } from '#actions';
import { GuardConfig_Schema } from '#guards';
import type { ActivityArray } from '#states';
import { SoaLSchema } from '#utils/schemas/soa';
import * as v from 'valibot';

const ActivityMap_Schema = v.union([
  ActionConfig_Schema,
  v.object({
    description: v.optional(v.string()),
    actions: SoaLSchema(ActionConfig_Schema),
    guards: v.optional(SoaLSchema(GuardConfig_Schema)),
  }),
]);
const ActivityMapG_Schema = v.union([
  ActionConfig_Schema,
  v.object({
    description: v.optional(v.string()),
    actions: SoaLSchema(ActionConfig_Schema),
    guards: SoaLSchema(GuardConfig_Schema),
  }),
]);

const _ActivityArray = v.pipe(
  v.array(ActivityMap_Schema),
  v.check(a => a.length > 0),
  v.check(a => {
    const [_, ...rest] = a.reverse();
    const schema = ActivityMapG_Schema;
    const fn = (value: unknown) => v.safeParse(schema, value).success;
    return rest.every(fn);
  }),
) as unknown as v.BaseSchema<ActivityArray, ActivityArray, any>;

export const ActivityConfig_Schema = v.union([
  _ActivityArray,
  ActivityMap_Schema,
]);
