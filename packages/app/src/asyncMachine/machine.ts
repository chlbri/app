import type { AsyncAction } from '#actions';

import type { AsyncDelayFunction } from '#delays';
import { ActorsConfigMap, type EventObject, type EventsMap } from '#events';
import { type FlatMapN } from '#states';
import {
  merge2,
  reduceFnMap,
  reduceFnMapFilterArray,
  reduceFnMapFilterObject,
} from '#utils';
import { _any, _unknown, toArray } from '@bemedev/app-utils-bemedev';
import asyncRecursive from '@bemedev/boolean-recursive/async';
import { getByKey, recompose } from '@bemedev/decompose';

import {
  CommonMachine,
  type CommonConfig3,
  type CommonCreateMachine_F,
  type ScheduledData,
  type SimpleMachineOptions2,
} from '#common/machine';

import type { AsyncPredicateS } from '#guards';
import { withTimeout } from '@bemedev/better-promise';
import cloneDeep from 'clone-deep';

import type {
  AsyncAddOptions_F,
  AsyncProvideOptions_F,
  AsyncSendAction_F,
  AsyncVoidAction_F,
} from './machine.types';

import type { PrimitiveObject } from '@bemedev/typings';
import type { EmptyObject } from '~types';

/**
 * A class representing a state machine.
 * It provides methods to manage states, actions, guards, delays, promises, and machines.
 *
 * @template : {@linkcode AsyncConfig} [C] - The configuration type of the machine.
 * @template `Pc` : The private context type of the machine.
 * @template : {@linkcode PrimitiveObject} [Pc] - The context type of the machine.
 * @template : {@linkcode GetEventsFromConfig}<{@linkcode C}> [E] - The events map type derived from the configuration.
 * @template : {@linkcode PromiseeMap} [P] - The promisees map type derived from the configuration.
 * @template : {@linkcode SimpleMachineOptions2} [Mo] - The options type for the machine, which includes actions, guards, delays, promises, and machines. Defaults to {@linkcode SimpleMachineOptions2}<[{@linkcode C} , {@linkcode E} , {@linkcode A} , {@linkcode Pc} , {@linkcode Tc} ]>.
 *
 * @implements {@linkcode AnyMachine}<{@linkcode E} , {@linkcode A} , {@linkcode Pc} , {@linkcode Tc} >
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
   *
   * @see {@linkcode E}, {@linkcode A}, {@linkcode Pc}, -- type {@linkcode PrimitiveObject}, {@linkcode Tc}
   */
  get __actionFn() {
    return _unknown<AsyncAction<Eo, Pc, Tc, Ta>>();
  }

  /**
   * @deprecated
   *
   * This property provides the predicate function for this {@linkcode AsyncMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @see -- type {@linkcode AsyncPredicateS}, -- type {@linkcode ActorsConfigMap}, -- type {@linkcode PrimitiveObject}, {@linkcode E}, {@linkcode A}, {@linkcode Pc}, {@linkcode Tc}
   */
  get __predicate() {
    return _unknown<AsyncPredicateS<Eo, Pc, Tc, Ta>>();
  }

  /**
   * @deprecated
   *
   * This property provides the delay function for this {@linkcode AsyncMachine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @see {@linkcode AsyncDelayFunction}, -- type {@linkcode ActorsConfigMap}, -- type {@linkcode PrimitiveObject}, {@linkcode E}, {@linkcode A}, {@linkcode Pc}, {@linkcode Tc}
   */
  get __delay() {
    return _unknown<AsyncDelayFunction<Eo, Pc, Tc, Ta>>();
  }

  // #endregion

  /**
   * The public accessor of the flat map of the configuration for this {@linkcode AsyncMachine}.
   *
   * @see -- type {@linkcode FlatMapN}, {@linkcode AsyncConfig}, {@linkcode C}
   */
  get flat() {
    return this.__flat as FlatMapN<C, true>;
  }

  // #region Providers

  /**
   * Create options for the machine.
   *
   * @param option a function that provides options for the machine.
   * Options can include actions, guards, delays, promises, and child machines.
   *
   * Remark: Used for typings, when you're outside the Machine class.
   */
  createOptions: AsyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
    const isValue = this.__isValue;
    const isNotValue = this.__isNotValue;
    const isDefined = this.__isDefined;
    const isNotDefined = this.__isNotDefined;
    const voidAction = this.__voidAction;
    const sendTo = this.__sendTo;

    const _legacy = Object.freeze({
      actions: cloneDeep(this.__elements.actions),
      guards: cloneDeep(this.__elements.guards),
      delays: cloneDeep(this.__elements.delays),
      actors: cloneDeep(this.__elements.actions),
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
            const { pContext, context, event, ...rest } = state;
            const _state = cloneDeep({ pContext, context });

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
                  event,
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
              return await errorAction({ ..._state, event, ...rest } as any);
            }
          };
        },

        batch: (...fns) => {
          return async ({ context, pContext, ...rest }) => {
            const state = this.__cloneStateExtended({ context, pContext, ...rest });

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

        filter: (key, fn) => {
          return ({ context, pContext, ...rest }) => {
            const state = this.__cloneStateExtended({ context, pContext, ...rest });
            const currentValue = getByKey.low(state, key);

            let filteredValue: any;

            /* v8 ignore else -- @preserve */
            if (Array.isArray(currentValue)) {
              const predicate = reduceFnMapFilterArray(
                fn as any,
                ...this.__eventsList,
              );
              filteredValue = currentValue.filter((item, index) =>
                predicate(item, index, state),
              );
            } else if (currentValue !== null && typeof currentValue === 'object') {
              const predicate = reduceFnMapFilterObject(
                fn as any,
                ...this.__eventsList,
              );
              filteredValue = Object.entries(currentValue).reduce(
                (acc, [objKey, value]) => {
                  const check = predicate(value, state);
                  if (check) acc[objKey] = value;
                  return acc;
                },
                {} as any,
              );
            }

            return {
              mergers: [
                {
                  key: key as any,
                  source: recompose({ [key]: filteredValue }) as any,
                },
              ],
            };
          };
        },

        erase: key => () => ({
          mergers: [
            { key: key as any, source: recompose.low({ [key]: undefined }) as any },
          ],
        }),
        voidAction,
        sendTo,

        debounce: (fn, { id, ms = 100 }) => {
          return async ({ context, pContext, ...rest }) => {
            const state = this.__cloneStateExtended({ context, pContext, ...rest });

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
   * Provides options for the machine.
   *
   * @param option a function that provides options for the machine.
   * Options can include actions, guards, delays, promises, and child machines.
   */
  addOptions: AsyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
    return super.addOptions(helper) as any;
  };

  /**
   * Provides options for the machine.
   *
   * @param helper a function that provides options for the machine.
   * Options can include actions, guards, delays, promises, and child machines.
   * @returns a new instance of the machine with the provided options applied.
   */
  provideOptions: AsyncProvideOptions_F<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L> =
    helper => super.provideOptions(helper);

  // #endregion

  /**
   * Provides elements of the machine.
   * @param key the key of the element to provide.
   * @param value the value of the element to provide.
   * If not provided, the current elements will be returned.
   * @returns the elements of the machine with the provided key and value.
   *
   * {@linkcode C}, {@linkcode E}  , {@linkcode A} , {@linkcode Pc}  , {@linkcode Tc} , {@linkcode SimpleMachineOptions2} , {@linkcode Mo}
   */

  /**
   * Renews the machine with the provided key and value.
   * @param key the key of the element to provide.
   * @param value the value of the element to provide.
   * If not provided, the current elements will be returned.
   * @returns a new instance of this {@linkcode AsyncMachine} with the provided key and value.
   *
   * {@linkcode C}, {@linkcode E}  , {@linkcode A} , {@linkcode Pc}  , {@linkcode Tc} , {@linkcode SimpleMachineOptions2} , {@linkcode Mo}
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
   * Creates an instance of Machine.
   *
   * @param config : of type {@linkcode AsyncConfig} [C] - The configuration for the machine.
   *
   * @remarks
   * This constructor initializes the machine with the provided configuration.
   * It flattens the configuration and prepares it for further operations ({@linkcode flat}).
   */
  constructor(config: C) {
    super(config);
    this.longRuns = this.config.__longRuns === true;
  }

  // #region Options helper functions

  /**
   * Function helper to send an event to a child service.
   *
   * @param _ an optional parameter of type {@linkcode AnyMachine} [{@linkcode T}] to specify the machine context. Only used for type inference.
   *
   * {@linkcode E} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
   *
   * @see {@linkcode reduceFnMap}
   */
  protected __sendTo: AsyncSendAction_F<Eo, Pc, Tc, Ta> = () => {
    return (fn, options?) => {
      if (!options) {
        const fn2 = reduceFnMap(fn, ...this.__eventsList);
        return ({ context, pContext, ...rest }) => {
          const state = this.__cloneStateExtended({ context, pContext, ...rest });
          const { event, to } = fn2(state) as any;

          const sentEvent = { to, event };

          return { sentEvent };
        };
      }

      const { catch: errorFn, max } = options;

      return async ({ context, pContext, event, ...rest }) => {
        const state = this.__cloneStateExtended({
          context,
          pContext,
          event,
          ...rest,
        });

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
          return await errorAction({ context, pContext, event, ...rest } as any);
        }
      };
    };
  };

  /**
   * Function helper to perform a void action.
   *
   * @param fn the action function to perform.
   *
   *
   * {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
   *
   * @see {@linkcode AsyncVoidAction_F}
   */
  protected __voidAction: AsyncVoidAction_F<Eo, Pc, Tc, Ta> = (fn, options?) => {
    if (!options) {
      return ({ context, pContext, ...rest }) => {
        const _fn = reduceFnMap(fn, ...this.__eventsList);
        const state = this.__cloneStateExtended({ context, pContext, ...rest });
        _fn(state);

        return {};
      };
    }

    const { catch: errorFn, then: thenFn, max } = options;

    return async ({ context, pContext, event, ...rest }) => {
      const state = this.__cloneStateExtended({ context, pContext, event, ...rest });

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

        if (thenFn) {
          const thenRes = await thenFn({ ...rest, event, context, pContext } as any);
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
        return await errorAction({ context, pContext, event, ...rest } as any);
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
