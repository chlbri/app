/**
 * Helpers shared by the synchronous and asynchronous option surfaces.
 *
 * @see -- module sync, -- module async
 */

import { recompose } from '@bemedev/decompose';
import { swap as _swap } from '@bemedev/function-swap';
import type { Contract } from '@bemedev/app-contract';
import { same, type UtilityMap } from '../utility';

import { constructEventsMap } from './events';
import { isDefined, isNotDefined, isNotValue, isValue } from './guards';
import { isDefined as _isDefined } from '@bemedev/app-utils-bemedev';
import { byKey2 } from './objects';
import {
  reduceFnMap,
  reduceFnMapFilterArray,
  reduceFnMapFilterObject,
} from './reduceFnMap';

/**
 * Creates the option helpers that do not depend on the sync/async mode.
 *
 * @param contract - Contract carrying the configuration.
 *
 * @returns Shared helpers plus the derived events list.
 */
export const createCommonHelpers = (contract: Contract) => {
  const config = contract.config as any;
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
    } else if (_isDefined(currentValue) && typeof currentValue === 'object') {
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

  const resend = (resend: any) => () => ({ resend });
  const forceSend = (forceSend: any) => () => ({ forceSend });

  const utilities: UtilityMap = {
    isValue: same(isValue),
    isNotValue: same(isNotValue),
    isDefined: same(isDefined),
    isNotDefined: same(isNotDefined),
    swap: same(swap),
    filter: same(filter),
    erase: same(erase),
    pauseActivity: same(timeAction('pauseActivity')),
    resumeActivity: same(timeAction('resumeActivity')),
    stopActivity: same(timeAction('stopActivity')),
    pauseTimer: same(timeAction('pauseTimer')),
    resumeTimer: same(timeAction('resumeTimer')),
    stopTimer: same(timeAction('stopTimer')),
    resend: same(resend),
    forceSend: same(forceSend),
  };

  return {
    eventsList,
    utilities,
    isValue,
    isNotValue,
    isDefined,
    isNotDefined,
    swap,
    filter,
    erase,
    timeAction,
    resend,
    forceSend,
  };
};
