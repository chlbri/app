import { type ExtendedActionsParams } from '#common/interpreter';
import { eventToType, transformEventArg, type ExtractSender } from '#events';
import { type GuardConfig } from '#guards';
import { initialConfig, nextSV } from '#states';
import { _any, isDefined, switchV, toArray } from '@bemedev/app-utils-bemedev';
import equal from 'fast-deep-equal';
import type { CommonChildFunction2 } from '#common/machine';
import type { Contract } from '@bemedev/app-contract';
import { recompose } from '@bemedev/decompose';
import { byKey2, merge2 } from '@bemedev/app-options/internal';
import type { AnyMachine, SimpleMachineOptions2 } from '@bemedev/app-plugins';
import { createScheduler } from '@bemedev/scheduler/sync';
import { CommonInterpreter } from '../../common/interpreter/interpreter';
import { createSubscriber } from '../../common/subscriber';
import type { SyncAddOptions_F } from '../machine';
import type { SyncMachine } from '../machine/machine';
import type { OptionsPlugin } from '@bemedev/app-options';

import { DEFAULT_MAX_SELF_TRANSITIONS, DEFAULT_MAX_TIME_PROMISE } from '#constants';

import type {
  AsyncEmitterFunction,
  ChildConfig,
  EmitterConfig,
  FinallyConfig,
  WithDescriber,
  TransitionConfig,
  AlwaysConfig,
  DelayedTransitions,
  EventArgObject,
  EventObject,
  ContractEvents,
} from '@bemedev/app-contract';

import {
  isDescriber,
  AFTER_EVENT,
  ALWAYS_EVENT,
} from '@bemedev/app-options/internal';

import type {
  _SyncSend_F,
  SyncPerformAction_F,
  SyncPerformPredicate_F,
  SyncPerformTransition_F,
  SyncPerformTransitions_F,
  SyncProvideMachineOptions_F,
} from './options.types';

import type { ExecuteActivity_F, InterpretArgs, Mode } from '#common/interpreter';

import type {
  AddSubscriber_F,
  AnyInterpreter,
} from '../../common/interpreter/types';

/**
 * The class {@linkcode SyncInterpreter} is responsible for interpreting and managing the state of a synchronous machine.
 * It provides methods to start, stop, pause, and resume the machine, as well as to send events
 * and subscribe to state changes.
 *
 * The class is parameterized by a contract: every member type is read from it
 * instead of being declared independently. The second parameter `L` is not part
 * of the contract: it accumulates the options of chained `provideOptions`
 * calls.
 *
 * @template | {@linkcode Contract} `Ct` - Contract describing the machine.
 * @template | {@linkcode SimpleMachineOptions2} `L` - Accumulated options.
 */
export class SyncInterpreter<
  const Ct extends Contract = Contract,
  const L extends SimpleMachineOptions2 = SimpleMachineOptions2,
  const Ps extends readonly OptionsPlugin<any, any>[] = [],
> extends CommonInterpreter<Ct> {
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
    return super.machine as SyncMachine<Ct, L, Ps>;
  }

  /**
   * Creates a new class {@linkcode SyncInterpreter} instance with the same initial configuration as this instance.
   *
   * @returns A new instance of class {@linkcode SyncInterpreter}.
   */
  get renew() {
    const out = new SyncInterpreter<Ct, L, Ps>(this.machine, this.__mode);
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
   */
  constructor(machine: AnyMachine<Ct>, mode: Mode = 'strict') {
    super(machine, mode);
    this.__initSchedulers();
    this.__performConfig(true);
  }

  /**
   * Forces transition to perform inner actions despite the current state.
   * This is useful for sending events that are not part of the current state transitions.
   *
   * @param forceSend - The optional event payload of type {@linkcode EventArgObject} to force send.
   */
  protected __performForceSendAction = (
    forceSend?: EventArgObject<ContractEvents<Ct>>,
  ) => {
    if (!forceSend) return;
    const values = Object.values(this.machine.flat);

    for (const { on } of values) {
      const type = eventToType(forceSend);
      const transitions = toArray.typed(on?.[type]);
      this.__performTransitions(...(transitions as any));
    }
  };

  /**
   * Executes extended actions such as sending events, activity management, and handling forced or resent events.
   *
   * @param params - The parameters of type {@linkcode ExtendedActionsParams}.
   *
   * @returns The result of performing forced send or resend actions.
   */
  protected __performsExtendedActions = ({
    forceSend,
    resend,
    pauseActivity,
    resumeActivity,
    stopActivity,
    sentEvent,
  }: ExtendedActionsParams<Ct>) => {
    this.__performSendToAction(sentEvent);
    this.__performPauseActivityAction(pauseActivity);
    this.__performResumeActivityAction(resumeActivity);
    this.__performStopActivityAction(stopActivity);

    // ForceSendAction returns the result to make further actions
    const result =
      this.__performForceSendAction(forceSend) ?? this.__performResendAction(resend);

    return result;
  };

  /**
   * Executes a single synchronous action, updating context and running extended actions.
   *
   * @param action - The action function to execute.
   *
   * @see -- type {@linkcode SyncPerformAction_F}
   */
  protected __executeAction: SyncPerformAction_F<Ct> = action => {
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
   * @param predicate - The predicate function to evaluate.
   *
   * @returns `true` if the predicate condition is met, `false` otherwise.
   *
   * @see -- type {@linkcode SyncPerformPredicate_F}
   */
  private __performPredicate: SyncPerformPredicate_F<Ct> = predicate => {
    this._iterate();
    return predicate(this.__cloneState);
  };

  /**
   * Executes a predicate function while managing the status of the interpreter.
   *
   * @param predicate - The predicate function to execute.
   *
   * @returns `true` if the predicate condition is met, `false` otherwise.
   *
   * @see -- type {@linkcode SyncPerformPredicate_F}
   */
  private __executePredicate: SyncPerformPredicate_F<Ct> = predicate => {
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
   * @param transition - The transition target string or configuration to perform.
   *
   * @returns The target state path string if the transition succeeded, or `false` if it failed.
   *
   * @see -- type {@linkcode SyncPerformTransition_F}
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
      this.__performActions(...toArray<WithDescriber>(actions));
      this.__performActions(...toArray.typed(diffEntries));
      return target ?? false;
    }
    return false;
  };

  /**
   * Performs the first valid transition from a list of transition configurations.
   *
   * @param transitions - The transition configurations to try in order.
   *
   * @returns The target state path string if a transition succeeded, or `false` otherwise.
   *
   * @see -- type {@linkcode SyncPerformTransitions_F}
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
          this.__changeEventInternal(`${from}/${AFTER_EVENT}`);

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
   * Builds the callback executed on every pass of an activity interval.
   *
   * Each activity is either an action name, a describer, or a definition whose
   * guards are checked before its actions run.
   *
   * @param _ - The origin state path string, unused by the synchronous
   * interpreter.
   * @param activities - The activity definitions to run on each pass.
   *
   * @returns The callback performing the actions on each pass.
   *
   * @see -- type {@linkcode ExecuteActivity_F}
   */
  __executeActivity: ExecuteActivity_F = (_, activities) => {
    const callback = () => {
      for (const activity of activities) {
        const check2 = typeof activity === 'string';
        const check3 = isDescriber(activity);
        const check4 = check2 || check3;

        if (check4) {
          this.__performActions(activity);
          continue;
        }

        const check5 = this.__performPredicates(...toArray.typed(activity.guards));

        if (check5) {
          const actions = toArray.typed(activity.actions);
          this.__performActions(...actions);
        }
      }

      this.__flush();
    };

    return callback;
  };

  /**
   * Performs `always` (transitional) logic for a state node configuration.
   *
   * @param from - The state path originating the `always` transition.
   * @param alway - The `always` transition configuration of type {@linkcode AlwaysConfig}.
   *
   * @returns The target state path string if successful, or `false` otherwise.
   */
  private __performAlways = (from: string, alway: AlwaysConfig) => {
    this.__changeEventInternal(`${from}/${ALWAYS_EVENT}`);
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
      emitterFn: AsyncEmitterFunction<Ct>;
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
   * @param helper - The options provider callback.
   *
   * @returns The interpreter instance with updated options.
   *
   * @see -- type {@linkcode SyncAddOptions_F}
   */
  addOptions: SyncAddOptions_F<Ct, L, Ps> = helper => {
    return super.addOptions(helper) as any;
  };

  /**
   * Provides options for the interpreter and returns a new interpreter instance.
   *
   * @param option - A function that provides options for the machine.
   *
   * @returns A new interpreter instance with the provided options applied.
   *
   * @see -- type {@linkcode SyncProvideMachineOptions_F}
   */
  provideOptions: SyncProvideMachineOptions_F<Ct, L, Ps> = option => {
    return super.provideOptions(option) as any;
  };

  /**
   * Subscribes a listener to state and context updates of this interpreter.
   *
   * @param _subscriber - The subscriber callback function.
   * @param options - Subscription configuration options.
   *
   * @returns The created subscriber object, or the existing one with the same id.
   *
   * @see -- type {@linkcode AddSubscriber_F}
   */
  subscribe: AddSubscriber_F<Ct> = (_subscriber, options) => {
    const events = this.machine.eventsList;
    const id = options?.id;
    const find = id
      ? Array.from(this.__subscribers).find(f => f.id === id)
      : undefined;
    if (find) return find;

    const subscriber = createSubscriber<Ct>(_subscriber, options, ...events);
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
  protected __presend: _SyncSend_F<Ct> = event => {
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
   * @template `T` - The event type string extending `ContractEvents<Ct>['type']`.
   *
   * @param type - The event type string.
   *
   * @returns A function that accepts payload data and sends the event.
   */
  sender = <const T extends ContractEvents<Ct>['type']>(type: T) => {
    return (...data: ExtractSender<ContractEvents<Ct>, T>) => {
      const payload = data.length === 1 ? data[0] : {};
      const event = { type, payload } as unknown as EventArgObject<
        ContractEvents<Ct>
      >;
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
  protected __send = (_event: EventArgObject<ContractEvents<Ct>>) => {
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
    type _Child = ChildConfig & { childFn: CommonChildFunction2<Ct>; id: string };

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
  private __executeChild = (child: CommonChildFunction2<Ct>) => {
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
 * Extracts the legacy options carried by a synchronous machine.
 *
 * @template | {@linkcode AnyMachine} `M` - Machine type carrying `__legacy`.
 */
type SyncLegacyOf<M> = M extends { __legacy: infer L extends SimpleMachineOptions2 }
  ? L
  : SimpleMachineOptions2;

/**
 * Extracts the options plugins carried by a synchronous machine.
 *
 * @template | {@linkcode AnyMachine} `M` - Machine type carrying `__plugins`.
 */
type SyncPluginsOf<M> = M extends {
  __plugins: infer Ps extends readonly OptionsPlugin<any, any>[];
}
  ? Ps
  : [];

/**
 * Infers the interface {@linkcode SyncInterpreter} type corresponding to a
 * given interface {@linkcode AnyMachine}.
 *
 * @template | {@linkcode AnyMachine} `M` - The machine type from which to infer
 * the interpreter type.
 */
export type SyncInterpreterFrom<M extends AnyMachine> = SyncInterpreter<
  M['__contract'],
  SyncLegacyOf<M>,
  SyncPluginsOf<M>
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
 * @param _args - The interpretation arguments including the machine, mode, context, and private context.
 *
 * @returns A new class {@linkcode SyncInterpreter} service instance.
 */
export const interpretSync: SyncInterpreter_F = (..._args) => {
  const [machine, args] = _args;
  const { mode, pContext, context } = _any(args);
  const out: any = new SyncInterpreter(machine, mode);
  out._providePrivateContext(pContext);
  out._provideContext(context);
  return out;
};
