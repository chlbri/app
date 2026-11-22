import {
  mergePlugins,
  mergeUtilities,
  orderPlugins,
  same,
  type UtilityMap,
  type UtilityPlugin,
} from '@bemedev/app-options';

const plugin = (name: string, requires?: readonly string[]): UtilityPlugin => ({
  name,
  ...(requires && { requires }),
  create: () => ({}),
});

describe('TESTS', () => {
  describe('#01 => mergeUtilities', () => {
    test('#01 => merges descriptors into the target in place', () => {
      const target: UtilityMap = {};
      const increment = same((value: number) => value + 1);

      const result = mergeUtilities(target, { increment });

      expect(result).toBe(target);
      expect(target).toStrictEqual({ increment });
    });

    test('#02 => rejects the reserved name', () => {
      expect(() => mergeUtilities({}, { resolve: same(() => undefined) })).toThrow(
        'Utility "resolve" is reserved',
      );
    });

    test('#03 => names the plugin that declares a reserved name', () => {
      expect(() =>
        mergeUtilities({}, { resolve: same(() => undefined) }, { plugin: 'alpha' }),
      ).toThrow('Utility "resolve" is reserved from plugin "alpha"');
    });

    test('#04 => rejects an existing key without an explicit override', () => {
      const target: UtilityMap = { increment: same(() => 1) };

      expect(() => mergeUtilities(target, { increment: same(() => 2) })).toThrow(
        'Utility "increment" already exists. ' +
          'Set "override: true" on the plugin to replace it.',
      );
    });

    test('#05 => names the plugin responsible for a duplicate key', () => {
      const target: UtilityMap = { increment: same(() => 1) };

      expect(() =>
        mergeUtilities(target, { increment: same(() => 2) }, { plugin: 'beta' }),
      ).toThrow(
        'Utility "increment" already exists from plugin "beta". ' +
          'Set "override: true" on the plugin to replace it.',
      );
    });

    test('#06 => replaces an existing key when override is set', () => {
      const first = same(() => 1);
      const second = same(() => 2);
      const target: UtilityMap = { increment: first };

      const result = mergeUtilities(
        target,
        { increment: second },
        { override: true },
      );

      expect(result).toBe(target);
      expect(target.increment).toBe(second);
    });

    test('#07 => keeps the reserved name protected from override', () => {
      expect(() =>
        mergeUtilities(
          { increment: same(() => 1) },
          { resolve: same(() => 2) },
          { override: true },
        ),
      ).toThrow('Utility "resolve" is reserved');
    });
  });

  describe('#02 => mergePlugins', () => {
    test('#01 => returns the local plugins without globals', () => {
      const first = plugin('first');
      const second = plugin('second');

      expect(mergePlugins([], [first, second])).toStrictEqual([first, second]);
    });

    test('#02 => lets a local plugin replace a global one', () => {
      const global = plugin('shared');
      const other = plugin('other');
      const local = plugin('shared');

      const merged = mergePlugins([global, other], [local]);

      expect(merged).toStrictEqual([local, other]);
      expect(merged[0]).toBe(local);
    });

    test('#03 => appends new local plugins after the global ones', () => {
      const global = plugin('global');
      const local = plugin('local');

      expect(mergePlugins([global], [local])).toStrictEqual([global, local]);
    });
  });

  describe('#03 => orderPlugins', () => {
    test('#01 => preserves the input order without constraints', () => {
      const first = plugin('first');
      const second = plugin('second');

      expect(orderPlugins([first, second])).toStrictEqual([first, second]);
    });

    test('#02 => orders a plugin after its dependency', () => {
      const base = plugin('base');
      const derived = plugin('derived', ['base']);

      expect(orderPlugins([derived, base])).toStrictEqual([base, derived]);
    });

    test('#03 => keeps the first plugin when names are duplicated', () => {
      const first = plugin('duplicated');
      const second = plugin('duplicated');

      expect(orderPlugins([first, second])).toStrictEqual([first]);
    });

    test('#04 => skips plugins already applied', () => {
      const applied = plugin('applied');
      const pending = plugin('pending');

      expect(orderPlugins([applied, pending], new Set(['applied']))).toStrictEqual([
        pending,
      ]);
    });

    test('#05 => skips a dependency that is already applied', () => {
      const derived = plugin('derived', ['base']);

      expect(orderPlugins([derived], new Set(['base']))).toStrictEqual([derived]);
    });

    test('#06 => skips a dependency that was already ordered', () => {
      const base = plugin('base');
      const middle = plugin('middle', ['base']);
      const top = plugin('top', ['base', 'middle']);

      expect(orderPlugins([top, middle, base])).toStrictEqual([base, middle, top]);
    });

    test('#07 => throws on a circular dependency', () => {
      const first = plugin('first', ['second']);
      const second = plugin('second', ['first']);

      expect(() => orderPlugins([first, second])).toThrow(
        'Circular plugin dependency: first -> second -> first',
      );
    });

    test('#08 => detects a self dependency', () => {
      const self = plugin('self', ['self']);

      expect(() => orderPlugins([self])).toThrow(
        'Circular plugin dependency: self -> self',
      );
    });

    test('#09 => throws when a dependency is missing', () => {
      const derived = plugin('derived', ['missing']);

      expect(() => orderPlugins([derived])).toThrow(
        'Plugin "derived" requires "missing", which is not provided.',
      );
    });
  });
});
