import type { RecordS } from './internal';

/**
 * Registry target definition describing every declared state path.
 *
 * It mirrors the CLI-generated `paths.map` tree: each node exposes its resolved
 * absolute path and, when compound, its initial child and nested nodes.
 */
export type TargetDef = {
  /** Resolved absolute path of the node. */
  readonly targets: string;
  /** Initial child key when the node is compound. */
  readonly initial?: string;
  /** Nested target definitions keyed by child state key. */
  readonly states?: RecordS<TargetDef>;
};

/**
 * Map of option categories to string identifiers for registry options.
 */
export type RegisterOptions = Record<
  'children' | 'emitters' | 'tags' | 'actions' | 'guards' | 'delays',
  string
>;
/**
 * The Register interface is augmented by the CLI-generated `app.gen.ts` file.
 * It uses the TanStack Start pattern of `declare module` augmentation
 * to wire pre-resolved types to machine paths.
 *
 */
export interface Register extends Record<
  string,
  {
    /** Resolved path tree and flattened path union of the contract. */
    paths: { map: TargetDef; all: string };
    /** Union of event names declared by the contract. */
    events: string;
    /** Option identifiers available for the contract. */
    options: RegisterOptions;
    /** Private context surfaced by the contract. */
    pContext?: any;
  }
  // oxlint-disable-next-line typescript/no-empty-object-type
> {}
