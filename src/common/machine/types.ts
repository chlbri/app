import type { WithDescriber } from '#actions';
import type { ActorsConfigMap, EventsMap } from '#events';
import type { SimpleMachineOptions2 } from '#machines';
import type { Fn } from '#utils';
import type {
  ObjectT,
  PrimitiveObject,
  Sh,
  StandardKey,
} from '@bemedev/typings';

export type CommonAddOptionsParam_F<
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = Fn<any[], Mo | undefined>;

export type CommonAddOptions_F<
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = (option: CommonAddOptionsParam_F<Mo>) => Mo | undefined;

export type CommonElements<
  C extends {
    readonly strict?: boolean;
    readonly __longRuns?: boolean;
  } = {
    readonly strict?: boolean;
    readonly __longRuns?: boolean;
  },
  E extends EventsMap = EventsMap,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = {
  config: C;
  pContext: Pc;
  events: E;
  actorsMap: A;
  context: Tc;
  actions?: Mo['actions'];
  guards?: Mo['guards'];
  delays?: Mo['delays'];
  actors?: Mo['actors'];
};

export type GetIO_F = (
  key: 'exit' | 'entry',
  node?: any,
) => WithDescriber[];

type StandardOutput2<T extends ObjectT> = Pick<Sh<T>, StandardKey>;

export type StdO2<T extends ObjectT> = StandardOutput2<T>;
