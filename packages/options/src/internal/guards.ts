/**
 * Guard factories exposed as option helpers.
 *
 * Vendored from `@bemedev/app` so contract-driven options expose the same
 * `isValue`, `isNotValue`, `isDefined` and `isNotDefined` helpers.
 */

import { byKey2 } from './objects';

/**
 * Checks that a context, private context or event path matches one of the
 * provided values.
 *
 * @param path - Property path to read.
 * @param values - Values to compare against.
 *
 * @returns Predicate returning `true` when the read value matches.
 */
export const isValue = (path: string, ...values: any[]) => {
  const start = path.startsWith.bind(path);

  return ({ pContext, context, event }: any) => {
    if (path === 'pContext') return values.some(value => pContext === value);
    if (path === 'context') return values.some(value => context === value);
    if (path === 'events') return values.some(value => event === value);

    if (start('context.')) {
      const key = path.replace('context.', '');
      return values.some(value => byKey2(context, key) === value);
    }

    if (start('pContext.')) {
      const key = path.replace('pContext.', '');
      return values.some(value => byKey2(pContext, key) === value);
    }

    const key = path.replace('events.', '');
    const toValidate = byKey2(event, key);
    return values.some(value => toValidate === value);
  };
};

/**
 * Checks that a context, private context or event path matches none of the
 * provided values.
 *
 * @param path - Property path to read.
 * @param values - Values to compare against.
 *
 * @returns Predicate returning `true` when the read value does not match.
 */
export const isNotValue = (path: string, ...values: any[]) => {
  const func = isValue(path, ...values);
  return (state: any) => !func(state as any);
};

/**
 * Checks that a context property is defined.
 *
 * @param path - Property path to read.
 *
 * @returns Predicate returning `true` when the value is neither `undefined`
 * nor `null`.
 */
export const isDefined = (path: string) => isNotValue(path, undefined, null);

/**
 * Checks that a context property is undefined or null.
 *
 * @param path - Property path to read.
 *
 * @returns Predicate returning `true` when the value is `undefined` or `null`.
 */
export const isNotDefined = (path: string) => isValue(path, undefined, null);
