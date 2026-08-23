import type { AsyncFilterAction_F, SyncFilterAction_F } from '@bemedev/app';

type TestContext = {
  numbers: number[];
  optNumbers?: number[];
  scores: Record<string, number>;
  optScores?: { a: number; b: number };
  name: string;
  age?: number;
  active: boolean;
};

type SyncFilter = SyncFilterAction_F<any, any, TestContext>;
type AsyncFilter = AsyncFilterAction_F<any, any, TestContext>;

declare const syncFilter: SyncFilter;
declare const asyncFilter: AsyncFilter;

// #region Valid Array properties
syncFilter('context.numbers', num => num > 0);
syncFilter('context.optNumbers', num => num > 0);
asyncFilter('context.numbers', num => num > 0);
asyncFilter('context.optNumbers', num => num > 0);
// #endregion

// #region Valid Object properties
syncFilter('context.scores', score => score > 50);
syncFilter('context.optScores', score => score > 50);
asyncFilter('context.scores', score => score > 50);
asyncFilter('context.optScores', score => score > 50);
// #endregion

// #region Invalid Primitive properties
// @ts-expect-error - 'context.name' is a string, not Array or TrueObject
syncFilter('context.name', () => true);

// @ts-expect-error - 'context.age' is a number | undefined, not Array or TrueObject
syncFilter('context.age', () => true);

// @ts-expect-error - 'context.active' is a boolean, not Array or TrueObject
syncFilter('context.active', () => true);

// @ts-expect-error - 'context.name' is a string, not Array or TrueObject
asyncFilter('context.name', () => true);

// @ts-expect-error - 'context.age' is a number | undefined, not Array or TrueObject
asyncFilter('context.age', () => true);

// @ts-expect-error - 'context.active' is a boolean, not Array or TrueObject
asyncFilter('context.active', () => true);
// #endregion
