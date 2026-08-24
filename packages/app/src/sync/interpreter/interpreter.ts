import { type WithDescriber } from '#actions';
import type { ChildConfig, EmitterConfig, FinallyConfig } from '#actor';
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
  AFTER_EVENT,
  ALWAYS_EVENT,
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
import type {
  AlwaysConfig,
  DelayedTransitions,
  TransitionConfig,
} from '#transitions';
import { _any, isDefined, switchV, toArray } from '@bemedev/app-utils-bemedev';
import { createInterval } from '@bemedev/interval2';
import type { PrimitiveObject } from '@bemedev/typings';
import equal from 'fast-deep-equal';
import { isDescriber, type KeyU } from '~types';
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
import type {
  AnyMachine,
  CommonChildFunction2,
  CommonConfig3,
  SimpleMachineOptions2,
} from '#common/machine';
import { byKey2, merge2 } from '#utils';
import { recompose } from '@bemedev/decompose';
import { createScheduler } from '@bemedev/scheduler/sync';
import { CommonInterpreter } from '../../common/interpreter/interpreter';
import type {
  AddSubscriber_F,
  AnyInterpreter,
} from '../../common/interpreter/types';
import { createSubscriber } from '../../common/subscriber';
import type { SyncAddOptions_F } from '../machine';
import type { SyncMachine } from '../machine/machine';

/**
 * The class {@linkcode SyncInterpreter} is responsible for interpreting and managing the state of a synchronous machine.
 * It provides methods to start, stop, pause, and resume the machine, as well as to send events
 * and subscribe to state changes.
 *
 * @template | {@linkcode CommonConfig3} `C` - The configuration type of the machine.
 * @template `Pc` - The private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - The context type.
 * @template | {@linkcode EventsMap} `E` - The events map type.
 * @template | {@linkcode ActorsConfigMap} `A` - The actors config map type.
 * @template `Ta` - Tag string type.
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 * @template `AllPaths` - All state paths type.
 * @template | {@linkcode SimpleMachineOptions2} `Mo` - Machine options type.
 * @template | {@linkcode SimpleMachineOptions2} `L` - Additional options type.
 */
export class SyncInterpreter<
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
> extends CommonInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo> {
  /**
   * The type identifier for the synchronous interpreter.
   */
  readonly TYPE = 'sync';

  /**
   * Access the inner class {@linkcode SyncMachine} machine being interpreted.
   *
   * @returns The class {@linkcode SyncMachine} instance.
   */
  get machine() {
    return super.machine as SyncMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>;
  }

  /**
   * Creates a new class {@linkcode SyncInterpreter} instance with the same initial configuration as this instance.
   *
   * @returns A new instance of class {@linkcode SyncInterpreter}.
   */
  get renew() {
    const out = new SyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>(
      this.machine,
      this.__mode,
      this.__exact,
    );
    out._ppC(this.__initialContexts.pContext);
    out._provideContext(this.__initialContexts.context);

    return out;
  }

  /**
   * Initializes internal schedulers for context, value, event, and status.
   */
  private __initSchedulers = () => {
    this.__schedulerContexts = createScheduler();
    this.__schedulerValue = createScheduler();
    this.__schedulerEvent = createScheduler();
    this.__schedulerStatus = createScheduler();
  };

  /**
   * Creates an instance of class {@linkcode SyncInterpreter}.
   *
   * @param machine - The machine instance of interface {@linkcode AnyMachine} to be interpreted.
   * @param mode - The execution mode of the interpreter, defaults to `'strict'`.
   * @param exact - Whether to use exact interval and timeout evaluation, defaults to `true`.
   */
  constructor(
    machine: AnyMachine<E, A, Pc, Tc>,
    mode: Mode = 'strict',
    exact = true,
  ) {
    super(machine, mode, exact);
    this.__initSchedulers();
    this.__performConfig(true);
  }

  /**
   * Forces transition to perform inner actions despite the current state.
   * This is useful for sending events that are not part of the current state transitions.
   *
   * @param forceSend - The optional event payload of type {@linkcode EventArgObject} to force send.
   */
  protected __performForceSendAction = (forceSend?: EventArgObject<Eo>) => {
    if (!forceSend) return;
    const values = Object.values(this.machine.flat);

    for (const { on } of values) {
      const type = eventToType(forceSend);
      const transitions = toArray.typed(on?.[type]);
      this.__performTransitions(...(transitions as any));
    }
  };

  /**
   * Executes extended actions such as sending events, scheduling, activity management, timer management, and forced sending.
   *
   * @param params - The parameters of type {@linkcode ExtendedActionsParams}.
   *
   * @returns The result of performing forced send or resend actions.
   */
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
  }: ExtendedActionsParams<Eo, Tc>) => {
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
      this.__performForceSendAction(forceSend) ?? this.__performResendAction(resend);

    return result;
  };

  /**
   * Executes a single synchronous action, updating context and running extended actions.
   *
   * @param action - The action function of type {@linkcode SyncPerformAction_F}.
   */
  protected __executeAction: SyncPerformAction_F<Eo, Pc, Tc, Ta> = action => {
    this.__setStatus('busy');
    this._iterate();
    const { mergers, ...extendeds } = action(this.__cloneState);

    if (mergers && mergers.length > 0) {
      this.__mergeContexts({ mergers });
    }
    this.__performsExtendedActions(extendeds as any);
  };

  /**
   * Performs multiple actions in sequence.
   *
   * @param actions - The list of action describers of type {@linkcode WithDescriber}.
   */
  protected __performActions = (...actions: WithDescriber[]) => {
    const fns = actions.map(this.toActionFn).filter(f => f !== undefined);

    for (const fn of fns) {
      this.__executeAction(fn as any);
    }
  };

  /**
   * Evaluates a single predicate function against the current cloned state.
   *
   * @param predicate - The predicate function of type {@linkcode SyncPerformPredicate_F}.
   *
   * @returns `true` if the predicate condition is met, `false` otherwise.
   */
  private __performPredicate: SyncPerformPredicate_F<Eo, Pc, Tc, Ta> = predicate => {
    this._iterate();
    return predicate(this.__cloneState);
  };

  /**
   * Executes a predicate function while managing the status of the interpreter.
   *
   * @param predicate - The predicate function of type {@linkcode SyncPerformPredicate_F}.
   *
   * @returns `true` if the predicate condition is met, `false` otherwise.
   */
  private __executePredicate: SyncPerformPredicate_F<Eo, Pc, Tc, Ta> = predicate => {
    this.__setStatus('busy');
    const out = this.__performPredicate(predicate);
    this.__setStatus('working');
    return out;
  };

  /**
   * Evaluates an array of guard configurations against the state.
   *
   * @param guards - The array of guard configurations of type {@linkcode GuardConfig}.
   *
   * @returns `true` if all guards evaluate to `true`, `false` otherwise.
   */
  private __performPredicates = (...guards: GuardConfig[]) => {
    if (guards.length < 1) return true;
    return guards
      .map(this.toPredicateFn)
      .filter(isDefined)
      .map(this.__executePredicate)
      .every(b => b);
  };

  /**
   * Performs a single state transition, executing exit, action, and entry callbacks.
   *
   * @param transition - The transition target string or configuration of type {@linkcode SyncPerformTransition_F}.
   *
   * @returns The target state path string if the transition succeeded, or `false` if it failed.
   */
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

    const response = this.__performPredicates(...toArray<GuardConfig>(guards));

    if (response) {
      this.__performActions(...toArray.typed(diffExits));
      this.__performActions(...toArray.typed(actions));
      this.__performActions(...toArray.typed(diffEntries));
      return target ?? false;
    }
    return false;
  };

  /**
   * Performs the first valid transition from a list of transition configurations.
   *
   * @param transitions - The transition configurations of type {@linkcode SyncPerformTransitions_F}.
   *
   * @returns The target state path string if a transition succeeded, or `false` otherwise.
   */
  protected __performTransitions: SyncPerformTransitions_F = (...transitions) => {
    for (const _transition of transitions) {
      const transition = this.__performTransition(_transition);
      const check1 = typeof transition === 'string';
      if (check1) return transition;
    }

    return false;
  };

  /**
   * Performs finalization configurations when completing a state node or activity.
   *
   * @param _finally - The optional finalization configuration of type {@linkcode FinallyConfig}.
   */
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

      const response = this.__performPredicates(...toArray.typed(final.guards));

      /* v8 ignore else -- @preserve */
      if (response) {
        this.__performActions(...toArray.typed(final.actions));
      }
    }
    return;
  };

  /**
   * Accesses the flattened state node map from the underlying machine.
   *
   * @returns The flat state nodes object.
   */
  private get _flat() {
    return this.machine.flat;
  }

  /**
   * Collects all `always` transition configurations from flat state nodes.
   *
   * @returns An array of tuples containing state node paths and their `always` configurations of type {@linkcode AlwaysConfig}.
   */
  protected get __collectedAlways() {
    const entriesFlat = Object.entries(this._flat);
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
   * Creates a delayed transition handler for a specific state path.
   *
   * @param from - The state path string.
   * @param after - The delayed transitions configuration of type {@linkcode DelayedTransitions}.
   *
   * @returns A parameterless function that schedules delayed transitions.
   */
  private __performAfter = (from: string, after: DelayedTransitions) => {
    const entries = Object.entries(after);

    return () => {
      entries.forEach(([_delay, transition]) => {
        const delayF = this.toDelayFn(_delay);
        const check0 = !isDefined(delayF);
        if (check0) return;
        const delay = this.__executeDelay(delayF);

        const check1 = delay > DEFAULT_MAX_TIME_PROMISE;
        /* v8 ignore else -- @preserve */
        if (check1) {
          this._addWarning(`Delay ${_delay} is too long`);
          return;
        }

        const transitions = toArray.typed(transition);
        setTimeout(() => {
          if (this.__cannotPerform(from)) return;
          this.__changeEvent(transformEventArg(`${from}/${AFTER_EVENT}`));

          const target = this.__performTransitions(...(transitions as any));

          if (target === false) {
            this._addWarning(
              `No transitions reached from "${from}" by delay "${_delay}" !`,
            );
          } else {
            this.__performConfig(target);
            this._next();
          }
        }, delay);
      });
    };
  };

  /**
   * Collects all delayed transition (`after`) configurations across flat state nodes.
   *
   * @returns An array of tuples containing state node paths and their `after` configurations of type {@linkcode DelayedTransitions}.
   */
  private get __collectedAfters() {
    const entriesFlat = Object.entries(this._flat);
    const entries: [from: string, after: DelayedTransitions][] = [];

    entriesFlat.forEach(([from, node]) => {
      const after = node.after;
      if (after) {
        entries.push([from, after]);
      }
    });

    return entries;
  }

  /**
   * Evaluates a delay function against the state.
   *
   * @param delay - The delay function of type {@linkcode SyncPerformDelay_F}.
   *
   * @returns The evaluated delay time in milliseconds.
   */
  private __performDelay: SyncPerformDelay_F<Eo, Pc, Tc, Ta> = delay => {
    this._iterate();
    return delay(this.__cloneState);
  };

  /**
   * Executes a delay function while setting the interpreter status to busy.
   *
   * @param delay - The delay function of type {@linkcode SyncPerformDelay_F}.
   *
   * @returns The evaluated delay time in milliseconds.
   */
  private __executeDelay: SyncPerformDelay_F<Eo, Pc, Tc, Ta> = delay => {
    this.__setStatus('busy');
    const out = this.__performDelay(delay);
    this.__setStatus('started');
    return out;
  };

  /**
   * Creates an interval instance for executing periodic tasks or activities.
   *
   * @param options - Configuration options for interval creation of type {@linkcode CreateInterval2_F}.
   *
   * @returns The created interval handle.
   */
  protected createInterval: CreateInterval2_F = ({ callback, id, interval }) => {
    const exact = this.__exact;
    const out = createInterval({ callback, id, interval, exact });

    return out;
  };

  /**
   * Executes activity timers for a state node.
   *
   * @param from - The origin state path string.
   * @param _activities - The activities map to execute.
   *
   * @returns An array of activity interval identifiers.
   */
  protected __executeActivities: ExecuteActivities_F = (from, _activities) => {
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
        const interval = this.__executeDelay(delayF);

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

            const check5 = this.__performPredicates(
              ...toArray.typed(activity.guards),
            );

            if (check5) {
              const actions = toArray.typed(activity.actions);
              this.__performActions(...actions);
            }
          }
          this.__flush();
        };

        const promise = this.createInterval({ callback, interval, id });

        this.__cachedIntervals.push(promise);

        return id;
      };

      if (_interval) {
        const check = _interval.state === 'idle' || _interval.state === 'paused';
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
   * Performs `always` (transitional) logic for a state node configuration.
   *
   * @param alway - The `always` transition configuration of type {@linkcode AlwaysConfig}.
   *
   * @returns The target state path string if successful, or `false` otherwise.
   */
  private __performAlways = (from: string, alway: AlwaysConfig) => {
    this.__changeEvent(transformEventArg(`${from}/${ALWAYS_EVENT}`));
    const always = toArray<TransitionConfig>(alway);
    return this.__performTransitions(...always);
  };

  /**
   * Collects initial self-transitions (`always` and `after`) across all flat state nodes.
   *
   * @returns A map of state paths to self-transition execution functions.
   */
  protected get __collectedSelfTransitions0() {
    const entries = new Map<
      string,
      { always?: () => string | false; after?: () => void }
    >();

    this.__collectedAlways.forEach(([from, always]) => {
      entries.set(from, { always: () => this.__performAlways(from, always) });
    });

    this.__collectedAfters.forEach(([from, after]) => {
      const inner = entries.get(from);
      if (inner) inner.after = this.__performAfter(from, after);
      else {
        entries.set(from, { after: this.__performAfter(from, after) });
      }
    });

    return entries;
  }

  /**
   * Collects self-transitions that are currently active based on state value.
   *
   * @returns A parameterless function that executes all active self-transitions, or `undefined` if none active.
   */
  protected get __collectedSelfTransitions() {
    const entries = Array.from(this.__collectedSelfTransitions0).filter(([from]) =>
      this.__isInsideValue(from),
    );

    const out = entries.map(([, { always, after }]) => {
      return () => {
        /* v8 ignore else -- @preserve */
        if (always) {
          const target = always();
          /* v8 ignore else -- @preserve */
          if (target) return this.__performConfig(target);
        }

        after?.();
      };
    });

    if (out.length < 1) return;
    return () => out.forEach(f => f());
  }

  /**
   * Collects and activates pausable emitters active in the current state.
   *
   * @returns An array of activated pausable emitter objects.
   */
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
                const event = { type: `${id}::next`, payload } satisfies EventObject;

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

            return { pausable, id, from };
          },
        );

        this.__collectedPausables.push(...pausables);
        return pausables;
      })
      .flat();
  };

  /**
   * Performs all active self-transitions and flushes state changes if state changed.
   */
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
   * Adds options to the inner class {@linkcode SyncMachine} of this interpreter service.
   *
   * @param helper - The options provider function of type {@linkcode SyncAddOptions_F}.
   *
   * @returns The interpreter instance with updated options.
   */
  addOptions: SyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
    return super.addOptions(helper) as any;
  };

  /**
   * Provides options for the interpreter and returns a new interpreter instance.
   *
   * @param option - A function that provides options for the machine of type {@linkcode SyncProvideMachineOptions_F}.
   *
   * @returns A new class {@linkcode SyncInterpreter} instance with the provided options applied.
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

  /**
   * Subscribes a listener to state and context updates of this interpreter.
   *
   * @param _subscriber - The subscriber callback function.
   * @param options - Subscription configuration options.
   *
   * @returns The created subscriber object of type {@linkcode AddSubscriber_F}.
   */
  subscribe: AddSubscriber_F<Tc, Ta, Eo> = (_subscriber, options) => {
    const events = this.machine.eventsList;
    const id = options?.id;
    const find = id
      ? Array.from(this.__subscribers).find(f => f.id === id)
      : undefined;
    if (find) return find;

    const subscriber = createSubscriber(_subscriber, options, ...events);
    this.__subscribers.add(subscriber as any);
    return subscriber as any;
  };

  /**
   * Pre-processes an event send operation to compute state transition results.
   *
   * @param event - The event argument of type {@linkcode EventArgObject}.
   *
   * @returns The computed next state configuration, or `undefined` if unchanged.
   */
  protected __presend: _SyncSend_F<Eo> = event => {
    this.__sent = true;
    this.__changeEvent(event);
    this.__setStatus('sending');
    let sv = this.__value;

    const flat2 = this.__extractTransitions(event);
    // #endregion

    for (const [, transitions] of flat2) {
      const target = this.__performTransitions(...toArray.typed(transitions));

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
   * Creates a curried sender function for the given event type.
   *
   * @template T - The event type string extending `Eo['type']`.
   *
   * @param type - The event type string.
   *
   * @returns A function that accepts payload data and sends the event.
   */
  sender = <const T extends Eo['type']>(type: T) => {
    return (...data: ExtractSender<Eo, T>) => {
      const payload = data.length === 1 ? data[0] : {};
      const event = { type, payload } as unknown as EventArgObject<Eo>;
      return this.send(event);
    };
  };

  /**
   * Performs all self transitions and activities of this class {@linkcode SyncInterpreter} service.
   *
   * @throws type {@linkcode Error} Throw if the number of self transitions exceeds {@linkcode DEFAULT_MAX_SELF_TRANSITIONS}.
   */
  protected _next = () => {
    this.__flush();
    let check = false;
    do {
      const previousValue = this.__value;

      const checkCounter =
        this.__selfTransitionsCounter >= DEFAULT_MAX_SELF_TRANSITIONS;

      if (checkCounter) return this.__throwMaxCounter();
      this.__throwing();
      this.__preNext();
      const currentValue = this.__value;
      check = !equal(previousValue, currentValue);
      if (check) this.__flush();
    } while (check);

    this.__flush();
    this.__selfTransitionsCounter = 0;
  };

  /**
   * Sends an event without precondition checking to the current class {@linkcode SyncInterpreter} service.
   *
   * @param _event - The event argument object of type {@linkcode EventArgObject}.
   */
  protected __send = (_event: EventArgObject<Eo>) => {
    const event = transformEventArg(_event);
    const next = this.__presend(event as any);

    if (isDefined(next)) {
      this.__config = next;
      this.__performConfig(true);
      this.__setStatus('working');
      return this._next();
    } else {
      this.__flush();
      return this.__setStatus('working');
    }
  };

  /**
   * Spawns and manages child actor services for active state nodes.
   *
   * @returns An array of spawned child service objects.
   */
  protected __collectChildren = () => {
    type _Child = ChildConfig & {
      childFn: CommonChildFunction2<Eo, Pc, Tc, Ta>;
      id: string;
    };

    return this.__collectedChildrenConfig
      .filter(([from]) => this.__isInsideValue(from))
      .filter(([from]) => {
        const froms = this.__collectedChildren.map(({ from }) => from);
        return !froms.includes(from);
      })
      .map(([from, ..._children]) => {
        const children = _children
          .map(({ id, ...rest }) => {
            return { childFn: this.toChildFn(id), ...rest, id };
          })
          .filter(({ childFn }) => !!childFn) as _Child[];

        return [from, ...children] as const;
      })
      .map(([from, ..._children]) => {
        const services = _children.map(({ childFn, ...rest }) => {
          const service = this.__executeChild(childFn);
          return { service, ...rest };
        });

        return [from, ...services] as const;
      })
      .map(([from, ..._services]) => {
        const services = _services.map(({ service, on, contexts, id }) => {
          const si = service as AnyInterpreter & { __subscribe: AddSubscriber_F };

          const checkOn = on !== undefined && Object.keys(on).length > 0;
          if (checkOn) {
            si.__subscribe(
              payload => {
                const type = eventToType(payload.event);

                const event = {
                  type: `${id}::on::${type}`,
                  payload,
                } satisfies EventObject;

                this.__changeEvent(_any(event));
                const transitions = toArray<TransitionConfig>(on?.[type]);

                return this.__performTransitions(...transitions);
              },
              {
                equals: (a, b) => a.event.type === b.event.type,
                id: `${id}::on`,
                firstTime: false,
              },
            );
          }

          const checkContexts =
            contexts !== undefined && Object.keys(contexts).length > 0;

          if (checkContexts) {
            si.__subscribe(
              ({ context }) => {
                const entries = Object.entries(contexts);
                entries.forEach(([key, path]) => {
                  const pContext =
                    key === '.'
                      ? structuredClone(context)
                      : byKey2.low(context, key);

                  if (path === '.') {
                    this.__contexts.pContext = pContext as any;
                  } else {
                     merge2({
                      target: this.__contexts.pContext,
                      source: recompose({ [path]: pContext }),
                      key: path,
                    } as any);
                    
                  }
                });
              },

              {
                equals: (a, b) => {
                  const ac = a.context;
                  const bc = b.context;
                  if (equal(ac, bc)) return true;
                  const keys = Object.keys(contexts);

                  for (const key of keys) {
                    if (key === '.') return equal(ac, bc);
                    const _a = byKey2.low(ac, key);
                    const _b = byKey2.low(bc, key);
                    if (!equal(_a, _b)) return false;
                  }

                  return true;
                },
                id: `${id}::contexts`,
                firstTime: false,
              },
            );
          }

          return { service: si, id, from };
        });

        this.__collectedChildren.push(...services);
        return services;
      });
  };

  /**
   * Executes a child machine factory function with the current cloned state.
   *
   * @param child - The child factory function of type {@linkcode CommonChildFunction2}.
   *
   * @returns The spawned child machine interpreter instance.
   */
  private __executeChild = (child: CommonChildFunction2<Eo, Pc, Tc, Ta>) => {
    const instance = child(this.__cloneState);
    return instance;
  };

  // #endregion

  /**
   * Sends an event to a specific child service by its ID.
   *
   * @template `T` - The event object type extending interface {@linkcode EventObject}.
   *
   * @param to - The ID of the child service to which the event will be sent.
   * @param event - The event object of type {@linkcode EventObject} to send to the child service.
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

/**
 * Type helper to extract the machine configuration property from a type {@linkcode KeyU}.
 *
 * @template `T` - The target type extending type {@linkcode KeyU}.
 */
type SyncConfigFrom<T extends KeyU<'config'>> = T['config'];

/**
 * Retrieves the type {@linkcode SyncInterpreter} service type from a given interface {@linkcode AnyMachine}.
 *
 * @template `M` - The machine type extending interface {@linkcode AnyMachine}.
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

/**
 * Function type signature for creating a type {@linkcode SyncInterpreterFrom} service from an interface {@linkcode AnyMachine}.
 *
 * @template `M` - The machine type extending interface {@linkcode AnyMachine}.
 *
 * @param args - The interpretation arguments of type {@linkcode InterpretArgs}.
 *
 * @returns A type {@linkcode SyncInterpreterFrom} instance.
 */
export type SyncInterpreter_F = <M extends AnyMachine>(
  ...args: InterpretArgs<M>
) => SyncInterpreterFrom<M>;

/**
 * Creates and initializes a class {@linkcode SyncInterpreter} service from the given interface {@linkcode AnyMachine}.
 *
 * @param _args - The interpretation arguments including the machine, mode, exact, context, and private context.
 *
 * @returns A new class {@linkcode SyncInterpreter} service instance.
 */
export const interpretSync: SyncInterpreter_F = (..._args) => {
  const [machine, args] = _args;
  const { mode, exact, pContext, context } = _any(args);
  const out: any = new SyncInterpreter(machine, mode, exact);
  out._providePrivateContext(pContext);
  out._provideContext(context);
  return out;
};
