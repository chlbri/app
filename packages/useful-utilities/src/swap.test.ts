import { createContract } from '@bemedev/app-contract';
import { buildHelpers, createOptions } from '@bemedev/app-options';

import { swap, swapPlugin } from './swap';

const contract = createContract(
  { initial: 'idle', states: { idle: { on: { WRITE: '/' } } } },
  { sync: true },
);

describe('swap', () => {
  test('#01 => remaps arguments from decomposed paths', () => {
    const fn = swap((value: number) => value + 1)({ '[0]': '[0].context' });

    expect(fn({ context: 1, pContext: {} } as any)).toBe(2);
  });
});

describe('swapPlugin', () => {
  test('#01 => is not part of the default helpers', () => {
    const helpers = buildHelpers({ contract });

    expect(helpers.swap).toBeUndefined();
  });

  test('#02 => adds swap to the helper surface', () => {
    const helpers = buildHelpers({ contract, plugins: [swapPlugin] });

    expect(typeof helpers.swap).toBe('function');
  });

  test('#03 => dispatches on the event name', () => {
    const helpers = buildHelpers({ contract, plugins: [swapPlugin] });
    const fn = helpers.swap(
      (value: string) => value.toUpperCase(),
      'WRITE',
    )({ '[0]': '[0].payload.value' });

    const state = { event: { type: 'WRITE', payload: { value: 'abc' } } };

    expect(fn(state)).toBe('ABC');
  });

  test('#04 => is usable through createOptions', () => {
    const options = createOptions(contract).use(swapPlugin)(({ swap, assign }) => ({
      actions: {
        inc: assign(swap((value: number) => value + 1)({ '[0]': '[0].context' })),
      },
    }));

    expect(typeof options.actions?.inc).toBe('function');
  });
});
