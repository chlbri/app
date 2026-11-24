/**
 * Refines a readonly array of string literals `T` into a union of its elements or `string` if empty.
 *
 * @template `T` - The string array type extending `ReadonlyArray<string>`.
 */
export type RefineStringArray<T extends ReadonlyArray<string>> = T extends []
  ? string
  : T[number];
