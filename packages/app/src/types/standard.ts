import type { StandardOutput } from '@bemedev/typings';

/**
 * Extracts the output type from a type {@linkcode StandardOutput} schema object `T`.
 *
 * @template T - Standard output schema type extending `StandardOutput`.
 */
export type inferS<T extends StandardOutput> = NonNullable<
  T['~standard']['types']
>['output'];
