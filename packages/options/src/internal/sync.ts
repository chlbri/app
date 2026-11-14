/**
 * Synchronous option helper surface built from a contract configuration.
 */

import recursive from '@bemedev/boolean-recursive';
import { recompose } from '@bemedev/decompose';

import { createCommonHelpers } from './common';
import { merge2 } from './merge2';
import { reduceFnMap } from './reduceFnMap';

/** Option helpers of a synchronous machine. */
export type SyncHelpers = ReturnType<typeof createSyncHelpers>;

/**
 * Builds every helper exposed by `machine.createOptions` for a sync machine.
 *
 * @param config - Contract machine configuration.
 *
 * @returns The synchronous helper surface.
 */
export const createSyncHelpers = (config: any) => {
  const common = createCommonHelpers(config);
  const { eventsList, timeAction } = common;

  /**
   * Batches multiple guards into a single synchronous guard.
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
    return recursive(...prepared);
  };

  /**
   * Assigns context keys from a function map or a bare function.
   *
   * @param keysOrFn - Key path(s) or keyless function map.
   * @param maybeFn - Function map when keys are provided.
   *
   * @returns Assign action.
   */
  const assign = (keysOrFn: any, maybeFn?: any) => {
    if (
      maybeFn === undefined &&
      (typeof keysOrFn === 'function' || typeof keysOrFn === 'object')
    ) {
      const _fn = reduceFnMap(keysOrFn, ...eventsList);
      return (state: any) => ({ mergers: [{ source: _fn(state) }] });
    }

    const keys = keysOrFn as any;
    const fn = maybeFn as any;
    const keysArray = Array.isArray(keys) ? keys : [keys];
    const isArray = Array.isArray(keys);
    const _fn = reduceFnMap(fn, ...eventsList);

    return (state: any) => {
      const result = _fn(state);
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
  };

  /**
   * Batches multiple actions.
   *
   * @param fns - Actions to run in order.
   *
   * @returns Batched action.
   */
  const batch = (...fns: any[]) => {
    return (state: any) => {
      const mergers: any[] = [];
      const extendeds: any = {};

      for (const fn of fns.filter(f => !!f)) {
        const { mergers: m, ...ext } = fn(state);
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
   * Repeats an action a fixed number of times.
   *
   * @param count - Number or function map resolving the number of iterations.
   * @param fn - Action to repeat.
   *
   * @returns Repeating action.
   */
  const _for = (count: number | ((state: any) => number), fn: any) => {
    return (state: any) => {
      const mergers: any[] = [];
      const extendeds: any = {};

      if (fn) {
        const raw =
          typeof count === 'number'
            ? count
            : reduceFnMap(count, ...eventsList)(state);

        if (!Number.isFinite(raw) || raw <= 0) return { mergers, ...extendeds };
        const iterations = Math.trunc(raw);

        for (let index = 0; index < iterations; index++) {
          const { mergers: m, ...ext } = fn(state);
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
   * Repeats an action while a predicate holds.
   *
   * @param predicate - Predicate function map.
   * @param fn - Action to repeat.
   *
   * @returns Repeating action.
   */
  const _while = (predicate: any, fn: any) => {
    return (state: any) => {
      const mergers: any[] = [];
      const extendeds: any = {};

      if (fn) {
        const predicateFn = reduceFnMap(predicate, ...eventsList);

        while (predicateFn(state)) {
          const { mergers: m, ...ext } = fn(state);
          Object.assign(extendeds, ext);

          /* v8 ignore if -- @preserve */
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
   * Repeats an action at least once while a predicate holds.
   *
   * @param predicate - Predicate function map.
   * @param fn - Action to repeat.
   *
   * @returns Repeating action.
   */
  const _doWhile = (predicate: any, fn: any) => {
    return (state: any) => {
      const mergers: any[] = [];
      const extendeds: any = {};

      if (fn) {
        const predicateFn = reduceFnMap(predicate, ...eventsList);

        do {
          const { mergers: m, ...ext } = fn(state);
          Object.assign(extendeds, ext);

          if (m && m.length > 0) {
            mergers.push(...m);
            state.context = merge2.multiple(state.context, ...(m as any)) as any;
          }
        } while (predicateFn(state));
      }

      return { mergers, ...extendeds };
    };
  };

  /**
   * Creates an action running a side-effect.
   *
   * @param fn - Action function or function map.
   *
   * @returns Action.
   */
  const action = (fn: any) => {
    return (state: any) => {
      reduceFnMap(fn, ...eventsList)(state);
      return {};
    };
  };

  /**
   * Creates an action sending an event to a child actor.
   *
   * @returns Sender factory.
   */
  const sendTo = () => {
    return (fn: any) => {
      const fn2 = reduceFnMap(fn, ...eventsList);
      return (state: any) => {
        const { event, to } = fn2(state) as any;
        return { sentEvent: { to, event } };
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
