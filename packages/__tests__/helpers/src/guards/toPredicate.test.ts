import { toPredicate, _toPredicate } from '@bemedev/app/guards';
import { sleep } from '@bemedev/sleep';

describe('toPredicate - coverage', () => {
  test('#01 => toPredicate - and', () => {
    const out = toPredicate(
      { and: ['non-exist2', 'non-exist1', { or: ['non-exist1'] }] },
      {},
    );

    expect(out).toStrictEqual({
      errors: [
        'Predicate (non-exist2) is not defined',
        'Predicate (non-exist1) is not defined',
        'Predicate (non-exist1) is not defined',
      ],
    });
  });

  test('#02 => toPredicate - or', () => {
    const out = toPredicate(
      { or: ['non-exist2', 'non-exist1', { and: ['non-exist2'] }] },
      {},
    );

    expect(out).toStrictEqual({
      errors: [
        'Predicate (non-exist2) is not defined',
        'Predicate (non-exist1) is not defined',
        'Predicate (non-exist2) is not defined',
      ],
    });
  });

  describe('#03 => toPredicate.async', () => {
    test('#01 => toPredicateAsync - and', () => {
      const out = toPredicate.async(
        { and: ['non-exist2', 'non-exist1', { or: ['non-exist1'] }] },
        {},
      );

      expect(out).toStrictEqual({
        errors: [
          'Predicate (non-exist2) is not defined',
          'Predicate (non-exist1) is not defined',
          'Predicate (non-exist1) is not defined',
        ],
      });
    });

    test('#02 => toPredicateAsync - or', () => {
      const out = toPredicate.async(
        { or: ['non-exist2', 'non-exist1', { and: ['non-exist2'] }] },
        {},
      );

      expect(out).toStrictEqual({
        errors: [
          'Predicate (non-exist2) is not defined',
          'Predicate (non-exist1) is not defined',
          'Predicate (non-exist2) is not defined',
        ],
      });
    });

    describe('#03 => resolves sync predicates', () => {
      const { predicate, errors } = toPredicate.async('isTrue', {
        isTrue: () => true,
      });

      test('#01 => errors is empty', () =>
        expect(errors).toHaveLength(0));

      test('#02 => predicate resolves to true', async () => {
        const res = await predicate!({} as any);
        expect(res).toBe(true);
      });
    });

    describe('#04 => resolves async predicates', () => {
      const { predicate, errors } = toPredicate.async('isTrueAsync', {
        isTrueAsync: async () => {
          await sleep(0);
          return true;
        },
      });

      test('#01 => errors is empty', () =>
        expect(errors).toHaveLength(0));

      test('#02 => predicate resolves to true', async () => {
        const res = await predicate!({} as any);
        expect(res).toBe(true);
      });
    });

    describe('#05 => returns false if a sync predicate throws', () => {
      const { predicate, errors } = toPredicate.async('throwsSync', {
        throwsSync: () => {
          throw new Error('sync failure');
        },
      });

      test('#01 => errors is empty', () =>
        expect(errors).toHaveLength(0));

      test('#02 => predicate resolves to false', async () => {
        const res = await predicate!({} as any);
        expect(res).toBe(false);
      });
    });

    describe('#06 => returns false if an async predicate rejects', () => {
      const { predicate, errors } = toPredicate.async('rejectsAsync', {
        rejectsAsync: async () => {
          await sleep(0);
          throw new Error('async failure');
        },
      });

      test('#01 => errors is empty', () =>
        expect(errors).toHaveLength(0));

      test('#02 => predicate resolves to false', async () => {
        const res = await predicate!({} as any);
        expect(res).toBe(false);
      });
    });
  });

  describe('#04 => _toPredicate & _toPredicate.async', () => {
    describe('#01 => _toPredicate returns structured function tree', () => {
      const { func, errors } = _toPredicate('isTrue', {
        isTrue: () => true,
      });

      test('#01 => errors is empty', () =>
        expect(errors).toHaveLength(0));
      test('#02 => func is a function', () =>
        expect(typeof func).toBe('function'));
      // oxlint-disable-next-line typescript/no-unsafe-function-type
      test('#03 => func returns true', () =>
        expect((func as Function)({} as any)).toBe(true));
    });

    describe('#02 => _toPredicate.async returns structured function tree for async predicates', () => {
      const { func, errors } = _toPredicate.async('isTrueAsync', {
        isTrueAsync: async () => {
          await sleep(0);
          return true;
        },
      });

      test('#01 => errors is empty', () =>
        expect(errors).toHaveLength(0));
      test('#02 => func is a function', () =>
        expect(typeof func).toBe('function'));

      // oxlint-disable-next-line typescript/no-unsafe-function-type
      test('#03 => func resolves to true', async () => {
        const res = await (func as Function)({} as any);
        expect(res).toBe(true);
      });
    });
  });
});
