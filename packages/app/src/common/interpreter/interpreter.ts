import {
  eventToType,
  INIT_EVENT,
  possibleEvents,
  transformEventArg,
  type ActorsConfigMap,
  type EventArgObject,
  type EventObject,
  type EventsMap,
  type ExtractSender,
} from '#events';
import { _any } from '@bemedev/app-utils-bemedev';

import { toAction, type WithDescriber } from '#actions';
import type { ChildConfig, EmitterConfig } from '#actor';
import { getTags, toChildSrc } from '#common/functions';
import { DEFAULT_DELIMITER, DEFAULT_MAX_SELF_TRANSITIONS } from '#constants';
import { toDelay } from '#delays';
import { toEmitterSrc } from '#emitters';
import { toPredicate, type GuardConfig } from '#guards';
import {
  flatMap,
  initialConfig,
  nextSV,
  nodeToValue,
  resolveNode,
  type ActivityConfig,
  type State,
  type StateExtended,
  type StateValue,
  type WorkingStatus,
} from '#states';
import type { AlwaysConfig, TransitionConfig } from '#transitions';
import {
  byKey2,
  decomposeSV,
  IS_TEST,
  isStringEmpty,
  merge2,
  reduceDescriber,
  replaceAll,
} from '#utils';
import type { AllowedNames } from '@bemedev/app-utils-bemedev';
import { isDefined, isPrimitive, toArray } from '@bemedev/app-utils-bemedev';
import { asyncfy } from '@bemedev/better-promise';
import {
  createInterval,
  createTimeout,
  type Interval2,
  type Timeout2,
} from '@bemedev/interval2';
import type { PrimitiveObject } from '@bemedev/typings';
import type { Fn, MachineType, Pausable } from '~types';
import {
  getEntries,
  getExits,
  type AnyMachine,
  type CommonConfig3,
  type CommonMachine,
  type ScheduledData,
  type SimpleMachineOptions2,
} from '../machine';
import { createSubscriber, type Subscriber } from '../subscriber';
import type {
  ActorsMapFrom,
  AddSubscriber_F,
  AllPathsFrom,
  AnyInterpreter,
  CollectedPausable,
  CommonCollectedService,
  ConfigFrom,
  ContextFrom,
  CreateInterval2_F,
  DiffNext,
  DirectMerge_F,
  EventsFrom,
  EventsMapFrom,
  ExecuteActivities_F,
  MachineOptionsFrom,
  Mode,
  PrivateContextFrom,
  Selector_F,
  SimpleScheduler,
  TagFrom,
} from './types';

/**
 * Abstract base class for state machine interpreters.
 *
 * Implements state management, event dispatching, subscriber notifications,
 * child actor spawning, activity scheduling, and lifecycle management.
 *
 * @template | {@linkcode CommonConfig3} `C` - Machine configuration type extending type {@linkcode CommonConfig3}.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type extending type {@linkcode PrimitiveObject}.
 * @template | {@linkcode EventsMap} `E` - Events map type extending type {@linkcode EventsMap}.
 * @template | {@linkcode ActorsConfigMap} `A` - Actors configuration map type extending type {@linkcode ActorsConfigMap}.
 * @template `Ta` - Tag type string.
 * @template | {@linkcode EventObject} `Eo` - Event object type extending interface {@linkcode EventObject}.
 * @template `AllPaths` - All paths type string.
 * @template | {@linkcode SimpleMachineOptions2} `Mo` - Machine options type extending type {@linkcode SimpleMachineOptions2}.
 */
export abstract class CommonInterpreter<
  const C extends CommonConfig3 = CommonConfig3,
  const Pc = any,
  const Tc extends PrimitiveObject = PrimitiveObject,
  const E extends EventsMap = EventsMap,
  const A extends ActorsConfigMap = ActorsConfigMap,
  const Ta extends string = string,
  const Eo extends EventObject = EventObject,
  const AllPaths extends string = string,
  const Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
>
  implements AnyInterpreter, Disposable, AsyncDisposable
{
  /**
   * The inner class {@linkcode CommonMachine} instance associated with this interpreter.
   */
  protected __machine!: CommonMachine<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>;

  /**
   * Accessor for the inner class {@linkcode CommonMachine} instance.
   *
   * @returns The class {@linkcode CommonMachine} instance.
   */
  get machine() {
    return this.__machine;
  }

  /**
   * The machine type classifier of type {@linkcode MachineType}.
   */
  abstract readonly TYPE: MachineType;

  /**
   * The current working status of this interpreter service of type {@linkcode WorkingStatus}.
   */
  private __status: WorkingStatus = 'idle';

  /**
   * Public accessor for the current working status of type {@linkcode WorkingStatus}.
   *
   * @returns The current status of type {@linkcode WorkingStatus}.
   */
  get status() {
    return this.__status;
  }

  /**
   * The active node configuration state of this interpreter service.
   */
  protected __config: any;

  /**
   * Public accessor for the active node configuration state.
   *
   * @returns The current node configuration object.
   */
  get config() {
    return this.__config;
  }

  /**
   * Flattened map representation of the state machine nodes.
   */
  private __flat!: Record<string, any>;

  /**
   * The current state value of this interpreter service of type {@linkcode StateValue}.
   */
  __value!: StateValue;

  /**
   * Public accessor for the current state value of type {@linkcode StateValue}.
   *
   * @returns The current state value of type {@linkcode StateValue}.
   */
  get value() {
    return this.__value;
  }

  /**
   * The execution mode of this interpreter service of type {@linkcode Mode}.
   */
  protected __mode!: Mode;

  /**
   * The initial node resolved from the machine configuration.
   */
  private readonly __initialNode: any;

  /**
   * Public accessor for the initial resolved node.
   *
   * @returns The initial node instance.
   */
  get initialNode() {
    return this.__initialNode;
  }

  /**
   * The current resolved state node instance.
   */
  private __node!: any;

  /**
   * Public accessor for the current resolved state node instance.
   *
   * @returns The current state node instance.
   */
  get node() {
    return this.__node;
  }

  /**
   * Internal step iterator count tracking transition operations performed by this interpreter.
   */
  private __iterator = 0;

  /**
   * The active event object currently processed by this interpreter service.
   */
  private __event: Eo = transformEventArg(INIT_EVENT);

  /**
   * The initial node configuration of the state machine.
   */
  protected readonly __initialConfig: any;

  /**
   * Public accessor for the initial node configuration of the state machine.
   *
   * @returns The initial node configuration object.
   */
  get initialConfig() {
    return this.__initialConfig;
  }

  /**
   * Public accessor for the initial state value of the inner class {@linkcode CommonMachine}.
   *
   * @returns The initial state value of type {@linkcode StateValue}.
   */
  get initialValue() {
    return this.__machine.initialValue;
  }

  /**
   * The initial private context snapshot of type `Pc`.
   */
  protected __initialPpc!: Pc;

  /**
   * The initial public context snapshot of type `Tc`.
   */
  protected __initialContext!: Tc;

  /**
   * The active private context state of type `Pc`.
   */
  protected __pContext!: Pc;

  /**
   * The active public context state of type `Tc`.
   */
  protected __context!: Tc;

  /**
   * Public accessor for the current public context of type `Tc`.
   *
   * @returns The active context object of type `Tc`.
   */
  get context() {
    return this.__context;
  }

  /**
   * The active public state object of type {@linkcode State}.
   */
  protected __state!: State<Eo, Tc, Ta>;

  /**
   * Flag indicating whether an event has been dispatched during execution.
   */
  protected __sent = false;

  /**
   * Flag indicating whether precise interval timing is enabled for activity schedulers.
   */
  protected __exact!: boolean;

  /**
   * Public accessor for all collected child interpreter services.
   *
   * @returns An array of collected child services of type {@linkcode CommonCollectedService}.
   */
  get children() {
    return this.__collectedChildren;
  }

  /**
   * Retrieves a spawned child interpreter service by its identifier.
   *
   * @param id - The unique identifier of the target child service.
   *
   * @returns The child service object of type {@linkcode CommonCollectedService}, or `undefined` if not found.
   *
   * @see {@linkcode children}
   */
  getChildAt = (id: string) => this.children.find(f => f.id === id);

  /**
   * Alias for method {@linkcode CommonInterpreter.getChildAt}.
   */
  at = this.getChildAt;

  /**
   * Checks whether a state path string is active within the current state value.
   *
   * @param value - The state path string to test.
   *
   * @returns `true` if the state path is active; otherwise, `false`.
   */
  protected __isInsideValue = (value: string) => {
    const out = this.__isInsideValue2(this.__value, value);
    return out;
  };

  /**
   * Evaluates if a given state path is active within a specific state value of type {@linkcode StateValue}.
   *
   * @param sv - The state value structure of type {@linkcode StateValue}.
   * @param value - The state path string to evaluate.
   *
   * @returns `true` if the value is active within the state value; otherwise, `false`.
   */
  protected __isInsideValue2 = (sv: StateValue, value: string) => {
    if (value === DEFAULT_DELIMITER) {
      return true;
    }
    const values = decomposeSV(sv);
    const entry = value.substring(1);
    const state = replaceAll({ entry, match: DEFAULT_DELIMITER, replacement: '.' });

    return values.includes(state);
  };

  /**
   * Scheduler instance of type {@linkcode SimpleScheduler} managing state value update timing.
   */
  protected __schedulerValue!: SimpleScheduler;

  /**
   * Scheduler instance of type {@linkcode SimpleScheduler} managing context mutation batching.
   */
  protected __schedulerContexts!: SimpleScheduler;

  /**
   * Scheduler instance of type {@linkcode SimpleScheduler} managing event handling queues.
   */
  protected __schedulerEvent!: SimpleScheduler;

  /**
   * Scheduler instance of type {@linkcode SimpleScheduler} managing working status transitions.
   */
  protected __schedulerStatus!: SimpleScheduler;

  /**
   * Optional unique identifier for this interpreter instance.
   */
  id?: string;

  /**
   * Optional parent state node path that spawned this interpreter.
   */
  from?: string;

  /**
   * Accessor for the execution mode of this interpreter of type {@linkcode Mode}.
   *
   * @returns The current mode of type {@linkcode Mode}.
   */
  get mode() {
    return this.__mode;
  }

  /**
   * Accessor for private context, intended solely for test inspection.
   *
   * @deprecated Use for testing only. Returns `undefined` in production.
   *
   * @returns The active private context object of type `Pc`, or `undefined` in production.
   *
   * @see {@linkcode context}
   */
  get _pContext() {
    /* v8 ignore else -- @preserve */
    if (IS_TEST()) {
      return this.__pContext;
    }

    /* v8 ignore start -- @preserve */
    console.error('pContext is not available in production');
    return;
    /* v8 ignore stop -- @preserve */
  }

  /**
   * Indicates whether the interpreter has started and is currently operational.
   *
   * @returns `true` if the working status is neither `'idle'` nor `'stopped'` nor `'starting'`; otherwise, `false`.
   */
  get isReady() {
    return (
      this.__status !== 'idle' &&
      this.__status !== 'stopped' &&
      this.__status !== 'starting'
    );
  }

  /**
   * Selects a value from the public context using a key path string.
   *
   * @returns A selector function of type {@linkcode Selector_F}.
   *
   * Remarks : only th
   *
   * @see {@linkcode byKey2}
   */
  get select(): Selector_F<Tc> {
    const check = isPrimitive(this.__context);
    if (check) return undefined as any;
    const out = (path: string) => byKey2.low(this.__state.context, path);
    return out as any;
  }

  /**
   * Selects a value from the private context using a key path string.
   *
   * @deprecated Use for testing only. Returns `undefined` in production.
   *
   * @returns A selector function of type {@linkcode Selector_F}.
   *
   * @see {@linkcode byKey2}
   */
  get _pSelect(): Selector_F<Pc> {
    /* v8 ignore else -- @preserve */
    if (IS_TEST()) {
      const check = this.isReady && isPrimitive(this.__pContext);
      const pContext = this.__pContext;
      if (check) return undefined as any;

      /* v8 ignore else -- @preserve */
      if (pContext) {
        const out: any = (path: string) => byKey2.low(pContext, path);
        return out as any;
      }
    }

    /* v8 ignore start -- @preserve */
    console.error('pContext is not available in production');
    return undefined as any;
    /* v8 ignore stop -- @preserve */
  }

  /**
   * Accessor for the current event object of type `Eo`.
   *
   * @deprecated Intended primarily for type inference and debugging.
   *
   * @returns The active event object.
   */
  get event() {
    return this.__event;
  }

  /**
   * Accessor for the events map of type {@linkcode EventsMap} from the inner class {@linkcode CommonMachine}.
   *
   * @returns The events map object of type {@linkcode EventsMap}.
   */
  get eventsMap() {
    return this.__machine.eventsMap;
  }

  /**
   * Accessor for the array of event names supported by the inner class {@linkcode CommonMachine}.
   *
   * @returns An array of event type strings.
   */
  get eventsList() {
    return this.__machine.eventsList;
  }

  /**
   * Accessor for the active state tags of type `Ta[]`.
   *
   * @returns An array of active state tag strings.
   */
  get tags() {
    return getTags<Ta>(this.__config);
  }

  /**
   * Initializes a new class {@linkcode CommonInterpreter} instance.
   *
   * @param machine - The state machine instance of interface {@linkcode AnyMachine}.
   * @param mode - The execution mode of type {@linkcode Mode}. Defaults to `'strict'`.
   * @param exact - Whether to use exact timer intervals. Defaults to `true`.
   */
  constructor(
    machine: AnyMachine<E, A, Pc, Tc>,
    mode: Mode = 'strict',
    exact = true,
  ) {
    this.__init(machine.renew, mode, exact);
    this.__initialConfig = this.__machine.initialConfig;
    this.__initialNode = this.__resolveNode(this.__initialConfig);
  }

  /**
   * Internal initialization helper configuring state machine reference and structures.
   *
   * @param machine - The state machine instance of interface {@linkcode AnyMachine}.
   * @param mode - The execution mode of type {@linkcode Mode}.
   * @param exact - Whether exact timer intervals are configured.
   */
  private __init = (
    machine: AnyMachine<E, A, Pc, Tc>,
    mode: Mode = 'strict',
    exact = true,
  ) => {
    this.__machine = machine.renew;
    this.__config = this.__machine.initialConfig;
    this.__mode = mode;
    this.__exact = exact;

    this.__state = {
      status: this.__status,
      context: this.__context,
      event: { type: INIT_EVENT, payload: {} } as any,
      value: this.__value,
      tags: toArray.typed(this.tags),
    };

    this.__collectEmitterConfigs();
    this.__collectChildrenConfig();
    this.__throwing();
  };

  /**
   * Resets the interpreter to its initial state without pausing or stopping background operations.
   */
  softReset = () => {
    this.__value = nodeToValue(this.__initialConfig);
    this.__context = this.__initialContext;
    this.__pContext = this.__initialPpc;
    this.__init(this.__machine, this.__mode, this.__exact);
    this.__flush();
  };

  /**
   * Resets the interpreter to its initial state and pauses all running activities and timers.
   */
  reset = () => {
    this.softReset();
    this.pause();
  };

  /**
   * Schedules a change to the current active event.
   *
   * @param event - The new event object of type `Eo`.
   *
   * @returns The scheduled task result.
   */
  protected __changeEvent = (event: Eo) => {
    const cb = () => {
      this.__performStates({ event });
      this.__event = event;
    };

    return this.__schedulerEvent.schedule(cb, this.__sent);
  };

  /**
   * Abstract method performing state transitions based on active events.
   */
  protected abstract __performTransitions: Fn;

  /**
   * Accessor collecting always (eventless) transition configurations across active nodes.
   *
   * @returns An array of tuples containing state paths and always configurations.
   */
  protected get __collectedAlways() {
    const entriesFlat = Object.entries(this.__flat);

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
   * Accessor collecting activity configurations across active state nodes.
   *
   * @returns An array of tuples containing state paths and activity configurations of type {@linkcode ActivityConfig}.
   */
  private get __collectedActivities() {
    const entriesFlat = Object.entries(this.__flat);

    const entries: [from: string, activities: ActivityConfig][] = [];

    entriesFlat.forEach(([from, { activities }]) => {
      if (activities) {
        entries.push([from, activities]);
      }
    });

    return entries;
  }

  /**
   * Accessor filtering and gathering active intervals matching current state activities.
   *
   * @returns An array of active interval instances of type {@linkcode Interval2}, or `undefined`.
   */
  private get __currentActivities() {
    const collected = this.__collectedActivities.filter(([from]) =>
      this.__isInsideValue(from),
    );
    const check = collected.length < 1;
    if (check) return;

    const ids: string[] = [];
    for (const args of collected) {
      ids.push(...this.__executeActivities(...args));
    }

    return this.__cachedIntervals.filter(({ id }) => ids.includes(id));
  }

  /**
   * Triggers the start of all active state activities.
   */
  private __performActivities = () => {
    return this.__currentActivities?.forEach(this.__start);
  };

  /**
   * Pauses all currently active interval activities.
   */
  private __pauseAllActivities = () => {
    this.__cachedIntervals.forEach(this.__pause);
  };

  /**
   * Counter tracking consecutive self-transitions to prevent infinite loop recursion.
   */
  protected __selfTransitionsCounter = 0;

  /**
   * Collection of pausable actor metadata objects of type {@linkcode CollectedPausable}.
   */
  protected __collectedPausables: CollectedPausable[] = [];

  /**
   * Abstract method responsible for gathering pausable emitters and services from active state nodes.
   *
   * @returns An array of pausable item structures.
   */
  protected abstract __collectPausables: () => {
    pausable: Pausable;
    id: string;
    from: string;
  }[];

  /**
   * Starts execution for all collected pausable emitters.
   */
  private __startPausables = () => {
    this.__collectedPausables.forEach(({ pausable }) => pausable.start());
  };

  /**
   * Resumes execution for collected pausable emitters matching the filter predicate.
   *
   * @param filter - Predicate function filtering pausable items.
   */
  private __resumePausables = (
    filter: (value: CollectedPausable) => boolean = () => true,
  ) => {
    this.__collectedPausables
      .filter(filter)
      .forEach(({ pausable }) => pausable.resume());
  };

  /**
   * Stops execution and removes collected pausable emitters matching the filter predicate.
   *
   * @param filter - Predicate function filtering pausable items.
   */
  private __stopPausables = (
    filter: Parameters<Array<CollectedPausable>['filter']>[0] = () => true,
  ) => {
    this.__collectedPausables.filter(filter).forEach(({ pausable, id }) => {
      pausable.stop();
      this.__collectedPausables = this.__collectedPausables.filter(f => f.id !== id);
    });
  };

  /**
   * Pauses execution for collected pausable emitters matching the filter predicate.
   *
   * @param filter - Predicate function filtering pausable items.
   */
  private __pausePausables = (
    filter: (value: CollectedPausable) => boolean = () => true,
  ) => {
    this.__collectedPausables
      .filter(filter)
      .forEach(({ pausable }) => pausable.pause());
  };

  /**
   * Abstract storage map tracking initial self-transitions.
   */
  protected abstract __collectedSelfTransitions0: Map<string, any>;

  /**
   * Abstract storage tracking active self-transition definitions.
   */
  protected abstract __collectedSelfTransitions: any;

  /**
   * Collected emitter configurations grouped by state node origin path.
   */
  protected __collectedEmitterConfigs: [
    from: string,
    ...emitters: (EmitterConfig & { id: string })[],
  ][] = [];

  /**
   * Collects emitter configurations defined across machine state nodes.
   *
   * @returns The array of collected emitter configuration entries.
   */
  private __collectEmitterConfigs = () => {
    const entriesFlat = Object.entries<any>(this.__machine.flat);
    const entries: [
      from: string,
      ...emitters: (EmitterConfig & { id: string })[],
    ][] = [];

    entriesFlat.forEach(([from, node]) => {
      const actors = Object.entries(node.actors ?? {});
      const emitters = toArray<any>(actors)
        .map(([id, actor]) => ({ ...actor, id }))
        .filter(actor => 'next' in actor);
      if (node.actors) {
        entries.push([from, ...emitters]);
      }
    });

    this.__collectedEmitterConfigs.push(...entries);
    return entries;
  };

  /**
   * Collected child machine configurations grouped by state node origin path.
   */
  protected __collectedChildrenConfig: [
    from: string,
    ...children: (ChildConfig & { id: string })[],
  ][] = [];

  /**
   * Collects child machine configurations defined across state nodes.
   *
   * @returns The array of collected child configuration entries.
   */
  private __collectChildrenConfig = () => {
    const entriesFlat = Object.entries<any>(this.__machine.flat);
    const entries: [from: string, ...children: (ChildConfig & { id: string })[]][] =
      [];

    entriesFlat.forEach(([from, node]) => {
      const actors = Object.entries(node.actors ?? {});
      const chidlren = toArray<any>(actors)
        .map(([id, actor]) => ({ ...actor, id }))
        .filter(actor => 'on' in actor || 'contexts' in actor);
      if (node.actors) {
        entries.push([from, ...chidlren]);
      }
    });

    this.__collectedChildrenConfig.push(...entries);
    return entries;
  };

  /**
   * Array of active child service instances of type {@linkcode CommonCollectedService}.
   */
  protected __collectedChildren: CommonCollectedService[] = [];

  /**
   * Abstract method executing self-transitions for active state nodes.
   */
  protected abstract __performSelfTransitions: () => any;

  /**
   * Abstract method executing action describer functions.
   */
  protected abstract __performActions: Fn;

  /**
   * Triggers entry actions defined on the initial state configuration.
   *
   * @returns The result of performing initial entry actions.
   */
  protected __startInitialEntries = () => {
    const actions = getEntries(this.__initialConfig);
    if (actions.length < 1) return;
    return this.__performActions(...actions);
  };

  /**
   * Creates a method invoking mapper function for objects of type `T`.
   *
   * @template `T` - Target object type.
   *
   * @param key - The method name key of type {@linkcode AllowedNames}.
   *
   * @returns A function invoking the named method on the target object.
   *
   * @deprecated Internal helper function.
   */
  private __mapperFn = <T>(key: AllowedNames<T, Fn>) => {
    return (value: T) => (value as any)[key]();
  };

  /** Helper invoking method `pause` on a target object. */
  private __pause = this.__mapperFn('pause');

  /** Helper invoking method `open` on a target object. */
  private __open = this.__mapperFn('open');

  /** Helper invoking method `start` on a target object. */
  private __start = this.__mapperFn('start');

  /** Helper invoking method `close` on a target object. */
  private __close = this.__mapperFn('close');

  /** Helper invoking method `resume` on a target object. */
  private __resume = this.__mapperFn('resume');

  /** Helper invoking method `unsubscribe` on a target object. */
  private __unsubscribe = this.__mapperFn('unsubscribe');

  /** Helper invoking method `stop` on a target object. */
  private __stop = this.__mapperFn('stop');

  /** Helper invoking method `dispose` on a target object. */
  private __dispose = this.__mapperFn('dispose');

  /**
   * Set of public subscribers attached to this interpreter of type {@linkcode Subscriber}.
   */
  protected __subscribers = new Set<Subscriber<Tc, Ta, Eo>>();

  /**
   * Set of internal subscribers attached to this interpreter of type {@linkcode Subscriber}.
   */
  private __innerSubscribers = new Set<Subscriber<Tc, Ta, Eo>>();

  /**
   * Flushes and notifies all registered subscribers with the current state.
   */
  protected __flush = () => {
    const all = [...this.__innerSubscribers, ...this.__subscribers];
    all.forEach(({ fn }) => fn(this.__state));
  };

  /**
   * Array of active timer instances of type {@linkcode Timeout2} scheduled for action execution.
   */
  protected __timeoutActions: Timeout2[] = [];

  /**
   * Starts execution of all spawned child services.
   */
  private __startChildren = () => {
    this.__collectedChildren.forEach(({ service }) => {
      service.start();
    });
  };

  /**
   * Pauses execution of spawned child services matching the filter predicate.
   *
   * @param filter - Predicate filtering child service entries.
   */
  private __pauseChildren = (
    filter: Parameters<Array<CommonCollectedService>['filter']>[0] = () => true,
  ) => {
    this.__collectedChildren
      .filter(filter)
      .forEach(({ service }) => service.pause());
  };

  /**
   * Stops and disposes spawned child services matching the filter predicate.
   *
   * @param filter - Predicate filtering child service entries.
   */
  private __stopChildren = (
    filter: Parameters<Array<CommonCollectedService>['filter']>[0] = () => true,
  ) => {
    this.__collectedChildren.filter(filter).forEach(({ service, id }) => {
      service.stop();

      this.__collectedChildren
        .filter(f => f.id === id)
        .forEach(({ service }) => service.dispose());

      this.__collectedChildren = this.__collectedChildren.filter(f => f.id !== id);
    });
  };

  /**
   * Resumes execution of spawned child services matching the filter predicate.
   *
   * @param filter - Predicate filtering child service entries.
   */
  private __resumeChildren = (
    filter: Parameters<Array<CommonCollectedService>['filter']>[0] = () => true,
  ) => {
    this.__collectedChildren
      .filter(filter)
      .forEach(({ service }) => service.resume());
  };

  /**
   * Abstract property returning a new interpreter instance initialized with identical state parameters.
   */
  abstract renew: any;

  /**
   * Formats an iterable of log messages into a single newline-separated string.
   *
   * @param messages - An iterable of log message strings.
   *
   * @returns Formatted newline-delimited message string.
   */
  private __displayConsole = (messages: Iterable<string>) => {
    return Array.from(messages).join('\n');
  };

  /**
   * Handles collected warnings and errors according to the current execution mode of type {@linkcode Mode}.
   *
   * @throws type {@linkcode Error} Throws an error in `'strict'` mode if errors are present.
   */
  protected __throwing = () => {
    if (this.__mode === 'strict') {
      const check1 = this.__warningsCollector.size > 0;
      if (check1) {
        const warnings = this.__displayConsole(this.__warningsCollector);
        console.log(warnings);
      }

      const check2 = this.__errorsCollector.size > 0;
      if (check2) {
        const errors = this.__displayConsole(this.__errorsCollector);
        throw new Error(errors);
      }
    } else {
      const check3 = this.__errorsCollector.size > 0;
      if (check3) {
        const errors = this.__displayConsole(this.__errorsCollector);
        console.error(errors);
      }

      const check4 = this.__warningsCollector.size > 0;
      if (check4) {
        const warnings = this.__displayConsole(this.__warningsCollector);
        console.log(warnings);
      }
    }
  };

  /**
   * Starts the interpreter service, initializing children, pausable services, and entry actions.
   */
  start = () => {
    this.__setStatus('starting');
    this.__collectChildren();
    this.__collectPausables();
    this.__throwing();
    this.__setStatus('started');
    this.__startPausables();
    this.__flush();
    this.__startInitialEntries();
    this.__startChildren();
    this.__throwing();
    this._next();
  };

  /**
   * Merges partial state updates into the current state and triggers subscriber notifications.
   */
  protected __performStates = (parts?: Partial<State<Eo, Tc, Ta>>) => {
    this.__state = { ...this.__state, ...parts };
    this.__flush();
  };

  /**
   * Schedules an update to the interpreter working status of type {@linkcode WorkingStatus}.
   *
   * @param status - Target working status of type {@linkcode WorkingStatus}.
   *
   * @returns Scheduled status update result.
   */
  protected __setStatus = (status: WorkingStatus) => {
    const cb = () => {
      this.__performStates({ status });
      return (this.__status = status);
    };

    return this.__schedulerStatus.schedule(cb, this.__sent);
  };

  /**
   * Accessor collecting all scheduler instances of type {@linkcode SimpleScheduler}.
   *
   * @returns Array of scheduler instances.
   */
  private get __schedulers() {
    return [
      this.__schedulerValue,
      this.__schedulerContexts,
      this.__schedulerEvent,
      this.__schedulerStatus,
    ];
  }

  /**
   * Stops all internal scheduler instances.
   */
  private __stopSchedulers = () => {
    this.__schedulers.forEach(this.__stop);
  };

  /**
   * Pauses the interpreter, activities, timers, child services, and subscribers.
   */
  pause = () => {
    this.__setStatus('busy');
    this.__pauseAllActivities();
    this.__pauseChildren();
    this.__pausePausables();
    this.__timeoutActions.forEach(this.__pause);
    this.__setStatus('paused');
    this.__subscribers.forEach(this.__close);
  };

  /**
   * Resumes the interpreter from a paused state, restarting activities and subscribers.
   */
  resume = () => {
    if (this.__status === 'paused') {
      this.__performActivities();
      this.__setStatus('busy');
      this.__subscribers.forEach(this.__open);
      this.__timeoutActions.forEach(this.__resume);
      this.__resumeChildren();
      this.__resumePausables();
      this.__setStatus('working');
    }
  };

  /**
   * Stops the interpreter service and cleans up all active timers, child services, and subscribers.
   */
  stop = () => {
    this.__setStatus('busy');
    this.__pauseAllActivities();
    this.__cachedIntervals.forEach(this.__dispose);
    this.__timeoutActions.forEach(this.__dispose);
    this.__stopPausables();
    this.__stopChildren();
    this.__setStatus('stopped');
    this.__subscribers.forEach(this.__close);
    this.__subscribers.forEach(this.__unsubscribe);
    this.__stopSchedulers();
  };

  /**
   * Provides custom initial context to the inner machine.
   *
   * @deprecated Internal method.
   *
   * @param context - The context object of type `Tc`.
   *
   * @returns The updated inner machine instance.
   */
  _provideContext = (context: Tc) => {
    this.__initialContext = this.__context = context;
    this.__performStates({ context });
    this.__machine.addContext(this.__initialContext);
    return this.__machine;
  };

  /**
   * Configures additional machine options on the current interpreter instance.
   *
   * @param helper - Option provider callback function of type {@linkcode Fn}.
   *
   * @returns Updated machine options structure.
   */
  addOptions(helper: Fn) {
    this.__machine = this.__machine.provideOptions(helper);
    return this.__machine.options;
  }

  /**
   * Creates a renewed interpreter instance with custom machine options applied.
   *
   * @param helper - Option provider callback function of type {@linkcode Fn}.
   *
   * @returns A new interpreter instance.
   */
  provideOptions(helper: Fn) {
    const out = this.renew;
    out.addOptions(helper);
    return out as any;
  }

  /**
   * Subscribes a listener to state changes of this interpreter.
   *
   * @param _subscriber - Subscriber callback function.
   * @param options - Subscription configuration options.
   *
   * @returns A subscriber object of type {@linkcode Subscriber}.
   */
  subscribe: AddSubscriber_F<Tc, Ta, Eo> = (_subscriber, options) => {
    const events = this.__machine.eventsList;
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
   * Subscribes an internal listener to state changes.
   *
   * @param _subscriber - Subscriber callback function.
   * @param options - Subscription configuration options.
   *
   * @returns A subscriber object of type {@linkcode Subscriber}.
   */
  // @ts-expect-error Already used recursively
  private __subscribe: AddSubscriber_F<Tc, Ta, Eo> = (_subscriber, options) => {
    const events = this.__machine.eventsList;
    const subscriber = createSubscriber(_subscriber, options, ...events);
    this.__innerSubscribers.add(subscriber as any);
    return subscriber as any;
  };

  /**
   * Public accessor for a deep-cloned immutable snapshot of the current state.
   *
   * @returns Immutable snapshot object of type {@linkcode State}.
   */
  get state() {
    return Object.freeze(structuredClone(this.__state));
  }

  /** Collector set containing internal error strings. */
  private __errorsCollector = new Set<string>();

  /** Collector set containing internal warning strings. */
  private __warningsCollector = new Set<string>();

  /**
   * Accessor for collected error strings, intended for testing.
   *
   * @deprecated Use for testing only. Returns `undefined` in production.
   *
   * @returns Collector set of error strings, or `undefined` in production.
   */
  get _errorsCollector() {
    /* v8 ignore else -- @preserve */
    if (IS_TEST()) {
      return this.__errorsCollector;
    }

    /* v8 ignore start -- @preserve */
    console.error('errorsCollector is not available in production');
    return;
    /* v8 ignore stop -- @preserve */
  }

  /**
   * Accessor for collected warning strings, intended for testing.
   *
   * @deprecated Use for testing only. Returns `undefined` in production.
   *
   * @returns Collector set of warning strings, or `undefined` in production.
   */
  get _warningsCollector() {
    /* v8 ignore else -- @preserve */
    if (IS_TEST()) {
      return this.__warningsCollector;
    }
    /* v8 ignore start -- @preserve */
    console.error('warningsCollector is not available in production');
    return;
    /* v8 ignore stop -- @preserve */
  }

  /**
   * Records internal error messages into the error collector.
   *
   * @param errors - Error message strings to record.
   */
  protected _addError = (...errors: string[]) => {
    errors.forEach(error => this.__errorsCollector.add(error));
  };

  /**
   * Records internal warning messages into the warning collector.
   *
   * @param warnings - Warning message strings to record.
   */
  protected _addWarning = (...warnings: string[]) => {
    warnings.forEach(warning => this.__warningsCollector.add(warning));
  };

  /**
   * Extracts valid transition definitions matching a given event.
   *
   * @param event - Event object of type `Eo`.
   *
   * @returns Sorted array of state path and transition tuples.
   */
  protected __extractTransitions = (event: Eo) => {
    type FlatArray = [from: string, transitions: TransitionConfig[]][];
    const entriesFlat = Object.entries(this.__flat);
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

  /**
   * Abstract pre-send handler hook.
   */
  protected abstract __presend: Fn<[event: Eo], any>;

  /**
   * Accessor for all event types that can currently trigger state transitions.
   *
   * @returns Array of possible event type strings.
   */
  get possibleEvents() {
    return possibleEvents(this.__flat);
  }

  /**
   * Evaluates whether all specified event types are currently accepted.
   *
   * @param events - Array of event type strings.
   *
   * @returns `true` if all events can be performed; otherwise, `false`.
   */
  canEvents = (...events: Eo['type'][]) => {
    return events.every(event => this.possibleEvents.includes(event));
  };

  /**
   * Evaluates whether an event argument cannot be processed by the current state.
   *
   * @param _event - Event argument object of type {@linkcode EventArgObject}.
   *
   * @returns `true` if the event cannot be processed; otherwise, `false`.
   */
  private __cannotPerformEvents = (_event: EventArgObject<Eo>) => {
    const type = eventToType(_event);
    const check = !this.possibleEvents.includes(type);
    return check;
  };

  /**
   * Creates a curried event sender function for a specific event type.
   *
   * @template T - Event type string extending `Eo['type']`.
   *
   * @param type - Target event type string.
   *
   * @returns Function accepting payload data and sending the event.
   */
  sender = <const T extends Eo['type']>(type: T) => {
    return (...data: ExtractSender<Eo, T>) => {
      const payload = data.length === 1 ? data[0] : {};
      const event = { type, payload } as unknown as EventArgObject<Eo>;
      return this.send(event);
    };
  };

  /**
   * Resolves a state node instance from a node configuration object.
   *
   * @param config - Node configuration object.
   *
   * @returns Resolved state node instance.
   */
  private __resolveNode = (config: any) => {
    const options = this.__machine.options;
    const events = this.__machine.eventsList;

    return resolveNode<Pc, Tc, Ta, Eo>(config, options as any, ...events);
  };

  /**
   * Abstract method gathering child machine service configurations.
   */
  protected abstract __collectChildren: Fn;

  /**
   * Sets the execution mode of type {@linkcode Mode} to `'strict'`.
   */
  makeStrict = () => (this.__mode = 'strict' as Mode);

  /**
   * Sets the execution mode of type {@linkcode Mode} to `'normal'`.
   */
  makeNormal = () => (this.__mode = 'normal' as Mode);

  /**
   * Updates state value and node configuration after a state transition.
   */
  protected _performConfig = () => {
    const value = nodeToValue(this.__config as any);
    const cb = () => {
      this.__value = value;
      // this.__performStates({ value });
    };
    this.__schedulerValue.schedule(cb, this.__sent);
    this.__node = this.__resolveNode(this.__config);
    const configForFlat = _any(this.__config);
    this.__flat = flatMap.low(configForFlat, true);
  };

  /**
   * Calculates the proposed next state value for a target path without applying mutations.
   *
   * @param target - Target state path string.
   *
   * @returns Proposed state value of type {@linkcode StateValue}.
   */
  private __proposedNextSV = (target: string) => nextSV(this.__value, target);

  /**
   * Calculates the proposed next node configuration for a target path without applying mutations.
   *
   * @param target - Target state path string.
   *
   * @returns Proposed node configuration object.
   */
  protected proposedNextConfig = (target: string) => {
    const nextValue = this.__proposedNextSV(target);
    const out = this.__machine.valueToConfig(nextValue);
    return out;
  };

  /**
   * Pauses an activity by its identifier.
   *
   * @param id - Optional activity identifier.
   */
  protected __performPauseActivityAction = (id?: string) => {
    if (!id) return;
    this.__currentActivities?.filter(f => f.id === id).forEach(this.__pause);
  };

  /**
   * Resumes an activity by its identifier.
   *
   * @param id - Optional activity identifier.
   */
  protected __performResumeActivityAction = (id?: string) => {
    if (!id) return;
    this.__currentActivities?.filter(f => f.id === id).forEach(this.__resume);
  };

  /**
   * Stops an activity by its identifier.
   *
   * @param id - Optional activity identifier.
   */
  protected __performStopActivityAction = (id?: string) => {
    if (!id) return;
    this.__currentActivities?.filter(f => f.id === id).forEach(this.__dispose);
  };

  /**
   * Pauses a scheduled action timer by its identifier.
   *
   * @param id - Optional timer identifier.
   */
  protected __performPauseTimerAction = (id?: string) => {
    if (!id) return;
    this.__timeoutActions.filter(f => f.id === id).forEach(this.__pause);
  };

  /**
   * Resumes a paused action timer by its identifier.
   *
   * @param id - Optional timer identifier.
   */
  protected __performResumeTimerAction = (id?: string) => {
    if (!id) return;
    this.__timeoutActions.filter(f => f.id === id).forEach(this.__resume);
  };

  /**
   * Stops and disposes a scheduled action timer by its identifier.
   *
   * @param id - Optional timer identifier.
   */
  protected __performStopTimerAction = (id?: string) => {
    if (!id) return;
    this.__timeoutActions.filter(f => f.id === id).forEach(this.__dispose);
  };

  /**
   * Computes entry and exit action diffs for transitioning to a target state path.
   *
   * @param target - Optional target state path string.
   *
   * @returns Diff result object of type {@linkcode DiffNext}.
   */
  protected __diffNext = (target?: string): DiffNext => {
    if (!target) {
      return { sv: this.__value, diffEntries: [], diffExits: [] };
    }

    const next = initialConfig(this.proposedNextConfig(target));
    const flatNext = flatMap.low(next);

    const entriesCurrent = Object.entries(this.__flat);
    const keysNext = Object.keys(flatNext);

    const keys = entriesCurrent.map(([key]) => key);
    const diffEntries: WithDescriber[] = [];
    const diffExits: WithDescriber[] = [];

    // #region Entry actions

    // These actions are from next config states that are not inside the previous
    keysNext.forEach(key => {
      const check2 = !keys.includes(key);

      if (check2) {
        const out2 = (flatNext as any)[key];
        const _entries = getEntries(out2);
        diffEntries.push(..._entries);
      }
    });
    // #endregion

    // #region Exit actions

    // These actions are from previous config states that are not inside the next
    entriesCurrent.forEach(([key, node]) => {
      const check2 = !keysNext.includes(key);

      if (check2) {
        const _exits = getExits(node);
        diffExits.push(..._exits);
      }
    });
    // #endregion
    const sv = this.__proposedNextSV(target);
    return { sv, diffEntries, diffExits };
  };

  /**
   * Prepares interpreter state prior to executing a transition, running self-transitions and managing activity states.
   *
   * @returns Self-transition execution result.
   */
  protected __preNext = () => {
    const filter: Parameters<Array<{ from: string; id: string }>['filter']>[0] = (
      { from, id },
      _,
      all,
    ) => {
      const isOutside = !this.__isInsideValue(from);

      const hasSiblingsWithSameId = all
        .filter(val => val.from !== from)
        .map(({ id }) => id)
        .includes(id);

      const check1 = isOutside && hasSiblingsWithSameId;
      if (check1) return false;
      return isOutside;
    };

    this.__collectChildren();
    this.__collectPausables();
    this.__selfTransitionsCounter++;
    this.__pauseAllActivities();
    this.__performActivities();
    this.__stopPausables(filter);
    this.__pausePausables(({ from }) => this.__isInsideValue(from));
    this.__pauseChildren(({ from }) => this.__isInsideValue(from));
    this.__stopChildren(filter);
    this.__startChildren();
    this.__resumeChildren(({ from }) => !this.__isInsideValue(from));
    this.__startPausables();
    this.__resumePausables(({ from }) => this.__isInsideValue(from));

    return this.__performSelfTransitions();
  };

  /**
   * Handles maximum self-transition overflow limit.
   *
   * @throws type {@linkcode Error} Throws when exceeding maximum self-transitions limit.
   */
  protected __throwMaxCounter() {
    const error = `Too much self transitions, exceeded ${DEFAULT_MAX_SELF_TRANSITIONS} transitions`;

    /* v8 ignore else -- @preserve */
    if (IS_TEST()) {
      this._addError(error);
      this.__throwing();
      this.stop();
    } else throw error;
  }

  /**
   * Applies target configuration updates to the interpreter state.
   *
   * @param target - Optional target state path string or `true`.
   *
   * @returns State update result.
   */
  protected __performConfig = (target?: string | true) => {
    if (target === true) {
      this._performConfig();
      const value = this.__value;
      const tags = this.tags;
      return this.__performStates({ value, tags });
    }

    /* v8 ignore else -- @preserve */
    if (target) {
      this.__config = initialConfig(this.proposedNextConfig(target));
      const tags = this.tags;
      this._performConfig();
      const value = this.__value;
      return this.__performStates({ tags, value });
    }
  };

  /**
   * Abstract method executing the next transition step.
   */
  protected abstract _next: Fn<[]>;

  /**
   * Increments internal step counter iterator.
   *
   * @returns Updated iterator count.
   */
  protected _iterate = () => this.__iterator++;

  /**
   * Abstract internal method dispatching an event argument object.
   *
   * @param _event - Event argument object of type {@linkcode EventArgObject}.
   */
  protected abstract __send: (_event: EventArgObject<Eo>) => any;

  /**
   * Dispatches an event to the interpreter if permitted by active state rules.
   *
   * @param _event - Event argument object of type {@linkcode EventArgObject}.
   *
   * @returns Dispatch operation result.
   */
  send = (_event: EventArgObject<Eo>) => {
    const check = !this.isReady || this.__cannotPerformEvents(_event);
    if (check) return;
    return this.__send(_event);
  };

  /**
   * Forwards an event to a target child service.
   *
   * @param sentEvent - Optional target routing object.
   *
   * @returns Send to operation result.
   */
  protected __performSendToAction = (sentEvent?: { to: string; event: any }) => {
    if (!sentEvent) return;
    return this.__sendTo(sentEvent.to, sentEvent.event);
  };

  /**
   * Re-dispatches an event back to this interpreter instance.
   *
   * @param resend - Optional event argument object of type {@linkcode EventArgObject}.
   *
   * @returns Event dispatch result.
   */
  protected __performResendAction = (resend?: EventArgObject<Eo>) => {
    if (!resend) return;
    const cannot = this.__cannotPerformEvents(resend);
    if (cannot) return;

    return this.send(resend);
  };

  /**
   * Accessor generating a deep-cloned state snapshot of type {@linkcode StateExtended}.
   *
   * @returns Cloned extended state snapshot of type {@linkcode StateExtended}.
   */
  protected get __cloneState(): StateExtended<Eo, Pc, Tc, Ta> {
    const pContext = this.__pContext;
    return { pContext, ...structuredClone(this.__state) };
  }

  /**
   * Merges partial context results into private and public contexts.
   *
   * @param result - Partial action result object.
   *
   * @returns Scheduled context merge result.
   */
  protected __mergeContexts: DirectMerge_F<Pc, Tc> = result => {
    const cb = () => {
      const mergers = result?.mergers;
      /* v8 ignore else -- @preserve */
      if (mergers && mergers.length > 0) {
        const state = {
          pContext: this.__pContext,
          context: structuredClone(this.__context),
        };

        const nextState = merge2.multiple(state, ...(mergers as any));
        /* v8 ignore else -- @preserve */
        if (nextState) {
          this.__pContext = nextState.pContext;
          this.__context = nextState.context;
        }
      }

      return this.__performStates({ context: this.__context });
    };

    return this.__schedulerContexts.schedule(cb, this.__sent);
  };

  /**
   * Schedules a delayed context update action.
   *
   * @param scheduled - Optional scheduled action configuration of type {@linkcode ScheduledData}.
   */
  protected __performScheduledAction = (scheduled?: ScheduledData<Pc, Tc>) => {
    if (!scheduled) return;
    const { data, ms: timeout, id } = scheduled;
    const callback = () => this.__mergeContexts({ mergers: data });
    this.__timeoutActions.filter(f => f.id === id).forEach(this.__dispose);
    this.__timeoutActions = this.__timeoutActions.filter(f => f.id !== id);
    const timer = createTimeout({ callback, timeout, id });
    this.__timeoutActions.push(timer);
    timer.start();
  };

  /**
   * Abstract method executing activities configured for active states.
   */
  protected abstract __executeActivities: ExecuteActivities_F;

  /**
   * Creates an interval instance of type {@linkcode Interval2}.
   *
   * @param config - Interval parameters object.
   *
   * @returns New interval instance of type {@linkcode Interval2}.
   */
  protected createInterval: CreateInterval2_F = ({ callback, id, interval }) => {
    const exact = this.__exact;
    const out = createInterval({ callback, id, interval, exact });

    return out;
  };

  /**
   * Cached array of active interval instances of type {@linkcode Interval2}.
   */
  protected __cachedIntervals: Interval2[] = [];

  /**
   * Abstract method executing final state cleanup hooks.
   */
  protected abstract __performFinally: Fn;

  /**
   * Evaluates whether operations originating from a state path are prohibited.
   *
   * @param from - State path string.
   *
   * @returns `true` if prohibited; otherwise, `false`.
   */
  protected __cannotPerform = (from: string) => {
    const first = this.isReady && this.__status !== 'sending';
    const check = !this.__isInsideValue(from);
    return first && check;
  };

  /**
   * Helper returning a value or recording warnings if undefined.
   *
   * @template `T` - Value type.
   *
   * @param out - Optional value of type `T`.
   * @param messages - Warning messages to record.
   *
   * @returns Provided value of type `T`, or `undefined`.
   */
  private __returnWithWarning = <T = any>(
    out: T | undefined,
    ...messages: string[]
  ) => {
    const check = isDefined(out);
    if (check) return out;

    this._addWarning(...messages);
    return;
  };

  /**
   * Provides initial private context object.
   *
   * @deprecated Internal method.
   *
   * @param pContext - Private context object of type `Pc`.
   *
   * @returns Updated machine instance.
   */
  _providePrivateContext = (pContext: Pc) => {
    this.__initialPpc = this.__pContext = pContext;
    this.__machine.addPrivateContext(this.__initialPpc);
    return this.__machine;
  };

  /**
   * Alias for method {@linkcode CommonInterpreter._providePrivateContext}.
   *
   * @deprecated Internal method.
   */
  _ppC = this._providePrivateContext;

  /**
   * Resolves an action function from an action describer object.
   *
   * @param action - Action describer of type {@linkcode WithDescriber}.
   *
   * @returns Resolved action function, or `undefined`.
   */
  toActionFn = (action: WithDescriber) => {
    const events = this.__machine.eventsList;
    const actions = this.__machine.actions;

    const out = this.__returnWithWarning(
      toAction<Pc, Tc, Ta, Eo>(action, actions, ...events),
      `Action (${reduceDescriber(action)}) is not defined`,
    );

    return out;
  };

  /**
   * Resolves a predicate guard function from a guard configuration object.
   *
   * @param guard - Guard configuration of type {@linkcode GuardConfig}.
   *
   * @returns Resolved predicate function, or `undefined`.
   */
  toPredicateFn = (guard: GuardConfig): any => {
    const events = this.__machine.eventsList;
    const guards = this.__machine.guards;

    const { predicate, errors } = toPredicate<Pc, Tc, Ta, Eo>(
      guard,
      guards,
      ...events,
    );

    return this.__returnWithWarning(predicate, ...errors);
  };

  /**
   * Resolves a delay duration provider function from a delay key string.
   *
   * @param delay - Delay identifier string.
   *
   * @returns Resolved delay function, or `undefined`.
   */
  toDelayFn = (delay: string) => {
    const events = this.__machine.eventsList;
    const delays = this.__machine.delays;

    return this.__returnWithWarning(
      toDelay<Pc, Tc, Ta, Eo>(delay, delays, ...events),
      `Delay (${delay}) is not defined`,
    );
  };

  /**
   * Resolves a child machine factory function from a child key string.
   *
   * @param machine - Child machine identifier string.
   *
   * @returns Resolved child factory function, or `undefined`.
   */
  toChildFn = (machine: string) => {
    const events = this.__machine.eventsList;
    const machines = this.__machine.children;

    return this.__returnWithWarning(
      toChildSrc<Pc, Tc, Ta>(machine, machines as any, ...events),
      `Machine (${reduceDescriber(machine)}) is not defined`,
    );
  };

  /**
   * Resolves an emitter factory function from an emitter key string.
   *
   * @param emitter - Emitter identifier string.
   *
   * @returns Resolved emitter source function, or `undefined`.
   */
  toEmitterSrc = (emitter: string) => {
    const emitters = this.__machine.emitters;

    return this.__returnWithWarning(
      toEmitterSrc<Pc, Tc, Ta>(emitter, emitters as any),
      `Emitter (${reduceDescriber(emitter)}) is not defined`,
    );
  };

  /**
   * Abstract method dispatching an event to a child service by ID.
   *
   * @template `T` - Event type extending interface {@linkcode EventObject}.
   *
   * @param to - Target child service identifier string.
   * @param event - Event object of type `T`.
   */
  protected abstract __sendTo: <T extends EventObject>(to: string, event: T) => any;

  // #region Disposable
  /**
   * Synchronously disposes resources, stopping timers and subscribers.
   */
  dispose = () => {
    this.stop();
    this.__timeoutActions.forEach(this.__dispose);
    this.__subscribers.forEach(this.__dispose);
    this.__innerSubscribers.forEach(this.__dispose);
  };

  /**
   * Implementation of `Disposable` symbol contract.
   */
  [Symbol.dispose] = this.dispose;

  /**
   * Implementation of `AsyncDisposable` symbol contract.
   *
   * @returns A promise resolving upon disposal completion.
   */
  [Symbol.asyncDispose] = () => {
    const out = asyncfy(this[Symbol.dispose]);
    return out();
  };
  // #endregion
}

/**
 * Type alias retrieving the type {@linkcode CommonInterpreter} service type from an interface {@linkcode AnyMachine}.
 *
 * @template `M` - Machine type extending interface {@linkcode AnyMachine}.
 */
export type CommonInterpreterFrom<M extends AnyMachine> = CommonInterpreter<
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
