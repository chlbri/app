import type { EventObject, PrimitiveObject } from "@bemedev/app-contract";
import type { Fn } from "@bemedev/app-utils-bemedev";
// oxlint-disable-next-line no-unused-vars
import { createOptions } from "../createOptions";
import { ValueDefined, ValueIs } from "./guards.types";

export type _Addons = Record<string, { sync: Fn; async: Fn }>;

/**
 * Utils that will be used inside {@linkcode createOptions}
 */
// oxlint-disable-next-line typescript/no-empty-object-type
export interface Addons<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> extends _Addons {
  isDefined: ValueDefined<E, Pc, Tc, T>;
  isNotDefined: ValueDefined<E, Pc, Tc, T>;
  isValue: ValueIs<E, Pc, Tc, T>;
  isNotValue: ValueIs<E, Pc, Tc, T>;
}

export type AddonUtilsSync = { [K in keyof Addons]: Addons[K]["sync"] };
export type AddonUtilsAsync = { [K in keyof Addons]: Addons[K]["async"] };
