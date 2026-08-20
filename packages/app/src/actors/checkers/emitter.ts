import { checkAction } from '#actions';
import { checkGuards } from '#guards';
import { isStringOrUndefined } from '#utils';
import {
  isSingleOrArrayT,
  isTransitionConfigMapActions,
} from '../../transitions/functions/is/transition';
import type { EmitterConfig, FinallyConfig } from '../types';

/**
 * Type guard for checking single completion transition entry.
 *
 * @param value - Value to check.
 *
 * @returns `true` if single completion transition config, `false` otherwise.
 */
export const isFinallyConfig1 = (value: unknown) => {
  const check1 = checkAction(value);
  if (check1) return true;
  return isTransitionConfigMapActions(value) && value.target === undefined;
};

/**
 * Type guard for checking completion transition configurations.
 *
 * @param value - Value to check.
 *
 * @returns `true` if type {@linkcode FinallyConfig}, `false` otherwise.
 */
export const isFinallyConfig = (value: unknown): value is FinallyConfig => {
  if (Array.isArray(value)) {
    const _value = [...value];
    const pop = _value.pop();
    if (!pop) return false;
    const check1 = isFinallyConfig1(pop);
    if (!check1) return false;

    const out = _value.every(v => {
      const check2 = isTransitionConfigMapActions(v);
      if (!check2) return false;
      return checkGuards(v.guards);
    });
    return out;
  }

  return isFinallyConfig1(value);
};

isFinallyConfig.orUndefined = (
  value: unknown,
): value is FinallyConfig | undefined => {
  if (value === undefined) return true;
  return isFinallyConfig(value);
};

/**
 * Type guard for checking if a value is a valid emitter configuration.
 *
 * @template {string[]} T - Path keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target state paths.
 *
 * @returns `true` if type {@linkcode EmitterConfig}, `false` otherwise.
 */
export const isEmitterConfig = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is EmitterConfig<T[number]> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;

  const _value: any = value;
  const description = _value.description;
  const next = _value.next;
  const error = _value.error;
  const complete = _value.complete;

  if (!isStringOrUndefined(description)) return false;
  if (!isSingleOrArrayT(next, ...keys)) return false;
  if (!isSingleOrArrayT.orUndefined(error, ...keys)) return false;
  return isFinallyConfig.orUndefined(complete);
};
