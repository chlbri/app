/**
 * Recursive guard builder re-exported as the
 * `@bemedev/app-options/boolean-recursive` subpath, so consumers of
 * `createOptions` can import it without a direct dependency on
 * `@bemedev/boolean-recursive`.
 *
 * The package exposes its builder as the default export, which `export *`
 * does not forward, hence the explicit re-export.
 */

export { default } from '@bemedev/boolean-recursive';
export * from '@bemedev/boolean-recursive';
