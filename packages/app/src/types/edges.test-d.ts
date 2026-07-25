import type { NoExtraKeySoa } from './edges';

type N1 = NoExtraKeySoa<
  [{ a: string; b: number }, { a: string }],
  { a: string }
>;

expectTypeOf<N1>().branded.toEqualTypeOf<[never, { a: string }]>();
