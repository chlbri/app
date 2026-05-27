import type { SyncAction } from '#actions';
import _any from '#bemedev/features/common/castings/any';
import { _unknown } from '#bemedev/globals/utils/_unknown';
import type { DelayFunction } from '#delays';
import type {
  ActorsConfigMap,
  EventObject,
  EventsMap,
  ToEventObject,
  ToEvents,
} from '#events';
import { type PredicateS } from '#guards';
import {
  assignByKey,
  expandFnMap,
  getByKey,
  type ScheduledData,
  type SimpleMachineOptions2,
} from '#machines';
import type { Register } from '#registry';
import type { FlatMapN } from '#states';
import { reduceFnMap } from '#utils';
import type {
  inferT,
  PrimitiveObject,
  StandardOutput,
} from '@bemedev/typings';
import cloneDeep from 'clone-deep';
import { CommonMachine } from '../../common/machine';
import type { SyncConfig } from '../types.types';
import type {
  SyncAddOptions_F,
  SyncAddOptionsParam_F,
  SyncMachineOptions2,
  SyncSendAction_F,
  SyncTimeAction_F,
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
 * @template : {@linkcode SimpleMachineOptions2} [Mo] - The options type for the machine, which includes actions, guards, delays, promises, and machines. Defaults to {@linkcode MachineOptions}<[{@linkcode C} , {@linkcode E} , {@linkcode A} , {@linkcode Pc} , {@linkcode Tc} ]>.
 *
 * @implements {@linkcode AnyMachine}<{@linkcode E} , {@linkcode A} , {@linkcode Pc} , {@linkcode Tc} >
 */
class SyncMachine<
  const C extends SyncConfig = SyncConfig,
  const Pc = any,
  const Tc extends PrimitiveObject = PrimitiveObject,
  const E extends EventsMap = EventsMap,
  const A extends ActorsConfigMap = ActorsConfigMap,
  const Ta extends string = string,
  const Eo extends EventObject = EventObject,
  const AllPaths extends string = string,
  const Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> extends CommonMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo> {
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
    return _unknown<SyncAction<Eo, Pc, Tc, Ta>>();
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
   * @see {@linkcode PredicateS}
   * @see {@linkcode ActorsConfigMap}
   * @see {@linkcode PrimitiveObject}
   * @see {@linkcode E}
   * @see {@linkcode A}
   * @see {@linkcode Pc}
   * @see {@linkcode Tc}
   */
  get __predicate() {
    return _unknown<PredicateS<Eo, Pc, Tc, Ta>>();
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
    return _unknown<DelayFunction<Eo, Pc, Tc, Ta>>();
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
  createOptions: SyncAddOptions_F<Eo, Pc, Tc, Ta, Mo> = helper => {
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

        assign: (key, fn) => {
          return _any(expandFnMap)(
            this.__eventsMap,
            this.__actorsMap,
            _any(key),
            fn,
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
              else out = fn({ ...out, ...rest });
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
              // Filter object properties
              filteredValue = Object.entries(currentValue).reduce(
                (acc, [objKey, value]) => {
                  const check = predicate(value, currentValue);
                  if (check) acc[objKey] = value;
                  return acc;
                },
                {} as any,
              );
            }

            return assignByKey({ context, pContext }, key, filteredValue);
          };
        },

        erase: key => {
          return ({ context, pContext }) => {
            const state = cloneDeep({
              context,
              pContext,
            });
            return assignByKey(state, key, undefined);
          };
        },

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

        pauseActivity: this.__timeAction('pauseActivity'),
        resumeActivity: this.__timeAction('resumeActivity'),
        stopActivity: this.__timeAction('stopActivity'),
        pauseTimer: this.__timeAction('pauseTimer'),
        resumeTimer: this.__timeAction('resumeTimer'),
        stopTimer: this.__timeAction('stopTimer'),
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
   *  {@linkcode Config} , {@linkcode C} , {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode PrimitiveObject} , {@linkcode Tc} , {@linkcode SimpleMachineOptions2} , {@linkcode MachineOptions} , {@linkcode Mo}
   */

  addOptions = (
    helper: SyncAddOptionsParam_F<Eo, Pc, Tc, Ta, Mo>,
  ): Mo | undefined => {
    return super.addOptions(helper);
  };

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
   *  {@linkcode Config} , {@linkcode C} , {@linkcode GetEventsFromConfig} , {@linkcode E} , {@linkcode PromiseeMap} , {@linkcode GetPromiseesSrcFromConfig} , {@linkcode A} , {@linkcode Pc} , {@linkcode types} , {@linkcode Tc} , {@linkcode SimpleMachineOptions2} , {@linkcode MachineOptions} , {@linkcode Mo}
   */
  protected __renew = (): this => {
    const {
      config,
      pContext,
      context,
      guards,
      actions,
      delays,

      events,
      actors,
      actorsMap,
    } = this.__elements;

    const out = new SyncMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>(
      config,
    );

    out.__pContext = pContext;
    out.__context = context;
    out.__eventsMap = events;
    out.__actorsMap = actorsMap;

    out.addOptions(
      () =>
        ({
          guards,
          actions,
          delays,
          actors,
        }) as any,
    );

    // out.#addGuards(guards);
    // out.#addActions(actions);
    // out.#addDelays(delays);
    // out.#addChildren(actors?.children);
    // out.#addEmitters(actors?.emitters);

    return out as any;
  };

  /**
   * @deprecated
   * @remarks used internally
   */
  _provideEvents = <T extends EventsMap>(map: T) => {
    const { pContext, config, context, actorsMap } = this.__elements;

    const out = new SyncMachine<C, Pc, Tc, T, A>(config);

    out.__pContext = pContext;
    out.__context = context;
    out.__eventsMap = map;
    out.__actorsMap = actorsMap;

    return out as any;
  };

  /**
   * @deprecated
   * @remarks used internally
   */
  _provideActors = <T extends ActorsConfigMap>(map: T) => {
    const { pContext, config, context, events } = this.__elements;

    const out = new SyncMachine<C, Pc, Tc, E, T>(config);

    out.__pContext = pContext;
    out.__context = context;
    out.__eventsMap = events;
    out.__actorsMap = map;

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
  // @ts-expect-error cdcdf
  protected __sendTo: SyncSendAction_F<Eo, Pc, Tc, Ta> = (_?) => {
    return fn => {
      const fn2 = reduceFnMap(this.__eventsMap, this.__actorsMap, fn);
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
      const _fn = reduceFnMap(this.__eventsMap, this.__actorsMap, fn);
      const state = this.__cloneStateExtended({
        context,
        pContext,
        ...rest,
      });
      _fn(state);

      return _any({ context, pContext });
    };
  };

  provideOptions<T extends Mo>(
    helper: SyncAddOptionsParam_F<Eo, Pc, Tc, Ta, T>,
  ) {
    return super.provideOptions(helper);
  }

  protected __timeAction = (
    name: string,
  ): SyncTimeAction_F<Eo, Pc, Tc, Ta> => {
    return id =>
      ({ context, pContext }) => {
        return _any({ context, pContext, [name]: id });
      };
  };
}

export { type SyncMachine };

/**
 * Creates a new instance of {@linkcode Machine} with the provided configuration.
 *
 * @param name - Unique name used to register the machine in the {@linkcode Register}.
 * @param config - The machine configuration.
 * @param types - Optional type hints (pContext, context, eventsMap, actorsMap).
 *   Typically generated by the CLI into `app.gen.ts`.
 */

export function createSyncMachine<
  Name extends keyof Register & string,
  Current extends Register[Name] = Register[Name],
  const C extends SyncConfig<Current['paths']['map']> = SyncConfig<
    Current['paths']['map']
  >,
  const Pc extends StandardOutput<Current['pContext']> = StandardOutput<
    Current['pContext']
  >,
  const Tc extends StandardOutput<PrimitiveObject> = never,
  const E extends StandardOutput<
    Record<Current['events'], PrimitiveObject>
  > = StandardOutput<Record<Current['events'], PrimitiveObject>>,
  const A extends StandardOutput<
    ActorsConfigMap<
      Current['options']['children'],
      Current['options']['emitters']
    >
  > = StandardOutput<
    ActorsConfigMap<
      Current['options']['children'],
      Current['options']['emitters']
    >
  >,
  _E extends inferT<E> = inferT<E>,
  _A extends inferT<A> = inferT<A>,
  _Pc extends inferT<Pc> = inferT<Pc>,
  _Tc extends inferT<Tc> = inferT<Tc>,
  Tags extends Exclude<Current['tags'], undefined> = Exclude<
    Current['tags'],
    undefined
  >,
  Eo extends EventObject = ToEventObject<ToEvents<_E, _A>>,
>(
  _: Name,
  config: C,
  types?: {
    context?: Tc;
    pContext?: Pc;
    eventsMap?: E;
    actorsMap?: A;
  },
): SyncMachine<
  C,
  _Pc,
  _Tc,
  _E,
  _A,
  Tags,
  Eo,
  Current['paths']['all'],
  SyncMachineOptions2<_Pc, _Tc, Tags, Eo, Current['options']>
> {
  const eventsMap = types?.eventsMap?.['~standard']?.types?.output ?? {};
  const actorsMap = types?.actorsMap?.['~standard']?.types?.output ?? {};

  const out = new SyncMachine(config as SyncConfig)
    ._provideEvents(eventsMap)
    ._provideActors(actorsMap as any);

  return out as any;
}
