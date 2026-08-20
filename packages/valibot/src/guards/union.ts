import type { GuardConfig } from '@bemedev/app/guards';
import * as v from 'valibot';
import { ActionConfig_Schema } from '../actions';

/**
 * Alias for action config schema used as simple guard configuration.
 *
 * @see {@linkcode ActionConfig_Schema}
 */
export const SimpleGuardConfig_Schema = ActionConfig_Schema;

/**
 * Valibot schema for validating guard configurations (simple, AND logical combination, or OR logical combination).
 *
 * @see type {@linkcode GuardConfig}
 * @see {@linkcode SimpleGuardConfig_Schema}, {@linkcode GuardAnd_Schema}, {@linkcode GuardOr_Schema}
 */
export const GuardConfig_Schema: v.BaseSchema<
  GuardConfig,
  GuardConfig,
  v.BaseIssue<unknown>
> = v.union([
  SimpleGuardConfig_Schema,
  v.lazy(() => GuardAnd_Schema),
  v.lazy(() => GuardOr_Schema),
]);

/**
 * Valibot schema for AND-combined guard conditions.
 *
 * @see {@linkcode GuardConfig_Schema}
 */
export const GuardAnd_Schema = v.object({ and: v.array(GuardConfig_Schema) });

/**
 * Valibot schema for OR-combined guard conditions.
 *
 * @see {@linkcode GuardConfig_Schema}
 */
export const GuardOr_Schema = v.object({ or: v.array(GuardConfig_Schema) });
