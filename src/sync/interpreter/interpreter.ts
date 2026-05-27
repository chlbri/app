import { type WithDescriber } from '#actions';
import type { EmitterConfig, FinallyConfig } from '#actor';
import toArray from '#bemedev/features/arrays/castings/toArray';
import _any from '#bemedev/features/common/castings/any';
import isDefined from '#bemedev/features/common/castings/is/defined';
import { switchV } from '#bemedev/features/functions/functions/switch';
import type { AllowedNames, Equals, Fn } from '#bemedev/globals/types';
import {
  DEFAULT_DELIMITER,
  DEFAULT_MAX_SELF_TRANSITIONS,
  DEFAULT_MAX_TIME_PROMISE,
  DEFAULT_MIN_ACTIVITY_TIME,
} from '#constants';
import { type EmitterFunction2 } from '#emitters';
import {
  ALWAYS_EVENT,
  eventToType,
  possibleEvents,
  transformEventArg,
  type ActorsConfigMap,
  type EventArgObject,
  type EventObject,
  type EventsMap,
  type ExtractSender,
} from '#events';
import { type GuardConfig } from '#guards';

import {
  type ActorsMapFrom,
  type AllPathsFrom,
  type ConfigFrom,
  type ContextFrom,
  type EventsFrom,
  type EventsMapFrom,
  type ExtendedActionsParams,
  type MachineOptionsFrom,
  type PrivateContextFrom,
  type TagFrom,
} from '#common/interpreter';
import { initialConfig, nextSV, type ActivityConfig } from '#states';
import type { AlwaysConfig, TransitionConfig } from '#transitions';
import { IS_TEST, isStringEmpty } from '#utils';
import { createInterval, type Interval2 } from '@bemedev/interval2';
import type { PrimitiveObject } from '@bemedev/typings';
import cloneDeep from 'clone-deep';
import equal from 'fast-deep-equal';
import { isDescriber } from '~types';
import type { SyncConfig } from '../types.types';
import type {
  _SyncSend_F,
  SyncPerformAction_F,
  SyncPerformAlway_F,
  SyncPerformDelay_F,
  SyncPerformPredicate_F,
  SyncPerformTransition_F,
  SyncPerformTransitions_F,
} from './options.types';

import type {
  CreateInterval2_F,
  ExecuteActivities_F,
  Mode,
  OptionalDefinitions,
} from '#common/interpreter';
import type { AnyMachine, SimpleMachineOptions2 } from '#common/machine';
import { createScheduler } from '@bemedev/scheduler/sync';
import { CommonInterpreter } from '../../common/interpreter/interpreter';
import type { AddSubscriber_F } from '../../common/interpreter/types';
import { createSubscriber } from '../../common/subscriber';
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
 * @template Mo : type {@linkcode MachineOptions} - The machine options type, which includes various configurations for the machine. Default to {@linkcode MachineOptions}.
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
> extends CommonInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo> {
  /**
   * Create a new {@linkcode Interpreter} instance with the same initial configuration as this instance.
   */
  get renew() {
    const out = new SyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>(
      this.#machine,
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

  protected __performSendToAction = (sentEvent?: {
    to: string;
    event: any;
  }) => {
    if (!sentEvent) return;
    return this.__sendTo(sentEvent.to, sentEvent.event);
  };

  protected __performResendAction = (resend?: EventArgObject<Eo>) => {
    if (!resend) return;
    const cannot = this.#cannotPerformEvents(resend);
    if (cannot) return;

    return this.send(resend);
  };

  get #machine() {
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
    const values = Object.values(this.#machine.flat);

    for (const { on } of values) {
      const type = eventToType(forceSend);
      const transitions = toArray.typed(on?.[type]);
      this.__performTransitions(...(transitions as any));
    }
  };

  #performPauseActivityAction = (id?: string) => {
    if (!id) return;
    this.#currentActivities?.filter(f => f.id === id).forEach(this.#pause);
  };

  #performResumeActivityAction = (id?: string) => {
    if (!id) return;
    this.#currentActivities
      ?.filter(f => f.id === id)
      .forEach(this.#resume);
  };

  #performStopActivityAction = (id?: string) => {
    if (!id) return;
    this.#currentActivities
      ?.filter(f => f.id === id)
      .forEach(this.#dispose);
  };

  #performPauseTimerAction = (id?: string) => {
    if (!id) return;
    this.__timeoutActions.filter(f => f.id === id).forEach(this.#pause);
  };

  #performResumeTimerAction = (id?: string) => {
    if (!id) return;
    this.__timeoutActions.filter(f => f.id === id).forEach(this.#resume);
  };

  #performStopTimerAction = (id?: string) => {
    if (!id) return;
    this.__timeoutActions.filter(f => f.id === id).forEach(this.#dispose);
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
    this.#performPauseActivityAction(pauseActivity);
    this.#performResumeActivityAction(resumeActivity);
    this.#performStopActivityAction(stopActivity);
    this.#performPauseTimerAction(pauseTimer);
    this.#performResumeTimerAction(resumeTimer);
    this.#performStopTimerAction(stopTimer);

    // ForceSendAction returns the result to make further actions
    const result =
      this.__performForceSendAction(forceSend) ??
      this.__performResendAction(resend);

    return result;
  };

  protected __executeAction: SyncPerformAction_F<Eo, Pc, Tc, Ta> =
    async action => {
      this.__setStatus('busy');
      this._iterate();
      const { pContext, context, ...extendeds } = action(
        this.__cloneState,
      );

      this.__mergeContexts({ pContext, context });
      this.__performsExtendedActions(extendeds);
    };

  /**
   * Throws if the number of self transitions exceeds {@linkcode DEFAULT_MAX_SELF_TRANSITIONS}.
   */
  #throwMaxCounter() {
    const error = `Too much self transitions, exceeded ${DEFAULT_MAX_SELF_TRANSITIONS} transitions`;

    /* v8 ignore else -- @preserve */
    if (IS_TEST) {
      this._addError(error);
      this.__throwing();
      this.stop();
    } else throw error;
  }

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

  // get #sending() {
  //   return this.#status === 'sending';
  // }

  get longRuns() {
    return this.#machine.longRuns;
  }

  /**
   * Checks if sent events cannot be performed.
   * @param from - the config value from which the events are sent.
   * @returns true if the events cannot be performed, false otherwise.
   */
  // #cannotPerform = (from: string) => {
  //   const check = this.#sending || !this.#isInsideValue(from);
  //   return check;
  // };

  #performAlways: SyncPerformAlway_F = alway => {
    this.__changeEvent(transformEventArg(ALWAYS_EVENT));
    const always = toArray<TransitionConfig>(alway);
    return this.__performTransitions(...always);
  };

  get #flat() {
    return this.#machine.flat;
  }

  get #collectedActivities() {
    const entriesFlat = Object.entries(this.#flat);

    const entries: [from: string, activities: ActivityConfig][] = [];

    entriesFlat.forEach(([from, { activities }]) => {
      if (activities) {
        entries.push([from, activities]);
      }
    });

    return entries;
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

  /**
   * Collection of all currents {@linkcode Interval2} intervals, related to current {@linkcode ActivityConfig}s of this {@linkcode Interpreter} service.
   */
  protected _cachedIntervals: Interval2[] = [];

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
      const _interval = this._cachedIntervals.find((f, i) => {
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

        this._cachedIntervals.push(promise);

        return id;
      };

      if (_interval) {
        const check =
          _interval.state === 'idle' || _interval.state === 'paused';
        if (check) {
          this._cachedIntervals.splice(index, 1);
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

  get #currentActivities() {
    const collected = this.#collectedActivities.filter(([from]) =>
      this.__isInsideValue(from),
    );
    const check = collected.length < 1;
    if (check) return;

    const ids: string[] = [];
    for (const args of collected) {
      ids.push(...this.__executeActivities(...args));
    }

    return this._cachedIntervals.filter(({ id }) => ids.includes(id));
  }

  /**
   * Get all brut self transitions of the current {@linkcode NodeConfigWithInitials} config state of this {@linkcode Interpreter} service.
   */
  protected get __collectedSelfTransitions0() {
    const entries = new Map<string, () => string | false>();

    this.#collectedAlways.forEach(([from, always]) => {
      entries.set(from, () => this.#performAlways(always));
    });

    return entries;
  }

  protected get __collectedSelfTransitions() {
    const entries = Array.from(this.__collectedSelfTransitions0).filter(
      ([from]) => this.__isInsideValue(from),
    );

    const out = entries.map(([, always]) => {
      return () => {
        if (always) {
          const target = always();
          if (target !== false) return this.__performConfig(target);
        }
      };
    });

    if (out.length < 1) return;
    return () => out.forEach(f => f());
  }

  protected __collectPausables = () => {
    type _Emitter = EmitterConfig & {
      emitterFn: EmitterFunction2<Eo, Pc, Tc, Ta>;
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

            // // Branch on the interpreter's current status so that pausables
            // // collected during an active session start immediately, while
            // // those collected during initial start-up are left in 'stopped'
            // // state and started by the subsequent #startPausables() call.
            // switch (this.#status) {
            //   case 'started':
            //   case 'working':
            //   case 'sending':
            //   case 'busy':
            //     pausable.start();
            //     break;
            //   case 'paused':
            //     pausable.start();
            //     pausable.pause();
            //     break;
            //   // 'idle' | 'starting' | 'stopped' → #startPausables() handles it
            // }

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
   * @deprecated
   * A mapper function that returns a function to call a method on a value.
   * @param key - the key of the method to be called on the value.
   * @returns a function that calls the method on the value.
   *
   * @see {@linkcode AllowedNames} for more information about allowed names.
   * @see {@linkcode Fn} for more information about function
   */
  #mapperFn = <T>(key: AllowedNames<T, Fn>) => {
    return (value: T) => (value as any)[key]();
  };

  #pause = this.#mapperFn('pause');

  #resume = this.#mapperFn('resume');

  #dispose = this.#mapperFn('dispose');

  /**
   * @deprecated
   * Used internally
   */
  _providePrivateContext = (pContext: Pc) => {
    this.__initialPpc = this.__pContext = pContext;
    this.__setStatus('busy');

    this.#machine.addPrivateContext(this.__initialPpc);

    this.__setStatus('starting');
    return this.#machine;
  };

  /**
   * @deprecated
   * Used internally
   *
   * Alias of {@linkcode _providePrivateContext}
   */
  _ppC = this._providePrivateContext;

  /**
   * @deprecated
   * Used internally
   */
  _provideContext = (context: Tc) => {
    this.__initialContext = this.__context = context;
    this.__performStates({ context });
    this.__setStatus('busy');

    this.#machine.addContext(this.__initialContext);

    this.__setStatus('starting');
    return this.#machine;
  };

  /**
   * Add options to the inner {@linkcode Machine} of this {@linkcode Interpreter} service.
   */
  get addOptions() {
    return this.#machine.addOptions;
  }

  /**
   * Provides options for the interpreter and returns a new interpreter instance.
   *
   * @param option a function that provides options for the machine.
   * Options can include actions, guards, delays, promises, and child machines.
   * @returns a new interpreter instance with the provided options applied.
   */
  provideOptions = (
    option: Parameters<(typeof this)['addOptions']>[0],
  ) => {
    const newMachine = this.#machine.provideOptions(option);
    const out = new SyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>(
      newMachine,
      this.__mode,
      this.__exact,
    );
    out._ppC(this.__initialPpc);
    out._provideContext(this.__initialContext);
    return out;
  };

  subscribe: AddSubscriber_F<E, A, Tc, Ta, Eo> = (
    _subscriber,
    options,
  ) => {
    const eventsMap = this.#machine.eventsMap;
    const actorsMap = this.#machine.actorsMap;
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

  get state() {
    return Object.freeze(cloneDeep(this.__state));
  }

  #errorsCollector = new Set<string>();
  #warningsCollector = new Set<string>();

  /**
   * @deprecated
   * Just use for testing
   * @remarks returns nothing in prod
   */
  get _errorsCollector() {
    /* v8 ignore else -- @preserve */
    if (IS_TEST) {
      return this.#errorsCollector;
    }

    /* v8 ignore start -- @preserve */
    console.error('errorsCollector is not available in production');
    return;
    /* v8 ignore stop -- @preserve */
  }

  /**
   * @deprecated
   * Just use for testing
   * @remarks returns nothing in prod
   */
  get _warningsCollector() {
    /* v8 ignore else -- @preserve */
    if (IS_TEST) {
      return this.#warningsCollector;
    }
    /* v8 ignore start -- @preserve */
    console.error('warningsCollector is not available in production');
    return;
    /* v8 ignore stop -- @preserve */
  }

  protected _addError = (...errors: string[]) => {
    errors.forEach(error => this.#errorsCollector.add(error));
  };

  protected _addWarning = (...warnings: string[]) => {
    warnings.forEach(warning => this.#warningsCollector.add(warning));
  };

  // #region Next

  #extractTransitions = (event: Eo) => {
    type FlatArray = [from: string, transitions: TransitionConfig[]][];
    const entriesFlat = Object.entries(this.#flat);
    const flat: FlatArray = [];
    const flat2: FlatArray = [];

    const type = event.type;
    entriesFlat.forEach(([from, node]) => {
      const on = node.on;
      const trs = on?.[type];
      if (trs) {
        const transitions = toArray.typed(trs);
        flat.push([from, transitions as any]);
      }
    });

    flat.forEach(([from, transitions], _, all) => {
      const canTake = all.every(
        ([from2]) => !from2.startsWith(`${from}${DEFAULT_DELIMITER}`),
      );
      if (canTake) flat2.push([from, transitions]);
    });

    flat2.sort((a, b) => {
      const from1 = a[0];
      const from2 = b[0];

      const split1 = from1
        .split(DEFAULT_DELIMITER)
        .filter(val => !isStringEmpty(val)).length;

      const split2 = from2
        .split(DEFAULT_DELIMITER)
        .filter(val => !isStringEmpty(val)).length;

      const splitsAreDifferents = split1 !== split2;
      if (splitsAreDifferents) return split2 - split1;
      return from2.localeCompare(from1);
    });

    return flat2;
  };

  protected __presend: _SyncSend_F<Eo> = event => {
    this.__sent = true;
    this.__changeEvent(event);
    this.__setStatus('sending');
    let sv = this.__value;

    const flat2 = this.#extractTransitions(event);
    // #endregion

    for (const [from, transitions] of flat2) {
      const cannotContinue = !this.__isInsideValue2(sv, from);
      if (cannotContinue) continue;

      const target = this.__performTransitions(
        ...toArray.typed(transitions),
      );

      const diffTarget = target === false ? undefined : target;
      sv = nextSV(sv, diffTarget);
    }

    const next = switchV({
      condition: equal(this.__value, sv),
      truthy: undefined,
      falsy: initialConfig(this.#machine.valueToConfig(sv)),
    });

    this.__sent = false;
    return next;
  };

  get #possibleEvents() {
    return possibleEvents(this.#flat);
  }

  #cannotPerformEvents = (_event: EventArgObject<Eo>) => {
    const type = eventToType(_event);
    const check = !this.#possibleEvents.includes(type);
    return check;
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
      if (checkCounter) return this.#throwMaxCounter();
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

/**
 * Retrieves the {@linkcode Interpreter} service from the given {@linkcode AnyMachine} machine.
 *
 * @template : type {@linkcode AnyMachine} [M] - The type of the machine from which to retrieve the interpreter.
 *
 * @see {@linkcode ConfigFrom}
 * @see {@linkcode PrivateContextFrom}
 * @see {@linkcode ContextFrom}
 * @see {@linkcode EventsMapFrom}
 * @see {@linkcode PromiseesMapFrom}
 * @see {@linkcode MachineOptionsFrom}
 */
export type SyncInterpreterFrom<M extends AnyMachine> = SyncInterpreter<
  ConfigFrom<M>,
  PrivateContextFrom<M>,
  ContextFrom<M>,
  EventsMapFrom<M>,
  ActorsMapFrom<M>,
  TagFrom<M>,
  EventsFrom<M>,
  AllPathsFrom<M>,
  MachineOptionsFrom<M>
>;

export type InterpreterOptions<
  M extends AnyMachine,
  P extends PrivateContextFrom<M> = PrivateContextFrom<M>,
  C extends ContextFrom<M> = ContextFrom<M>,
> = {
  mode?: Mode;
  exact?: boolean;
} & OptionalDefinitions<P, C>;

export type InterpretArgs<M extends AnyMachine> =
  Equals<
    InterpreterOptions<M>,
    Partial<InterpreterOptions<M>>
  > extends true
    ? [machine: M, config?: InterpreterOptions<M>]
    : [machine: M, config: InterpreterOptions<M>];

export type Interpreter_F = <M extends AnyMachine>(
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
export const interpretSync: Interpreter_F = (..._args) => {
  const [machine, args] = _args;
  const { mode, exact, pContext, context } = _any(args ?? {});
  const out: any = new SyncInterpreter(machine, mode, exact);
  out._providePrivateContext(pContext);
  out._provideContext(context);
  return out;
};
