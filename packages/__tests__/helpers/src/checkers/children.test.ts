import { isChildConfig } from '@bemedev/app-options/internal';
import { describe, expect, test } from 'vite-plus/test';

describe('isChildConfig', () => {
  describe('#01 => rejected shapes', () => {
    test('#01 => string rejected', () => {
      expect(isChildConfig('child')).toBe(false);
    });

    test('#02 => null rejected', () => {
      expect(isChildConfig(null)).toBe(false);
    });

    test('#03 => array rejected', () => {
      expect(isChildConfig([])).toBe(false);
    });

    test('#04 => empty object rejected', () => {
      expect(isChildConfig({})).toBe(false);
    });

    test('#05 => extra key rejected', () => {
      const value = { on: { EVENT: 'idle' }, extra: true };
      expect(isChildConfig(value, 'idle')).toBe(false);
    });

    test('#06 => description key rejected', () => {
      expect(isChildConfig({ description: 42 })).toBe(false);
    });

    test('#07 => description only rejected', () => {
      expect(isChildConfig({ description: 'child' })).toBe(false);
    });

    test('#08 => non-object on rejected', () => {
      expect(isChildConfig({ on: 'EVENT' })).toBe(false);
    });

    test('#09 => unknown target rejected', () => {
      expect(isChildConfig({ on: { EVENT: 'unknown' } }, 'idle')).toBe(false);
    });

    test('#10 => invalid transition value rejected', () => {
      expect(isChildConfig({ on: { EVENT: 42 } })).toBe(false);
    });

    test('#11 => non-string context value rejected', () => {
      expect(isChildConfig({ contexts: { count: 1 } })).toBe(false);
    });

    test('#12 => null contexts rejected', () => {
      expect(isChildConfig({ contexts: null })).toBe(false);
    });

    test('#13 => array contexts rejected', () => {
      expect(isChildConfig({ contexts: [] })).toBe(false);
    });
  });

  describe('#02 => accepted shapes', () => {
    test('#01 => on with known target accepted', () => {
      expect(isChildConfig({ on: { EVENT: 'idle' } }, 'idle')).toBe(true);
    });

    test('#02 => on without keys accepted', () => {
      expect(isChildConfig({ on: { EVENT: 'anywhere' } })).toBe(true);
    });

    test('#03 => contexts only accepted', () => {
      expect(isChildConfig({ contexts: { key: 'value' } })).toBe(true);
    });

    test('#04 => contexts with description key rejected', () => {
      const value = { description: 'child', contexts: { key: 'value' } };
      expect(isChildConfig(value)).toBe(false);
    });

    test('#05 => transition configuration accepted', () => {
      const value = {
        on: { EVENT: { target: 'idle', actions: 'act', guards: 'guard' } },
      };
      expect(isChildConfig(value, 'idle')).toBe(true);
    });

    test('#06 => on and contexts accepted', () => {
      const value = { on: { EVENT: 'idle' }, contexts: { key: 'value' } };
      expect(isChildConfig(value, 'idle')).toBe(true);
    });
  });
});
