/**
 * Function type signature for checking key presence in an object.
 */
export type CheckKeys_F = {
  /**
   * Checks if all keys in object `arg` are present in `keys`.
   *
   * @template T - Object type extending `object`.
   * @param arg - Object to check keys against.
   * @param keys - Allowed keys.
   *
   * @returns `true` if all object keys are present in `keys`, `false` otherwise.
   */
  <T extends object>(arg: T, ...keys: string[]): boolean;

  /**
   * Performs a strict check verifying both key containment and matching key counts.
   *
   * @template T - Object type extending `object`.
   * @param arg - Object to check.
   * @param keys - Required exact keys.
   *
   * @returns `true` if object keys exactly match `keys`, `false` otherwise.
   */
  strict: <T extends object>(arg: T, ...keys: string[]) => boolean;
};

/**
 * Checks if all keys present in object `arg` are included in `keys`.
 * Includes property {@linkcode checkKeys.strict}.
 *
 * @param arg - Object to check keys against.
 * @param keys - Keys to check for presence in the object.
 *
 * @returns `true` if all keys are present, `false` otherwise.
 *
 * @see {@linkcode CheckKeys_F}
 */
export const checkKeys: CheckKeys_F = (arg, ...keys) => {
  const argKeys = Object.keys(arg);
  for (const key of argKeys) {
    const check = !keys.includes(key);
    if (check) return false;
  }
  return true;
};

/**
 * Performs a strict key check ensuring object `arg` has exactly all `keys` and no extra or missing keys.
 *
 * @param arg - Object to check.
 * @param keys - Keys required to exist on the object.
 *
 * @returns `true` if object keys match specified `keys` exactly, `false` otherwise.
 */
checkKeys.strict = (arg, ...keys) => {
  const check1 = checkKeys(arg, ...keys);
  if (!check1) return false;

  const argKeys = Object.keys(arg);
  for (const key of keys) {
    const check = !argKeys.includes(key);
    if (check) return false;
  }
  return true;
};
