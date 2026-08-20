import { describe, expect, test } from 'vitest';
import { checkValues } from '@bemedev/app/utils';

describe('checkValues', () => {
  describe('#01 => checkValues (sync)', () => {
    test('#01 => empty values returns true', () => {
      expect(checkValues('hello')).toBe(true);
    });

    test('#02 => matching value returns true', () => {
      expect(checkValues('a', 'a', 'b', 'c')).toBe(true);
    });

    test('#03 => non-matching value returns false', () => {
      expect(checkValues('z', 'a', 'b', 'c')).toBe(false);
    });
  });

  describe('#02 => checkValues.undefined (sync)', () => {
    test('#01 => undefined value returns true', () => {
      expect(checkValues.undefined(undefined, 'a', 'b')).toBe(true);
    });

    test('#02 => matching defined value returns true', () => {
      expect(checkValues.undefined('a', 'a', 'b')).toBe(true);
    });

    test('#03 => non-matching defined value returns false', () => {
      expect(checkValues.undefined('c', 'a', 'b')).toBe(false);
    });
  });

  describe('#03 => checkValues.async', () => {
    test('#01 => empty values resolves to true', async () => {
      await expect(checkValues.async('hello')).resolves.toBe(true);
    });

    test('#02 => matching value resolves to true', async () => {
      await expect(checkValues.async('a', 'a', 'b', 'c')).resolves.toBe(true);
    });

    test('#03 => non-matching value resolves to false', async () => {
      await expect(checkValues.async('z', 'a', 'b', 'c')).resolves.toBe(
        false,
      );
    });

    test('#04 => undefined value when listed resolves to true', async () => {
      await expect(
        checkValues.async(undefined, 'a', undefined),
      ).resolves.toBe(true);
    });

    test('#05 => undefined value when not listed resolves to false', async () => {
      await expect(checkValues.async(undefined, 'a', 'b')).resolves.toBe(
        false,
      );
    });
  });

  describe('#04 => checkValues.async.undefined', () => {
    test('#01 => undefined value resolves to true', async () => {
      await expect(
        checkValues.async.undefined(undefined, 'a', 'b'),
      ).resolves.toBe(true);
    });

    test('#02 => undefined value with empty values resolves to true', async () => {
      await expect(checkValues.async.undefined(undefined)).resolves.toBe(
        true,
      );
    });

    test('#03 => matching defined value resolves to true', async () => {
      await expect(
        checkValues.async.undefined('a', 'a', 'b'),
      ).resolves.toBe(true);
    });

    test('#04 => non-matching defined value resolves to false', async () => {
      await expect(
        checkValues.async.undefined('c', 'a', 'b'),
      ).resolves.toBe(false);
    });
  });
});
