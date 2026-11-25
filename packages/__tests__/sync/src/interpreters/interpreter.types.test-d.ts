import { OptionalDefinition } from '@bemedev/app/types';

type O<T> = OptionalDefinition<T, 'value'>;

describe('OptionalDefinition', () => {
  describe('#01 => primitives', () => {
    test('#01 => string', () => {
      expectTypeOf<O<string>>().toEqualTypeOf<{ value: string }>();
    });

    test('#02 => optional string', () => {
      expectTypeOf<O<string | undefined>>().toEqualTypeOf<{ value?: string }>();
    });

    test('#03 => number', () => {
      expectTypeOf<O<number>>().toEqualTypeOf<{ value: number }>();
    });
  });

  describe('#02 => objects', () => {
    test('#01 => partial object', () => {
      expectTypeOf<O<Partial<{ name: string; age: number }>>>().toEqualTypeOf<{
        value: Partial<{ name: string; age: number }>;
      }>();
    });

    test('#02 => object with an optional property', () => {
      expectTypeOf<O<{ name: string; age?: number }>>().toEqualTypeOf<{
        value: { name: string; age?: number };
      }>();
    });

    test('#03 => object with a required property', () => {
      expectTypeOf<O<{ name: string; age?: number; sex: string }>>().toEqualTypeOf<{
        value: { name: string; age?: number; sex: string };
      }>();
    });

    test('#04 => object with mixed optional and required properties', () => {
      expectTypeOf<O<{ name?: string; age?: number; sex: string }>>().toEqualTypeOf<{
        value: { name?: string; age?: number; sex: string };
      }>();
    });

    test('#05 => fully optional object', () => {
      expectTypeOf<
        O<{ name?: string; age?: number; sex?: string }>
      >().toEqualTypeOf<{ value: { name?: string; age?: number; sex?: string } }>();
    });

    test('#06 => nested object', () => {
      expectTypeOf<
        O<{
          name?: string;
          age?: number;
          sex?: string;
          data: { ert: string; esp?: boolean };
        }>
      >().toEqualTypeOf<{
        value: {
          name?: string;
          age?: number;
          sex?: string;
          data: { ert: string; esp?: boolean };
        };
      }>();
    });
  });
});
