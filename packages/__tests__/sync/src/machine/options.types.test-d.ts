import type {
  AsyncFilterAction_F,
  AsyncForAction_F,
  AsyncWhileAction_F,
  SyncFilterAction_F,
  SyncForAction_F,
  SyncWhileAction_F,
} from '@bemedev/app';

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

// #region For action helper
type SyncFor = SyncForAction_F<any, any, TestContext>;
type AsyncFor = AsyncForAction_F<any, any, TestContext>;

declare const syncFor: SyncFor;
declare const asyncFor: AsyncFor;

// #region Valid count and action
syncFor(3, () => ({ mergers: [] }));
syncFor(
  ({ context }) => context?.age ?? 0,
  () => ({ mergers: [] }),
);
asyncFor(3, () => ({ mergers: [] }));
asyncFor(3, async () => ({ mergers: [] }));
asyncFor(
  async ({ context }) => context?.age ?? 0,
  async () => ({ mergers: [] }),
);
// #endregion

// #region Valid function map count
syncFor({ FALLBACK: () => 2, else: () => 1 }, () => ({ mergers: [] }));
asyncFor({ FALLBACK: async () => 2, else: () => 1 }, () => ({ mergers: [] }));
// #endregion

// #region Invalid count or action
// @ts-expect-error - count must be a number or a function map returning a number
syncFor('3', () => ({ mergers: [] }));

// @ts-expect-error - count function must return a number
syncFor(
  () => '3',
  () => ({ mergers: [] }),
);

// @ts-expect-error - count function must return a number
asyncFor(
  async () => '3',
  () => ({ mergers: [] }),
);

// @ts-expect-error - sync action cannot return a promise
syncFor(3, async () => ({ mergers: [] }));

// @ts-expect-error - action is required
syncFor(3);
// #endregion
// #endregion

// #region While action helpers
type SyncWhile = SyncWhileAction_F<any, any, TestContext>;
type AsyncWhile = AsyncWhileAction_F<any, any, TestContext>;

declare const syncWhile: SyncWhile;
declare const asyncWhile: AsyncWhile;
declare const syncDoWhile: SyncWhile;
declare const asyncDoWhile: AsyncWhile;

// #region Valid predicate and action
syncWhile(({ context }) => (context?.age ?? 0) < 10, () => ({ mergers: [] }));
asyncWhile(async ({ context }) => (context?.age ?? 0) < 10, () => ({ mergers: [] }));
syncDoWhile(({ context }) => (context?.age ?? 0) < 10, () => ({ mergers: [] }));
asyncDoWhile(async ({ context }) => (context?.age ?? 0) < 10, () => ({ mergers: [] }));
// #endregion

// #region Valid function map predicate
syncWhile({ FALLBACK: () => true, else: () => false }, () => ({ mergers: [] }));
asyncWhile(
  { FALLBACK: async () => true, else: () => false },
  () => ({ mergers: [] }),
);
// #endregion

// #region Invalid predicate or action
// @ts-expect-error - predicate must return a boolean
syncWhile(
  () => '3',
  () => ({ mergers: [] }),
);

// @ts-expect-error - predicate must return a boolean
syncDoWhile(
  () => '3',
  () => ({ mergers: [] }),
);

// @ts-expect-error - async predicate must resolve to a boolean
asyncWhile(
  async () => '3',
  () => ({ mergers: [] }),
);

// @ts-expect-error - sync predicate cannot return a promise
syncWhile(async () => true, () => ({ mergers: [] }));

// @ts-expect-error - sync action cannot return a promise
syncDoWhile(() => true, async () => ({ mergers: [] }));

// @ts-expect-error - predicate is required
syncWhile(undefined, () => ({ mergers: [] }));

// @ts-expect-error - action is required
asyncWhile(() => true);
// #endregion
// #endregion
