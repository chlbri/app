import type { SyncAction2 } from '#actions';
import { expandFnMap } from '#common/functions';
import type {
  CommonConfig3,
  CommonCreateMachine_F,
  ScheduledData,
  SimpleMachineOptions2,
} from '#common/machine';
import type { SyncDelayFunction } from '#delays';
import type { ActorsConfigMap, EventObject, EventsMap } from '#events';
import { type AsyncPredicateS } from '#guards';
import type { FlatMapN } from '#states';
import {
  _merge,
  isMergeUndefined,
  MERGE_UNDEFINED,
  reduceFnMap,
} from '#utils';
import { _any, _unknown } from '@bemedev/app-utils-bemedev';
import { getByKey, recompose } from '@bemedev/decompose';
import type { PrimitiveObject } from '@bemedev/typings';
import cloneDeep from 'clone-deep';
import { CommonMachine } from '../../common/machine';
import type {
  SyncAddOptions_F,
  SyncProvideOptions_F,
  SyncSendAction_F,
  SyncVoidAction_F,
} from './options.types';

/**
 * A class representing a state machine.
 * It provides methods to manage states, actions, guards, delays, promises, and machines.
 *
 * @template : {@linkcode Config} [C] - The configuration type of the machine.
 * @template Pc : The private context type of the machine.
 * @template : {@linkcode PrimitiveObject} [Pc] - The context type of the machine.
 * @template : {@linkcode GetEventsFromConfig}<{@linkcode C}> [E] - The events map type derived from the configuration.
 * @template : {@linkcode PromiseeMap} [P] - The promisees map type derived from the configuration.
 * @template : {@linkcode SimpleMachineOptions2} [Mo] - The options type for the machine, which includes actions, guards, delays, promises, and machines. Defaults to {@linkcode SimpleMachineOptions2}<[{@linkcode C} , {@linkcode E} , {@linkcode A} , {@linkcode Pc} , {@linkcode Tc} ]>.
 *
 * @implements {@linkcode AnyMachine}<{@linkcode E} , {@linkcode A} , {@linkcode Pc} , {@linkcode Tc} >
 */
export class SyncMachine<
  const C extends CommonConfig3 = CommonConfig3,
  const Pc = any,
  const Tc extends PrimitiveObject = PrimitiveObject,
  const E extends EventsMap = EventsMap,
  const A extends ActorsConfigMap = ActorsConfigMap,
  const Ta extends string = string,
  const Eo extends EventObject = EventObject,
  const AllPaths extends string = string,
  const Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  const L extends SimpleMachineOptions2 = SimpleMachineOptions2,
> extends CommonMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo> {
  readonly TYPE = 'sync';
  /**
   * @deprecated
   * This property provides the action function for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @see {@linkcode E}
   * @see {@linkcode PromiseeMap}
   * @see {@linkcode A}
   * @see {@linkcode Pc}
   * @see {@linkcode PrimitiveObject}
   * @see {@linkcode Tc}
   */
  get __actionFn() {
    return _unknown<SyncAction2<Eo, Pc, Tc, Ta>>();
  }

  get flat() {
    return this.__flat as FlatMapN<C, true>;
  }

  /**
   * @deprecated
   *
   * This property provides the predicate function for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @see {@linkcode AsyncPredicateS}
   * @see {@linkcode ActorsConfigMap}
   * @see {@linkcode PrimitiveObject}
   * @see {@linkcode E}
   * @see {@linkcode A}
   * @see {@linkcode Pc}
   * @see {@linkcode Tc}
   */
  get __predicate() {
    return _unknown<AsyncPredicateS<Eo, Pc, Tc, Ta>>();
  }

  /**
   * @deprecated
   *
   * This property provides the delay function for this {@linkcode Machine} as a type.
   *
   * @remarks Used for typing purposes only.
   *
   * @see {@linkcode DelayFunction}
   * @see {@linkcode ActorsConfigMap}
   * @see {@linkcode PrimitiveObject}
   * @see {@linkcode E}
   * @see {@linkcode A}
   * @see {@linkcode Pc}
   * @see {@linkcode Tc}
   */
  get __delay() {
    return _unknown<SyncDelayFunction<Eo, Pc, Tc, Ta>>();
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
  createOptions: SyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
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
      actors: cloneDeep(this.__elements.actors),
    }) as any;

    const out = helper(
      {
        isValue,
        isNotValue,
        isDefined,
        isNotDefined,

        assign: (key, fn) => {
          return _any(expandFnMap.sync)(
            _any(key),
            fn,
            ...this.__eventsList,
          );
        },

        batch: (...fns) => {
          return ({ context, pContext, ...rest }) => {
            const state = this.__cloneStateExtended({
              context,
              pContext,
              ...rest,
            });

            let out: any;
            for (const fn of fns.filter(f => !!f)) {
              if (!out) out = fn(state);
              else {
                const _state = Object.assign(out, rest);
                out = _merge(out, fn(_state));
              }
            }
            return out;
          };
        },

        filter: (key, fn) => {
          return ({ context, pContext }) => {
            const currentValue = getByKey.low({ context, pContext }, key);

            const predicate = fn as any;

            let filteredValue: any;

            /* v8 ignore else -- @preserve */
            if (Array.isArray(currentValue)) {
              // Filter array elements
              filteredValue = currentValue.filter(predicate);
            } else if (
              currentValue !== null &&
              typeof currentValue === 'object'
            ) {
              if (isMergeUndefined(currentValue)) {
                return MERGE_UNDEFINED as any;
              }
              // Filter object properties
              filteredValue = Object.entries(currentValue).reduce(
                (acc, [objKey, value]) => {
                  const check = predicate(value, currentValue);
                  if (check) acc[objKey] = value;
                  else acc[objKey] = MERGE_UNDEFINED;
                  return acc;
                },
                {} as any,
              );
            }

            return recompose({ [key]: filteredValue });
          };
        },

        erase: key => () => recompose.low({ [key]: MERGE_UNDEFINED }),
        voidAction,
        sendTo,

        debounce: (fn, { id, ms = 100 }) => {
          return ({ context, pContext, ...rest }) => {
            const state = this.__cloneStateExtended({
              context,
              pContext,
              ...rest,
            });

            const data = fn(state);
            const scheduled: ScheduledData<Pc, Tc> = { data, ms, id };

            return _any({
              context,
              pContext,
              scheduled,
            });
          };
        },

        resend: resend => {
          return ({ context, pContext }) => {
            return _any({
              context,
              pContext,
              resend,
            });
          };
        },

        forceSend: forceSend => {
          return ({ context, pContext }) => {
            return _any({
              context,
              pContext,
              forceSend,
            });
          };
        },

        pauseActivity: this.__timeAction('pauseActivity') as any,
        resumeActivity: this.__timeAction('resumeActivity') as any,
        stopActivity: this.__timeAction('stopActivity') as any,
        pauseTimer: this.__timeAction('pauseTimer') as any,
        resumeTimer: this.__timeAction('resumeTimer') as any,
        stopTimer: this.__timeAction('stopTimer') as any,
      },
      { _legacy },
    );

    return out;
  };

  /**
   * Provides elements of the machine.
   * @param key the key of the element to provide.
   * @param value the value of the element to provide.
   * If not provided, the current elements will be returned.
   * @returns the elements of the machine with the provided key and value.
   *
   * @see {@linkcode Elements}
   *
   * @see type inferences :
   *
   *  {@linkcode Config} , {@linkcode C} , {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc} , {@linkcode SimpleMachineOptions2} , {@linkcode Mo}
   */

  addOptions: SyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
    return super.addOptions(helper) as any;
  };

  /**
   * Provides options for the machine.
   *
   * @param helper a function that provides options for the machine.
   * Options can include actions, guards, delays, promises, and child machines.
   * @returns a new instance of the machine with the provided options applied.
   */

  provideOptions: SyncProvideOptions_F<
    C,
    Pc,
    Tc,
    E,
    A,
    Ta,
    Eo,
    AllPaths,
    Mo,
    L
  > = helper => super.provideOptions(helper);

  // #endregion

  /**
   * Renews the machine with the provided key and value.
   * @param key the key of the element to provide.
   * @param value the value of the element to provide.
   * If not provided, the current elements will be returned.
   * @returns a new instance of this {@linkcode Machine} with the provided key and value.
   *
   * @see {@linkcode Elements}
   *
   * @see type inferences :
   *
   *  {@linkcode Config} , {@linkcode C} , {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode types} , {@linkcode Tc} , {@linkcode SimpleMachineOptions2} , {@linkcode Mo}
   */
  protected __renew = (): this => {
    const { config, pContext, context, guards, actions, delays, actors } =
      this.__elements;

    const out = new SyncMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>(
      config,
    );

    out.__pContext = pContext;
    out.__context = context;

    out.addOptions(
      () =>
        ({
          guards,
          actions,
          delays,
          actors,
        }) as any,
    );

    return out as any;
  };

  // #region Options helper functions

  /**
   * Function helper to send an event to a child service.
   *
   * @param _ an optional parameter of type {@linkcode AnyMachine} [{@linkcode T}] to specify the machine context. Only used for type inference.
   *
   * @see type inferences :
   *
   * {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
   *
   * @see {@linkcode reduceFnMap}
   */
  protected __sendTo: SyncSendAction_F<Eo, Pc, Tc, Ta> = () => {
    return fn => {
      const fn2 = reduceFnMap(fn, ...this.__eventsList);
      return ({ context, pContext, ...rest }) => {
        const state = this.__cloneStateExtended({
          context,
          pContext,
          ...rest,
        });
        const { event, to } = fn2(state) as any;

        const sentEvent = { to, event };

        return _any({ context, pContext, sentEvent });
      };
    };
  };

  /**
   * Function helper to perform a void action.
   *
   * @param fn the action function to perform.
   *
   * @see type inferences :
   *
   * {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc}
   *
   * @see {@linkcode VoidAction_F}
   */
  protected __voidAction: SyncVoidAction_F<Eo, Pc, Tc, Ta> = fn => {
    return ({ context, pContext, ...rest }) => {
      const _fn = reduceFnMap(fn, ...this.__eventsList);
      const state = this.__cloneStateExtended({
        context,
        pContext,
        ...rest,
      });
      _fn(state);

      return _any({ context, pContext });
    };
  };
}

export const createSyncMachine: CommonCreateMachine_F = config => {
  return new SyncMachine(config);
};
