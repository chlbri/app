import { type WithDescriber } from '#actions';
import _any from '#bemedev/features/common/castings/any';
import {
  DEFAULT_MAX_SELF_TRANSITIONS,
  DEFAULT_MAX_TIME_PROMISE,
  DEFAULT_MIN_ACTIVITY_TIME,
} from '#constants';

import toArray from '#bemedev/features/arrays/castings/toArray';
import isDefined from '#bemedev/features/common/castings/is/defined';
import { switchV } from '#bemedev/features/functions/functions/switch';
import {
  ALWAYS_EVENT,
  eventToType,
  transformEventArg,
  type ActorsConfigMap,
  type EventArgObject,
  type EventObject,
  type EventsMap,
} from '#events';
import { type GuardConfig } from '#guards';
import {
  type Config,
  type ConfigFrom,
  type ContextFrom,
  type EventsMapFrom,
  type ExtendedActionsParams,
  type PrivateContextFrom,
} from '#machines';
import { initialConfig, nextSV } from '#states';
import type { DelayedTransitions, TransitionConfig } from '#transitions';
import {
  anyPromises,
  withTimeout,
  type TimeoutPromise,
} from '@bemedev/better-promise';

import { sleep } from '@bemedev/sleep';
import equal from 'fast-deep-equal';
import { isDescriber } from '~types';
import type {
  _Send_F,
  Collected0,
  ExecuteActivities_F,
  Interpreter_F,
  Mode,
  PerformAction_F,
  PerformActionLater_F,
  PerformAfter_F,
  PerformAlway_F,
  PerformDelay_F,
  PerformPredicate_F,
  PerformTransition_F,
  PerformTransitions_F,
} from './interpreter.types';

import type { PrimitiveObject } from '#bemedev/globals/types';
import { CommonInterpreter } from '#common/interpreter';
import type { AnyMachine } from '#common/machine';
import { type EmitterFunction2 } from '#emitters';
import type { Machine } from '#machine';
import type {
  ActorsMapFrom,
  AllPathsFrom,
  EventsFrom,
  MachineOptionsFrom,
  SimpleMachineOptions2,
  TagFrom,
} from '#machines';
import { createScheduler } from '@bemedev/scheduler';
import type { EmitterConfig, FinallyConfig } from '../actors/types';

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
 * @implements : {@linkcode AnyInterpreter}
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
export class Interpreter<
  const C extends Config = Config,
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
   * @deprecated Use the `machine` getter instead to access the inner machine of this interpreter.
   *
   * The {@linkcode Machine} machine being interpreted.
   */
  get machine() {
    return this.__machine as unknown as Machine<
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
    const out = new Interpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>(
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

  /**
   * Where everything is initialized
   * @param machine, the {@linkcode Machine} to interpret.
   * @param mode, the {@linkcode Mode} of the interpreter, default is 'strict'.
   * @param exact, whether to use exact intervals or not, default is false.
   */
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
   * Performs all self transitions and activities of this {@linkcode Interpreter} service.
   * @remarks Throw if the number of self transitions exceeds {@linkcode DEFAULT_MAX_SELF_TRANSITIONS}.
   */
  protected _next = async () => {
    // eslint-disable-next-line no-useless-assignment
    let check = false;
    do {
      const startTime = Date.now();
      const previousValue = this.__value;

      const checkCounter =
        this.__selfTransitionsCounter >= DEFAULT_MAX_SELF_TRANSITIONS;
      if (checkCounter) return this.__throwMaxCounter();
      this.__throwing();
      await this.__preNext();

      const currentValue = this.__value;
      check = !equal(previousValue, currentValue);
      if (check) this.__flush();

      const duration = Date.now() - startTime;
      const check2 = duration > TIME_TO_RINIT_SELF_COUNTER;
      if (check2) this.__selfTransitionsCounter = 0;
    } while (check);

    this.__selfTransitionsCounter = 0;
  };

  protected __performAction: PerformActionLater_F<Eo, Pc, Tc, Ta> =
    action => {
      this._iterate();
      const out = withTimeout(
        async () => action(this.__cloneState),
        'Action timed out',
        ...(this.longRuns ? [] : [DEFAULT_MAX_TIME_PROMISE]),
      );

      return out();
    };

  /**
   * Force transition to performs inner actions despite the current state.
   * This is useful for sending events that are not part of the current state transitions.
   * @param transitions, the transitions to perform.
   * @returns the result of the transitions.
   *
   * @see {@linkcode TransitionConfig} for more information about transitions.
   */
  protected __performForceSendAction = async (
    forceSend?: EventArgObject<Eo>,
  ) => {
    if (!forceSend) return;
    const values = Object.values(this.machine.flat);

    for (const { on } of values) {
      const type = eventToType(forceSend);
      const transitions = toArray.typed(on?.[type]);
      await this.__performTransitions(...(transitions as any));
    }
  };

  protected __performsExtendedActions = async ({
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
      (await this.__performForceSendAction(forceSend)) ??
      (await this.__performResendAction(resend));

    return result;
  };

  protected __executeAction: PerformAction_F<Eo, Pc, Tc, Ta> =
    async action => {
      this.__setStatus('busy');

      const { pContext, context, ...extendeds } =
        await this.__performAction(action);

      this.__mergeContexts({ pContext, context });
      await this.__performsExtendedActions(extendeds);
    };

  protected __performActions = async (...actions: WithDescriber[]) => {
    const fns = actions.map(this.toActionFn).filter(f => f !== undefined);

    for (const fn of fns) {
      await this.__executeAction(fn);
    }
  };

  #performPredicate: PerformPredicate_F<Eo, Pc, Tc, Ta> = predicate => {
    this._iterate();
    return predicate(this.__cloneState);
  };

  #executePredicate: PerformPredicate_F<Eo, Pc, Tc, Ta> = predicate => {
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

  #performDelay: PerformDelay_F<Eo, Pc, Tc, Ta> = delay => {
    this._iterate();
    return delay(this.__cloneState);
  };

  #executeDelay: PerformDelay_F<Eo, Pc, Tc, Ta> = delay => {
    this.__setStatus('busy');
    const out = this.#performDelay(delay);
    this.__setStatus('started');
    return out;
  };

  __executeActivities: ExecuteActivities_F = (from, _activities) => {
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

        const callback = async () => {
          for (const activity of activities) {
            const check2 = typeof activity === 'string';
            const check3 = isDescriber(activity);
            const check4 = check2 || check3;

            if (check4) {
              await this.__performActions(activity);
              continue;
            }

            const check5 = this.#performPredicates(
              ...toArray.typed(activity.guards),
            );
            if (check5) {
              const actions = toArray.typed(activity.actions);
              await this.__performActions(...actions);
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

  protected __performTransition: PerformTransition_F =
    async transition => {
      const check = typeof transition == 'string';
      if (check) {
        const { diffEntries, diffExits } = this.__diffNext(transition);
        await this.__performActions(...toArray.typed(diffExits));
        await this.__performActions(...toArray.typed(diffEntries));
        return transition;
      }

      const { guards, actions, target } = transition;
      const { diffEntries, diffExits } = this.__diffNext(target);

      const response = this.#performPredicates(
        ...toArray<GuardConfig>(guards),
      );

      if (response) {
        await this.__performActions(...toArray.typed(diffExits));
        await this.__performActions(...toArray.typed(actions));
        await this.__performActions(...toArray.typed(diffEntries));
        return target ?? false;
      }
      return false;
    };

  protected __performTransitions: PerformTransitions_F = async (
    ...transitions
  ) => {
    for (const _transition of transitions) {
      const transition = await this.__performTransition(_transition);
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
        return this.__performActions(...toArray.typed(final.actions));
      }
    }
    return;
  };

  #performAfter: PerformAfter_F = (from, after) => {
    const entries = Object.entries(after);
    const promises: TimeoutPromise<string | false>[] = [];

    entries.forEach(([_delay, transition]) => {
      const delayF = this.toDelayFn(_delay);
      const check0 = !isDefined(delayF);
      if (check0) return;
      const delay = this.#executeDelay(delayF);

      const check1 = delay > DEFAULT_MAX_TIME_PROMISE;
      if (check1) {
        this._addWarning(`Delay ${_delay} is too long`);
        return;
      }

      const transitions = toArray.typed(transition);

      const _promise = async () => {
        await sleep(delay);
        if (this.__cannotPerform(from)) return false;

        const func = () =>
          this.__performTransitions(...(transitions as any));

        const out = await func();

        if (out === false) {
          const message = `No transitions reached from "${from}" by delay "${_delay}" !`;

          throw message;
        }
        return out;
      };

      const promise = withTimeout(
        _promise,
        from,
        ...(this.longRuns ? [] : [DEFAULT_MAX_TIME_PROMISE]),
      );

      promises.push(promise);
    });

    const check5 = promises.length < 1;
    if (check5) return;

    const promise = anyPromises(from, ...promises);
    return promise;
  };

  get #flat() {
    return this.machine.flat;
  }

  #performAlways: PerformAlway_F = alway => {
    this.__changeEvent(transformEventArg(ALWAYS_EVENT));
    const always = toArray<TransitionConfig>(alway);
    return this.__performTransitions(...always);
  };

  get #collectedAfters() {
    const entriesFlat = Object.entries(this.#flat);
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
   * Get all brut self transitions of the current {@linkcode NodeConfigWithInitials} config state of this {@linkcode Interpreter} service.
   */
  protected get __collectedSelfTransitions0() {
    const entries = new Map<string, Collected0>();

    this.__collectedAlways.forEach(([from, always]) => {
      entries.set(from, { always: () => this.#performAlways(always) });
    });

    this.#collectedAfters.forEach(([from, after]) => {
      const inner = entries.get(from);
      if (inner) {
        inner.after = this.#performAfter(from, after);
      } else entries.set(from, { after: this.#performAfter(from, after) });
    });

    return entries;
  }

  protected get __collectedSelfTransitions() {
    const entries = Array.from(this.__collectedSelfTransitions0).filter(
      ([from]) => this.__isInsideValue(from),
    );

    const out = entries.map(([from, { after, always }]) => {
      const promise = async () => {
        if (always) {
          const target = await always();
          if (target !== false) return this.__performConfig(target);
        }

        // const promises: TimeoutPromise<void>[] = [];
        if (after) {
          const _after = async () => {
            await after()
              .then(transition => {
                if (transition !== false)
                  return this.__performConfig(transition);
              })
              .catch(() =>
                this._addWarning(
                  `${from}::after - No transitions reached!`,
                ),
              );
          };
          await _after();
        }
      };

      return withTimeout(promise, 'self-transition');
    });

    if (out.length < 1) return;
    return anyPromises('self-transition', ...out);
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

  protected __performSelfTransitions = async () => {
    this.__setStatus('busy');
    const previousState = structuredClone(this.__state);
    await this.__collectedSelfTransitions?.();
    const nextState = structuredClone(this.__state);
    const check = !equal(previousState, nextState);
    if (check) this.__flush();
    this.__setStatus('working');
  };

  /**
   * Add options to the inner {@linkcode Machine} of this {@linkcode Interpreter} service.
   */
  get addOptions() {
    return super.addOptions as this['machine']['addOptions'];
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
    const newMachine = this.machine.provideOptions(option);

    const out = new Interpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>(
      newMachine,
      this.__mode,
      this.__exact,
    );
    
    out._ppC(this.__initialPpc);
    out._provideContext(this.__initialContext);
    return out;
  };

  // #region Next

  protected __presend: _Send_F<Eo> = async event => {
    this.__sent = true;
    this.__changeEvent(event);
    this.__setStatus('sending');
    let sv = this.__value;

    const flat2 = this.__extractTransitions(event);
    // #endregion

    for (const [from, transitions] of flat2) {
      const cannotContinue = !this.__isInsideValue2(sv, from);
      if (cannotContinue) continue;

      const target = await this.__performTransitions(
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
   * Sends an event without cheching to the current {@linkcode Interpreter} service.
   *
   * @param _event - the {@linkcode EventArg} event to send.
   *
   */
  protected __send = async (_event: EventArgObject<Eo>) => {
    const event = transformEventArg(_event);
    const next = await this.__presend(event as any);

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
  protected __sendTo = async <T extends EventObject>(
    to: string,
    event: T,
  ) => {
    const collector = this.__collectedChildren.filter(
      ({ from, id }) => this.__isInsideValue(from) && id === to,
    );

    for (const { service } of collector) {
      await service.send(event);
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
export type InterpreterFrom<M extends AnyMachine> = Interpreter<
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

/**
 * Creates an {@linkcode Interpreter} service from the given {@linkcode MachineConfig} machine.
 *
 * @param machine - The {@linkcode MachineConfig} machine to create the interpreter from.
 * @param options - The options for the interpreter, including context, private context, mode, and exact.
 * @returns an {@linkcode Interpreter} service.
 *
 * @see {@linkcode MachineConfig}
 */
export const interpret: Interpreter_F = (..._args) => {
  const [machine, args] = _args;
  const { mode, exact, pContext, context } = _any(args ?? {});
  const out: any = new Interpreter(machine, mode, exact);
  out._providePrivateContext(pContext);
  out._provideContext(context);
  return out;
};
