import { createContract } from '@bemedev/app-contract';
import { createOptions, createUtilities, same } from '@bemedev/app-options';
import { expectTypeOf } from 'vite-plus/test';

describe('#01 => utility added to options', () => {
  const config = {
    initial: 'idle',
    states: { idle: { on: { START: '/done' } }, done: {} },
  } as const;

  const syncContract = createContract(config, { sync: true });
  const asyncContract = createContract(config, {});

  const sumPlugin = createUtilities({}, () => ({
    sum: same((a: number, b: number) => a + b),
  }));

  test('#01 => sync implementation', () => {
    const options = createOptions(
      syncContract,
      sumPlugin,
    )(({ sum }) => ({ actions: { total: sum(1, 2) as any } }));

    expect(options.actions!.total).toBe(3);
  });

  test('#02 => async implementation', () => {
    const options = createOptions(
      asyncContract,
      sumPlugin,
    )(({ sum }) => ({ actions: { total: sum(4, 5) as any } }));

    expect(options.actions!.total).toBe(9);
  });

  test('#03 => typings come from the plugin tuple', () => {
    createOptions(
      syncContract,
      sumPlugin,
    )(({ sum }) => {
      expectTypeOf(sum).toEqualTypeOf<(a: number, b: number) => number>();
      return {};
    });
  });

  test('#04 => a direct plugin argument also applies and types it', () => {
    const options = createOptions(
      syncContract,
      sumPlugin,
    )(({ sum }) => {
      expectTypeOf(sum).toEqualTypeOf<(a: number, b: number) => number>();
      return { actions: { total: sum(6, 7) as any } };
    });

    expect(options.actions!.total).toBe(13);
  });

  test('#05 => use applies and types plugins', () => {
    const used = createOptions(syncContract).use(sumPlugin)(({ sum }) => {
      expectTypeOf(sum).toEqualTypeOf<(a: number, b: number) => number>();
      return { actions: { total: sum(8, 9) as any } };
    });

    const all = createOptions(syncContract).use(sumPlugin)(({ sum }) => ({
      actions: { total: sum(10, 11) as any },
    }));

    expect(used.actions!.total).toBe(17);
    expect(all.actions!.total).toBe(21);
  });
});
