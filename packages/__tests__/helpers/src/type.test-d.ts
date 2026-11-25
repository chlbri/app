import type { DecomposeC } from '@bemedev/app/types';

type TT = DecomposeC<{ arry: string[] }, number>;

describe('DecomposeC', () => {
  test('#01 => keeps arrays as leaf values', () => {
    expectTypeOf<TT>().toEqualTypeOf<{ arry: string[] }>();
  });
});
