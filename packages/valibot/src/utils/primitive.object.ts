import type { PrimitiveObject } from '@bemedev/typings';
import * as v from 'valibot';
import { MapSchema } from './map';
import { PrimitiveSchema } from './primitive';
import { SoraSchema } from './sora';

/**
 * Valibot schema for recursive primitive values, including nested maps and
 * arrays of primitives.
 *
 * @see -- type {@linkcode PrimitiveObject}, {@linkcode SoraSchema}, {@linkcode PrimitiveSchema}, {@linkcode MapSchema}
 */
export const PrimitiveObjectSchema: v.BaseSchema<
  PrimitiveObject,
  PrimitiveObject,
  v.BaseIssue<unknown>
> = SoraSchema(
  v.union([PrimitiveSchema, MapSchema(v.lazy(() => PrimitiveObjectSchema))]),
) as any;
