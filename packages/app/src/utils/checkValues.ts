/**
 * Type guard function to verify if a value is contained within a list of allowed values.
 * Includes property {@linkcode checkValues.orUndefined}.
 *
 * @template T - The type of allowed values, defaults to `any`.
 * @param value - The value to check.
 * @param values - Variadic array of allowed values.
 *
 * @returns `true` if `values` is empty or includes `value`, `false` otherwise.
 */
export const checkValues = <T = any>(
  value: unknown,
  ...values: T[]
): value is T => {
  if (values.length === 0) return true;
  return values.includes(value as any);
};

/**
 * Type guard function to verify if a value is undefined or contained within a list of allowed values.
 *
 * @template T - The type of allowed values, defaults to `any`.
 * @param value - The value to check.
 * @param values - Variadic array of allowed values.
 *
 * @returns `true` if `value` is undefined or included in `values`, `false` otherwise.
 */
checkValues.orUndefined = <T = any>(
  value: unknown,
  ...values: T[]
): value is T | undefined => {
  if (value === undefined) return true;
  return checkValues(value, ...values);
};
