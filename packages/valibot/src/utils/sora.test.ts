import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { SoraSchema } from './sora';

describe('#01 => sora schema', () => {
  const schema = SoraSchema(v.string());

  describe('#01 => single value', () => {
    const result = v.safeParse(schema, 'hello');

    test('#01 => success', () => expect(result.success).toBe(true));
    test('#02 => output', () => expect(result.output).toBe('hello'));
  });

  describe('#02 => flat array', () => {
    const result = v.safeParse(schema, ['hello', 'world']);

    test('#01 => success', () => expect(result.success).toBe(true));

    test('#02 => output', () => {
      expect(result.output).toEqual(['hello', 'world']);
    });
  });

  describe('#03 => recursive arrays', () => {
    const result = v.safeParse(schema, ['hello', ['world', ['nested']]]);

    test('#01 => success', () => expect(result.success).toBe(true));

    test('#02 => output', () => {
      expect(result.output).toEqual(['hello', ['world', ['nested']]]);
    });
  });

  test('#04 => invalid type', () => {
    expect(v.safeParse(schema, 123).success).toBe(false);
  });

  test('#05 => invalid nested type', () => {
    expect(v.safeParse(schema, ['hello', [123]]).success).toBe(false);
  });
});
