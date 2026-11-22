import { createContract } from '@bemedev/app-contract';
import {
  configureOptions,
  createOptions,
  registerPlugins,
  same,
  type UtilityPair,
  type UtilityPlugin,
} from '@bemedev/app-options';
import { createMachine } from '@bemedev/app';

declare module '@bemedev/app-options' {
  interface Addons<Ct> {
    double: UtilityPair<(value: number) => number, (value: number) => number>;
  }
}

describe('TESTS', () => {
  const config = {
    initial: 'idle',
    states: { idle: { on: { START: '/done' } }, done: {} },
  } as const;

  const syncContract = createContract(config, { sync: true });
  const asyncContract = createContract(config, {});

  const retryPlugin = {
    name: 'retry',
    create: () => ({
      retry: same((times: number, fn: () => any) => (state: any) => {
        let last: unknown;

        for (let index = 0; index < times; index++) {
          try {
            return { result: fn(), state };
          } catch (error) {
            last = error;
          }
        }

        throw last;
      }),
    }),
  } satisfies UtilityPlugin;

  const doublePlugin = {
    name: 'double',
    create: () => ({ double: same((value: number) => value * 2) }),
  } satisfies UtilityPlugin;

  const quadruplePlugin = {
    name: 'quadruple',
    requires: ['double'],
    create: ({ utilities }: any) => ({
      quadruple: same((value: number) =>
        utilities.double.sync(utilities.double.sync(value)),
      ),
    }),
  } satisfies UtilityPlugin;

  const contextPlugin = {
    name: 'context',
    create: ({ config, eventsList, contract }: any) => ({
      pluginConfig: same(() => config),
      pluginEvents: same(() => eventsList),
      pluginContract: same(() => contract),
    }),
  } satisfies UtilityPlugin;

  const state = () => ({ context: {}, pContext: {}, event: { type: 'START' } });

  afterEach(() => configureOptions());

  describe('#01 => createOptions / per call', () => {
    test('#01 => exposes a stable helper surface in both modes', () => {
      const expected = [
        '_doWhile',
        '_for',
        '_while',
        'action',
        'assign',
        'batch',
        'erase',
        'filter',
        'forceSend',
        'guardBatch',
        'isDefined',
        'isNotDefined',
        'isNotValue',
        'isValue',
        'pauseActivity',
        'pauseTimer',
        'resend',
        'resumeActivity',
        'resumeTimer',
        'sendTo',
        'stopActivity',
        'stopTimer',
        'swap',
      ];

      const sync: string[] = [];
      const async: string[] = [];

      createOptions(syncContract)(helpers => {
        sync.push(...Object.keys(helpers));
        return {};
      });

      createOptions(asyncContract)(helpers => {
        async.push(...Object.keys(helpers));
        return {};
      });

      expect(sync.sort()).toStrictEqual(expected);
      expect(async.sort()).toStrictEqual(expected);
    });

    test('#02 => accepts a plugin as a direct argument', () => {
      const options = createOptions(
        syncContract,
        doublePlugin,
      )(({ double }) => ({ actions: { doubled: double(2) as any } }));

      expect(options.actions!.doubled).toBe(4);
    });

    test('#03 => accepts a plugin through use', () => {
      const used = createOptions(syncContract).use(doublePlugin)(({ double }) => ({
        actions: { doubled: double(4) as any },
      }));

      expect(used.actions!.doubled).toBe(8);
    });

    test('#04 => accepts several plugins through use', () => {
      const options = createOptions(syncContract).use(
        quadruplePlugin,
        doublePlugin,
      )(({ quadruple }) => ({ actions: { quadrupled: quadruple(2) as any } }));

      expect(options.actions!.quadrupled).toBe(8);
    });

    test('#05 => exposes the retry helper in sync and async', () => {
      const sync = createOptions(
        syncContract,
        retryPlugin,
      )(({ retry }) => ({ actions: { retried: retry(2, () => 42) as any } }));

      const async = createOptions(
        asyncContract,
        retryPlugin,
      )(({ retry }) => ({ actions: { retried: retry(2, () => 42) as any } }));

      expect(sync.actions!.retried!(state() as any)).toStrictEqual({
        result: 42,
        state: state(),
      });
      expect(async.actions!.retried!(state() as any)).toStrictEqual({
        result: 42,
        state: state(),
      });
    });

    test('#06 => forwards config, events and contract to plugins', () => {
      const options = createOptions(
        syncContract,
        contextPlugin,
      )(({ pluginConfig, pluginEvents, pluginContract }) => ({
        actions: {
          config: pluginConfig() as any,
          events: pluginEvents() as any,
          contract: pluginContract() as any,
        },
      }));

      expect(options.actions!.config).toBe(config);
      expect(options.actions!.events).toContain('START');
      expect(options.actions!.contract).toBe(syncContract);
    });
  });

  describe('#02 => createOptions / registry', () => {
    test('#01 => applies plugins registered globally', () => {
      configureOptions(doublePlugin);

      const options = createOptions(syncContract)(({ double }) => ({
        actions: { doubled: double(5) as any },
      }));

      expect(options.actions!.doubled).toBe(10);
    });

    test('#02 => registerPlugins is idempotent and returns the plugin', () => {
      expect(registerPlugins(doublePlugin)).toStrictEqual([doublePlugin]);
      registerPlugins(doublePlugin);

      const options = createOptions(syncContract)(({ double }) => ({
        actions: { doubled: double(6) as any },
      }));

      expect(options.actions!.doubled).toBe(12);
    });

    test('#03 => a per-call plugin overrides a global plugin with the same name', () => {
      configureOptions(doublePlugin);

      const tripler = {
        name: 'double',
        create: () => ({ double: same((value: number) => value * 3) }),
      } satisfies UtilityPlugin;

      const options = createOptions(
        syncContract,
        tripler,
      )(({ double }) => ({ actions: { doubled: double(2) as any } }));

      expect(options.actions!.doubled).toBe(6);
    });

    test('#04 => configureOptions() resets the registry', () => {
      configureOptions(doublePlugin);
      configureOptions();

      const options = createOptions(syncContract)(() => ({}));

      expect(options).toStrictEqual({});
    });
  });

  describe('#03 => machine plugins', () => {
    test('#01 => sync machine exposes plugin helpers', () => {
      const machine = createMachine(config, { sync: true, plugins: [doublePlugin] });

      const options = machine.createOptions(({ double }) => ({
        actions: { doubled: double(7) as any },
      }));

      expect(options.actions!.doubled).toBe(14);
    });

    test('#02 => async machine exposes plugin helpers', () => {
      const machine = createMachine(config, { plugins: [doublePlugin] });

      const options = machine.createOptions(({ double }) => ({
        actions: { doubled: double(8) as any },
      }));

      expect(options.actions!.doubled).toBe(16);
    });

    test('#03 => the interpreter exposes machine plugin helpers', () => {
      const machine = createMachine(config, { sync: true, plugins: [doublePlugin] });
      const service = machine
        .provideOptions(() => ({}))
        .addOptions(({ double }) => ({ actions: { doubled: double(9) as any } }));

      expect(service.actions!.doubled).toBe(18);
    });
  });
});
