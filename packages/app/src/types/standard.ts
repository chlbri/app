import type { StandardOutput } from '@bemedev/typings';

export type inferS<T extends StandardOutput> = NonNullable<
  T['~standard']['types']
>['output'];
