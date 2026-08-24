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
syncFilter('numbers', num => num > 0);
syncFilter('optNumbers', num => num > 0);
asyncFilter('numbers', num => num > 0);
asyncFilter('optNumbers', num => num > 0);
// #endregion

// #region Valid Object properties
syncFilter('scores', score => score > 50);
syncFilter('optScores', score => score > 50);
asyncFilter('scores', score => score > 50);
asyncFilter('optScores', score => score > 50);
// #endregion

// #region Invalid Primitive properties
// @ts-expect-error - 'name' is a string, not Array or TrueObject
syncFilter('name', () => true);

// @ts-expect-error - 'age' is a number | undefined, not Array or TrueObject
syncFilter('age', () => true);

// @ts-expect-error - 'active' is a boolean, not Array or TrueObject
syncFilter('active', () => true);

// @ts-expect-error - 'name' is a string, not Array or TrueObject
asyncFilter('name', () => true);

// @ts-expect-error - 'age' is a number | undefined, not Array or TrueObject
asyncFilter('age', () => true);

// @ts-expect-error - 'active' is a boolean, not Array or TrueObject
asyncFilter('active', () => true);
// #endregion

