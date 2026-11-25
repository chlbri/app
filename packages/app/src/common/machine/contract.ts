import type {
  Contract,
  ContractActorsMap,
  ContractConfig,
  ContractContext,
  ContractEvents,
  ContractEventsMap,
  ContractOptions,
  ContractPContext,
  ContractPaths,
  ContractTags,
  State,
} from '@bemedev/app-contract';

/**
 * Contract-derived machine types.
 *
 * Every alias reads a single member of the contract so no machine or
 * interpreter class declares its own event, context or tag type parameter.
 */

/** Configuration carried by a contract. */
export type MachineConfigOf<Ct extends Contract> = ContractConfig<Ct>;

/** Public context carried by a contract. */
export type MachineContextOf<Ct extends Contract> = ContractContext<Ct>;

/** Private context carried by a contract. */
export type MachinePContextOf<Ct extends Contract> = ContractPContext<Ct>;

/** Union of typed events carried by a contract. */
export type MachineEventsOf<Ct extends Contract> = ContractEvents<Ct>;

/** Raw events map carried by a contract. */
export type MachineEventsMapOf<Ct extends Contract> = ContractEventsMap<Ct>;

/** Actors map carried by a contract. */
export type MachineActorsOf<Ct extends Contract> = ContractActorsMap<Ct>;

/** Tag union carried by a contract. */
export type MachineTagsOf<Ct extends Contract> = ContractTags<Ct>;

/** State path union carried by a contract. */
export type MachinePathsOf<Ct extends Contract> = ContractPaths<Ct>;

/** Options surface carried by a contract. */
export type MachineOptionsOf<Ct extends Contract> = ContractOptions<Ct>;

/** Active state produced by a contract. */
export type MachineStateOf<Ct extends Contract> = State<Ct>;
