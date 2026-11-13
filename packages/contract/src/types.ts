import type {
  ActorsConfigMap,
  AnyMachineOptions,
  CommonConfig2,
  EventArgAll,
  EventObject,
  EventsMap,
  PrimitiveObject,
  StandardOutput,
} from './internal';

/**
 * Joins a parent state path with a child state key.
 *
 * @template `Prefix` - Parent state path.
 * @template `Key` - Child state key.
 */
type JoinPath<Prefix extends string, Key extends string> = Prefix extends ''
  ? `/${Key}`
  : `${Prefix}/${Key}`;

/**
 * Resolves the union of every state path declared by a machine configuration.
 *
 * The root path `/` is always included. Nested states produce both their own
 * path and the paths of their descendants, matching the output of the CLI
 * `parseTree` helper.
 *
 * @template `Config` - Machine configuration type.
 * @template `Prefix` - Internal path prefix used during recursion.
 *
 * @example
 * ```ts
 * type Paths = StatePaths<{
 *   initial: 'idle';
 *   states: {
 *     idle: {};
 *     working: { initial: 'busy'; states: { busy: {} } };
 *   };
 * }>;
 * // '/' | '/idle' | '/working' | '/working/busy'
 * ```
 */
export type StatePaths<Config, Prefix extends string = ''> = Config extends {
  states: infer States;
}
  ?
      | (Prefix extends '' ? '/' : never)
      | {
          [Key in keyof States & string]:
            | JoinPath<Prefix, Key>
            | (States[Key] extends { states: any }
                ? StatePaths<States[Key], JoinPath<Prefix, Key>>
                : never);
        }[keyof States & string]
  : Prefix extends ''
    ? '/'
    : never;

/**
 * Schema map accepted by {@linkcode createContract}.
 *
 * It deliberately mirrors the `types` argument of `createMachine` from
 * `@bemedev/app`: only the machine `context`, `pContext`, `eventsMap`,
 * `actorsMap` and `sync` flag are described. Implementations (actions, guards,
 * delays, actors) are intentionally absent.
 */
export type ContractSchemas = {
  context?: StandardOutput<PrimitiveObject>;
  pContext?: StandardOutput<any>;
  eventsMap?: StandardOutput<EventsMap>;
  actorsMap?: StandardOutput<ActorsConfigMap>;
  sync?: true | undefined;
};

/**
 * Inferred typing surface of a contract.
 *
 * It is the resolved counterpart of type {@linkcode ContractSchemas}: raw
 * schemas become events, contexts and state paths. These fields are type-only;
 * they are never present at runtime and are read through the helper types
 * exported by this package.
 */
export type ContractTypes = {
  /** Union of every typed event object accepted by the machine. */
  events: EventObject;
  /** Inferred events map declared by the contract. */
  eventMap: EventsMap;
  /** Inferred actors map declared by the contract. */
  actorsMap: ActorsConfigMap;
  /** Public machine context. */
  context: PrimitiveObject;
  /** Private machine context. */
  pContext: any;
  /** Union of every state path declared by the config. */
  paths: string;
  /** Synchronous execution flag. */
  sync: true | undefined;
};

/**
 * A lightweight state machine contract: the machine JSON config, its inferred
 * types and the machine options surface.
 *
 * It carries no option implementation: actions, guards, delays and actors are
 * described by type {@linkcode MachineOptions} only.
 *
 * @template `Config` - Machine configuration type.
 * @template `Types` - Inferred typing surface.
 * @template `Options` - Strict machine options surface, selected by the `sync`
 * flag: `SyncMachineOptions2` / `SyncSimpleMachineOptions` when `sync` is `true`,
 * `AsyncMachineOptions2` / `AsyncSimpleMachineOptions` otherwise.
 */
export type Contract<
  Config extends CommonConfig2 = CommonConfig2,
  Types extends ContractTypes = ContractTypes,
  Options extends AnyMachineOptions = AnyMachineOptions,
> = {
  /** Machine JSON configuration. */
  readonly config: Config;
  /** Inferred typing surface of the contract. */
  readonly types: Types;
  /**
   * Type-only options surface: the return type of `createOptions`. Never
   * defined at runtime.
   */
  readonly options?: Options;
};

/**
 * Extracts the inferred typing surface of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractTypesOf<C extends Contract> = C['types'];

/**
 * Extracts the machine configuration of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractConfig<C extends Contract> = C['config'];

/**
 * Extracts the machine options surface of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractOptions<C extends Contract> = NonNullable<C['options']>;

/**
 * Extracts every typed event object of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractEvents<C extends Contract> = ContractTypesOf<C>['events'];

/**
 * Extracts the union of event names declared by a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractEventType<C extends Contract> = ContractEvents<C>['type'];

/**
 * Extracts every argument accepted when sending an event of the contract.
 *
 * @template `C` - Contract type.
 */
export type ContractEventArg<C extends Contract> = EventArgAll<ContractEvents<C>>;

/**
 * Extracts the raw events map of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractEventsMap<C extends Contract> = ContractTypesOf<C>['eventMap'];

/**
 * Extracts the raw actors map of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractActorsMap<C extends Contract> = ContractTypesOf<C>['actorsMap'];

/**
 * Extracts the public context of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractContext<C extends Contract> = ContractTypesOf<C>['context'];

/**
 * Extracts the private context of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractPContext<C extends Contract> = ContractTypesOf<C>['pContext'];

/**
 * Extracts the union of state paths declared by a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractPaths<C extends Contract> = ContractTypesOf<C>['paths'];

/**
 * Extracts the synchronous execution flag of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractSync<C extends Contract> = ContractTypesOf<C>['sync'];
