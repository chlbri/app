import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { SoraSchema } from '@bemedev/app-valibot';

describe('#01 => sora schema', () => {
  const schema = SoraSchema(v.string());

  test('#01 => single value success', () => {
    const result = v.safeParse(schema, 'hello');
    expect(result.success).toBe(true);
  });

  test('#02 => single value output', () => {
    const result = v.safeParse(schema, 'hello');
    expect(result.output).toBe('hello');
  });

  test('#03 => flat array success', () => {
    const result = v.safeParse(schema, ['hello', 'world']);
    expect(result.success).toBe(true);
  });

  test('#04 => flat array output', () => {
    const result = v.safeParse(schema, ['hello', 'world']);
    expect(result.output).toEqual(['hello', 'world']);
  });

  test('#05 => recursive arrays success', () => {
    const result = v.safeParse(schema, ['hello', ['world', ['nested']]]);
    expect(result.success).toBe(true);
  });

  test('#06 => recursive arrays output', () => {
    const result = v.safeParse(schema, ['hello', ['world', ['nested']]]);
    expect(result.output).toEqual(['hello', ['world', ['nested']]]);
  });

  test('#07 => invalid type returns failure', () => {
    expect(v.safeParse(schema, 123).success).toBe(false);
  });

  test('#08 => invalid nested type returns failure', () => {
    expect(
      v.safeParse(schema, ['hello', [123]]).success,
    ).toBe(false);
  });
});
