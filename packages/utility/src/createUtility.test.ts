import { createUtility } from './createUtility';
import { orderPlugins } from './merge';
import { same } from './same';
import type { UtilityPlugin } from './plugin';

describe('TESTS', () => {
  describe('#01 => same', () => {
    test('#01 => shares one implementation between both modes', () => {
      const fn = (value: number) => value + 1;
      const pair = same(fn);

      expect(pair.sync).toBe(fn);
      expect(pair.async).toBe(fn);
    });
  });

  describe('#02 => createUtility / add', () => {
    test('#01 => resolves declared utilities by mode', async () => {
      const utilities = createUtility()
        .add(
          'add',
          same((a: number, b: number) => a + b),
        )
        .add('delay', {
          sync: (value: number) => value,
          async: async (value: number) => value,
        })
        .build();

      const sync = utilities.resolve('sync');
      const async = utilities.resolve('async');

      expect(sync.add(1, 2)).toBe(3);
      expect(sync.delay(4)).toBe(4);
      await expect(async.delay(4)).resolves.toBe(4);
    });

    test('#02 => throws on a duplicate name', () => {
      const builder = createUtility().add(
        'noop',
        same(() => undefined),
      );

      expect(() =>
        builder.add(
          'noop' as never,
          same(() => undefined),
        ),
      ).toThrow('Utility "noop" already exists');
    });

    test('#03 => rejects the reserved name', () => {
      const builder = createUtility();

      expect(() =>
        builder.add(
          'resolve' as never,
          same(() => undefined),
        ),
      ).toThrow('Utility "resolve" is reserved');
    });

    test('#04 => copies the seed map', () => {
      const seed = { noop: same(() => undefined) };
      const builder = createUtility(seed);
      builder.add(
        'other' as never,
        same(() => undefined),
      );

      expect(seed).not.toHaveProperty('other');
    });
  });

  describe('#03 => createUtility / plugins', () => {
    const retryPlugin = {
      name: 'retry',
      create: () => ({ retry: same((value: number) => value * 2) }),
    } satisfies UtilityPlugin;

    const logPlugin = {
      name: 'log',
      requires: ['retry'],
      create: ({ utilities }: any) => ({ log: same(() => utilities.retry.sync(3)) }),
    } satisfies UtilityPlugin;

    test('#01 => adds the utilities of a plugin', () => {
      const utilities = createUtility().use(retryPlugin).build();
      const sync = utilities.resolve('sync');

      expect(sync.retry(2)).toBe(4);
    });

    test('#02 => gives plugins access to already-built utilities', () => {
      const utilities = createUtility().use(logPlugin, retryPlugin).build();
      const sync = utilities.resolve('sync');

      expect(sync.log()).toBe(6);
    });

    test('#03 => skips a plugin applied twice', () => {
      const utilities = createUtility().use(retryPlugin).use(retryPlugin).build();

      expect(Object.keys(utilities)).toStrictEqual(['retry']);
    });

    test('#04 => throws on a duplicate utility key', () => {
      const other = {
        name: 'other',
        create: () => ({ retry: same(() => undefined) }),
      } satisfies UtilityPlugin;

      const builder = createUtility().use(retryPlugin);

      expect(() => builder.use(other)).toThrow(
        'Utility "retry" already exists from plugin "other"',
      );
    });

    test('#05 => allows an explicit override', () => {
      const other = {
        name: 'other',
        override: true,
        create: () => ({ retry: same(() => 'replaced') }),
      } satisfies UtilityPlugin;

      const sync = createUtility()
        .use(retryPlugin)
        .use(other)
        .build()
        .resolve('sync');

      expect(sync.retry()).toBe('replaced');
    });

    test('#06 => throws on a missing dependency in useAll', () => {
      const builder = createUtility();

      expect(() => builder.use(logPlugin)).toThrow(
        'Plugin "log" requires "retry", which is not provided.',
      );
    });

    test('#07 => throws on a cyclic dependency', () => {
      const first = {
        name: 'first',
        requires: ['second'],
        create: () => ({}),
      } satisfies UtilityPlugin;

      const second = {
        name: 'second',
        requires: ['first'],
        create: () => ({}),
      } satisfies UtilityPlugin;

      expect(() => orderPlugins([first, second])).toThrow(
        'Circular plugin dependency: first -> second -> first',
      );
    });

    test('#08 => keeps a deterministic order', () => {
      const ordered = orderPlugins([logPlugin, retryPlugin]);

      expect(ordered.map(plugin => plugin.name)).toStrictEqual(['retry', 'log']);
    });

    test('#09 => skips plugins already applied while ordering', () => {
      const ordered = orderPlugins([retryPlugin], new Set(['retry']));

      expect(ordered).toStrictEqual([]);
    });

    test('#10 => forwards the static context to plugins', () => {
      const contextPlugin = {
        name: 'context',
        create: ({ config, eventsList, legacy, contract }: any) => ({
          context: same(() => ({ config, eventsList, legacy, contract })),
        }),
      } satisfies UtilityPlugin;

      const contract = { name: 'contract' };
      const config = { initial: 'idle' };
      const legacy = { _legacy: {} };
      const sync = createUtility(undefined, {
        contract,
        config,
        eventsList: ['EVENT'],
        legacy,
      })
        .use(contextPlugin)
        .build()
        .resolve('sync');

      expect(sync.context()).toStrictEqual({
        contract,
        config,
        eventsList: ['EVENT'],
        legacy,
      });
    });
  });

  describe('#04 => createUtility / build', () => {
    test('#01 => exposes a frozen map with resolve', () => {
      const utilities = createUtility()
        .add(
          'noop',
          same(() => undefined),
        )
        .build();

      expect(Object.isFrozen(utilities)).toBe(true);
      expect(utilities.resolve('sync').noop()).toBeUndefined();
    });

    test('#02 => does not see utilities added after the build', () => {
      const builder = createUtility().add(
        'noop',
        same(() => undefined),
      );
      const built = builder.build();
      builder.add(
        'other' as never,
        same(() => undefined),
      );

      expect(built).not.toHaveProperty('other');
      expect(Object.keys(built)).toStrictEqual(['noop']);
    });
  });
});
