import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { merge2 } from '@bemedev/app/utils';

describe('TESTS', () => {
  describe('merge2', () => {
    const { acceptation, success } = createTests(merge2<any, any, string>);
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

  describe('merge2.multiple', () => {
    const { acceptation, success } = createTests(merge2.multiple);
    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success(
        {
          invite: 'no sources provided, returns target',
          parameters: { a: 1, b: 2 },
          expected: { a: 1, b: 2 },
        },

        {
          invite: 'single source with single-level property',

          parameters: [
            { a: 1, b: 2 },
            { source: { a: 10, b: 20 }, key: 'a' },
          ],

          expected: { a: 10, b: 2 },
        },

        {
          invite: 'multiple sources merging different top-level keys',

          parameters: [
            { a: 1, b: 2, c: 3 },
            { source: { a: 10, b: 20, c: 30 }, key: 'a' },
            { source: { a: 10, b: 20, c: 30 }, key: 'b' },
          ],

          expected: { a: 10, b: 20, c: 3 },
        },

        {
          invite: 'multiple sources merging nested and top-level keys',

          parameters: [
            { a: { b: 1, c: 2 }, d: 3 },
            { source: { a: { b: 10, c: 20 }, d: 30 }, key: 'a.b' },
            { source: { a: { b: 10, c: 20 }, d: 30 }, key: 'd' },
          ],

          expected: { a: { b: 10, c: 2 }, d: 30 },
        },

        {
          invite: 'multiple sources overriding the same key sequentially',

          parameters: [
            { a: 1 },
            { source: { a: 10 }, key: 'a' },
            { source: { a: 100 }, key: 'a' },
          ],

          expected: { a: 100 },
        },

        {
          invite: 'multiple sources with deep nested paths',

          parameters: [
            { a: { b: { c: 1, d: 2 }, e: 3 } },
            { source: { a: { b: { c: 10, d: 20 }, e: 30 } }, key: 'a.b.c' },
            { source: { a: { b: { c: 10, d: 20 }, e: 30 } }, key: 'a.e' },
          ],

          expected: { a: { b: { c: 10, d: 2 }, e: 30 } },
        },

        {
          invite: 'sources containing undefined source objects',

          parameters: [
            { a: 1, b: 2 },
            { source: undefined, key: 'a' },
            { source: { a: 10, b: 20 }, key: 'b' },
          ],

          expected: { a: 1, b: 20 },
        },

        {
          invite: 'multiple sources on same nested object properties',

          parameters: [
            { a: { x: 1, y: 2, z: 3 } },
            { source: { a: { x: 10, y: 20, z: 30 } }, key: 'a.x' },
            { source: { a: { x: 50, y: 20, z: 30 } }, key: 'a.y' },
          ],

          expected: { a: { x: 10, y: 20, z: 3 } },
        },
        {
          invite: 'multiple sources, and with non-existed keys',

          parameters: [
            { a: { x: 1, y: 2 } },
            { source: { a: { x: 10, y: 20, z: 30 } }, key: 'a.x' },
            { source: { a: { x: 50, y: 20, z: 30 } }, key: 'a.y' },
            { source: { a: { z: 130 } }, key: 'a.z' },
          ],

          expected: { a: { x: 10, y: 20, z: 130 } },
        },
      ),
    );
  });
});
