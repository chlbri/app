import { type WithDescriber } from '#actions';
import {
  DEFAULT_MAX_SELF_TRANSITIONS,
  DEFAULT_MAX_TIME_PROMISE,
  DEFAULT_MIN_ACTIVITY_TIME,
  TIME_TO_RINIT_SELF_COUNTER,
} from '#constants';
import { _any } from '@bemedev/app-utils-bemedev';

import {
  ALWAYS_EVENT,
  eventToType,
  transformEventArg,
  type ActorsConfigMap,
  type EventArgObject,
  type EventObject,
  type EventsMap,
} from '#events';
import { toPredicate } from '../guards/functions/toPredicate';
import { type GuardConfig } from '#guards';
import { initialConfig, nextSV } from '#states';
import type { DelayedTransitions, TransitionConfig } from '#transitions';
import { isDefined, switchV, toArray } from '@bemedev/app-utils-bemedev';
import {
  anyPromises,
  withTimeout,
  type TimeoutPromise,
} from '@bemedev/better-promise';

import { sleep } from '@bemedev/sleep';
import equal from 'fast-deep-equal';
import { isDescriber, type EmptyObject } from '~types';
import type {
  _AsyncSend_F,
  AsyncCollected0,
  AsyncInterpreter_F,
  AsyncPerformAction_F,
  AsyncPerformActionLater_F,
  AsyncPerformAfter_F,
  AsyncPerformAlway_F,
  AsyncPerformDelay_F,
  AsyncPerformPredicate_F,
  AsyncPerformTransition_F,
  AsyncPerformTransitions_F,
  AsyncProvideMachineOptions_F,
} from './interpreter.types';

import {
  AddSubscriber_F,
  AnyInterpreter,
  CommonInterpreter,
  type ActorsMapFrom,
  type AllPathsFrom,
  type ConfigFrom,
  type ContextFrom,
  type EventsFrom,
  type EventsMapFrom,
  type ExecuteActivities_F,
  type ExtendedActionsParams,
  type MachineOptionsFrom,
  type Mode,
  type PrivateContextFrom,
  type TagFrom,
} from '#common/interpreter';
import {
  CommonChildFunction2,
  getEntries,
  type AnyMachine,
  type CommonConfig3,
  type SimpleMachineOptions2,
} from '#common/machine';
import { type AsyncEmitterFunction } from '#emitters';
import type { AsyncMachine } from '../asyncMachine/machine';
import type { AsyncAddOptions_F } from '../asyncMachine';
import { getByKey, recompose } from '@bemedev/decompose';
import { createScheduler } from '@bemedev/scheduler';
import type { PrimitiveObject } from '@bemedev/typings';
import type {
  ChildConfig,
  EmitterConfig,
  FinallyConfig,
} from '../actors/types';

/**
 * The `Interpreter` class is responsible for interpreting and managing the state of a machine.
 * It provides methods to start, stop, pause, and resume the machine, as well as to send events
 * and subscribe to state changes.
 *
 * @template : type {@linkcode AsyncConfig} [C] - The configuration type of the machine.
 * @template : [Pc] - The private context type, which can be any type.
 * @template : type {@linkcode types} [Tc] - The context type.
 * @template : type {@linkcode EventsMap} [E] - The events map type, which maps event names to their
 * @template : type {@linkcode PromiseeMap} [P] - The promisees map type, which maps promise names to their
 * @template Mo : type {@linkcode SimpleMachineOptions2} - The machine options type, which includes various configurations for the machine. Default to {@linkcode SimpleMachineOptions2}.
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
export class AsyncInterpreter<
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
> extends CommonInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo> {
  readonly TYPE = 'async';
  /**
   * @deprecated Use the `machine` getter instead to access the inner machine of this interpreter.
   *
   * The {@linkcode AsyncMachine} machine being interpreted.
   */
  get machine() {
    return this.__machine as unknown as AsyncMachine<
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
   * Create a new {@linkcode AsyncInterpreter} instance with the same initial configuration as this instance.
   */
  get renew() {
    const out = new AsyncInterpreter<
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
    >(this.machine, this.__mode, this.__exact);

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
   * @param machine, the {@linkcode AsyncMachine} to interpret.
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
   * Performs all self transitions and activities of this {@linkcode AsyncInterpreter} service.
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

  protected __performAction: AsyncPerformActionLater_F<Eo, Pc, Tc, Ta> =
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
    from: string | false,
    forceSend?: EventArgObject<Eo>,
  ) => {
    if (!forceSend) return;
    const values = Object.values(this.machine.flat);

    for (const { on } of values) {
      const type = eventToType(forceSend);
      const transitions = toArray.typed(on?.[type]);
      await this.__performTransitions(from, ...(transitions as any));
    }
  };

  protected __performsExtendedActions = async (
    from: string | false,
    {
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
    }: ExtendedActionsParams<Eo, Pc, Tc>,
  ) => {
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
      (await this.__performForceSendAction(from, forceSend)) ??
      (await this.__performResendAction(resend));

    return result;
  };

  protected __executeAction: AsyncPerformAction_F<Eo, Pc, Tc, Ta> = async (
    from,
    action,
  ) => {
    this.__setStatus('busy');

    const { pContext, context, ...extendeds } =
      await this.__performAction(action);

    if (from !== false && this.__cannotPerform(from)) return;
    this.__mergeContexts({ pContext, context });
    await this.__performsExtendedActions(from, extendeds);
  };

  protected __performActions = async (
    from: string | false,
    ...actions: WithDescriber[]
  ) => {
    const fns = actions.map(this.toActionFn).filter(f => f !== undefined);

    for (const fn of fns) {
      await this.__executeAction(from, fn);
      if (from !== false && this.__cannotPerform(from)) break;
    }
  };

  #performPredicate: AsyncPerformPredicate_F<Eo, Pc, Tc, Ta> =
    predicate => {
      this._iterate();
      return predicate(this.__cloneState);
    };

  #executePredicate: AsyncPerformPredicate_F<Eo, Pc, Tc, Ta> =
    predicate => {
      this.__setStatus('busy');
      const out = this.#performPredicate(predicate);

      this.__setStatus('working');

      return out;
    };

  override toPredicateFn = (guard: GuardConfig) => {
    const events = this.__machine.eventsList;
    const guards = this.__machine.guards;

    const { predicate, errors } = toPredicate.async<Pc, Tc, Ta, Eo>(
      guard,
      guards,
      ...events,
    );

    if (isDefined(predicate)) return predicate;
    this._addWarning(...errors);
    return;
  };

  #performPredicates = async (...guards: GuardConfig[]) => {
    if (guards.length < 1) return true;
    const predicates = guards.map(this.toPredicateFn).filter(isDefined);

    for (const predicate of predicates) {
      const out = await this.#executePredicate(predicate);
      if (!out) return false;
    }
    return true;
  };

  #performDelay: AsyncPerformDelay_F<Eo, Pc, Tc, Ta> = delay => {
    this._iterate();
    return delay(this.__cloneState);
  };

  #executeDelay: AsyncPerformDelay_F<Eo, Pc, Tc, Ta> = delay => {
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
              await this.__performActions(from, activity);
              continue;
            }

            const check5 = await this.#performPredicates(
              ...toArray.typed(activity.guards),
            );
            if (check5) {
              const actions = toArray.typed(activity.actions);
              await this.__performActions(from, ...actions);
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

  protected __startInitialEntries = () => {
    const actions = getEntries(this.__initialConfig);
    if (actions.length < 1) return;
    return this.__performActions(false, ...actions);
  };

  protected __performTransition: AsyncPerformTransition_F = async (
    from,
    transition,
  ) => {
    const check = typeof transition == 'string';
    if (check) {
      const { diffEntries, diffExits } = this.__diffNext(transition);
      await this.__performActions(from, ...toArray.typed(diffExits));
      await this.__performActions(from, ...toArray.typed(diffEntries));
      return transition;
    }

    const { guards, actions, target } = transition;
    const { diffEntries, diffExits } = this.__diffNext(target);

    const response = await this.#performPredicates(
      ...toArray<GuardConfig>(guards),
    );

    if (response) {
      await this.__performActions(from, ...toArray.typed(diffExits));
      await this.__performActions(from, ...toArray.typed(actions));
      await this.__performActions(from, ...toArray.typed(diffEntries));
      return target ?? false;
    }
    return false;
  };

  protected __performTransitions: AsyncPerformTransitions_F = async (
    from,
    ...transitions
  ) => {
    for (const _transition of transitions) {
      const transition = await this.__performTransition(from, _transition);
      const check1 = typeof transition === 'string';
      if (check1) return transition;
    }

    return false;
  };

  protected __performFinally = async (
    from: string,
    _finally?: FinallyConfig,
  ) => {
    const check1 = _finally === undefined;
    if (check1) return;

    const finals = toArray.typed(_finally);

    for (const final of finals) {
      const check2 = typeof final === 'string';
      const check3 = isDescriber(final);

      const check4 = check2 || check3;
      if (check4) {
        await this.__performActions(from, final);
        continue;
      }

      const response = await this.#performPredicates(
        ...toArray.typed(final.guards),
      );

      /* v8 ignore else -- @preserve */
      if (response) {
        return this.__performActions(
          from,
          ...toArray.typed(final.actions),
        );
      }
    }
    return;
  };

  get #machine() {
    return this.__machine as unknown as AsyncMachine<
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
    >;
  }

  get longRuns() {
    return this.#machine.longRuns;
  }

  #performAfter: AsyncPerformAfter_F = (from, after) => {
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
          this.__performTransitions(from, ...(transitions as any));

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

  #performAlways: AsyncPerformAlway_F = (from, alway) => {
    this.__changeEvent(transformEventArg(ALWAYS_EVENT));
    const always = toArray<TransitionConfig>(alway);
    return this.__performTransitions(from, ...always);
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
   * Get all brut self transitions of the current {@linkcode NodeConfigWithInitials} config state of this {@linkcode AsyncInterpreter} service.
   */
  protected get __collectedSelfTransitions0() {
    const entries = new Map<string, AsyncCollected0>();

    this.__collectedAlways.forEach(([from, always]) => {
      entries.set(from, {
        always: () => this.#performAlways(from, always),
      });
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
                this.__performTransitions(from, ...transitions);
              },
              error: payload => {
                const event = {
                  type: `${id}::error`,
                  payload,
                } satisfies EventObject;

                this.__changeEvent(_any(event));
                const transitions = toArray<TransitionConfig>(error);
                this.__performTransitions(from, ...transitions);
              },
              complete: () => this.__performFinally(from, complete),
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
   * Add options to the inner {@linkcode AsyncMachine} of this {@linkcode AsyncInterpreter} service.
   */
  addOptions: AsyncAddOptions_F<Eo, Pc, Tc, Ta, Mo, L> = helper => {
    return super.addOptions(helper) as any;
  };

  /**
   * Provides options for the interpreter and returns a new interpreter instance.
   *
   * @param option a function that provides options for the machine.
   * Options can include actions, guards, delays, promises, and child machines.
   * @returns a new interpreter instance with the provided options applied.
   */
  provideOptions: AsyncProvideMachineOptions_F<
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

  // #region Next

  protected __presend: _AsyncSend_F<Eo> = async event => {
    this.__sent = true;
    this.__changeEvent(event);
    this.__setStatus('sending');
    let sv = structuredClone(this.__value);

    const flat2 = this.__extractTransitions(event);
    // #endregion

    for (const [from, transitions] of flat2) {
      const cannotContinue = !this.__isInsideValue2(sv, from);
      if (cannotContinue) continue;

      const target = await this.__performTransitions(
        from,
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
   * Sends an event without cheching to the current {@linkcode AsyncInterpreter} service.
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
          const service = this.#executeChild(childFn);
          return {
            service,
            ...rest,
          };
        });

        return [from, ...services] as const;
      })
      .map(([from, ..._services]) => {
        const services = _services.map(({ service, on, contexts, id }) => {
          const si = service as AnyInterpreter & {
            __subscribe: AddSubscriber_F;
          };

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

                return this.__performTransitions(from, ...transitions);
              },
              {
                equals: (a, b) => a.event.type === b.event.type,
                id: `${id}::on`,
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
                      : getByKey.low(context, key);

                  if (path === '.')
                    return this.__mergeContexts({ pContext });
                  return this.__mergeContexts(
                    recompose({ [`pContext.${path}`]: pContext }),
                  );
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
                    const _a = getByKey.low(ac, key);
                    const _b = getByKey.low(bc, key);
                    if (!equal(_a, _b)) return false;
                  }

                  return true;
                },
                id: `${id}::contexts`,
              },
            );
          }

          return {
            service: si,
            id,
            from,
          };
        });

        this.__collectedChildren.push(...services);
        return services;
      });
  };

  #executeChild = (child: CommonChildFunction2<Eo, Pc, Tc, Ta>) => {
    const instance = child(this.__cloneState);
    return instance;
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
      ({ id }) => id === to,
    );

    for (const { service } of collector) {
      await service.send(event);
    }
  };
}

/**
 * Retrieves the {@linkcode AsyncInterpreter} service from the given {@linkcode AnyMachine} machine.
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
export type AsyncInterpreterFrom<M extends AnyMachine> = AsyncInterpreter<
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
 * Creates an {@linkcode AsyncInterpreter} service from the given {@linkcode MachineConfig} machine.
 *
 * @param machine - The {@linkcode MachineConfig} machine to create the interpreter from.
 * @param options - The options for the interpreter, including context, private context, mode, and exact.
 * @returns an {@linkcode AsyncInterpreter} service.
 *
 * @see {@linkcode MachineConfig}
 */
export const interpret: AsyncInterpreter_F = (..._args) => {
  const [machine, args] = _args;
  const { mode, exact, pContext, context } = _any(args ?? {});
  const out: any = new AsyncInterpreter(machine, mode, exact);
  out._providePrivateContext(pContext);
  out._provideContext(context);
  return out;
};
