import type { Accessor } from 'solid-js';

export const buildBoolean = (
  condition?: Accessor<boolean | undefined> | boolean,
) => {
  const _condition =
    typeof condition === 'function'
      ? (condition() ?? true)
      : (condition ?? true);
  return _condition;
};
