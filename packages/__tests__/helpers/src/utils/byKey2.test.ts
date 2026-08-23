import { describe, expect, test } from 'vitest';
import { byKey2 } from '@bemedev/app/utils';

describe('byKey2', () => {
  describe('#01 => Single-level access', () => {
    const data = {
      name: 'Alice',
      age: 30,
      active: true,
      profile: { city: 'Paris' },
    };

    test('#01 => string property', () => {
      expect(byKey2(data, 'name')).toBe('Alice');
    });

    test('#02 => number property', () => {
      expect(byKey2(data, 'age')).toBe(30);
    });

    test('#03 => boolean property', () => {
      expect(byKey2(data, 'active')).toBe(true);
    });

    test('#04 => object property', () => {
      expect(byKey2(data, 'profile')).toEqual({ city: 'Paris' });
    });

    test('#05 => non-existent property', () => {
      expect(byKey2.low(data, 'missing')).toBeUndefined();
    });
  });

  describe('#02 => Multi-level nested access', () => {
    const nested = {
      a: { b: { c: { d: 'deep-value' } } },
      user: { profile: { settings: { theme: 'dark' } } },
    };

    test('#01 => two levels', () => {
      expect(byKey2(nested, 'a.b')).toEqual({ c: { d: 'deep-value' } });
    });

    test('#02 => three levels', () => {
      expect(byKey2(nested, 'a.b.c')).toEqual({ d: 'deep-value' });
    });

    test('#03 => four levels', () => {
      expect(byKey2(nested, 'a.b.c.d')).toBe('deep-value');
    });

    test('#04 => user theme', () => {
      expect(byKey2(nested, 'user.profile.settings.theme')).toBe('dark');
    });

    test('#05 => missing nested property returns undefined', () => {
      expect(byKey2.low(nested, 'a.b.missing')).toBeUndefined();
    });
  });

  describe('#04 => Custom separator (sep)', () => {
    const data = { user: { details: { email: 'alice@example.com', age: 25 } } };

    test('#01 => slash separator', () => {
      expect(byKey2(data, 'user/details/email' as any, { sep: '/' })).toBe(
        'alice@example.com',
      );
    });

    test('#02 => colon separator', () => {
      expect(byKey2(data, 'user:details:age' as any, { sep: ':' })).toBe(25);
    });

    test('#03 => hyphen separator', () => {
      expect(byKey2(data, 'user-details' as any, { sep: '-' })).toEqual({
        email: 'alice@example.com',
        age: 25,
      });
    });
  });

  describe('#05 => Leading delimiter removal (start: true)', () => {
    const data = { app: { config: { port: 8080 } } };

    test('#01 => start with default dot separator', () => {
      expect(byKey2(data, '.app.config.port' as any, { start: true })).toBe(8080);
    });

    test('#02 => start with custom slash separator', () => {
      expect(
        byKey2(data, '/app/config/port' as any, { sep: '/', start: true }),
      ).toBe(8080);
    });

    test('#03 => start with single-level key', () => {
      expect(byKey2(data, '/app' as any, { sep: '/', start: true })).toEqual({
        config: { port: 8080 },
      });
    });
  });

  describe('#06 => Edge cases and nullish values', () => {
    test('#01 => undefined object returns undefined', () => {
      expect(byKey2.low(undefined, 'a.b')).toBeUndefined();
    });

    test('#02 => null object returns undefined', () => {
      expect(byKey2.low(null, 'a.b')).toBeUndefined();
    });

    test('#03 => traversing through undefined property returns undefined', () => {
      expect(byKey2.low({ a: undefined }, 'a.b.c')).toBeUndefined();
    });

    test('#04 => traversing through null property returns undefined', () => {
      expect(byKey2.low({ a: null }, 'a.b.c')).toBeNull();
    });
  });

  describe('#07 => byKey2.low', () => {
    const target = { x: { y: { z: 99 } } };

    test('#01 => retrieves value with low', () => {
      expect(byKey2.low(target, 'x.y.z')).toBe(99);
    });

    test('#02 => retrieves object with low', () => {
      expect(byKey2.low(target, 'x.y')).toEqual({ z: 99 });
    });

    test('#03 => supports options in low', () => {
      expect(byKey2.low(target, '/x/y/z', { sep: '/', start: true })).toBe(99);
    });
  });
});
