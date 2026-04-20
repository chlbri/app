export type { inferT, inferO, Fn } from '@bemedev/typings';
import * as helpers from '@bemedev/typings/helpers';
import {
  type,
  type inferSh,
  type ObjectT,
  type PARTIAL,
} from '@bemedev/typings';

export const ttypes = helpers.partial({
  context: helpers.primitiveObject.type,
  pContext: 'any',
  eventsMap: helpers.record(helpers.primitiveObject.type),
  actorsMap: helpers.partial({
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
type TransformF = <T extends ObjectT = ObjectT>(
  option?: ((helpers: Helpers) => T) | T,
) => inferSh<T>;

const _type: TransformF = type;
export const typings = {
  context: <T extends TTypes<'context'>>(t: T) => _type<T>(t),
  pContext: _type,
  eventsMap: <T extends TTypes<'eventsMap'>>(t: T) => _type<T>(t),
  actorsMap: <T extends TTypes<'actorsMap'>>(t: T) => _type<T>(t),
};

export { helpers };
