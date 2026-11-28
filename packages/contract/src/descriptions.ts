import type {
  Contract,
  ContractEventKeys,
  ContractOptions,
  ContractPaths,
} from './types';

/**
 * Strongly typed description hierarchy for each category of machine tokens.
 *
 * The `string[]` is the hierarchy of descriptions the AI must follow to create
 * the token, or the description of a state (or any other token type), so the AI
 * can better understand what the user really wants.
 */
export type Helper<S extends keyof any = keyof any> = Partial<Record<S, string[]>>;

/**
 * Description hierarchy attached to a contract with `describe`.
 *
 * Keys come from the contract options surface, like `provideOptions`: a
 * CLI-generated `Register` entry resolves every token of the machine, while
 * unnamed contracts expose broad records and stay loose.
 *
 * @template | {@linkcode Contract} `Ct` - Contract described.
 * @template `Opts` - Required options surface of the contract.
 */
export type DescriptionProps<
  Ct extends Contract,
  Opts extends Required<ContractOptions<Ct>> = Required<ContractOptions<Ct>>,
> = Partial<{
  general: string[];
  states: Helper<ContractPaths<Ct>>;
  guards: Helper<keyof Opts['guards']>;
  actions: Helper<keyof Opts['actions']>;
  delays: Helper<keyof Opts['delays']>;
  events: Helper<keyof ContractEventKeys<Ct>>;

  actors: Partial<{
    children: Helper<keyof NonNullable<NonNullable<Opts['actors']>['children']>>;
    emitters: Helper<keyof NonNullable<NonNullable<Opts['actors']>['emitters']>>;
  }>;
}>;

/** Description record category (`actions`, `guards`, `delays`, `states`, ...). */
type DescriptionRecord = Record<string, string[] | undefined>;

/**
 * Appends the tail of `next` to `current`.
 *
 * A missing `current` is created from `next`, and a missing `next` leaves
 * `current` untouched.
 *
 * @param current - Existing description hierarchy.
 * @param next - Hierarchy appended by a new `describe` call.
 *
 * @returns The merged hierarchy.
 */
const mergeList = (current?: string[], next?: string[]): string[] | undefined => {
  if (!next?.length) return current;
  if (!current?.length) return [...next];
  return [...current, ...next];
};

/**
 * Merges every token entry of a description record.
 *
 * Missing tokens are created, existing tokens receive the tail of the new
 * array.
 *
 * @param current - Existing token record.
 * @param next - Token record appended by a new `describe` call.
 *
 * @returns The merged token record.
 */
const mergeRecord = (
  current: DescriptionRecord = {},
  next?: DescriptionRecord,
): DescriptionRecord => {
  if (!next) return current;

  for (const key of Object.keys(next)) {
    const values = next[key];
    if (!values?.length) continue;
    current[key] = mergeList(current[key], values);
  }

  return current;
};

/**
 * Merges a description hierarchy into the contract descriptions.
 *
 * @param current - Descriptions already attached to the contract.
 * @param next - Descriptions of the current `describe` call.
 *
 * @returns The updated description hierarchy.
 */
export const mergeDescriptions = (
  current: DescriptionProps<Contract>,
  next: DescriptionProps<Contract>,
): DescriptionProps<Contract> => {
  if (next.general) current.general = mergeList(current.general, next.general);
  if (next.states) current.states = mergeRecord(current.states, next.states);
  if (next.guards) current.guards = mergeRecord(current.guards, next.guards);
  if (next.actions) current.actions = mergeRecord(current.actions, next.actions);
  if (next.delays) current.delays = mergeRecord(current.delays, next.delays);

  if (next.actors) {
    const actors = (current.actors ??= {});
    actors.children = mergeRecord(actors.children, next.actors.children);
    actors.emitters = mergeRecord(actors.emitters, next.actors.emitters);
  }

  return current;
};
