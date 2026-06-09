import type {
  SolidAsyncInterpreter,
  SolidSyncInterpreter,
} from '@bemedev/app-solidjs';
import type {
  ActorsConfigMap,
  CommonConfig3,
  EventObject,
  EventsMap,
  PrimitiveObject,
  SimpleMachineOptions2,
} from '@bemedev/app/types';

export type SolidTest_F = <
  const C extends CommonConfig3 = CommonConfig3,
  const Pc = any,
  const Tc extends PrimitiveObject = PrimitiveObject,
  const E extends EventsMap = EventsMap,
  const A extends ActorsConfigMap = ActorsConfigMap,
  const Ta extends string = string,
  const Eo extends EventObject = EventObject,
  const AllPaths extends string = string,
  const Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  const L extends SimpleMachineOptions2 = SimpleMachineOptions2,
>(
  solid:
    | SolidSyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L>
    | SolidAsyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L>,
) => (typeof solid)['TYPE'] extends 'sync'
  ? SolidSyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L>
  : SolidAsyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L>;
