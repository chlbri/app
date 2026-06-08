import type {
  CommonInterpreter,
  SimpleMachineOptions2,
  RecordS,
  CommonConfig3,
  EventsMap,
  ActorsConfigMap,
  EventObject,
} from '@bemedev/app/types';
import type { PrimitiveObject } from '@bemedev/typings';
import type { ConstructTestsResult, Option } from './types';
import type { VitestUtils } from 'vitest';

export type ConstructTests_F = <
  const C extends CommonConfig3 = CommonConfig3,
  const Pc = any,
  const Tc extends PrimitiveObject = PrimitiveObject,
  const E extends EventsMap = EventsMap,
  const A extends ActorsConfigMap = ActorsConfigMap,
  const T extends object = object,
  const Ta extends string = string,
  const Eo extends EventObject = EventObject,
  const AllPaths extends string = string,
  const Mo extends SimpleMachineOptions2 = Partial<
    Record<'actions' | 'guards' | 'delays', any> &
      Record<
        'actors',
        {
          children?: RecordS<any>;
          emitters?: RecordS<any>;
        }
      >
  >,
>(
  vi: VitestUtils,
  service: CommonInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>,
  helper?: (option: Option<Eo, Pc, Tc>) => T,
  startIndex?: number,
) => ConstructTestsResult<Eo, T, Ta>;
