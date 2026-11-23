import { createContract } from '@bemedev/app-contract';
import { createOptions, createUtilities, same } from '@bemedev/app-options';
import { createMachine } from '@bemedev/app';

describe('TESTS', () => {
  const config = {
    initial: 'idle',
    states: { idle: { on: { START: '/done' } }, done: {} },
  } as const;

  const syncContract = createContract(config, { sync: true });
  const asyncContract = createContract(config, {});

  const retryPlugin = createUtilities({}, () => ({
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
  }));

  const doublePlugin = createUtilities({}, () => ({
    double: same((value: number) => value * 2),
  }));

  const quadruplePlugin = createUtilities(
    { utilities: doublePlugin },
    ({ utilities }: any) => ({
      quadruple: same((value: number) => {
        return utilities.double.sync(utilities.double.sync(value));
      }),
    }),
  );

  const state = () => ({ context: {}, pContext: {}, event: { type: 'START' } });

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
        doublePlugin,
        quadruplePlugin,
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

    test('#06 => forwards the contract to plugins', () => {
      const contractPlugin = createUtilities(
        { contract: syncContract },
        ({ contract }) => ({ pluginContract: same(() => contract) }),
      );

      const options = createOptions(
        syncContract,
        contractPlugin,
      )(({ pluginContract }) => ({
        actions: { contract: pluginContract() as any },
      }));

      expect(options.actions!.contract).toBe(syncContract);
    });
  });

  describe('#02 => plugin precedence', () => {
    test('#01 => a later plugin replaces an earlier one with the same name', () => {
      const tripler = createUtilities({}, () => ({
        double: same((value: number) => value * 3),
      }));

      const options = createOptions(
        syncContract,
        doublePlugin,
        tripler,
      )(({ double }) => ({ actions: { doubled: double(2) as any } }));

      expect(options.actions!.doubled).toBe(6);
    });

    test('#02 => a plugin cannot override a default addon', () => {
      const assignPlugin = createUtilities({}, () => ({
        assign: same(() => undefined),
      }));

      expect(() => createOptions(syncContract, assignPlugin)(() => ({}))).toThrow(
        'A plugin cannot override the default utility "assign"',
      );
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
