import type { ActivityArray } from '@bemedev/app/states';
import * as v from 'valibot';
import { ActionConfig_Schema } from '../actions';
import { GuardConfig_Schema } from '../guards';
import { SoaLSchema } from '../utils/soa';

/**
 * Internal schema for activity map configuration with optional guards.
 *
 * @see {@linkcode ActionConfig_Schema}, {@linkcode SoaLSchema}, {@linkcode GuardConfig_Schema}
 */
const ActivityMap_Schema = v.union([
  ActionConfig_Schema,
  v.strictObject({
    description: v.optional(v.string()),
    actions: SoaLSchema(ActionConfig_Schema),
    guards: v.optional(SoaLSchema(GuardConfig_Schema)),
  }),
]);

/**
 * Internal schema for activity map configuration requiring guards.
 *
 * @see {@linkcode ActionConfig_Schema}, {@linkcode SoaLSchema}, {@linkcode GuardConfig_Schema}
 */
const ActivityMapG_Schema = v.strictObject({
  description: v.optional(v.string()),
  actions: SoaLSchema(ActionConfig_Schema),
  guards: SoaLSchema(GuardConfig_Schema),
});

/**
 * Internal schema for validating non-empty arrays of activity mappings.
 *
 * @see type {@linkcode ActivityArray}
 * @see {@linkcode ActivityMap_Schema}, {@linkcode ActivityMapG_Schema}
 */
const _ActivityArray = v.pipe(
  v.array(ActivityMap_Schema),
  v.check(a => {
    return a.length > 0;
  }, 'Empty Activity Array'),
  v.check(a => {
    const [_, ...rest] = [...a].reverse();
    const schema = ActivityMapG_Schema;
    const fn = (value: unknown) => v.safeParse(schema, value).success;
    return rest.every(fn);
  }, 'Wrong activity Array'),
) as unknown as v.BaseSchema<ActivityArray, ActivityArray, any>;

/**
 * Valibot schema for activity configuration (single activity map or array of activity maps).
 *
 * @see {@linkcode ActivityMap_Schema}, {@linkcode _ActivityArray}
 */
export const ActivityConfig_Schema = v.union([
  ActivityMap_Schema,
  _ActivityArray,
]);
