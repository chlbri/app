import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { PrimitiveObjectSchema } from '@bemedev/app-valibot';

describe('#01 => primitiveObject schema', () => {
  describe('#01 => string', () => {
    const result = v.safeParse(PrimitiveObjectSchema, 'hello');

    test('#01 => success is true', () =>
      expect(result.success).toBe(true));
    test('#02 => output is hello', () =>
      expect(result.output).toBe('hello'));
  });

  describe('#02 => number', () => {
    const result = v.safeParse(PrimitiveObjectSchema, 42);

    test('#01 => success is true', () =>
      expect(result.success).toBe(true));
    test('#02 => output is 42', () => expect(result.output).toBe(42));
  });

  describe('#03 => boolean', () => {
    const result = v.safeParse(PrimitiveObjectSchema, true);

    test('#01 => success is true', () =>
      expect(result.success).toBe(true));
    test('#02 => output is true', () => expect(result.output).toBe(true));
  });

  describe('#04 => undefined', () => {
    const result = v.safeParse(PrimitiveObjectSchema, undefined);

    test('#01 => success is true', () =>
      expect(result.success).toBe(true));

    test('#02 => output is undefined', () => {
      expect(result.output).toBe(undefined);
    });
  });

  describe('#05 => simple object', () => {
    const data = { a: 'hello', b: 42, c: true };
    const result = v.safeParse(PrimitiveObjectSchema, data);

    test('#01 => success is true', () =>
      expect(result.success).toBe(true));

    test('#02 => output equals data', () => {
      expect(result.output).toEqual(data);
    });
  });

  describe('#06 => nested object', () => {
    const data = { a: { b: { c: 'hello' } } };
    const result = v.safeParse(PrimitiveObjectSchema, data);

    test('#01 => success is true', () =>
      expect(result.success).toBe(true));

    test('#02 => output equals data', () => {
      expect(result.output).toEqual(data);
    });
  });

  describe('#07 => simple array', () => {
    const data = ['hello', 42, true, undefined];
    const result = v.safeParse(PrimitiveObjectSchema, data);

    test('#01 => success is true', () =>
      expect(result.success).toBe(true));

    test('#02 => output equals data', () => {
      expect(result.output).toEqual(data);
    });
  });

  describe('#08 => recursive arrays', () => {
    const data = ['hello', ['world', ['nested']]];
    const result = v.safeParse(PrimitiveObjectSchema, data);

    test('#01 => success is true', () =>
      expect(result.success).toBe(true));

    test('#02 => output equals data', () => {
      expect(result.output).toEqual(data);
    });
  });

  describe('#09 => mixed arrays and objects', () => {
    const data = [{ a: 'hello' }, [['world', { x: 1 }]]];
    const result = v.safeParse(PrimitiveObjectSchema, data);

    test('#01 => success is true', () =>
      expect(result.success).toBe(true));

    test('#02 => output equals data', () => {
      expect(result.output).toEqual(data);
    });
  });

  test('#10 => invalid primitive null', () => {
    expect(v.safeParse(PrimitiveObjectSchema, null).success).toBe(false);
  });

  test('#11 => invalid nested null', () => {
    expect(v.safeParse(PrimitiveObjectSchema, { a: null }).success).toBe(
      false,
    );
  });

  test('#12 => invalid nested array null', () => {
    expect(
      v.safeParse(PrimitiveObjectSchema, ['hello', [null]]).success,
    ).toBe(false);
  });
});
