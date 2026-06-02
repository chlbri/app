import type { PRIMITIVES } from './constants';

export * from '../features/arrays/types';
export * from '../features/common/types';
export * from '../features/functions/types';
export * from '../features/numbers/types';
export * from '../features/objects/types';
export * from '../features/promises/types';
export * from '../features/strings/types';

/**
 * PrimitiveS type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type PrimitiveS = (typeof PRIMITIVES)[number];
/**
 * TransformPrimitiveS type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type TransformPrimitiveS<T extends PrimitiveS> = T extends 'string'
  ? string
  : T extends 'number'
    ? number
    : T extends 'boolean'
      ? boolean
      : T extends 'bigint'
        ? bigint
        : T extends 'null'
          ? null
          : T extends 'undefined'
            ? undefined
            : T extends 'symbol'
              ? symbol
              : never;
