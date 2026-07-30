import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { recordV } from './record';

describe('#01 => recordV schema', () => {
  const schema = recordV(v.string(), v.string());

  describe('#01 => valid record', () => {
    const result = v.safeParse(schema, { a: 'hello', b: 'world' });

    test('#01 => success', () => expect(result.success).toBe(true));
    test('#02 => output', () =>
      expect(result.output).toEqual({ a: 'hello', b: 'world' }));
  });

  describe('#02 => invalid array', () => {
    const result = v.safeParse(schema, ['hello', 'world']);

    test('#01 => failure', () => expect(result.success).toBe(false));
  });

  describe('#03 => invalid values', () => {
    const result = v.safeParse(schema, { a: 123 });

    test('#01 => failure', () => expect(result.success).toBe(false));
  });
});
