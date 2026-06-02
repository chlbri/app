import { type WithDescriber } from '#actions';
import type { EmitterConfig, FinallyConfig } from '#actor';
import {
  type ActorsMapFrom,
  type AllPathsFrom,
  type ContextFrom,
  type EventsFrom,
  type EventsMapFrom,
  type ExtendedActionsParams,
  type MachineOptionsFrom,
  type PrivateContextFrom,
  type TagFrom,
} from '#common/interpreter';
import {
  DEFAULT_MAX_SELF_TRANSITIONS,
  DEFAULT_MAX_TIME_PROMISE,
  DEFAULT_MIN_ACTIVITY_TIME,
} from '#constants';
import { type AsyncEmitterFunction } from '#emitters';
import {
  eventToType,
  transformEventArg,
  type ActorsConfigMap,
  type EventArgObject,
  type EventObject,
  type EventsMap,
  type ExtractSender,
} from '#events';
import { type GuardConfig } from '#guards';
import { initialConfig, nextSV } from '#states';
import type { AlwaysConfig, TransitionConfig } from '#transitions';
import {
  _any,
  isDefined,
  switchV,
  toArray,
} from '@bemedev/app-utils-bemedev';
import { createInterval } from '@bemedev/interval2';
import type { PrimitiveObject } from '@bemedev/typings';
import equal from 'fast-deep-equal';
import { isDescriber, type KeyU } from '~types';
import type { SyncConfig } from '../types.types';
import type {
  _SyncSend_F,
  SyncPerformAction_F,
  SyncPerformDelay_F,
  SyncPerformPredicate_F,
  SyncPerformTransition_F,
  SyncPerformTransitions_F,
  SyncProvideMachineOptions_F,
} from './options.types';

import type {
  CreateInterval2_F,
  ExecuteActivities_F,
  InterpretArgs,
  Mode,
} from '#common/interpreter';
import type { AnyMachine, SimpleMachineOptions2 } from '#common/machine';
import { createScheduler } from '@bemedev/scheduler/sync';
import { CommonInterpreter } from '../../common/interpreter/interpreter';
import type { AddSubscriber_F } from '../../common/interpreter/types';
import { createSubscriber } from '../../common/subscriber';
import type { SyncAddOptions_F } from '../machine';
import type { SyncMachine } from '../machine/machine';

/**
 * The `Interpreter` class is responsible for interpreting and managing the state of a machine.
 * It provides methods to start, stop, pause, and resume the machine, as well as to send events
 * and subscribe to state changes.
 *
 * @template : type {@linkcode Config} [C] - The configuration type of the machine.
 * @template : [Pc] - The private context type, which can be any type.
 * @template : type {@linkcode types} [Tc] - The context type.
 * @template : type {@linkcode EventsMap} [E] - The events map type, which maps event names to their
 * @template : type {@linkcode PromiseeMap} [P] - The promisees map type, which maps promise names to their
 * @template Mo : type {@linkcode SimpleMachineOptions2} - The machine options type, which includes various configurations for the machine. Default to {@linkcode SimpleMachineOptions2}.
 *
 * @implements : {@linkcode AnySyncInterpreter}
 *
 * @remarks
 * The `Interpreter` class is a core component of the state machine implementation,
 * allowing for the execution of state transitions, handling of events, and management of the machine's lifecycle.
 * It supports various modes of operation, including strict and normal modes,
 * and provides mechanisms for error and warning handling.
 * * It also allows for the execution of actions, guards, and delays,
 * * as well as the management of child interpreters and scheduled tasks.
 *
 * @see {@linkcode GetEventsFromConfig} for extracting events from the machine configuration.
 */
export class SyncInterpreter<
  const C extends SyncConfig = SyncConfig,
  const Pc = any,
  const Tc extends PrimitiveObject = PrimitiveObject,
  const E extends EventsMap = EventsMap,
  const A extends ActorsConfigMap = ActorsConfigMap,
  const Ta extends string = string,
  const Eo extends EventObject = EventObject,
  const AllPaths extends string = string,
  const Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  const L extends SimpleMachineOptions2 = SimpleMachineOptions2,
> extends CommonInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo> {
  readonly TYPE = 'sync';
  /**
   * @deprecated Use the `machine` getter instead to access the inner machine of this interpreter.
   *
   * The {@linkcode SyncMachine} machine being interpreted.
   */
  get machine() {
    return this.__machine as SyncMachine<
      C,
      Pc,
      Tc,
      E,
      A,
      Ta,
      Eo,
      AllPaths,
      Mo
    >;
  }

  /**
   * Create a new {@linkcode Interpreter} instance with the same initial configuration as this instance.
   */
  get renew() {
    const out = new SyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>(
      this.machine,
    );
    out._ppC(this.__initialPpc);
    out._provideContext(this.__initialContext);

    return out;
  }

  #initSchedulers = () => {
    this.__schedulerContexts = createScheduler();
    this.__schedulerValue = createScheduler();
    this.__schedulerEvent = createScheduler();
    this.__schedulerStatus = createScheduler();
  };

  constructor(
    machine: AnyMachine<E, A, Pc, Tc>,
    mode: Mode = 'strict',
    exact = true,
  ) {
    super(machine, mode, exact);
    this.#initSchedulers();
    this.__performConfig(true);
  }

  /**
   * Force transition to performs inner actions despite the current state.
   * This is useful for sending events that are not part of the current state transitions.
   * @param transitions, the transitions to perform.
   * @returns the result of the transitions.
   *
   * @see {@linkcode TransitionConfig} for more information about transitions.
   */
  protected __performForceSendAction = (
    forceSend?: EventArgObject<Eo>,
  ) => {
    if (!forceSend) return;
    const values = Object.values(this.machine.flat);

    for (const { on } of values) {
      const type = eventToType(forceSend);
      const transitions = toArray.typed(on?.[type]);
      this.__performTransitions(...(transitions as any));
    }
  };

  protected __performsExtendedActions = ({
    forceSend,
    resend,
    scheduled,
    pauseActivity,
    resumeActivity,
    stopActivity,
    pauseTimer,
    resumeTimer,
    stopTimer,
    sentEvent,
  }: ExtendedActionsParams<Eo, Pc, Tc>) => {
    this.__performSendToAction(sentEvent);

    this.__performScheduledAction(scheduled);
    this.__performPauseActivityAction(pauseActivity);
    this.__performResumeActivityAction(resumeActivity);
    this.__performStopActivityAction(stopActivity);
    this.__performPauseTimerAction(pauseTimer);
    this.__performResumeTimerAction(resumeTimer);
    this.__performStopTimerAction(stopTimer);

    // ForceSendAction returns the result to make further actions
    const result =
      this.__performForceSendAction(forceSend) ??
      this.__performResendAction(resend);

    return result;
  };

  protected __executeAction: SyncPerformAction_F<Eo, Pc, Tc, Ta> =
    action => {
      this.__setStatus('busy');
      this._iterate();
      const { pContext, context, ...extendeds } = action(
        this.__cloneState,
      );

      this.__mergeContexts({ pContext, context });
      this.__performsExtendedActions(extendeds);
    };

  protected __performActions = (...actions: WithDescriber[]) => {
    const fns = actions.map(this.toActionFn).filter(f => f !== undefined);

    for (const fn of fns) {
      this.__executeAction(fn as any);
    }
  };

  #performPredicate: SyncPerformPredicate_F<Eo, Pc, Tc, Ta> =
    predicate => {
      this._iterate();
      return predicate(this.__cloneState);
    };

  #executePredicate: SyncPerformPredicate_F<Eo, Pc, Tc, Ta> =
    predicate => {
      this.__setStatus('busy');
      const out = this.#performPredicate(predicate);
      this.__setStatus('working');
      return out;
    };

  #performPredicates = (...guards: GuardConfig[]) => {
    if (guards.length < 1) return true;
    return guards
      .map(this.toPredicateFn)
      .filter(isDefined)
      .map(this.#executePredicate)
      .every(b => b);
  };

  protected __performTransition: SyncPerformTransition_F = transition => {
    const check = typeof transition == 'string';
    if (check) {
      const { diffEntries, diffExits } = this.__diffNext(transition);
      this.__performActions(...toArray.typed(diffExits));
      this.__performActions(...toArray.typed(diffEntries));
      return transition;
    }

    const { guards, actions, target } = transition;
    const { diffEntries, diffExits } = this.__diffNext(target);

    const response = this.#performPredicates(
      ...toArray<GuardConfig>(guards),
    );

    if (response) {
      this.__performActions(...toArray.typed(diffExits));
      this.__performActions(...toArray.typed(actions));
      this.__performActions(...toArray.typed(diffEntries));
      return target ?? false;
    }
    return false;
  };

  protected __performTransitions: SyncPerformTransitions_F = (
    ...transitions
  ) => {
    for (const _transition of transitions) {
      const transition = this.__performTransition(_transition);
      const check1 = typeof transition === 'string';
      if (check1) return transition;
    }

    return false;
  };

  protected __performFinally = (_finally?: FinallyConfig) => {
    const check1 = _finally === undefined;
    if (check1) return;

    const finals = toArray.typed(_finally);

    for (const final of finals) {
      const check2 = typeof final === 'string';
      const check3 = isDescriber(final);

      const check4 = check2 || check3;
      if (check4) {
        this.__performActions(final);
        continue;
      }

      const response = this.#performPredicates(
        ...toArray.typed(final.guards),
      );

      /* v8 ignore else -- @preserve */
      if (response) {
        this.__performActions(...toArray.typed(final.actions));
      }
    }
    return;
  };

  get #flat() {
    return this.machine.flat;
  }

  get #collectedAlways() {
    const entriesFlat = Object.entries(this.#flat);
    const entries: [from: string, always: AlwaysConfig][] = [];

    entriesFlat.forEach(([from, node]) => {
      const always = node.always;
      if (always) {
        entries.push([from, always]);
      }
    });

    return entries;
  }

  #performDelay: SyncPerformDelay_F<Eo, Pc, Tc, Ta> = delay => {
    this._iterate();
    return delay(this.__cloneState);
  };

  #executeDelay: SyncPerformDelay_F<Eo, Pc, Tc, Ta> = delay => {
    this.__setStatus('busy');
    const out = this.#performDelay(delay);
    this.__setStatus('started');
    return out;
  };

  protected createInterval: CreateInterval2_F = ({
    callback,
    id,
    interval,
  }) => {
    const exact = this.__exact;
    const out = createInterval({
      callback,
      id,
      interval,
      exact,
    });

    return out;
  };

  protected __executeActivities: ExecuteActivities_F = (
    from,
    _activities,
  ) => {
    const entries = Object.entries(_activities);
    const outs: string[] = [];

    for (const [_delay, _activity] of entries) {
      const id = `${from}::${_delay}`;
      let index = -1;
      const _interval = this.__cachedIntervals.find((f, i) => {
        const check = f.id === id;
        if (check) index = i;
        return check;
      });

      const buildCallback = () => {
        const delayF = this.toDelayFn(_delay);
        const check0 = !isDefined(delayF);
        if (check0) return;
        const interval = this.#executeDelay(delayF);

        const check11 = interval < DEFAULT_MIN_ACTIVITY_TIME;
        if (check11) {
          this._addWarning(`Delay (${_delay}) is too short`);
          return;
        }

        const check12 = interval > DEFAULT_MAX_TIME_PROMISE;
        if (check12) {
          this._addWarning(`Delay (${_delay}) is too long`);
          return;
        }

        const activities = toArray.typed(_activity);

        const callback = () => {
          for (const activity of activities) {
            const check2 = typeof activity === 'string';
            const check3 = isDescriber(activity);
            const check4 = check2 || check3;

            if (check4) {
              this.__performActions(activity);
              continue;
            }

            const check5 = this.#performPredicates(
              ...toArray.typed(activity.guards),
            );

            if (check5) {
              const actions = toArray.typed(activity.actions);
              this.__performActions(...actions);
            }
          }
        };

        const promise = this.createInterval({
          callback,
          interval,
          id,
        });

        this.__cachedIntervals.push(promise);

        return id;
      };

      if (_interval) {
        const check =
          _interval.state === 'idle' || _interval.state === 'paused';
        if (check) {
          this.__cachedIntervals.splice(index, 1);
          const result = buildCallback();
          if (!result) return [];
          outs.push(result);
        } else outs.push(id);
        continue;
      }

      const result = buildCallback();
      if (!result) return [];

      outs.push(result);
    }

    return outs;
  };

  /**
   * Get all brut self transitions of the current {@linkcode NodeConfigWithInitials} config state of this {@linkcode Interpreter} service.
   */
  protected get __collectedSelfTransitions0() {
    const entries = new Map<string, () => string>();

    this.#collectedAlways.forEach(([from, always]) => {
      entries.set(from, () => this.__performAlways(always));
    });

    return entries;
  }

  protected get __collectedSelfTransitions() {
    const entries = Array.from(this.__collectedSelfTransitions0).filter(
      ([from]) => this.__isInsideValue(from),
    );

    const out = entries.map(([, always]) => {
      return () => {
        /* v8 ignore else -- @preserve */
        if (always) {
          const target = always();
          return this.__performConfig(target);
        }
      };
    });

    if (out.length < 1) return;
    return () => out.forEach(f => f());
  }

  protected __collectPausables = () => {
    type _Emitter = EmitterConfig & {
      emitterFn: AsyncEmitterFunction<Eo, Pc, Tc, Ta>;
      id: string;
    };
    return this.__collectedEmitterConfigs
      .filter(([from]) => this.__isInsideValue(from))
      .filter(([from]) => {
        const froms = this.__collectedPausables.map(({ from }) => from);
        return !froms.includes(from);
      })
      .map(([from, ..._emitters]) => {
        const emitters = _emitters
          .map(({ id, ...rest }) => {
            return { emitterFn: this.toEmitterSrc(id), ...rest, id };
          })
          .filter(({ emitterFn }) => !!emitterFn) as _Emitter[];

        return [from, ...emitters] as const;
      })
      .map(([from, ...emitters]) => {
        const pausables = emitters.map(
          ({ emitterFn, error, next, complete, id }) => {
            const pausable = emitterFn(this.__cloneState);

            // Wire the interpreter's transition callbacks into the pausable.
            pausable.subscribe({
              next: payload => {
                const event = {
                  type: `${id}::next`,
                  payload,
                } satisfies EventObject;

                this.__changeEvent(_any(event));
                const transitions = toArray<TransitionConfig>(next);
                this.__performTransitions(...transitions);
              },
              error: payload => {
                const event = {
                  type: `${id}::error`,
                  payload,
                } satisfies EventObject;

                this.__changeEvent(_any(event));
                const transitions = toArray<TransitionConfig>(error);
                this.__performTransitions(...transitions);
              },
              complete: () => this.__performFinally(complete),
            });

            return {
              pausable,
              id,
              from,
            };
          },
        );

        this.__collectedPausables.push(...pausables);
        return pausables;
      })
      .flat();
  };

  protected __performSelfTransitions = () => {
    this.__setStatus('busy');
    const previousState = structuredClone(this.__state);
    this.__collectedSelfTransitions?.();
    const nextState = structuredClone(this.__state);
    const check = !equal(previousState, nextState);
    if (check) this.__flush();
    this.__setStatus('working');
  };

  /**
   * Add options to the inner {@linkcode Machine} of this {@linkcode Interpreter} service.
   */
  addOptions: SyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
    return super.addOptions(helper) as any;
  };

  /**
   * Provides options for the interpreter and returns a new interpreter instance.
   *
   * @param option a function that provides options for the machine.
   * Options can include actions, guards, delays, promises, and child machines.
   * @returns a new interpreter instance with the provided options applied.
   */
  provideOptions: SyncProvideMachineOptions_F<
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
  > = option => {
    return super.provideOptions(option) as any;
  };

  subscribe: AddSubscriber_F<E, A, Tc, Ta, Eo> = (
    _subscriber,
    options,
  ) => {
    const eventsMap = this.machine.eventsMap;
    const actorsMap = this.machine.actorsMap;
    const find = Array.from(this.__subscribers).find(
      f => f.id === options?.id,
    );
    if (find) return find;

    const subcriber = createSubscriber(
      eventsMap,
      actorsMap,
      _subscriber,
      options,
    );
    this.__subscribers.add(subcriber as any);
    return subcriber as any;
  };

  protected __presend: _SyncSend_F<Eo> = event => {
    this.__sent = true;
    this.__changeEvent(event);
    this.__setStatus('sending');
    let sv = this.__value;

    const flat2 = this.__extractTransitions(event);
    // #endregion

    for (const [, transitions] of flat2) {
      const target = this.__performTransitions(
        ...toArray.typed(transitions),
      );

      const diffTarget = target === false ? undefined : target;
      sv = nextSV(sv, diffTarget);
    }

    const next = switchV({
      condition: equal(this.__value, sv),
      truthy: undefined,
      falsy: initialConfig(this.machine.valueToConfig(sv)),
    });

    this.__sent = false;
    return next;
  };

  /**
   * Creates a sender function for the given event type.
   * @param type - the {@linkcode EventArgT} type of the event to send.
   * @returns a function with the payload as Parameter that sends the event with the given type and payload.
   *
   * @see {@linkcode send} for sending events directly.
   */
  sender = <const T extends Eo['type']>(type: T) => {
    return (...data: ExtractSender<Eo, T>) => {
      const payload = data.length === 1 ? data[0] : {};
      const event = { type, payload } as unknown as EventArgObject<Eo>;
      return this.send(event);
    };
  };

  /**
   * Performs all self transitions and activities of this {@linkcode Interpreter} service.
   * @remarks Throw if the number of self transitions exceeds {@linkcode DEFAULT_MAX_SELF_TRANSITIONS}.
   */
  protected _next = () => {
    // eslint-disable-next-line no-useless-assignment
    let check = false;
    do {
      const startTime = Date.now();
      const previousValue = this.__value;

      const checkCounter =
        this.__selfTransitionsCounter >= DEFAULT_MAX_SELF_TRANSITIONS;
      if (checkCounter) return this.__throwMaxCounter();
      this.__throwing();
      this.__preNext();

      const currentValue = this.__value;
      check = !equal(previousValue, currentValue);
      if (check) this.__flush();

      const duration = Date.now() - startTime;
      const check2 = duration > TIME_TO_RINIT_SELF_COUNTER;
      if (check2) this.__selfTransitionsCounter = 0;
    } while (check);

    this.__selfTransitionsCounter = 0;
  };

  /**
   * Sends an event without cheching to the current {@linkcode Interpreter} service.
   *
   * @param _event - the {@linkcode EventArg} event to send.
   *
   */
  protected __send = (_event: EventArgObject<Eo>) => {
    const event = transformEventArg(_event);
    const next = this.__presend(event as any);

    if (isDefined(next)) {
      this.__config = next;
      this.__performConfig(true);
      this.__setStatus('working');
      return this._next();
    } else return this.__setStatus('working');
  };

  // #endregion

  /**
   * Sends an event to a specific child service by its ID.
   *
   * @param to - The ID of the child service to which the event will be sent.
   * @param : the {@linkcode EventObject} event to send to the child service.
   *
   * @see {@linkcode send} for sending events to the current service.
   */
  protected __sendTo = <T extends EventObject>(to: string, event: T) => {
    const collector = this.__collectedChildren.filter(
      ({ from, id }) => this.__isInsideValue(from) && id === to,
    );

    for (const { service } of collector) {
      service.send(event);
    }
  };
}

export const TIME_TO_RINIT_SELF_COUNTER = DEFAULT_MIN_ACTIVITY_TIME * 2;

type SyncConfigFrom<T extends KeyU<'config'>> = Extract<
  T['config'],
  SyncConfig
>;

/**
 * Retrieves the {@linkcode Interpreter} service from the given {@linkcode AnyMachine} machine.
 *
 * @template : type {@linkcode AnyMachine} [M] - The type of the machine from which to retrieve the interpreter.
 *
 * @see {@linkcode SyncConfigFrom}
 * @see {@linkcode PrivateContextFrom}
 * @see {@linkcode ContextFrom}
 * @see {@linkcode EventsMapFrom}
 * @see {@linkcode PromiseesMapFrom}
 * @see {@linkcode MachineOptionsFrom}
 */
export type SyncInterpreterFrom<M extends AnyMachine> = SyncInterpreter<
  SyncConfigFrom<M>,
  PrivateContextFrom<M>,
  ContextFrom<M>,
  EventsMapFrom<M>,
  ActorsMapFrom<M>,
  TagFrom<M>,
  EventsFrom<M>,
  AllPathsFrom<M>,
  MachineOptionsFrom<M>
>;

export type SyncInterpreter_F = <M extends AnyMachine>(
  ...args: InterpretArgs<M>
) => SyncInterpreterFrom<M>;

/**
 * Creates an {@linkcode SyncInterpreter} service from the given {@linkcode AnyMachine} machine.
 *
 * @param machine - The {@linkcode AnyMachine} machine to create the interpreter from.
 * @param options - The options for the interpreter, including context, private context, mode, and exact.
 * @returns an {@linkcode SyncInterpreter} service.
 *
 * @see {@linkcode SyncConfig}
 */
export const interpretSync: SyncInterpreter_F = (..._args) => {
  const [machine, args] = _args;
  const { mode, exact, pContext, context } = _any(args ?? {});
  const out: any = new SyncInterpreter(machine, mode, exact);
  out._providePrivateContext(pContext);
  out._provideContext(context);
  return out;
};
