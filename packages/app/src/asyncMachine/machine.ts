import type { AsyncAction } from '#actions';

import type { AsyncDelayFunction } from '#delays';
import { ActorsConfigMap, type EventObject, type EventsMap } from '#events';
import { type FlatMapN } from '#states';
import { merge2, reduceFnMap } from '#utils';
import { _unknown, toArray } from '@bemedev/app-utils-bemedev';
import asyncRecursive from '@bemedev/boolean-recursive/async';
import { recompose } from '@bemedev/decompose';

import {
  CommonMachine,
  type CommonConfig3,
  type CommonCreateMachine_F,
  type ScheduledData,
  type SimpleMachineOptions2,
} from '#common/machine';

import type { AsyncPredicateS } from '#guards';
import { withTimeout } from '@bemedev/better-promise';

import type {
  AsyncAddOptions_F,
  AsyncProvideOptions_F,
  AsyncSendAction_F,
  AsyncVoidAction_F,
} from './machine.types';

import type { PrimitiveObject } from '@bemedev/typings';
import type { EmptyObject } from '~types';

/**
 * A class representing an asynchronous state machine.
 * It provides methods to manage states, actions, guards, delays, promises, and machines.
 *
 * @template | {@linkcode CommonConfig3} `C` - Configuration type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template | {@linkcode EventsMap} `E` - Events map type.
 * @template | {@linkcode ActorsConfigMap} `A` - Actors configuration map type.
 * @template `Ta` - Tag string type.
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 * @template `AllPaths` - All state paths type.
 * @template | {@linkcode SimpleMachineOptions2} `Mo` - Machine options type.
 * @template | {@linkcode SimpleMachineOptions2} `L` - Additional options type.
 */

export class AsyncMachine<
  const C extends CommonConfig3 = CommonConfig3,
  const Pc = any,
  const Tc extends PrimitiveObject = PrimitiveObject,
  const E extends EventsMap = EventsMap,
  const A extends ActorsConfigMap = ActorsConfigMap,
  const Ta extends string = string,
  const Eo extends EventObject = EventObject,
  const AllPaths extends string = string,
  const Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  const L extends SimpleMachineOptions2 = EmptyObject,
> extends CommonMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo> {
  /**
   * Machine type identifier string.
   */
  readonly TYPE = 'async';

  /**
   * @deprecated
   * This property provides the action function for this {@linkcode AsyncMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   */
  get __actionFn() {
    return _unknown<AsyncAction<Eo, Pc, Tc, Ta>>();
  }

  /**
   * @deprecated
   * This property provides the predicate function for this {@linkcode AsyncMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   */
  get __predicate() {
    return _unknown<AsyncPredicateS<Eo, Pc, Tc, Ta>>();
  }

  /**
   * @deprecated
   * This property provides the delay function for this {@linkcode AsyncMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   */
  get __delay() {
    return _unknown<AsyncDelayFunction<Eo, Pc, Tc, Ta>>();
  }

  // #endregion

  /**
   * The public accessor for the flat map representation of the configuration.
   */
  get flat() {
    return this.__flat as FlatMapN<C, true>;
  }

  // #region Providers

  /**
   * Create options for the machine.
   *
   * @param helper - A function that provides options for the machine.
   * Options can include actions, guards, delays, promises, and child machines.
   *
   * @returns Option object for machine customization.
   */
  createOptions: AsyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
    const isValue = this.__isValue;
    const isNotValue = this.__isNotValue;
    const isDefined = this.__isDefined;
    const isNotDefined = this.__isNotDefined;
    const voidAction = this.__voidAction;
    const sendTo = this.__sendTo;
    const erase = this.__erase;
    const filter = this.__filter;

    const _legacy = Object.freeze({
      actions: this.__elements.actions,
      guards: this.__elements.guards,
      delays: this.__elements.delays,
      actors: this.__elements.actions,
    }) as any;

    const out = helper(
      {
        isValue,
        isNotValue,
        isDefined,
        isNotDefined,
        guardBatch: (...guards) => {
          const reduceGuardItem = (guard: any): any => {
            if (typeof guard === 'boolean') return () => guard;
            if (typeof guard === 'function') return guard;

            if (typeof guard === 'object') {
              if ('or' in guard) {
                const or = guard.or.map(reduceGuardItem);
                return { or };
              }

              const and = guard.and.map(reduceGuardItem);
              return { and };
            }

            return undefined;
          };

          const prepared = guards.map(reduceGuardItem).filter(Boolean);
          const fn = asyncRecursive(...prepared);
          return fn;
        },

        swap: this.swap,

        assign: (keys, fn, options?) => {
          const keysArray = Array.isArray(keys) ? keys : [keys];
          const isArray = Array.isArray(keys);

          if (!options) {
            const _fn = reduceFnMap(fn as any, ...this.__eventsList);
            return async state => {
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
          const _fn = reduceFnMap(fn as any, ...this.__eventsList);

          return async state => {
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
                const nextState = merge2.multiple(
                  { context, pContext },
                  ...toArray.typed(res?.mergers),
                );
                const nextContext = nextState?.context;
                const nextPContext = nextState?.pContext;
                const thenRes = await thenFn({
                  ...rest,
                  context: nextContext,
                  pContext: nextPContext,
                } as any);
                const mergers = [
                  ...toArray.typed(res?.mergers),
                  ...toArray.typed(thenRes?.mergers),
                ];
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
        },

        batch: (...fns) => {
          return async state => {
            const mergers: any[] = [];
            const extendeds: any = {};

            for (const fn of fns.filter(f => !!f)) {
              const res = await fn(state);

              const { mergers: m, ...ext } = res;
              if (m) mergers.push(...m);
              Object.assign(extendeds, ext);

              /* v8 ignore else -- @preserve */
              if (m && m.length > 0) merge2.multiple(state, ...(m as any));
            }
            return { mergers, ...extendeds };
          };
        },

        filter,
        erase,
        voidAction,
        sendTo,

        debounce: (fn, { id, ms = 100 }) => {
          return async state => {
            const res = await fn(state);
            const { mergers = [] } = res;
            const scheduled: ScheduledData<Pc, Tc> = { data: mergers, ms, id };

            return { scheduled };
          };
        },

        resend: resend => () => ({ resend }),

        forceSend: forceSend => () => ({ forceSend }),

        pauseActivity: this.__timeAction('pauseActivity'),
        resumeActivity: this.__timeAction('resumeActivity'),
        stopActivity: this.__timeAction('stopActivity'),
        pauseTimer: this.__timeAction('pauseTimer'),
        resumeTimer: this.__timeAction('resumeTimer'),
        stopTimer: this.__timeAction('stopTimer'),
      },
      { _legacy },
    );

    return out as any;
  };

  /**
   * Provides elements of the machine.
   *
   * @param helper - Option helper callback.
   *
   * @returns Machine options structure.
   */
  addOptions: AsyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
    return super.addOptions(helper) as any;
  };

  /**
   * Provides options for the machine.
   *
   * @param helper - A function that provides options for the machine.
   *
   * @returns A new instance of the machine with the provided options applied.
   */
  provideOptions: AsyncProvideOptions_F<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L> =
    helper => super.provideOptions(helper);

  // #endregion

  /**
   * Renews the machine with current configuration.
   *
   * @returns A new instance of this class {@linkcode AsyncMachine}.
   */
  protected __renew = (): this => {
    const { config, pContext, context, guards, actions, delays, actors } =
      this.__elements;

    const out = new AsyncMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>(config);

    out.__pContext = pContext;
    out.__context = context;

    out.addOptions(() => ({ guards, actions, delays, actors }) as any);

    return out as any;
  };

  /**
   * Flag indicating whether the machine contains long-running operations.
   */
  readonly longRuns: boolean;

  /**
   * Creates an instance of class {@linkcode AsyncMachine}.
   *
   * @param config - The configuration for the machine.
   */
  constructor(config: C) {
    super(config);
    this.longRuns = this.config.__longRuns === true;
  }

  // #region Options helper functions

  /**
   * Function helper to send an event to a child service.
   *
   * @see {@linkcode reduceFnMap}
   */
  protected __sendTo: AsyncSendAction_F<Eo, Pc, Tc, Ta> = () => {
    return (fn, options?) => {
      if (!options) {
        const fn2 = reduceFnMap(fn, ...this.__eventsList);
        return state => {
          const { event, to } = fn2(state) as any;
          const sentEvent = { to, event };
          return { sentEvent };
        };
      }

      const { catch: errorFn, max } = options;

      return async state => {
        const execute = async () => {
          const fn2 = reduceFnMap(fn, ...this.__eventsList);
          const { event, to } = (await fn2(state)) as any;
          const sentEvent = { to, event };
          return { sentEvent };
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

  /**
   * Function helper to perform a void action.
   *
   * @param fn - The action function to perform.
   * @param options - Optional configuration including timeout and error handling.
   *
   * @see -- type {@linkcode AsyncVoidAction_F}
   */
  protected __voidAction: AsyncVoidAction_F<Eo, Pc, Tc, Ta> = (fn, options?) => {
    if (!options) {
      return state => {
        const _fn = reduceFnMap(fn, ...this.__eventsList);
        const out = _fn(state);
        console.warn({ out });
        return {};
      };
    }

    const { catch: errorFn, then: thenFn, max } = options;

    return async state => {
      const execute = async () => {
        const _fn = reduceFnMap(fn, ...this.__eventsList);
        await _fn(state);
        return {};
      };

      try {
        let res: any = {};
        if (max !== undefined) {
          const tp = withTimeout(execute, 'voidAction', max);
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
}

/**
 * Helper function to create a new instance of class {@linkcode AsyncMachine}.
 *
 * @param config - The machine configuration object.
 *
 * @returns A new instance of class {@linkcode AsyncMachine}.
 */
export const createAsyncMachine: CommonCreateMachine_F = config => {
  return new AsyncMachine(config);
};
