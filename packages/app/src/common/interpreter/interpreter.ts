import {
  ALWAYS_EVENT,
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
import {
  DEFAULT_DELIMITER,
  DEFAULT_MAX_SELF_TRANSITIONS,
  DEFAULT_MIN_ACTIVITY_TIME,
} from '#constants';
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
  decomposeSV,
  IS_TEST,
  isStringEmpty,
  merge,
  reduceDescriber,
  replaceAll,
} from '#utils';
import type { AllowedNames } from '@bemedev/app-utils-bemedev';
import {
  isDefined,
  isPrimitive,
  toArray,
} from '@bemedev/app-utils-bemedev';
import { asyncfy } from '@bemedev/better-promise';
import { getByKey } from '@bemedev/decompose';
import {
  createInterval,
  createTimeout,
  type Interval2,
  type Timeout2,
} from '@bemedev/interval2';
import type { PrimitiveObject } from '@bemedev/typings';
import cloneDeep from 'clone-deep';
import equal from 'fast-deep-equal';
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
import { createSubscriber, type SubscriberClass } from '../subscriber';
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
  protected __machine: CommonMachine<
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

  abstract readonly TYPE: MachineType;

  /**
   * The current {@linkcode WorkingStatus} status of the this {@linkcode Interpreter} service.
   */
  #status: WorkingStatus = 'idle';

  /**
   * The public accessor of initial {@linkcode WorkingStatus} status of the this {@linkcode Interpreter} service.
   */
  get status() {
    return this.#status;
  }

  protected __config: any;

  /**
   * The public accessor of current {@linkcode NodeConfigWithInitials} config state of this {@linkcode Interpreter} service.
   */
  get config() {
    return this.__config;
  }

  #flat!: Record<string, any>;

  /**
   * The current {@linkcode StateValue}> of this {@linkcode Interpreter} service.
   */
  __value!: StateValue;

  /**
   * The public accessor of current {@linkcode StateValue}> of this {@linkcode Interpreter} service.
   */
  get value() {
    return this.__value;
  }

  /**
   * The {@linkcode Mode} of this {@linkcode Interpreter} service
   */
  protected __mode: Mode;

  /**
   * The initial {@linkcode Node} of the inner {@linkcode Machine}.
   */
  readonly #initialNode: any;

  get initialNode() {
    return this.#initialNode;
  }

  /**
   * The current {@linkcode Node} of this {@linkcode Interpreter} service.
   */
  #node!: any;

  /**
   * The accessor of current {@linkcode Node} of this {@linkcode Interpreter} service.
   */
  get node() {
    return this.#node;
  }

  /**
   * an iiner ietrator to count the number of operations performed by this {@linkcode Interpreter} service.
   */
  #iterator = 0;

  /**
   * The current {@linkcode ToEvents} event of this {@linkcode Interpreter} service.
   */
  #event: Eo = transformEventArg(INIT_EVENT);

  /**
   * The initial {@linkcode NodeConfigWithInitials} of the inner {@linkcode Machine}.
   */
  protected readonly __initialConfig: any;

  /**
   * The public accessor of initial {@linkcode NodeConfigWithInitials} of the inner {@linkcode Machine}.
   */
  get initialConfig() {
    return this.__initialConfig;
  }

  /**
   * The public accessor of initial {@linkcode StateValue} of the inner {@linkcode Machine}.
   */
  get initialValue() {
    return this.__machine.initialValue;
  }

  /**
   * The initial {@linkcode Pc} private context of this {@linkcode Interpreter} service.
   */
  protected __initialPpc!: Pc;

  /**
   * The initial {@linkcode Tc} context of this {@linkcode Interpreter} service.
   */
  protected __initialContext!: Tc;

  /**
   * The current {@linkcode Pc} private context of this {@linkcode Interpreter} service.
   */
  protected __pContext!: Pc;

  /**
   * The current {@linkcode Tc} context of this {@linkcode Interpreter} service.
   */
  protected __context!: Tc;

  /**
   * The public accessor of current {@linkcode Tc} context of this {@linkcode Interpreter} service.
   */
  get context() {
    return this.__context;
  }

  /**
   * The previous {@linkcode State} of this {@linkcode Interpreter} service.
   */
  #previousState!: State<Eo, Tc, Ta>;

  /**
   * The current {@linkcode State} of this {@linkcode Interpreter} service.
   */
  protected __state!: State<Eo, Tc, Ta>;

  /**
   * All {@linkcode AnyInterpreter} service subscribers of this {@linkcode Interpreter} service.
   */

  protected __sent = false;

  protected __exact: boolean;

  /**
   * Public getter of the service subscribers of this {@linkcode Interpreter} service.
   */
  get children() {
    return this.__collectedChildren;
  }

  /**
   * Returns a service subscriber of this {@linkcode Interpreter} service with a specific id.
   * @param id - The id of the service subscriber to get.
   * @return The service subscriber {@linkcode AnyInterpreter} of this {@linkcode Interpreter} service with the specified id, or undefined if not found.
   *
   * @see {@linkcode children} for all children.
   */
  getChildAt = (id: string) => this.children.find(f => f.id === id);

  /**
   * Allias of {@linkcode getChildAt} function.
   */
  at = this.getChildAt;

  /**
   * Checks if the given value is inside the current state value.
   * @param value - the state value to check if it is inside the current state value.
   * @returns true if the value is inside the current state value, false otherwise.
   */
  protected __isInsideValue = (value: string) => {
    const out = this.__isInsideValue2(this.__value, value);
    return out;
  };

  protected __isInsideValue2 = (sv: StateValue, value: string) => {
    if (value === DEFAULT_DELIMITER) {
      return true;
    }
    const values = decomposeSV(sv);
    const entry = value.substring(1);
    const state = replaceAll({
      entry,
      match: DEFAULT_DELIMITER,
      replacement: '.',
    });

    return values.includes(state);
  };

  protected __schedulerValue!: SimpleScheduler;
  protected __schedulerContexts!: SimpleScheduler;
  protected __schedulerEvent!: SimpleScheduler;
  protected __schedulerStatus!: SimpleScheduler;

  /**
   * The id of the current {@linkcode Interpreter} service.
   * Used for child machines identification.
   */
  id?: string;

  from?: string;

  /**
   * The accessor of {@linkcode Mode} of this {@linkcode Interpreter} service
   */
  get mode() {
    return this.__mode;
  }

  /**
   * @deprecated
   * Just use for testing
   * @returns the current {@linkcode Pc} private context of this {@linkcode Interpreter} service.
   * @remarks returns nothing in prod
   *
   * @see {@linkcode context} to get the current context.
   */
  get _pContext() {
    /* v8 ignore else -- @preserve */
    if (IS_TEST) {
      return this.__pContext;
    }

    /* v8 ignore start -- @preserve */
    console.error('pContext is not available in production');
    return;
    /* v8 ignore stop -- @preserve */
  }

  get isReady() {
    return this.#status !== 'idle' && this.#status !== 'stopped';
  }

  /**
   * Select a path from the current {@linkcode Tc} context of this {@linkcode Interpreter} service.
   *
   * @param path, the key to select from the current {@linkcode Tc} context of this {@linkcode Interpreter} service.
   *
   * @returns the value from the path from the current {@linkcode Tc} context of this {@linkcode Interpreter} service.
   *
   * @see {@linkcode getByKey} for retrieving values by key.
   */

  get select(): Selector_F<Tc> {
    const check = isPrimitive(this.__context);
    if (check) return undefined as any;
    const out = (path: string) => getByKey(this.__state.context, path);
    return out as any;
  }

  /**
   * @deprecated
   * Select a path from the current {@linkcode Pc} private context of this {@linkcode Interpreter} service.
   *
   * @param path, the key to select from the current {@linkcode Pc} private context of this {@linkcode Interpreter} service.
   *
   * @returns the value from the path from the current {@linkcode Pc} private context of this {@linkcode Interpreter} service.
   *
   * @remarks returns nothing in prod
   *
   * @see {@linkcode getByKey} for retrieving values by key.
   */
  get _pSelect(): Selector_F<Pc> {
    /* v8 ignore else -- @preserve */
    if (IS_TEST) {
      const check = this.isReady && isPrimitive(this.__pContext);
      const pContext = this.__pContext;
      if (check) return undefined as any;

      /* v8 ignore else -- @preserve */
      if (pContext) {
        const out: any = (path: string) => getByKey(pContext, path);
        return out as any;
      }
    }

    /* v8 ignore start -- @preserve */
    console.error('pContext is not available in production');
    return undefined as any;
    /* v8 ignore stop -- @preserve */
  }

  /**
   * @deprecated
   *
   * Used for typings only
   * The accessor of current {@linkcode ToEvents} of this {@linkcode Interpreter} service
   *
   * @remarks Usually for typings
   */
  get event() {
    return this.#event;
  }

  /**
   * The accessor of the map of events from the inner {@linkcode Machine}.
   */
  get eventsMap() {
    return this.__machine.eventsMap;
  }

  get tags() {
    return getTags<Ta>(this.__config);
  }

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
    this.__machine = machine.renew;

    this.__config = this.__initialConfig = this.__machine.initialConfig;
    this.#initialNode = this.#resolveNode(this.__initialConfig) as any;
    this.__mode = mode;
    this.__exact = exact;

    this.__state = this.#previousState = {
      status: this.#status,
      context: this.__context,
      event: { type: INIT_EVENT, payload: {} } as any,
      value: this.__value,
      tags: this.tags,
    };

    this.#collectEmitterConfigs();
    this.#collectChildrenConfig();
    this.__throwing();
  }

  /**
   * Changes the current {@linkcode ToEvents} event of this {@linkcode Interpreter} service.
   *
   * @param event - the {@linkcode ToEventsR} event to change the current {@linkcode Interpreter} service state.
   */
  protected __changeEvent = (event: Eo) => {
    const cb = () => {
      this.__performStates({ event });
      this.#event = event;
    };

    return this.__schedulerEvent.schedule(cb, this.__sent);
  };
  protected abstract __performTransitions: Fn;

  protected __performAlways = (alway: AlwaysConfig) => {
    this.__changeEvent(transformEventArg(ALWAYS_EVENT));
    const always = toArray<TransitionConfig>(alway);
    return this.__performTransitions(...always);
  };

  protected get __collectedAlways() {
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

    return this.__cachedIntervals.filter(({ id }) => ids.includes(id));
  }

  #performActivities = () => {
    return this.#currentActivities?.forEach(this.#start);
  };

  /**
   * Pause the collection of all currents {@linkcode Interval2} intervals, related to current {@linkcode ActivityConfig}s of this {@linkcode Interpreter} service.
   *
   */
  #pauseAllActivities = () => {
    this.__cachedIntervals.forEach(this.#pause);
  };

  /**
   * Used to track number of self transitions
   */
  protected __selfTransitionsCounter = 0;

  protected __collectedPausables: CollectedPausable[] = [];

  protected abstract __collectPausables: () => {
    pausable: Pausable;
    id: string;
    from: string;
  }[];

  #startPausables = () => {
    this.__collectedPausables.forEach(({ pausable }) => pausable.start());
  };

  #resumePausables = (
    filter: (value: CollectedPausable) => boolean = () => true,
  ) => {
    this.__collectedPausables
      .filter(filter)
      .forEach(({ pausable }) => pausable.resume());
  };

  #stopPausables = (
    filter: Parameters<Array<CollectedPausable>['filter']>[0] = () => true,
  ) => {
    this.__collectedPausables
      .filter(filter)
      .forEach(({ pausable, id }) => {
        pausable.stop();
        this.__collectedPausables = this.__collectedPausables.filter(
          f => f.id !== id,
        );
      });
  };

  #pausePausables = (
    filter: (value: CollectedPausable) => boolean = () => true,
  ) => {
    this.__collectedPausables
      .filter(filter)
      .forEach(({ pausable }) => pausable.pause());
  };

  protected abstract __collectedSelfTransitions0: Map<string, any>;
  protected abstract __collectedSelfTransitions: any;

  protected __collectedEmitterConfigs: [
    from: string,
    ...emitters: (EmitterConfig & { id: string })[],
  ][] = [];

  #collectEmitterConfigs = () => {
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

  protected __collectedChildrenConfig: [
    from: string,
    ...children: (ChildConfig & { id: string })[],
  ][] = [];

  #collectChildrenConfig = () => {
    const entriesFlat = Object.entries<any>(this.__machine.flat);
    const entries: [
      from: string,
      ...children: (ChildConfig & { id: string })[],
    ][] = [];

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

  protected __collectedChildren: CommonCollectedService[] = [];

  protected abstract __performSelfTransitions: () => any;

  protected abstract __performActions: Fn;

  protected __startInitialEntries = () => {
    const actions = getEntries(this.__initialConfig);
    if (actions.length < 1) return;
    return this.__performActions(...actions);
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

  #open = this.#mapperFn('open');
  #start = this.#mapperFn('start');

  #close = this.#mapperFn('close');

  #resume = this.#mapperFn('resume');
  #unsubscribe = this.#mapperFn('unsubscribe');
  #stop = this.#mapperFn('stop');
  #dispose = this.#mapperFn('dispose');

  protected __subscribers = new Set<SubscriberClass<E, A, Tc, Ta, Eo>>();
  #innerSubscribers = new Set<SubscriberClass<E, A, Tc, Ta, Eo>>();

  /**
   * Flushes all subscribers and map subscribers of this {@linkcode Interpreter} service.
   *
   * @see {@linkcode SubscriberClass} for more information about subscribers.
   * @see {@linkcode SubscriberClass} for more information about map subscribers.
   */
  protected __flush = () => {
    const all = [...this.#innerSubscribers, ...this.__subscribers];
    all.forEach(({ fn }) => fn(this.#previousState, this.__state));
  };

  /**
   * All actions that are currently scheduled to be performed.
   * @returns an array of {@linkcode Timeout2} that are currently scheduled to be performed.
   */
  protected __timeoutActions: Timeout2[] = [];

  #startChildren = () => {
    this.__collectedChildren.forEach(({ service }) => {
      service.start();
    });
  };

  #pauseChildren = (
    filter: Parameters<Array<CommonCollectedService>['filter']>[0] = () =>
      true,
  ) => {
    this.__collectedChildren
      .filter(filter)
      .forEach(({ service }) => service.pause());
  };

  #stopChildren = (
    filter: Parameters<Array<CommonCollectedService>['filter']>[0] = () =>
      true,
  ) => {
    this.__collectedChildren.filter(filter).forEach(({ service, id }) => {
      service.stop();

      this.__collectedChildren
        .filter(f => f.id === id)
        .forEach(({ service }) => service.dispose());

      this.__collectedChildren = this.__collectedChildren.filter(
        f => f.id !== id,
      );
    });
  };

  #resumeChildren = (
    filter: Parameters<Array<CommonCollectedService>['filter']>[0] = () =>
      true,
  ) => {
    this.__collectedChildren
      .filter(filter)
      .forEach(({ service }) => service.resume());
  };

  /**
   * Create a new {@linkcode Interpreter} instance with the same initial configuration as this instance.
   */
  abstract renew: any;

  /**
   * Helper to format inner errors and warnings.
   * @param messages - an iterable of messages to format.
   * @returns an array of messages joined by new line.
   *
   * @remarks Used to display console messages in a readable format.
   */
  #displayConsole = (messages: Iterable<string>) => {
    return Array.from(messages).join('\n');
  };

  /**
   * Use to manage internal errors and warnings.
   */
  protected __throwing = () => {
    if (this.__mode === 'strict') {
      const check1 = this.#warningsCollector.size > 0;
      if (check1) {
        const warnings = this.#displayConsole(this.#warningsCollector);
        console.log(warnings);
      }

      const check2 = this.#errorsCollector.size > 0;
      if (check2) {
        const errors = this.#displayConsole(this.#errorsCollector);
        throw new Error(errors);
      }
    } else {
      const check3 = this.#errorsCollector.size > 0;
      if (check3) {
        const errors = this.#displayConsole(this.#errorsCollector);
        console.error(errors);
      }

      const check4 = this.#warningsCollector.size > 0;
      if (check4) {
        const warnings = this.#displayConsole(this.#warningsCollector);
        console.log(warnings);
      }
    }
  };

  start = () => {
    this.__collectChildren();
    this.__collectPausables();
    this.__throwing();
    this.__setStatus('started');
    this.#startPausables();
    this.__flush();
    this.__startInitialEntries();
    this.#startChildren();
    this.__throwing();
    this._next();
  };

  /**
   * Assign the current {@linkcode State} and the previous {@linkcode State} of the {@linkcode Interpreter} service and flush all subscribers.
   * @param parts, Partial {@linkcode State}
   *
   * @see {@linkcode SubscriberClass}
   * @see {@linkcode SubscriberClass}
   */
  protected __performStates = (parts?: Partial<State<Eo, Tc, Ta>>) => {
    this.#previousState = cloneDeep(this.__state);
    this.__state = { ...this.__state, ...parts };
    const check = !equal(this.#previousState, this.__state);
    if (check) this.__flush();
  };

  protected __setStatus = (status: WorkingStatus) => {
    const cb = () => {
      this.__performStates({ status });
      return (this.#status = status);
    };

    return this.__schedulerStatus.schedule(cb, this.__sent);
  };

  get #schedulers() {
    return [
      this.__schedulerValue,
      this.__schedulerContexts,
      this.__schedulerEvent,
      this.__schedulerStatus,
    ];
  }

  #stopSchedulers = () => {
    this.#schedulers.forEach(this.#stop);
  };

  pause = () => {
    this.#pauseAllActivities();
    this.__setStatus('busy');
    this.__subscribers.forEach(this.#close);
    this.#pauseChildren();
    this.#pausePausables();
    this.__timeoutActions.forEach(this.#pause);
    this.__setStatus('paused');
  };

  resume = () => {
    if (this.#status === 'paused') {
      this.#performActivities();
      this.__setStatus('busy');
      this.__subscribers.forEach(this.#open);
      this.__timeoutActions.forEach(this.#resume);
      this.#resumeChildren();
      this.#resumePausables();
      this.__setStatus('working');
    }
  };

  stop = () => {
    this.pause();
    this.__setStatus('busy');
    this.__subscribers.forEach(this.#unsubscribe);
    this.#stopChildren();
    this.__cachedIntervals.forEach(this.#dispose);
    this.__timeoutActions.forEach(this.#dispose);
    this.#stopPausables();
    this.__setStatus('stopped');
    this.#stopSchedulers();
  };

  /**
   * @deprecated
   * Used internally
   */
  _provideContext = (context: Tc) => {
    this.__initialContext = this.__context = context;
    this.__performStates({ context });
    this.__setStatus('busy');

    this.__machine.addContext(this.__initialContext);

    this.__setStatus('starting');
    return this.__machine;
  };

  /**
   * Add options to the inner {@linkcode Machine} of this {@linkcode Interpreter} service.
   */
  addOptions(helper: Fn) {
    this.__machine = this.__machine.provideOptions(helper);
    return this.__machine.options;
  }

  /**
   * Provides options for the interpreter and returns a new interpreter instance.
   *
   * @param helper a function that provides options for the machine.
   * Options can include actions, guards, delays, promises, and child machines.
   * @returns a new interpreter instance with the provided options applied.
   */
  provideOptions(helper: Fn) {
    const out = this.renew;
    out.addOptions(helper);
    return out as any;
  }

  subscribe: AddSubscriber_F<E, A, Tc, Ta, Eo> = (
    _subscriber,
    options,
  ) => {
    const eventsMap = this.__machine.eventsMap;
    const actorsMap = this.__machine.actorsMap;
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
    this.__subscribers.add(subcriber);
    return subcriber as any;
  };

  // @ts-expect-error Already used recursively
  private __subscribe: AddSubscriber_F<E, A, Tc, Ta, Eo> = (
    _subscriber,
    options,
  ) => {
    const eventsMap = this.__machine.eventsMap;
    const actorsMap = this.__machine.actorsMap;

    const subscriber = createSubscriber(
      eventsMap,
      actorsMap,
      _subscriber,
      options,
    );
    this.#innerSubscribers.add(subscriber);
    return subscriber;
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

  protected __extractTransitions = (event: Eo) => {
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

  protected abstract __presend: Fn<[event: Eo], any>;

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
   * Resolves a {@linkcode Node} from the given {@linkcode NodeConfigWithInitials} configuration.
   *
   * @param config of type {@linkcode NodeConfigWithInitials}, the configuration to resolve.
   *
   * @returns a {@linkcode Node} resolved from the configuration.
   *
   * @see {@linkcode resolveNode} for the actual resolution logic.
   * @see {@linkcode E}
   * @see {@linkcode P}
   * @see {@linkcode Pc}
   * @see {@linkcode Tc}
   */
  #resolveNode = (config: any) => {
    const options = this.__machine.options;
    const events = this.__machine.eventsMap;
    const actorsMap = this.__machine.actorsMap;

    return resolveNode<E, A, Pc, Tc, Ta, Eo>(
      events,
      actorsMap,
      config,
      options as any,
    );
  };

  protected abstract __collectChildren: Fn;

  /**
   * Set the current {@linkcode Mode} of this {@linkcode Interpreter} service to 'strict'.
   * In this mode, all errors are thrown and warnings are logged to the console.
   */
  makeStrict = () => (this.__mode = 'strict' as Mode);

  /**
   * Set the current {@linkcode Mode} of this {@linkcode Interpreter} service to 'normal'.
   * In this mode, errors are logged to the console, but not thrown.
   */
  makeNormal = () => (this.__mode = 'normal' as Mode);

  /**
   * Performs computations, after transitioning to the next target, to update the current {@linkcode NodeConfigWithInitials} config state of this {@linkcode Interpreter} service
   */
  protected _performConfig = () => {
    const value = nodeToValue(this.__config as any);
    const cb = () => (this.__value = value);
    this.__schedulerValue.schedule(cb, this.__sent);
    this.#node = this.#resolveNode(this.__config);
    const configForFlat = _any(this.__config);
    this.#flat = flatMap.low(configForFlat, true);
  };

  /**
   * Proposes the next state value based on the current state value and the target.
   * @param target - the target state to propose the next state value.
   * @returns the next {@linkcode StateValue} based on the current state value and the target.
   *
   * @remarks
   * This method calculates the next state value based on the current state value and the target.
   * It does not change the current state value, but returns the proposed next state value.
   * It is used internally to calculate the next state value before sending an event.
   */
  #proposedNextSV = (target: string) => nextSV(this.__value, target);

  /**
   * Proposes the next configuration based on the current state value and the target.
   * @param target - the target state to propose the next configuration.
   * @returns the proposed next {@linkcode NodeConfigWithInitials} based on the current state value and the target.
   *
   * @remarks
   * Only proposes next config, does not change the current config.
   *
   * //
   *
  //  * @see {@linkcode Machine.valueToConfig} for more details.
   *
   * //
   */
  protected proposedNextConfig = (target: string) => {
    const nextValue = this.#proposedNextSV(target);
    const out = this.__machine.valueToConfig(nextValue);

    return out;
  };

  protected get __currentActivities() {
    const collected = this.#collectedActivities.filter(([from]) =>
      this.__isInsideValue(from),
    );

    const ids: string[] = [];
    for (const args of collected) {
      ids.push(...this.__executeActivities(...args));
    }

    return this.__cachedIntervals.filter(({ id }) => ids.includes(id));
  }

  protected __performPauseActivityAction = (id?: string) => {
    if (!id) return;
    this.__currentActivities
      ?.filter(f => f.id === id)
      .forEach(this.#pause);
  };

  protected __performResumeActivityAction = (id?: string) => {
    if (!id) return;
    this.__currentActivities
      ?.filter(f => f.id === id)
      .forEach(this.#resume);
  };

  protected __performStopActivityAction = (id?: string) => {
    if (!id) return;
    this.__currentActivities
      ?.filter(f => f.id === id)
      .forEach(this.#dispose);
  };

  protected __performPauseTimerAction = (id?: string) => {
    if (!id) return;
    this.__timeoutActions.filter(f => f.id === id).forEach(this.#pause);
  };

  protected __performResumeTimerAction = (id?: string) => {
    if (!id) return;
    this.__timeoutActions.filter(f => f.id === id).forEach(this.#resume);
  };

  protected __performStopTimerAction = (id?: string) => {
    if (!id) return;
    this.__timeoutActions.filter(f => f.id === id).forEach(this.#dispose);
  };

  /**
   * Calculates the difference between the current and next configuration.
   * @param target - the target state to calculate the difference.
   * @returns an {@linkcode DiffNext} object containing the proposed next state value, entry actions, and exit actions.
   *
   * @remarks
   * This method is used to calculate the entry and exit actions when transitioning to a new state.
   * It compares the current configuration with the proposed next configuration and returns the differences.
   */
  protected __diffNext = (target?: string): DiffNext => {
    if (!target) {
      return { sv: this.__value, diffEntries: [], diffExits: [] };
    }

    const next = initialConfig(this.proposedNextConfig(target));
    const flatNext = flatMap.low(next);

    const entriesCurrent = Object.entries(this.#flat);
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
    const sv = this.#proposedNextSV(target);
    return { sv, diffEntries, diffExits };
  };

  /**
   * Performs all self transitions and activities of this {@linkcode Interpreter} service.
   */
  protected __preNext = () => {
    const filter: Parameters<
      Array<{ from: string; id: string }>['filter']
    >[0] = ({ from, id }, _, all) => {
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
    this.#pauseAllActivities();
    this.#performActivities();
    this.#stopPausables(filter);
    this.#pausePausables(({ from }) => this.__isInsideValue(from));
    this.#pauseChildren(({ from }) => this.__isInsideValue(from));
    this.#stopChildren(filter);
    this.#startChildren();
    this.#resumeChildren(({ from }) => !this.__isInsideValue(from));
    this.#startPausables();
    this.#resumePausables(({ from }) => this.__isInsideValue(from));

    return this.__performSelfTransitions();
  };

  protected __throwMaxCounter() {
    const error = `Too much self transitions, exceeded ${DEFAULT_MAX_SELF_TRANSITIONS} transitions`;

    /* v8 ignore else -- @preserve */
    if (IS_TEST) {
      this._addError(error);
      this.__throwing();
      this.stop();
    } else throw error;
  }

  /**
   * Performs computations, to update the current {@linkcode NodeConfigWithInitials} config state of this {@linkcode Interpreter} service
   * @param target, the target to perform the config for.
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

  protected abstract _next: Fn<[]>;

  protected _iterate = () => this.#iterator++;

  /**
   * Sends an event without cheching to the current {@linkcode Interpreter} service.
   *
   * @param _event - the {@linkcode EventArg} event to send.
   *
   */
  protected abstract __send: (_event: EventArgObject<Eo>) => any;

  /**
   * Sends an event to the current {@linkcode Interpreter} service.
   *
   * @param _event - the {@linkcode EventArg} event to send.
   *
   * @remarks
   * If the event cannot be performed, it will not be sent.
   * If the event is sent, it will be processed and the state will be updated.
   */
  send = (_event: EventArgObject<Eo>) => {
    const check = this.#cannotPerformEvents(_event);
    if (check) return;
    return this.__send(_event);
  };

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

  protected get __cloneState(): StateExtended<Eo, Pc, Tc, Ta> {
    const pContext = cloneDeep(this.__pContext);
    return { pContext, ...structuredClone(this.__state) };
  }

  protected __mergeContexts: DirectMerge_F<Pc, Tc> = result => {
    const cb = () => {
      this.__pContext = merge(this.__pContext, _any(result?.pContext));
      const context = merge(this.__context, _any(result?.context));

      this.__context = context;
      return this.__performStates({ context });
    };

    return this.__schedulerContexts.schedule(cb, this.__sent);
  };

  protected __performScheduledAction = (
    scheduled?: ScheduledData<Pc, Tc>,
  ) => {
    if (!scheduled) return;
    const { data, ms: timeout, id } = scheduled;
    const callback = () => this.__mergeContexts(data);
    this.__timeoutActions.filter(f => f.id === id).forEach(this.#dispose);
    this.__timeoutActions = this.__timeoutActions.filter(f => f.id !== id);
    const timer = createTimeout({ callback, timeout, id });
    this.__timeoutActions.push(timer);
    timer.start();
  };

  protected abstract __executeActivities: ExecuteActivities_F;

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

  /**
   * Collection of all currents {@linkcode Interval2} intervals, related to current {@linkcode ActivityConfig}s of this {@linkcode Interpreter} service.
   */
  protected __cachedIntervals: Interval2[] = [];

  protected abstract __performFinally: Fn;

  get #sending() {
    return this.#status === 'sending';
  }

  /**
   * Checks if sent events cannot be performed.
   * @param from - the config value from which the events are sent.
   * @returns true if the events cannot be performed, false otherwise.
   */
  protected __cannotPerform = (from: string) => {
    const check = this.#sending || !this.__isInsideValue(from);
    return check;
  };

  /**
   * Returns the output value with a warning if it is not defined.
   * @param out of type [T], the output value to check if it is defined.
   * @param messages - the messages to add to the warnings collector if the output is not defined. it's a parram array
   */
  #returnWithWarning = <T = any>(
    out: T | undefined,
    ...messages: string[]
  ) => {
    const check = isDefined(out);
    if (check) return out;

    this._addWarning(...messages);
    return;
  };

  /**
   * @deprecated
   * Used internally
   */
  _providePrivateContext = (pContext: Pc) => {
    this.__initialPpc = this.__pContext = pContext;
    this.__setStatus('busy');

    this.__machine.addPrivateContext(this.__initialPpc);

    this.__setStatus('starting');
    return this.__machine;
  };

  /**
   * @deprecated
   * Used internally
   *
   * Alias of {@linkcode _providePrivateContext}
   */
  _ppC = this._providePrivateContext;

  toActionFn = (action: WithDescriber) => {
    const events = this.__machine.eventsMap;
    const actorsMap = this.__machine.actorsMap;
    const actions = this.__machine.actions;

    const out = this.#returnWithWarning(
      toAction<E, A, Pc, Tc, Ta, Eo>(events, actorsMap, action, actions),
      `Action (${reduceDescriber(action)}) is not defined`,
    );

    return out;
  };

  toPredicateFn = (guard: GuardConfig) => {
    const events = this.__machine.eventsMap;
    const actorsMap = this.__machine.actorsMap;
    const guards = this.__machine.guards;

    const { predicate, errors } = toPredicate<E, A, Pc, Tc, Ta, Eo>(
      events,
      actorsMap,
      guard,
      guards,
    );

    return this.#returnWithWarning(predicate, ...errors);
  };

  toDelayFn = (delay: string) => {
    const events = this.__machine.eventsMap;
    const actorsMap = this.__machine.actorsMap;
    const delays = this.__machine.delays;

    return this.#returnWithWarning(
      toDelay<E, A, Pc, Tc, Ta, Eo>(events, actorsMap, delay, delays),
      `Delay (${delay}) is not defined`,
    );
  };

  toChildFn = (machine: string) => {
    const events = this.__machine.eventsMap;
    const actorsMap = this.__machine.actorsMap;
    const machines = this.__machine.children;

    return this.#returnWithWarning(
      toChildSrc<E, A, Pc, Tc, Ta>(
        events,
        actorsMap,
        machine,
        machines as any,
      ),
      `Machine (${reduceDescriber(machine)}) is not defined`,
    );
  };

  toEmitterSrc = (emitter: string) => {
    const events = this.__machine.eventsMap;
    const actorsMap = this.__machine.actorsMap;
    const emitters = this.__machine.emitters;

    return this.#returnWithWarning(
      toEmitterSrc<E, A, Pc, Tc, Ta>(
        events,
        actorsMap,
        emitter,
        emitters as any,
      ),
      `Emitter (${reduceDescriber(emitter)}) is not defined`,
    );
  };

  /**
   * Sends an event to a specific child service by its ID.
   *
   * @param to - The ID of the child service to which the event will be sent.
   * @param : the {@linkcode EventObject} event to send to the child service.
   *
   * @see {@linkcode send} for sending events to the current service.
   */
  protected abstract __sendTo: <T extends EventObject>(
    to: string,
    event: T,
  ) => any;

  // #region Disposable
  dispose = () => {
    this.stop();
    this.__timeoutActions.forEach(this.#dispose);
  };

  [Symbol.dispose] = this.dispose;

  [Symbol.asyncDispose] = () => {
    const out = asyncfy(this[Symbol.dispose]);
    return out();
  };
  // #endregion
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
export type CommonInterpreterFrom<M extends AnyMachine> =
  CommonInterpreter<
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
