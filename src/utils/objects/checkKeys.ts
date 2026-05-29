export type CheckKeys_F = {
  <T extends object>(arg: T, ...keys: string[]): boolean;
  strict: <T extends object>(arg: T, ...keys: string[]) => boolean;
  strictest: <T extends object>(arg: T, ...keys: string[]) => boolean;
};

/**
 * Checks if all specified keys are present in the given object.
 * @param arg Object to check keys against
 * @param keys Keys to check for presence in the object
 * @returns `true` if all keys are present, `false` otherwise
 *
 * @see {@linkcode CheckKeys_F} for the type definition
 */
export const checkKeys: CheckKeys_F = (arg, ...keys) => {
  const argKeys = Object.keys(arg);
  for (const key of argKeys) {
    const check = !keys.includes(key);
    if (check) return false;
  }
  return true;
};

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

checkKeys.strictest = (arg, ...keys) => {
  const argKeys = Object.keys(arg);
  const check0 = argKeys.length === keys.length;
  if (!check0) return false;
  return checkKeys.strict(arg, ...keys);
};
