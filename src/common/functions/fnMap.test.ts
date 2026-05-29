import { describe, test, expect } from 'vitest';
import { isFnMap, isAsyncFnMap } from './fnMap';

describe('TESTS', () => {
  describe('#01 => isFnMap', () => {
    test('#01 => with a single function: returns true', () => {
      expect(isFnMap(() => {})).toBe(true);
    });

    test('#02 => with an object containing only functions: returns true', () => {
      expect(
        isFnMap({
          fn1: () => {},
          fn2: () => {},
        }),
      ).toBe(true);
    });

    test('#03 => with null: returns false', () =>
      expect(isFnMap(null)).toBe(false));

    test('#04 => with undefined: returns false', () => {
      expect(isFnMap(undefined)).toBe(false);
    });

    test('#05 => with an array: returns false', () => {
      expect(isFnMap([() => {}, () => {}])).toBe(false);
    });

    test('#06.01 => with non-function values: returns false', () => {
      expect(
        isFnMap({
          fn1: () => {},
          fn2: 'not a function',
        }),
      ).toBe(false);
    });

    test('#06.02 => with number values: returns false', () => {
      expect(
        isFnMap({
          fn1: () => {},
          fn2: 42,
        }),
      ).toBe(false);
    });

    test('#06.03 => with object values: returns false', () => {
      expect(
        isFnMap({
          fn1: () => {},
          fn2: {},
        }),
      ).toBe(false);
    });

    test('#07 => with an empty object: returns true', () =>
      expect(isFnMap({})).toBe(true));

    test('#08.01 => with a string: returns false', () => {
      expect(isFnMap('not a function')).toBe(false);
    });

    test('#08.02 => with a number: returns false', () => {
      expect(isFnMap(42)).toBe(false);
    });

    test('#08.03 => with a boolean: returns false', () => {
      expect(isFnMap(true)).toBe(false);
    });
  });

  describe('#02 => isAsyncFnMap', () => {
    test('#01 => with a promise-returning function: returns true', () => {
      expect(
        isAsyncFnMap(async () => {
          // empty
        }),
      ).toBe(true);
    });

    test('#02 => with only promise-returning functions: returns true', () => {
      expect(
        isAsyncFnMap({
          fn1: async () => {},
          fn2: async () => {},
        }),
      ).toBe(true);
    });

    test('#03 => with some promise-returning functions: returns true', () => {
      expect(
        isAsyncFnMap({
          fn1: () => {},
          fn2: async () => {},
        }),
      ).toBe(true);
    });

    test('#04 => with only non-promise functions: returns false', () => {
      expect(
        isAsyncFnMap({
          fn1: () => {},
          fn2: () => {},
        }),
      ).toBe(false);
    });

    test('#05 => with null: returns false', () => {
      expect(isAsyncFnMap(null)).toBe(false);
    });

    test('#06 => with undefined: returns false', () => {
      expect(isAsyncFnMap(undefined)).toBe(false);
    });

    test('#07 => with an array: returns false', () => {
      expect(isAsyncFnMap([async () => {}, async () => {}])).toBe(false);
    });

    test('#08.01 => with non-function values: returns false', () => {
      expect(
        isAsyncFnMap({
          fn1: async () => {},
          fn2: 'not a function',
        }),
      ).toBe(false);
    });

    test('#08.02 => with mixed non-function values: returns false', () => {
      expect(
        isAsyncFnMap({
          fn1: async () => {},
          fn2: 42,
          fn3: {},
        }),
      ).toBe(false);
    });

    test('#09 => with an empty object: returns false', () => {
      expect(isAsyncFnMap({})).toBe(false);
    });

    test('#10.01 => with a string: returns false', () => {
      expect(isAsyncFnMap('not a function')).toBe(false);
    });

    test('#10.02 => with a number: returns false', () => {
      expect(isAsyncFnMap(42)).toBe(false);
    });

    test('#10.03 => with a boolean: returns false', () => {
      expect(isAsyncFnMap(true)).toBe(false);
    });
  });
});
