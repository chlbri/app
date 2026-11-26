import type { Contract, ContractOptions, ContractPaths } from './types';

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
  actors: Partial<{
    children: Helper<keyof NonNullable<NonNullable<Opts['actors']>['children']>>;
    emitters: Helper<keyof NonNullable<NonNullable<Opts['actors']>['emitters']>>;
  }>;
}>;
