export type { Fn, inferO, inferT } from '@bemedev/typings';
import {
  type,
  type inferSh,
  type ObjectT,
  type PrimitiveObjectT,
} from '@bemedev/typings';
import * as helpers from '@bemedev/typings/helpers';

type Helpers = typeof helpers;
type TransformF<U extends ObjectT = ObjectT> = <T extends U = U>(
  option?: ((helpers: Helpers) => T) | T,
) => inferSh<T>;

type ActorsHelper = Partial<{
  children: Record<string, Record<string, ObjectT>>;
  emitters: Record<string, { next: ObjectT; error: ObjectT }>;
}>;

type NoExtraKeysActorsHelper<T extends ActorsHelper> = T &
  Record<Exclude<keyof T, keyof ActorsHelper>, never>;

export const typings = {
  context: type as TransformF<PrimitiveObjectT>,
  pContext: type,
  eventsMap: type as TransformF<Record<string, PrimitiveObjectT>>,
  actorsMap: type as TransformF<NoExtraKeysActorsHelper<ActorsHelper>>,
};

export { helpers };
