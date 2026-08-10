import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { SoraSchema } from '@bemedev/app-valibot';

describe('#01 => sora schema', () => {
  const schema = SoraSchema(v.string());

  describe('#01 => single value', () => {
    const result = v.safeParse(schema, 'hello');

    test('#01 => success is true', () => expect(result.success).toBe(true));
    test('#02 => output is hello', () => expect(result.output).toBe('hello'));
  });

  describe('#02 => flat array', () => {
    const result = v.safeParse(schema, ['hello', 'world']);

    test('#01 => success is true', () => expect(result.success).toBe(true));

    test('#02 => output matches', () => {
      expect(result.output).toEqual(['hello', 'world']);
    });
  });

  describe('#03 => recursive arrays', () => {
    const data = ['hello', ['world', ['nested']]];
    const result = v.safeParse(schema, data);

    test('#01 => success is true', () => expect(result.success).toBe(true));

    test('#02 => output matches', () => {
      expect(result.output).toEqual(data);
    });
  });

  test('#04 => invalid type returns failure', () => {
    expect(v.safeParse(schema, 123).success).toBe(false);
  });

  test('#05 => invalid nested type returns failure', () => {
    expect(v.safeParse(schema, ['hello', [123]]).success).toBe(false);
  });
});

