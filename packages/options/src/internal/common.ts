/**
 * Helpers shared by the synchronous and asynchronous option surfaces.
 *
 * @see -- module sync, -- module async
 */

import { recompose } from '@bemedev/decompose';
import { swap as _swap } from '@bemedev/function-swap';

import { constructEventsMap } from './events';
import { isDefined, isNotDefined, isNotValue, isValue } from './guards';
import { byKey2 } from './objects';
import {
  reduceFnMap,
  reduceFnMapFilterArray,
  reduceFnMapFilterObject,
} from './reduceFnMap';

/**
 * Creates the option helpers that do not depend on the sync/async mode.
 *
 * @param config - Contract machine configuration.
 *
 * @returns Shared helpers plus the derived events list.
 */
export const createCommonHelpers = (config: any) => {
  const eventsList = constructEventsMap(config);

  /**
   * Creates an action marking an activity or timer operation.
   *
   * @param name - Activity or timer operation name.
   *
   * @returns Action factory.
   */
  const timeAction =
    (name: string) =>
    (id: string) =>
    ({ context, pContext }: any) => ({ context, pContext, [name]: id });

  /**
   * Swaps state arguments in functional transitions.
   *
   * @param fn - Function to swap.
   * @param event - Optional event name to scope the swap.
   *
   * @returns Function mapping decomposed paths to the swapped function.
   */
  const swap = (fn: any, event?: string) => (types: any) => {
    const swapped = _swap(fn).constraint()(types);
    const __fn = event ? { [event]: swapped } : swapped;
    return reduceFnMap(__fn, ...eventsList);
  };

  /**
   * Filters an array or object property of the context.
   *
   * @param key - Context key path to filter.
   * @param fn - Filter predicate or predicate map.
   *
   * @returns Action filtering the property.
   */
  const filter = (key: string, fn: any) => (state: any) => {
    const currentValue = byKey2(state.context, key);
    let filteredValue: any;

    if (Array.isArray(currentValue)) {
      const predicate = reduceFnMapFilterArray(fn, ...eventsList);
      filteredValue = currentValue.filter((item, index) =>
        predicate(item, index, state),
      );
    } else if (currentValue !== null && typeof currentValue === 'object') {
      const predicate = reduceFnMapFilterObject(fn, ...eventsList);
      filteredValue = Object.entries(currentValue).reduce((acc, [objKey, value]) => {
        if (predicate(value, state)) acc[objKey] = value;
        return acc;
      }, {} as any);
    }

    return {
      mergers: [
        { key: key as any, source: recompose({ [key]: filteredValue }) as any },
      ],
    };
  };

  /**
   * Erases context properties.
   *
   * @param keys - Key paths to erase.
   *
   * @returns Action erasing the properties.
   */
  const erase =
    (...keys: string[]) =>
    () => ({
      mergers:
        keys.length === 0
          ? [{ source: undefined }]
          : keys.map(key => ({
              key: key as any,
              source: recompose.low({ [key]: undefined }) as any,
            })),
    });

  return {
    eventsList,
    isValue,
    isNotValue,
    isDefined,
    isNotDefined,
    swap,
    filter,
    erase,
    timeAction,
    resend: (resend: any) => () => ({ resend }),
    forceSend: (forceSend: any) => () => ({ forceSend }),
  };
};
