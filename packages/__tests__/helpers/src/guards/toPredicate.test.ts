import {
  toPredicate,
  _toPredicate,
} from '@bemedev/app/guards';
import { sleep } from '@bemedev/sleep';

describe('toPredicate - coverage', () => {
  test('toPredicate - and', () => {
    const out = toPredicate({ and: ['non-exist2', 'non-exist1'] }, {});

    expect(out).toStrictEqual({
      errors: [
        'Predicate (non-exist2) is not defined',
        'Predicate (non-exist1) is not defined',
      ],
    });
  });

  test('toPredicate - or', () => {
    const out = toPredicate({ or: ['non-exist2', 'non-exist1'] }, {});

    expect(out).toStrictEqual({
      errors: [
        'Predicate (non-exist2) is not defined',
        'Predicate (non-exist1) is not defined',
      ],
    });
  });

  describe('toPredicate.async', () => {
    test('resolves sync predicates', async () => {
      const { predicate, errors } = toPredicate.async('isTrue', {
        isTrue: () => true,
      });
      expect(errors).toHaveLength(0);
      const res = await predicate!({} as any);
      expect(res).toBe(true);
    });

    test('resolves async predicates', async () => {
      const { predicate, errors } = toPredicate.async('isTrueAsync', {
        isTrueAsync: async () => {
          await sleep(0);
          return true;
        },
      });
      expect(errors).toHaveLength(0);
      const res = await predicate!({} as any);
      expect(res).toBe(true);
    });

    test('returns false if a sync predicate throws an error', async () => {
      const { predicate, errors } = toPredicate.async('throwsSync', {
        throwsSync: () => {
          throw new Error('sync failure');
        },
      });
      expect(errors).toHaveLength(0);
      const res = await predicate!({} as any);
      expect(res).toBe(false);
    });

    test('returns false if an async predicate rejects', async () => {
      const { predicate, errors } = toPredicate.async('rejectsAsync', {
        rejectsAsync: async () => {
          await sleep(0);
          throw new Error('async failure');
        },
      });
      expect(errors).toHaveLength(0);
      const res = await predicate!({} as any);
      expect(res).toBe(false);
    });
  });

  describe('_toPredicate & _toPredicate.async', () => {
    test('_toPredicate returns structured function tree', () => {
      const { func, errors } = _toPredicate('isTrue', {
        isTrue: () => true,
      });
      expect(errors).toHaveLength(0);
      expect(typeof func).toBe('function');
      // oxlint-disable-next-line typescript/no-unsafe-function-type
      expect((func as Function)({} as any)).toBe(true);
    });

    test('_toPredicate.async returns structured function tree for async predicates', async () => {
      const { func, errors } = _toPredicate.async('isTrueAsync', {
        isTrueAsync: async () => {
          await sleep(0);
          return true;
        },
      });
      expect(errors).toHaveLength(0);
      expect(typeof func).toBe('function');
      // oxlint-disable-next-line typescript/no-unsafe-function-type
      const res = await (func as Function)({} as any);
      expect(res).toBe(true);
    });
  });
});
