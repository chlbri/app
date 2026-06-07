import { ActionConfig_Schema } from '#actions';
import * as v from 'valibot';
import type { GuardConfig } from '../types';

export const SimpleGuardConfig_Schema = ActionConfig_Schema;

export const GuardConfig_Schema: v.BaseSchema<
  GuardConfig,
  GuardConfig,
  v.BaseIssue<unknown>
> = v.union([
  SimpleGuardConfig_Schema,
  v.lazy(() => GuardAnd_Schema),
  v.lazy(() => GuardOr_Schema),
]);

export const GuardAnd_Schema = v.object({
  and: v.array(GuardConfig_Schema),
});

export const GuardOr_Schema = v.object({
  or: v.array(GuardConfig_Schema),
});
