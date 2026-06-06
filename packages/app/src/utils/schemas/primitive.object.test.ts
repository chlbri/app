import { describe, expect, test } from 'vitest';
import * as v from 'valibot';
import { PrimitiveObjectSchema } from './primitive.object';

describe('#01 => primitiveObject schema', () => {
  test('#01 => string', () => {
    const result = v.safeParse(PrimitiveObjectSchema, 'hello');
    expect(result.success).toBe(true);
    expect(result.output).toBe('hello');
  });

  test('#02 => number', () => {
    const result = v.safeParse(PrimitiveObjectSchema, 42);
    expect(result.success).toBe(true);
    expect(result.output).toBe(42);
  });

  test('#03 => boolean', () => {
    const result = v.safeParse(PrimitiveObjectSchema, true);
    expect(result.success).toBe(true);
    expect(result.output).toBe(true);
  });

  test('#04 => undefined', () => {
    const result = v.safeParse(PrimitiveObjectSchema, undefined);
    expect(result.success).toBe(true);
    expect(result.output).toBe(undefined);
  });

  test('#05 => simple object', () => {
    const data = { a: 'hello', b: 42, c: true };
    const result = v.safeParse(PrimitiveObjectSchema, data);
    expect(result.success).toBe(true);
    expect(result.output).toEqual(data);
  });

  test('#06 => nested object', () => {
    const data = { a: { b: { c: 'hello' } } };
    const result = v.safeParse(PrimitiveObjectSchema, data);
    expect(result.success).toBe(true);
    expect(result.output).toEqual(data);
  });

  test('#07 => simple array', () => {
    const data = ['hello', 42, true, undefined];
    const result = v.safeParse(PrimitiveObjectSchema, data);
    expect(result.success).toBe(true);
    expect(result.output).toEqual(data);
  });

  test('#08 => recursive arrays', () => {
    const data = ['hello', ['world', ['nested']]];
    const result = v.safeParse(PrimitiveObjectSchema, data);
    expect(result.success).toBe(true);
    expect(result.output).toEqual(data);
  });

  test('#09 => mixed arrays and objects', () => {
    const data = [{ a: 'hello' }, [['world', { x: 1 }]]];
    const result = v.safeParse(PrimitiveObjectSchema, data);
    expect(result.success).toBe(true);
    expect(result.output).toEqual(data);
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
