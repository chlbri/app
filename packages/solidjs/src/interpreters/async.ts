import type {
  ActorsConfigMap,
  AsyncInterpreter,
  CommonConfig3,
  EventObject,
  EventsMap,
  PrimitiveObject,
  SimpleMachineOptions2,
} from '@bemedev/app/types';
import { SolidInterpreter } from './common';

export class SolidAsyncInterpreter<
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
> extends SolidInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo> {
  readonly TYPE = 'async';

  constructor(
    protected __service: AsyncInterpreter<
      C,
      Pc,
      Tc,
      E,
      A,
      Ta,
      Eo,
      AllPaths,
      Mo,
      L
    >,
  ) {
    super(__service);
  }
}
