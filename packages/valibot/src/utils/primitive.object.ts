import * as v from 'valibot';
import { MapSchema } from './map';
import { PrimitiveSchema } from './primitive';
import { SoraSchema } from './sora';
import type { PrimitiveObject } from '@bemedev/app/types';

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
