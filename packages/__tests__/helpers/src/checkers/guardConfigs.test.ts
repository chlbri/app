import { describe, expect, test } from 'vite-plus/test';
import { checkGuards } from '@bemedev/app-options/internal';

describe('checkGuards', () => {
  describe('#01 => direct values', () => {
    test('#01 => string accepted', () => {
      expect(checkGuards('isOn')).toBe(true);
    });

    test('#02 => describer accepted', () => {
      expect(checkGuards({ name: 'isOn', description: 'Guard' })).toBe(true);
    });

    test('#03 => undefined rejected', () => {
      expect(checkGuards(undefined)).toBe(false);
    });

    test('#04 => number rejected', () => {
      expect(checkGuards(42)).toBe(false);
    });
  });

  describe('#02 => arrays', () => {
    test('#01 => empty array rejected', () => {
      expect(checkGuards([])).toBe(false);
    });

    test('#02 => valid array accepted', () => {
      expect(checkGuards(['first', 'second'])).toBe(true);
    });

    test('#03 => invalid entry rejected', () => {
      expect(checkGuards(['first', 42])).toBe(false);
    });
  });

  describe('#03 => combinators', () => {
    test('#01 => and accepted', () => {
      expect(checkGuards({ and: ['first'] })).toBe(true);
    });

    test('#02 => or accepted', () => {
      expect(checkGuards({ or: ['first'] })).toBe(true);
    });

    test('#03 => nested combinations accepted', () => {
      expect(checkGuards({ and: [{ or: ['first'] }, 'second'] })).toBe(true);
    });

    test('#04 => both keys rejected', () => {
      expect(checkGuards({ and: ['first'], or: ['second'] })).toBe(false);
    });

    test('#05 => unknown key rejected', () => {
      expect(checkGuards({ not: ['first'] })).toBe(false);
    });

    test('#06 => empty object rejected', () => {
      expect(checkGuards({})).toBe(false);
    });

    test('#07 => non-array operand rejected', () => {
      expect(checkGuards({ and: 'first' })).toBe(false);
    });

    test('#08 => empty operand rejected', () => {
      expect(checkGuards({ and: [] })).toBe(false);
    });

    test('#09 => invalid operand rejected', () => {
      expect(checkGuards({ and: [42] })).toBe(false);
    });
  });

  describe('#04 => checkGuards.orUndefined', () => {
    test('#01 => undefined accepted', () => {
      expect(checkGuards.orUndefined(undefined)).toBe(true);
    });

    test('#02 => valid guard accepted', () => {
      expect(checkGuards.orUndefined({ or: ['first'] })).toBe(true);
    });

    test('#03 => invalid guard rejected', () => {
      expect(checkGuards.orUndefined({ and: [] })).toBe(false);
    });
  });
});
