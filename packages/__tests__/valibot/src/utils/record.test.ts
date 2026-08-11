import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { recordV } from '@bemedev/app-valibot';

describe('#01 => recordV schema', () => {
  const schema = recordV(v.string(), v.string());

  describe('#01 => valid record', () => {
    const result = v.safeParse(schema, { a: 'hello', b: 'world' });

    test('#01 => success is true', () =>
      expect(result.success).toBe(true));

    test('#02 => output matches', () => {
      expect(result.output).toEqual({ a: 'hello', b: 'world' });
    });
  });

  test('#02 => invalid array returns failure', () => {
    expect(v.safeParse(schema, ['hello', 'world']).success).toBe(false);
  });

  test('#03 => invalid values returns failure', () => {
    expect(v.safeParse(schema, { a: 123 }).success).toBe(false);
  });
});
