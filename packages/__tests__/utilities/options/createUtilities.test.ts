import { createUtilities, same } from '@bemedev/app-options';

describe('TESTS', () => {
  /** Builds a lazy plugin map whose single utility reports `impl`. */
  const create = (context: any = {}) => {
    const seen: any[] = [];

    const plugin: any = createUtilities(context, (args: any) => {
      seen.push(args);
      return { foo: same(() => 'impl') };
    });

    return { plugin, seen };
  };

  describe('#01 => builder', () => {
    test('#01 => is lazy until an entry is resolved', () => {
      const { plugin, seen } = create();

      expect(seen).toHaveLength(0);

      const implementation = plugin.foo.sync({});

      expect(seen).toHaveLength(1);
      expect(implementation()).toBe('impl');
    });

    test('#02 => caches the build per addons object', () => {
      const { plugin, seen } = create();
      const addons = {};

      plugin.foo.sync(addons);
      plugin.foo.sync(addons);

      expect(seen).toHaveLength(1);

      plugin.foo.async({});

      expect(seen).toHaveLength(2);
    });

    test('#03 => gives addons precedence over declared utilities', () => {
      const declared = { foo: same(() => 'declared') };
      let received: any;

      const plugin: any = createUtilities({ utilities: declared }, (args: any) => {
        received = args.utilities;
        return { foo: same(() => 'built') };
      });

      plugin.foo.sync({ foo: same(() => 'addon') });

      expect(received.foo.sync()).toBe('addon');
    });

    test('#04 => forwards the contract and the declared utilities', () => {
      const contract = { types: { sync: true } } as any;
      const declared = { bar: same(() => 'bar') };
      let received: any;

      const plugin: any = createUtilities(
        { contract, utilities: declared },
        (args: any) => {
          received = args;
          return { foo: same(() => 1) };
        },
      );

      plugin.foo.sync({ baz: same(() => 'baz') });

      expect(received.contract).toBe(contract);
      expect(received.utilities.bar).toBe(declared.bar);
      expect(received.utilities.foo).toBeUndefined();
    });
  });

  describe('#02 => get trap', () => {
    test('#01 => resolves any name before the build', () => {
      const { plugin } = create();

      expect(plugin.unknown).toStrictEqual({
        sync: expect.any(Function),
        async: expect.any(Function),
      });
    });

    test('#02 => hides unknown names after the build', () => {
      const { plugin } = create();
      plugin.foo.sync({});

      expect(plugin.foo).toStrictEqual({
        sync: expect.any(Function),
        async: expect.any(Function),
      });
      expect(plugin.unknown).toBeUndefined();
    });

    test('#03 => keeps the map out of the thenable protocol', async () => {
      const { plugin, seen } = create();

      expect(plugin.then).toBeUndefined();
      expect(seen).toHaveLength(0);
      await expect(Promise.resolve(plugin)).resolves.toBe(plugin);
      expect(seen).toHaveLength(0);
    });

    test('#04 => ignores symbol keys', () => {
      const { plugin, seen } = create();

      expect(plugin[Symbol.toStringTag]).toBeUndefined();
      expect(plugin[Symbol.iterator]).toBeUndefined();
      expect(Object.prototype.toString.call(plugin)).toBe('[object Object]');
      expect(seen).toHaveLength(0);
    });
  });

  describe('#03 => has trap', () => {
    test('#01 => reports the built keys only', () => {
      const { plugin } = create();

      expect('foo' in plugin).toBe(false);
      expect('unknown' in plugin).toBe(false);
      expect(Symbol.iterator in plugin).toBe(false);

      plugin.foo.sync({});

      expect('foo' in plugin).toBe(true);
      expect('unknown' in plugin).toBe(false);
    });
  });

  describe('#04 => ownKeys trap', () => {
    test('#01 => enumerates nothing before the build', () => {
      const { plugin } = create();

      expect(Object.keys(plugin)).toStrictEqual([]);
      expect(Reflect.ownKeys(plugin)).toStrictEqual([]);
      expect({ ...plugin }).toStrictEqual({});
    });

    test('#02 => enumerates the built keys', () => {
      const { plugin } = create();
      plugin.foo.sync({});

      expect(Object.keys(plugin)).toStrictEqual(['foo']);
      expect(Reflect.ownKeys(plugin)).toStrictEqual(['foo']);
      expect(Object.keys({ ...plugin })).toStrictEqual(['foo']);
    });
  });

  describe('#05 => getOwnPropertyDescriptor trap', () => {
    test('#01 => has no descriptor before the build', () => {
      const { plugin } = create();

      expect(Object.getOwnPropertyDescriptor(plugin, 'foo')).toBeUndefined();
      expect(
        Object.getOwnPropertyDescriptor(plugin, Symbol.iterator),
      ).toBeUndefined();
      expect(Object.hasOwn(plugin, 'foo')).toBe(false);
    });

    test('#02 => describes the built keys', () => {
      const { plugin } = create();
      plugin.foo.sync({});

      expect(Object.getOwnPropertyDescriptor(plugin, 'foo')).toStrictEqual({
        configurable: true,
        enumerable: true,
        value: { sync: expect.any(Function), async: expect.any(Function) },
        writable: false,
      });
      expect(Object.hasOwn(plugin, 'foo')).toBe(true);
      expect(Object.getOwnPropertyDescriptor(plugin, 'unknown')).toBeUndefined();
      expect(
        Object.getOwnPropertyDescriptor(plugin, Symbol.iterator),
      ).toBeUndefined();
      expect(Object.hasOwn(plugin, 'unknown')).toBe(false);
    });
  });
});
