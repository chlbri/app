import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { merge2 } from '@bemedev/app/utils';

describe('merge2', () => {
  const { acceptation, success } = createTests(merge2);

  describe('#00 => Acceptation', acceptation);

  describe(
    '#01 => Success',
    success(
      {
        invite: 'source is undefined, returns target',
        parameters: { target: { a: 1, b: 'test' }, source: undefined, key: 'a' },
        expected: { a: 1, b: 'test' },
      },
      {
        invite: 'source is null, returns target',
        parameters: { target: { a: 1, b: 'test' }, source: null as any, key: 'a' },
        expected: { a: 1, b: 'test' },
      },
      {
        invite: 'empty key returns target',
        parameters: {
          target: { a: 1, b: 2 },
          source: { a: 10, b: 20 },
          key: '' as any,
        },
        expected: { a: 1, b: 2 },
      },
      {
        invite: 'merges single-level property #1',
        parameters: { target: { a: 1, b: 2 }, source: { a: 10, b: 20 }, key: 'a' },
        expected: { a: 10, b: 2 },
      },
      {
        invite: 'merges single-level property #2',
        parameters: { target: { a: 1, b: 2 }, source: { a: 10, b: 20 }, key: 'b' },
        expected: { a: 1, b: 20 },
      },
      {
        invite: 'merges single-level object property',
        parameters: {
          target: { a: { x: 1 }, b: 2 },
          source: { a: { x: 99 }, b: 20 },
          key: 'a',
        },
        expected: { a: { x: 99 }, b: 2 },
      },
      {
        invite: 'merges two-level nested property',
        parameters: {
          target: { a: { x: 1, y: 2 }, b: 3 },
          source: { a: { x: 10, y: 20 }, b: 30 },
          key: 'a.x',
        },
        expected: { a: { x: 10, y: 2 }, b: 3 },
      },
      {
        invite: 'merges another two-level nested property',
        parameters: {
          target: { a: { x: 1, y: 2 }, b: 3 },
          source: { a: { x: 10, y: 20 }, b: 30 },
          key: 'a.y',
        },
        expected: { a: { x: 1, y: 20 }, b: 3 },
      },
      {
        invite: 'merges three-level nested property #1',
        parameters: {
          target: { a: { b: { c: 1, d: 2 }, e: 3 }, f: 4 },
          source: { a: { b: { c: 10, d: 20 }, e: 30 }, f: 40 },
          key: 'a.b.c',
        },
        expected: { a: { b: { c: 10, d: 2 }, e: 3 }, f: 4 },
      },
      {
        invite: 'merges three-level nested property #2',
        parameters: {
          target: { a: { b: { c: 1, d: 2 }, e: 3 }, f: 4 },
          source: { a: { b: { c: 10, d: 20 }, e: 30 }, f: 40 },
          key: 'a.b.d',
        },
        expected: { a: { b: { c: 1, d: 20 }, e: 3 }, f: 4 },
      },
      {
        invite: 'merges intermediate nested object',
        parameters: {
          target: { a: { b: { c: 1, d: 2 }, e: 3 }, f: 4 },
          source: { a: { b: { c: 10, d: 20 }, e: 30 }, f: 40 },
          key: 'a.b',
        },
        expected: { a: { b: { c: 10, d: 20 }, e: 3 }, f: 4 },
      },
      {
        invite: 'source property is undefined in sub-tree',
        parameters: {
          target: { a: { b: 1, c: 2 } },
          source: { a: undefined as any },
          key: 'a.b',
        },
        expected: { a: { b: 1, c: 2 } },
      },
    ),
  );
});
