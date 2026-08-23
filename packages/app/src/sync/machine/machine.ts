import type { SyncAction2 } from '#actions';

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
import { merge2, reduceFnMap } from '#utils';
import { _unknown } from '@bemedev/app-utils-bemedev';
import recursive from '@bemedev/boolean-recursive';
import { recompose } from '@bemedev/decompose';
import type { PrimitiveObject } from '@bemedev/typings';
import { CommonMachine } from '../../common/machine';
import type {
  SyncAddOptions_F,
  SyncProvideOptions_F,
  SyncSendAction_F,
  SyncVoidAction_F,
} from './options.types';

/**
 * A class representing a synchronous state machine.
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
  /**
   * Machine type identifier string.
   */
  readonly TYPE = 'sync';

  /**
   * @deprecated Use the action function type.
   */
  get __actionFn() {
    return _unknown<SyncAction2<Eo, Pc, Tc, Ta>>();
  }

  /**
   * The public accessor for the flat map representation of the configuration.
   */
  get flat() {
    return this.__flat as FlatMapN<C, true>;
  }

  /**
   * @deprecated Use the predicate function type.
   */
  get __predicate() {
    return _unknown<AsyncPredicateS<Eo, Pc, Tc, Ta>>();
  }

  /**
   * @deprecated Use the delay function type.
   */
  get __delay() {
    return _unknown<SyncDelayFunction<Eo, Pc, Tc, Ta>>();
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
  createOptions: SyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
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
      actors: this.__elements.actors,
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

          const prepareds = guards.map(reduceGuardItem).filter(Boolean);
          const fn = recursive(...prepareds);
          return fn;
        },

        swap: this.swap,

        assign: (keys, fn) => {
          const keysArray = Array.isArray(keys) ? keys : [keys];
          const isArray = Array.isArray(keys);

          const _fn = reduceFnMap(fn as any, ...this.__eventsList);

          return state => {
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
        },

        batch: (...fns) => {
          return state => {
            const mergers: any[] = [];
            const extendeds: any = {};

            for (const fn of fns.filter(f => !!f)) {
              const res = fn(state);
              /* v8 ignore else -- @preserve */
              if (res) {
                const { mergers: m, ...ext } = res;
                if (m) mergers.push(...m);
                Object.assign(extendeds, ext);
                if (m && m.length > 0) {
                  merge2.multiple(state, ...(m as any));
                }
              }
            }
            return { mergers, ...extendeds };
          };
        },

        filter,
        erase,
        voidAction,
        sendTo,

        debounce: (fn, { id, ms = 100 }) => {
          return state => {
            const res = fn(state);
            const { mergers = [] } = res;
            const scheduled: ScheduledData<Pc, Tc> = { data: mergers, ms, id };
            return { scheduled };
          };
        },

        resend: resend => () => ({ resend }),
        forceSend: forceSend => () => ({ forceSend }),

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
   * @param helper - Option helper callback.
   * @returns Machine options structure.
   */
  addOptions: SyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
    return super.addOptions(helper) as any;
  };

  /**
   * Provides options for the machine.
   *
   * @param helper - A function that provides options for the machine.
   * @returns A new instance of the machine with the provided options applied.
   */
  provideOptions: SyncProvideOptions_F<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L> =
    helper => super.provideOptions(helper);

  // #endregion

  /**
   * Renews the machine with current configuration.
   *
   * @returns A new instance of this {@linkcode SyncMachine}.
   */
  protected __renew = (): this => {
    const { config, pContext, context, guards, actions, delays, actors } =
      this.__elements;

    const out = new SyncMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>(config);

    out.__pContext = pContext;
    out.__context = context;

    out.addOptions(() => ({ guards, actions, delays, actors }) as any);

    return out as any;
  };

  // #region Options helper functions

  /**
   * Function helper to send an event to a child service.
   */
  protected __sendTo: SyncSendAction_F<Eo, Pc, Tc, Ta> = () => {
    return fn => {
      const fn2 = reduceFnMap(fn, ...this.__eventsList);
      return state => {
        const { event, to } = fn2(state) as any;
        const sentEvent = { to, event };
        return { sentEvent };
      };
    };
  };

  /**
   * Function helper to perform a void action.
   *
   * @param fn - The action function to perform.
   */
  protected __voidAction: SyncVoidAction_F<Eo, Pc, Tc, Ta> = fn => {
    return state => {
      const _fn = reduceFnMap(fn, ...this.__eventsList);
      _fn(state);
      return {};
    };
  };
}

/**
 * Creates a new synchronous state machine instance.
 *
 * @param config - Machine configuration object.
 *
 * @returns Instance of class {@linkcode SyncMachine}.
 */
export const createSyncMachine: CommonCreateMachine_F = config => {
  return new SyncMachine(config);
};
