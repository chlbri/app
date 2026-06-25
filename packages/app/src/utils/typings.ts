export type { Fn, inferO, inferSh, inferT } from '@bemedev/typings';
import { pretype, type } from '@bemedev/typings';
import * as helpers from '@bemedev/typings/helpers';

export const typings = {
  context: pretype(type(({ primitiveObject }) => primitiveObject.const))
    .type,
  pContext: type,
  eventsMap: pretype(
    type(({ primitiveObject }) => primitiveObject.map.const),
  ),
  actorsMap: pretype(
    type(({ partial, record, primitiveObject }) =>
      partial({
        emitters: record({
          next: primitiveObject.const,
          error: primitiveObject.const,
        }),
        children: record(primitiveObject.map.const),
      }),
    ),
  ),
  any: type,
};

export { helpers };
