import * as v from 'valibot';
import type { PrimitiveObject } from '@bemedev/typings';
import { PrimitiveSchema } from './primitive';
import { SoraSchema } from './sora';
import { MapSchema } from './map';

export const PrimitiveObjectSchema: v.BaseSchema<
  PrimitiveObject,
  PrimitiveObject,
  v.BaseIssue<unknown>
> = SoraSchema(
  v.union([
    PrimitiveSchema,
    MapSchema(v.lazy(() => PrimitiveObjectSchema)),
  ]),
) as any;
