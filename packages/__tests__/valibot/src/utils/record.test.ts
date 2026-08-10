import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { recordV } from '@bemedev/app-valibot';

describe('#01 => recordV schema', () => {
  const schema = recordV(v.string(), v.string());

  test('#01 => valid record success', () => {
    const result = v.safeParse(schema, { a: 'hello', b: 'world' });
    expect(result.success).toBe(true);
  });

  test('#02 => valid record output', () => {
    const result = v.safeParse(schema, { a: 'hello', b: 'world' });
    expect(result.output).toEqual({ a: 'hello', b: 'world' });
  });

  test('#03 => invalid array returns failure', () => {
    const result = v.safeParse(schema, ['hello', 'world']);
    expect(result.success).toBe(false);
  });

  test('#04 => invalid values returns failure', () => {
    const result = v.safeParse(schema, { a: 123 });
    expect(result.success).toBe(false);
  });
});
