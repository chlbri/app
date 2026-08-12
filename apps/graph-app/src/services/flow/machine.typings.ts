import { type } from '@bemedev/app/bemedev';
import type { EdgeMarkerType } from 'reactflow';

export const _type = type(({ litterals }) =>
  litterals(
    'guard',
    'state',
    'action',
    'delay',
    'activity',
    'emitter',
    'sub-machine',
    'machine',
  ),
);

export const style = type(({ record, union }) =>
  record(union('string', 'number')),
);
export const position = type(() => ({ x: 'number', y: 'number' }));

export const node = type(({ use, optional }) => ({
  id: 'string',
  type: use(_type),
  position: use(position),
  parentId: optional('string'),
  style: optional(use(style)),
  extendParent: optional('boolean'),
}));

export const connection = type(({ optional }) => ({
  source: 'string',
  target: 'string',
  sourceHandle: optional('string'),
  targetHandle: optional('string'),
}));

export const edge = type(({ use, optional, custom, intersection }) =>
  intersection(use(connection), {
    id: 'string',
    animated: optional('boolean'),
    style: optional(use(style)),
    markerEnd: optional(custom<EdgeMarkerType>()),
    markerStart: optional(custom<EdgeMarkerType>()),
  }),
);
