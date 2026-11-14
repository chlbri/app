import type { TargetDef } from '#states';
import type { RegisterOptions } from '@bemedev/app-options';

export type { RegisterOptions } from '@bemedev/app-options';

/**
 * The Register interface is augmented by the CLI-generated `app.gen.ts` file.
 * It uses the TanStack Start pattern of `declare module` augmentation
 * to wire pre-resolved types to machine paths.
 */
export interface Register extends Record<
  string,
  {
    paths: { map: TargetDef; all: string };

    events: string;
    options: RegisterOptions;
    pContext?: any;
  }
  // oxlint-disable-next-line typescript/no-empty-object-type
> {}
