import type { FromGuard, GuardConfig } from '@bemedev/app/guards';

type TT1 = 'exists';

type TT2 = 4;

type TT3 = { and: TT1 };

type TT4 = 'check';

type TT5 = { or: [] };

type TT6 = { or: [TT1, TT4, TT9] };

type TT7 = { and: [TT6, TT2] };

type TT8 = { or: [TT6, TT3, TT5] };

type TT9 = { name: 'exists2' };

describe('GuardConfig & FromGuard', () => {
  test('#01 => string guard', () => {
    expectTypeOf<TT1>().toExtend<GuardConfig>();
    expectTypeOf<FromGuard<TT1>>().toEqualTypeOf<'exists'>();
  });

  test('#02 => number guard rejected', () => {
    expectTypeOf<TT2>().not.toExtend<GuardConfig>();
  });

  test('#03 => single and guard rejected', () => {
    expectTypeOf<TT3>().not.toExtend<GuardConfig>();
  });

  test('#04 => check guard', () => {
    expectTypeOf<TT4>().toExtend<GuardConfig>();
    expectTypeOf<FromGuard<TT4>>().toEqualTypeOf<'check'>();
  });

  test('#05 => empty or guard', () => {
    expectTypeOf<TT5>().toExtend<GuardConfig>();
    expectTypeOf<FromGuard<TT5>>().toEqualTypeOf<never>();
  });

  test('#06 => or guard', () => {
    expectTypeOf<TT6>().toExtend<GuardConfig>();
    expectTypeOf<FromGuard<TT6>>().toEqualTypeOf<'check' | 'exists' | 'exists2'>();
  });

  test('#07 => invalid and guard', () => {
    expectTypeOf<TT7>().not.toExtend<GuardConfig>();
  });

  test('#08 => invalid nested or guard', () => {
    expectTypeOf<TT8>().not.toExtend<GuardConfig>();
  });

  test('#09 => describer guard', () => {
    expectTypeOf<TT9>().toExtend<GuardConfig>();
    expectTypeOf<FromGuard<TT9>>().toEqualTypeOf<'exists2'>();
  });
});
