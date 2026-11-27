import {
  checkKeys,
  checkValues,
  isString,
  isStringOrUndefined,
} from '@bemedev/app-options/internal';
import { describe, expect, test } from 'vite-plus/test';

describe('checkKeys', () => {
  describe('#01 => checkKeys', () => {
    test('#01 => empty object accepted', () => {
      expect(checkKeys({})).toBe(true);
    });

    test('#02 => no allowed keys rejects non-empty object', () => {
      expect(checkKeys({ name: 'x' })).toBe(false);
    });

    test('#03 => allowed key accepted', () => {
      expect(checkKeys({ name: 'x' }, 'name')).toBe(true);
    });

    test('#04 => disallowed key rejected', () => {
      expect(checkKeys({ name: 'x' }, 'other')).toBe(false);
    });

    test('#05 => one extra key rejects all', () => {
      expect(checkKeys({ name: 'x', age: 1 }, 'name')).toBe(false);
    });
  });

  describe('#02 => checkKeys.strict', () => {
    test('#01 => exact keys accepted', () => {
      expect(checkKeys.strict({ name: 'x' }, 'name')).toBe(true);
    });

    test('#02 => missing key rejected', () => {
      expect(checkKeys.strict({}, 'name')).toBe(false);
    });

    test('#03 => extra key rejected', () => {
      expect(checkKeys.strict({ name: 'x', age: 1 }, 'name')).toBe(false);
    });
  });
});

describe('checkValues', () => {
  test('#01 => no allowed values accepted', () => {
    expect(checkValues('value')).toBe(true);
  });

  test('#02 => allowed value accepted', () => {
    expect(checkValues('a', 'a', 'b')).toBe(true);
  });

  test('#03 => disallowed value rejected', () => {
    expect(checkValues('c', 'a', 'b')).toBe(false);
  });

  test('#04 => undefined value accepted', () => {
    expect(checkValues.undefined(undefined, 'a')).toBe(true);
  });

  test('#05 => defined allowed value accepted', () => {
    expect(checkValues.undefined('a', 'a')).toBe(true);
  });

  test('#06 => defined disallowed value rejected', () => {
    expect(checkValues.undefined('c', 'a')).toBe(false);
  });
});

describe('checkValues.async', () => {
  test('#01 => no allowed values resolve to true', async () => {
    await expect(checkValues.async('value')).resolves.toBe(true);
  });

  test('#02 => allowed value resolves to true', async () => {
    await expect(checkValues.async('a', 'a', 'b')).resolves.toBe(true);
  });

  test('#03 => disallowed value resolves to false', async () => {
    await expect(checkValues.async('c', 'a', 'b')).resolves.toBe(false);
  });

  test('#04 => undefined value resolves to true', async () => {
    await expect(checkValues.async.undefined(undefined, 'a')).resolves.toBe(true);
  });

  test('#05 => defined allowed value resolves to true', async () => {
    await expect(checkValues.async.undefined('a', 'a')).resolves.toBe(true);
  });

  test('#06 => defined disallowed value resolves to false', async () => {
    await expect(checkValues.async.undefined('c', 'a')).resolves.toBe(false);
  });
});

describe('isString', () => {
  test('#01 => string accepted', () => {
    expect(isString('value')).toBe(true);
  });

  test('#02 => empty string accepted', () => {
    expect(isString('')).toBe(true);
  });

  test('#03 => number rejected', () => expect(isString(42)).toBe(false));
  test('#04 => object rejected', () => expect(isString({})).toBe(false));
});

describe('isStringOrUndefined', () => {
  test('#01 => undefined accepted', () => {
    expect(isStringOrUndefined(undefined)).toBe(true);
  });

  test('#02 => string accepted', () => {
    expect(isStringOrUndefined('value')).toBe(true);
  });

  test('#03 => null rejected', () => {
    expect(isStringOrUndefined(null)).toBe(false);
  });

  test('#04 => number rejected', () => {
    expect(isStringOrUndefined(42)).toBe(false);
  });
});
