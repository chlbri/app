import type {
  ActorsConfigMap,
  EventArgAll,
  EventObject,
  EventsMap,
  ToEventObject,
  ToEvents,
} from './internal/events';
import type { CommonConfig2 } from './internal/machine';
import type { inferT, PrimitiveObject, StandardOutput } from './internal/primitives';

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
 * Resolved typing surface of a contract.
 *
 * These fields are type-only markers: they are never present at runtime and
 * are read through the helper types exported by this package.
 */
export type ResolvedContract = {
  /** Union of every typed event object accepted by the machine. */
  events: EventObject;
  /** Raw events map declared by the contract. */
  eventMap: EventsMap;
  /** Raw actors map declared by the contract. */
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
 * A lightweight state machine contract: the machine JSON config plus its
 * types, without any option implementation.
 *
 * @template `Name` - Contract identifier.
 * @template `Config` - Machine configuration type.
 * @template `Schemas` - Raw type schemas passed to the contract.
 * @template `Resolved` - Resolved typing surface, used by helper types.
 */
export type Contract<
  Name extends string = string,
  Config extends CommonConfig2 = CommonConfig2,
  Schemas extends ContractSchemas = ContractSchemas,
  Resolved extends ResolvedContract = ResolvedContract,
> = {
  /** Contract identifier. */
  readonly name: Name;
  /** Machine JSON configuration. */
  readonly config: Config;
  /** Type schemas passed to {@linkcode createContract}. */
  readonly types: Schemas;
  /**
   * Type-only resolved surface. Never defined at runtime.
   *
   * @internal
   */
  readonly __contract?: Resolved;
};

/**
 * Extracts the resolved typing surface of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractOf<C extends Contract> = NonNullable<C['__contract']>;

/**
 * Extracts the identifier of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractName<C extends Contract> = C['name'];

/**
 * Extracts the machine configuration of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractConfig<C extends Contract> = C['config'];

/**
 * Extracts the raw type schemas of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractTypesOf<C extends Contract> = C['types'];

/**
 * Extracts every typed event object of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractEvents<C extends Contract> = ContractOf<C>['events'];

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
export type ContractEventsMap<C extends Contract> = ContractOf<C>['eventMap'];

/**
 * Extracts the raw actors map of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractActorsMap<C extends Contract> = ContractOf<C>['actorsMap'];

/**
 * Extracts the public context of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractContext<C extends Contract> = ContractOf<C>['context'];

/**
 * Extracts the private context of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractPContext<C extends Contract> = ContractOf<C>['pContext'];

/**
 * Extracts the union of state paths declared by a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractPaths<C extends Contract> = ContractOf<C>['paths'];

/**
 * Extracts the synchronous execution flag of a contract.
 *
 * @template `C` - Contract type.
 */
export type ContractSync<C extends Contract> = ContractOf<C>['sync'];

/**
 * Function signature for {@linkcode createContract}.
 *
 * The arguments intentionally match the named overload of `createMachine`
 * from `@bemedev/app`: a name, a JSON config and optional type schemas.
 */
export type CreateContract_F = <
  const Name extends string,
  const Config extends CommonConfig2,
  const Pc extends StandardOutput<any> = StandardOutput<any>,
  const Tc extends StandardOutput<PrimitiveObject> = StandardOutput<undefined>,
  const E extends StandardOutput<Record<string, PrimitiveObject>> = StandardOutput<
    Record<string, never>
  >,
  const A extends StandardOutput<ActorsConfigMap> = StandardOutput<ActorsConfigMap>,
  _E extends inferT<E> = inferT<E>,
  _A extends inferT<A> = inferT<A>,
  _Pc extends inferT<Pc> = inferT<Pc>,
  _Tc extends inferT<Tc> = inferT<Tc>,
  Eo extends EventObject = ToEventObject<ToEvents<_E, _A>>,
  Sync extends true | undefined = undefined,
>(
  name: Name,
  config: Config,
  types?: { context?: Tc; pContext?: Pc; eventsMap?: E; actorsMap?: A; sync?: Sync },
) => Contract<
  Name,
  Config,
  { context?: Tc; pContext?: Pc; eventsMap?: E; actorsMap?: A; sync?: Sync },
  {
    events: Eo;
    eventMap: _E;
    actorsMap: _A;
    context: _Tc;
    pContext: _Pc;
    paths: StatePaths<Config>;
    sync: Sync;
  }
>;
