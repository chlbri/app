export type RefineStringArray<T extends ReadonlyArray<string>> =
  T extends [] ? string : T[number];
