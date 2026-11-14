import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

import { createOptions } from '@bemedev/app-options';

const config = {
  initial: 'idle',
  states: { idle: { on: { SEND: '/done' } }, done: {} },
} as const;

const syncContract = createContract(config, {
  context: type({ count: 'number' }),
  pContext: type({ token: 'string' }),
  eventsMap: type({ SEND: 'never' }),
  sync: true,
});

const asyncContract = createContract(config, {
  context: type({ count: 'number' }),
  pContext: type({ token: 'string' }),
  eventsMap: type({ SEND: 'never' }),
});

const state = (count: number, token?: string) =>
  ({
    context: { count },
    pContext: { token },
    event: { type: 'SEND', payload: {} },
  }) as any;

describe('#01 => createOptions / sync', () => {
  test('#01 => assign keyed path returns a merger', () => {
    const options = createOptions(syncContract)(({ assign }) => ({
      actions: {
        increment: assign('context.count', ({ context }) => context.count + 1),
      },
    }));

    const result = options.actions!.increment!(state(1, 'token'));

    expect(result).toEqual({
      mergers: [{ key: 'context.count', source: { context: { count: 2 } } }],
    });
  });

  test('#02 => assign keyless returns a source merger', () => {
    const options = createOptions(syncContract)(({ assign }) => ({
      actions: { reset: assign(() => ({ count: 0 })) },
    }));

    const result = options.actions!.reset!(state(3));

    expect(result).toEqual({ mergers: [{ source: { count: 0 } }] });
  });

  test('#03 => erase without keys returns an empty source', () => {
    const options = createOptions(syncContract)(({ erase }) => ({
      actions: { clear: erase() },
    }));

    expect(options.actions!.clear!(state(1))).toEqual({
      mergers: [{ source: undefined }],
    });
  });

  test('#04 => isValue and isDefined read context paths', () => {
    const options = createOptions(syncContract)(({ isValue, isDefined }) => ({
      guards: {
        isOne: isValue('context.count', 1),
        hasToken: isDefined('pContext.token'),
      },
    }));

    expect(options.guards!.isOne!(state(1))).toBe(true);
    expect(options.guards!.isOne!(state(2))).toBe(false);
    expect(options.guards!.hasToken!(state(1, 'token'))).toBe(true);
    expect(options.guards!.hasToken!(state(1))).toBe(false);
  });

  test('#05 => guardBatch combines guards with and/or', () => {
    const options = createOptions(syncContract)(({ isValue, guardBatch }) => ({
      guards: {
        isOneOrTwo: guardBatch({
          or: [isValue('context.count', 1), isValue('context.count', 2)],
        }),
      },
    }));

    expect(options.guards!.isOneOrTwo!(state(1))).toBe(true);
    expect(options.guards!.isOneOrTwo!(state(2))).toBe(true);
    expect(options.guards!.isOneOrTwo!(state(3))).toBe(false);
  });

  test('#06 => action runs the side effect', () => {
    const spy = vi.fn();

    const options = createOptions(syncContract)(({ action }) => ({
      actions: { trace: action(spy) },
    }));

    options.actions!.trace!(state(1));

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('#07 => resend and pauseActivity build plain actions', () => {
    const options = createOptions(syncContract)(({ resend, pauseActivity }) => ({
      actions: {
        again: resend({ type: 'SEND', payload: undefined } as any),
        paused: pauseActivity('trace'),
      },
    }));

    expect(options.actions!.again!(state(1))).toEqual({
      resend: { type: 'SEND', payload: undefined },
    });
    expect(options.actions!.paused!(state(1))).toEqual({
      context: { count: 1 },
      pContext: { token: undefined },
      pauseActivity: 'trace',
    });
  });
});

describe('#02 => createOptions / async', () => {
  test('#01 => assign awaits the function map', async () => {
    const options = createOptions(asyncContract)(({ assign }) => ({
      actions: {
        increment: assign('context.count', async ({ context }) => context.count + 1),
      },
    }));

    const result = await options.actions!.increment!(state(1, 'token'));

    expect(result).toEqual({
      mergers: [{ key: 'context.count', source: { context: { count: 2 } } }],
    });
  });

  test('#02 => action routes rejections to the catch handler', async () => {
    const options = createOptions(asyncContract)(({ action }) => ({
      actions: {
        fail: action(
          async () => {
            throw new Error('boom');
          },
          { catch: () => () => ({ failed: true }) } as any,
        ),
      },
    }));

    const result = await options.actions!.fail!(state(1));

    expect(result).toEqual({ failed: true });
  });

  test('#03 => sendTo builds a sentEvent action', async () => {
    const options = createOptions(asyncContract)(({ sendTo }) => ({
      actions: {
        toChild: sendTo()(() => ({
          to: 'child',
          event: { type: 'SEND', payload: undefined } as any,
        })),
      },
    }));

    const result = await options.actions!.toChild!(state(1));

    expect(result).toEqual({
      sentEvent: { to: 'child', event: { type: 'SEND', payload: undefined } },
    });
  });
});

describe('#03 => createOptions / runtime', () => {
  test('#01 => keeps the contract config untouched', () => {
    expect(syncContract.config).toBe(config);
    expect(asyncContract.config).toBe(config);
  });
});
