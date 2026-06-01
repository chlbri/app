import type {
  CommonInterpreter,
  SimpleMachineOptions2,
  RecordS,
  CommonConfig,
  EventsMap,
  ActorsConfigMap,
  EventObject,
} from '@bemedev/app/types';
import type { PrimitiveObject } from '@bemedev/app/bemedev';
import type { ConstructTestsResult, Option } from './types';

export type ConstructTests_F = <
  const C extends CommonConfig = CommonConfig,
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
  service: CommonInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo>,
  helper?: (option: Option<Eo, Pc, Tc>) => T,
  startIndex?: number,
) => ConstructTestsResult<Eo, T, Ta>;
