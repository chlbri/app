import type { ConfigDef } from '#machines';

export type RegisterOptions = Record<
  'children' | 'emitters' | 'tags' | 'actions' | 'guards' | 'delays',
  string
>;
/**
 * The Register interface is augmented by the CLI-generated `app.gen.ts` file.
 * It uses the TanStack Start pattern of `declare module` augmentation
 * to wire pre-resolved types to machine paths.
 *
 * @see https://www.npmjs.com/package/@bemedev/app
 */
export interface Register extends Record<
  string,
  {
    paths: {
      map: ConfigDef;
      all: string;
    };

    events: string;
    options: RegisterOptions;
    pContext?: any;
    tags?: string;
  }
  // oxlint-disable-next-line typescript/no-empty-object-type
> {}
