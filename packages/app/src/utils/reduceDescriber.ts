import { isDescriber, type Describer } from '~types';

/**
 * Signature for function that reduces a string or type {@linkcode Describer} to a string state name.
 *
 * @param value - String or type {@linkcode Describer}.
 *
 * @returns String representation of the state name.
 */
export type ReduceDescriber_F = (value: string | Describer) => string;

/**
 * Reduces a value to its name if it is a describer, otherwise returns the value as is.
 *
 * @param value - String or type {@linkcode Describer} to reduce.
 *
 * @returns The `name` property when the value is a describer, otherwise the value itself.
 *
 * @see {@linkcode isDescriber}
 */
export const reduceDescriber: ReduceDescriber_F = value => {
  if (isDescriber(value)) return value.name;
  return value;
};
