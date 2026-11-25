import type { RegisterType } from '@bemedev/app-contract/registry';

/**
 * The Register interface is augmented by the CLI-generated `app.gen.ts` file.
 * It uses the TanStack Start pattern of `declare module` augmentation
 * to wire pre-resolved types to machine paths.
 */
// oxlint-disable-next-line typescript/no-empty-object-type
export interface Register extends RegisterType {}
