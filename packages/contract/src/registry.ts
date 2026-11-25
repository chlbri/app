import { RegisterType } from './registry.types';

/**
 * The Register interface is augmented by the CLI-generated
 * `app.contract.gen.ts` file. It uses the TanStack Start pattern of
 * `declare module` augmentation to wire pre-resolved types to machine paths.
 *
 */
export interface Register extends RegisterType
// oxlint-disable-next-line typescript/no-empty-object-type
{}
