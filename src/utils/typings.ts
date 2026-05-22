export type { Fn, inferO, inferT, inferSh } from '@bemedev/typings';
import {
  type,
  type inferSh,
  type ObjectT,
  type PARTIAL,
} from '@bemedev/typings';
import * as helpers from '@bemedev/typings/helpers';

export const ttypes = helpers.partial({
  context: helpers.primitiveObject.type,
  pContext: 'any',
  eventsMap: helpers.record(helpers.primitiveObject.type),
  actorsMap: helpers.any({
    emitters: helpers.record({
      next: helpers.primitiveObject.type,
      error: helpers.primitiveObject.type,
    }),
    children: helpers.record(helpers.record(helpers.primitiveObject.type)),
  }),
});

export type TTypes<
  K extends Exclude<keyof typeof ttypes, typeof PARTIAL> = Exclude<
    keyof typeof ttypes,
    typeof PARTIAL
  >,
> = (typeof ttypes)[K];

type Helpers = typeof helpers;
type TransformF<U extends ObjectT = ObjectT> = <T extends U = U>(
  option?: ((helpers: Helpers) => T) | T,
) => inferSh<T>;

export const typings = {
  context: type as TransformF<TTypes<'context'>>,
  pContext: type,
  eventsMap: type as TransformF<TTypes<'eventsMap'>>,
  actorsMap: type as TransformF<{
    children: Record<string, Record<string, ObjectT>>;
    emitters: Record<string, { next: ObjectT; error: ObjectT }>;
  }>,
};

export { helpers };
