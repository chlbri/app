export const checkValues = <T = any>(
  value: unknown,
  ...values: T[]
): value is T => {
  if (values.length === 0) return true;
  return values.includes(value as any);
};

checkValues.orUndefined = <T = any>(
  value: unknown,
  ...values: T[]
): value is T | undefined => {
  if (value === undefined) return true;
  return checkValues(value, ...values);
};
