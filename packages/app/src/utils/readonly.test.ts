import { describe, expect, test } from 'vitest';
import { readonly } from './readonly';

describe('readonly tests', () => {
  describe('#01 => readonly', () => {
    const obj = { a: 1, b: { c: 2 } };
    const res = readonly(obj);

    test('#01 => returns reference', () => {
      expect(res).toBe(obj);
    });

    test('#02 => is not frozen', () => {
      expect(Object.isFrozen(res)).toBe(false);
    });
  });

  describe('#02 => readonly.freeze', () => {
    const obj = { a: 1, b: { c: 2 } };
    const res = readonly.freeze(obj);

    test('#01 => returns reference', () => {
      expect(res).toBe(obj);
    });

    test('#02 => is frozen', () => {
      expect(Object.isFrozen(res)).toBe(true);
    });
  });
});
