/**
 * Asynchronous option helper surface built from a contract configuration.
 */

import { withTimeout } from '@bemedev/better-promise';
import asyncRecursive from '@bemedev/boolean-recursive/async';
import { recompose } from '@bemedev/decompose';

import { createCommonHelpers, toArray } from './common';
import { merge2 } from './merge2';
import { reduceFnMap } from './reduceFnMap';

/** Option helpers of an asynchronous machine. */
export type AsyncHelpers = ReturnType<typeof createAsyncHelpers>;

/**
 * Builds every helper exposed by `machine.createOptions` for an async machine.
 *
 * @param config - Contract machine configuration.
 *
 * @returns The asynchronous helper surface.
 */
export const createAsyncHelpers = (config: any) => {
  const common = createCommonHelpers(config);
  const { eventsList, timeAction } = common;

  /**
   * Batches multiple guards into a single asynchronous guard.
   *
   * @param guards - Guards or logical guard objects.
   *
   * @returns Combined guard.
   */
  const guardBatch = (...guards: any[]) => {
    const reduceGuardItem = (guard: any): any => {
      if (typeof guard === 'boolean') return () => guard;
      if (typeof guard === 'function') return guard;

      if (typeof guard === 'object' && guard !== null) {
        if ('or' in guard) return { or: guard.or.map(reduceGuardItem) };
        return { and: guard.and.map(reduceGuardItem) };
      }

      return undefined;
    };

    const prepared = guards.map(reduceGuardItem).filter(Boolean);
    return asyncRecursive(...prepared);
  };

  /**
   * Assigns context keys from a function map or a bare function.
   *
   * @param keysOrFn - Key path(s), keyless function map, or bare function.
   * @param fnOrOptions - Function map or options when keyless.
   * @param maybeOptions - Options when keyed.
   *
   * @returns Assign action.
   */
  const assign = (keysOrFn: any, fnOrOptions?: any, maybeOptions?: any): any => {
    const isKeyless =
      typeof keysOrFn === 'function' ||
      (typeof keysOrFn === 'object' &&
        !Array.isArray(keysOrFn) &&
        (fnOrOptions === undefined || 'catch' in (fnOrOptions as any)));

    if (isKeyless) {
      const fn = keysOrFn;
      const options = fnOrOptions;
      if (!options) {
        const _fn = reduceFnMap(fn, ...eventsList);
        return async (state: any) => {
          const result = await _fn(state);
          return { mergers: [{ source: result }] };
        };
      }

      const { catch: errorFn, then: thenFn, max } = options;
      const _fn = reduceFnMap(fn, ...eventsList);

      return async (state: any) => {
        const { pContext, context, ...rest } = state;
        const _state = { pContext, context };

        const execute = async () => {
          const rawResult = await _fn(state);
          return { mergers: [{ source: rawResult }] };
        };

        try {
          let res: any = {};
          if (max !== undefined) {
            const tp = withTimeout(execute, `assign-root`, max);
            res = await tp();
          } else {
            res = await execute();
          }

          if (thenFn) {
            const nextContext = merge2.multiple(context, ...toArray(res?.mergers));
            const thenRes = await thenFn({
              ...rest,
              context: nextContext,
              pContext,
            } as any);

            const mergers = [...toArray(res?.mergers), ...toArray(thenRes?.mergers)];
            const { mergers: _m1, ...ext1 } = res;
            const { mergers: _m2, ...ext2 } = thenRes;
            return { mergers, ...ext1, ...ext2 };
          }

          return res;
        } catch (e: any) {
          const errorAction = errorFn(e);
          return await errorAction({ ..._state, ...rest } as any);
        }
      };
    }

    const keys = keysOrFn as any;
    const fn = fnOrOptions as any;
    const options = maybeOptions as any;
    const keysArray = Array.isArray(keys) ? keys : [keys];
    const isArray = Array.isArray(keys);

    if (!options) {
      const _fn = reduceFnMap(fn, ...eventsList);
      return async (state: any) => {
        const result = await _fn(state);
        if (!isArray) {
          return {
            mergers: [
              {
                key: keysArray[0] as any,
                source: recompose({ [keysArray[0]]: result }) as any,
              },
            ],
          };
        }
        const mergers = keysArray.map((k, idx) => ({
          key: k as any,
          source: recompose({ [k]: result?.[idx] }) as any,
        }));
        return { mergers };
      };
    }

    const { catch: errorFn, then: thenFn, max } = options;
    const _fn = reduceFnMap(fn, ...eventsList);

    return async (state: any) => {
      const { pContext, context, ...rest } = state;
      const _state = { pContext, context };

      const execute = async () => {
        const rawResult = await _fn(state);

        if (!isArray) {
          return {
            mergers: [
              {
                key: keysArray[0] as any,
                source: recompose({ [keysArray[0]]: rawResult }) as any,
              },
            ],
          };
        }
        const mergers = keysArray.map((k, idx) => ({
          key: k as any,
          source: recompose({ [k]: rawResult?.[idx] }) as any,
        }));
        return { mergers };
      };

      try {
        let res: any = {};
        if (max !== undefined) {
          const keysStr = keysArray.join('-');
          const tp = withTimeout(execute, `assign-${keysStr}`, max);
          res = await tp();
        } else {
          res = await execute();
        }

        if (thenFn) {
          const nextContext = merge2.multiple(
            structuredClone(context),
            ...toArray(res?.mergers),
          );
          const thenRes = await thenFn({
            ...rest,
            context: nextContext,
            pContext,
          } as any);

          const mergers = [...toArray(res?.mergers), ...toArray(thenRes?.mergers)];
          const { mergers: _m1, ...ext1 } = res;
          const { mergers: _m2, ...ext2 } = thenRes;
          return { mergers, ...ext1, ...ext2 };
        }

        return res;
      } catch (e: any) {
        const errorAction = errorFn(e);
        return await errorAction({ ..._state, ...rest } as any);
      }
    };
  };

  /**
   * Batches multiple asynchronous actions.
   *
   * @param fns - Actions to run in order.
   *
   * @returns Batched action.
   */
  const batch = (...fns: any[]) => {
    return async (state: any) => {
      const mergers: any[] = [];
      const extendeds: any = {};

      for (const fn of fns.filter(f => !!f)) {
        const { mergers: m, ...ext } = await fn(state);
        Object.assign(extendeds, ext);

        if (m && m.length > 0) {
          mergers.push(...m);
          state.context = merge2.multiple(state.context, ...(m as any)) as any;
        }
      }
      return { mergers, ...extendeds };
    };
  };

  /**
   * Repeats an asynchronous action a fixed number of times.
   *
   * @param count - Number or function map resolving the number of iterations.
   * @param fn - Action to repeat.
   *
   * @returns Repeating action.
   */
  const _for = (count: number | ((state: any) => any), fn: any) => {
    return async (state: any) => {
      const mergers: any[] = [];
      const extendeds: any = {};

      if (fn) {
        const raw =
          typeof count === 'number'
            ? count
            : await reduceFnMap(count, ...eventsList)(state);

        if (!Number.isFinite(raw) || raw <= 0) return { mergers, ...extendeds };
        const iterations = Math.trunc(raw);

        for (let index = 0; index < iterations; index++) {
          const { mergers: m, ...ext } = await fn(state);
          Object.assign(extendeds, ext);

          if (m && m.length > 0) {
            mergers.push(...m);
            state.context = merge2.multiple(state.context, ...(m as any)) as any;
          }
        }
      }

      return { mergers, ...extendeds };
    };
  };

  /**
   * Repeats an asynchronous action while a predicate holds.
   *
   * @param predicate - Predicate function map.
   * @param fn - Action to repeat.
   *
   * @returns Repeating action.
   */
  const _while = (predicate: any, fn: any) => {
    return async (state: any) => {
      const mergers: any[] = [];
      const extendeds: any = {};

      if (fn) {
        const predicateFn = reduceFnMap(predicate, ...eventsList);

        while (await predicateFn(state)) {
          const { mergers: m, ...ext } = await fn(state);
          Object.assign(extendeds, ext);

          if (m && m.length > 0) {
            mergers.push(...m);
            state.context = merge2.multiple(state.context, ...(m as any)) as any;
          }
        }
      }

      return { mergers, ...extendeds };
    };
  };

  /**
   * Repeats an asynchronous action at least once while a predicate holds.
   *
   * @param predicate - Predicate function map.
   * @param fn - Action to repeat.
   *
   * @returns Repeating action.
   */
  const _doWhile = (predicate: any, fn: any) => {
    return async (state: any) => {
      const mergers: any[] = [];
      const extendeds: any = {};

      if (fn) {
        const predicateFn = reduceFnMap(predicate, ...eventsList);

        do {
          const { mergers: m, ...ext } = await fn(state);
          Object.assign(extendeds, ext);

          if (m && m.length > 0) {
            mergers.push(...m);
            state.context = merge2.multiple(state.context, ...(m as any)) as any;
          }
        } while (await predicateFn(state));
      }

      return { mergers, ...extendeds };
    };
  };

  /**
   * Creates an asynchronous action running a side-effect.
   *
   * @param fn - Action function or function map.
   * @param options - Optional timeout, chaining and error handling.
   *
   * @returns Action.
   */
  const action = (fn: any, options?: any): any => {
    if (!options) {
      return (state: any) => {
        const _fn = reduceFnMap(fn, ...eventsList);
        void _fn(state);
        return {};
      };
    }

    const { catch: errorFn, then: thenFn, max } = options;

    return async (state: any) => {
      const execute = async () => {
        const _fn = reduceFnMap(fn, ...eventsList);
        await _fn(state);
        return {};
      };

      try {
        let res: any = {};
        if (max !== undefined) {
          const tp = withTimeout(execute, 'action', max);
          res = await tp();
        } else {
          res = await execute();
        }

        if (thenFn) return thenFn(state);

        return res;
      } catch (e: any) {
        const errorAction = errorFn(e);
        return await errorAction(state as any);
      }
    };
  };

  /**
   * Creates an asynchronous action sending an event to a child actor.
   *
   * @returns Sender factory.
   */
  const sendTo = () => {
    return (fn: any, options?: any): any => {
      if (!options) {
        const fn2 = reduceFnMap(fn, ...eventsList);
        return (state: any) => {
          const { event, to } = fn2(state) as any;
          return { sentEvent: { to, event } };
        };
      }

      const { catch: errorFn, max } = options;

      return async (state: any) => {
        const execute = async () => {
          const fn2 = reduceFnMap(fn, ...eventsList);
          const { event, to } = (await fn2(state)) as any;
          return { sentEvent: { to, event } };
        };

        try {
          if (max !== undefined) {
            const tp = withTimeout(execute, 'sendTo', max);
            return await tp();
          }
          return await execute();
        } catch (e: any) {
          const errorAction = errorFn(e);
          return await errorAction(state as any);
        }
      };
    };
  };

  return {
    ...common,
    guardBatch,
    assign,
    batch,
    _for,
    _while,
    _doWhile,
    action,
    sendTo,
    pauseActivity: timeAction('pauseActivity'),
    resumeActivity: timeAction('resumeActivity'),
    stopActivity: timeAction('stopActivity'),
    pauseTimer: timeAction('pauseTimer'),
    resumeTimer: timeAction('resumeTimer'),
    stopTimer: timeAction('stopTimer'),
  };
};
