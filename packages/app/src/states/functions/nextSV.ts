import { DEFAULT_DELIMITER } from '#constants';
import {
  deleteFirst,
  isStringEmpty,
  recomposeSV,
  replaceAll,
} from '#utils';
import { _any, isDefined, trueO } from '@bemedev/app-utils-bemedev';
import { decompose, decomposeKeys, recompose } from '@bemedev/decompose';
import { isString } from '~types';
import type { StateValue } from '../types';

/**
 * Function signature for calculating next state value.
 *
 * @template {StateValue} T - State value type.
 *
 * @param from - Current state value.
 * @param target - Target state path.
 *
 * @returns Updated state value of type {@linkcode StateValue}.
 */
export type NextStateValue_F = <T extends StateValue>(
  from: T,
  target?: string | undefined,
) => StateValue;

/**
 * Returns the next state value based on the current state value and a target string.
 *
 * @param from - The current state value, which can be a string or an object.
 * @param target - The target string to transition to. If not provided, the function returns the current state value.
 * @returns The next state value based on the provided conditions.
 *
 * @see {@linkcode isStringEmpty}, {@linkcode recomposeSV}, {@linkcode replaceAll}, {@linkcode DEFAULT_DELIMITER}
 */
export const nextSV: NextStateValue_F = (from, target) => {
  const isFromEmpty = isStringEmpty(from);
  if (isFromEmpty) return {};

  const isTargetDefined = isDefined(target);
  if (!isTargetDefined) return from;

  const targetIsEmpty = isStringEmpty(target);
  if (targetIsEmpty) return from;

  const check11 = !target.startsWith('/');
  if (check11) return from;

  const check2 = isString(from);

  if (check2) {
    const check31 = target.includes(`${from}/`);

    if (check31) {
      const out = recomposeSV(target);
      return out;
    }
    return target;
  }

  const keys = Object.keys(from);

  const check4 = keys.length === 0;
  if (check4) return from;

  const decomposed = _any(
    decompose(trueO.forceCast(from), { start: false, object: 'key' }),
  );

  const last = target.lastIndexOf(DEFAULT_DELIMITER);

  const entry = target.substring(0, last);

  const _target2 = replaceAll({
    entry,
    match: DEFAULT_DELIMITER,
    replacement: '.',
  });

  const target2 = deleteFirst(_target2, '.');
  const keysD = decomposeKeys.low(from);
  const check5 = keysD.includes(target2 as any);

  if (check5) {
    decomposed[target2] = target.substring(last + 1);
  } else return target;

  const out: any = recompose(decomposed);
  return out;
};
