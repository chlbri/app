import type { ActorsConfigMap, EventObject, EventsMap } from './events';
import type { PrimitiveObject } from './primitives';

/**
 * Minimal contract surface used by the vendored option types.
 *
 * It is the part of a contract that every state, function and option type
 * needs. `Contract` is structurally assignable to it, which avoids a circular
 * type reference between the contract definition and its option surface.
 */
export type ContractLike = {
  readonly types: {
    readonly events: EventObject;
    readonly eventMap: EventsMap;
    readonly actorsMap: ActorsConfigMap;
    readonly context: PrimitiveObject;
    readonly pContext: any;
    readonly paths: string;
    readonly tags: string;
    readonly sync?: true;
  };
};

/** Events union of a contract. */
export type ContractEventsOf<Ct extends ContractLike> = Ct['types']['events'];

/** Public context of a contract. */
export type ContractContextOf<Ct extends ContractLike> = Ct['types']['context'];

/** Private context of a contract. */
export type ContractPContextOf<Ct extends ContractLike> = Ct['types']['pContext'];

/** Tag union of a contract. */
export type ContractTagsOf<Ct extends ContractLike> = Ct['types']['tags'];

/** Synchronous execution flag of a contract. */
export type ContractSyncOf<Ct extends ContractLike> = Ct['types']['sync'];
