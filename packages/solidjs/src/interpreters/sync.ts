import type { SoA } from '@bemedev/app/bemedev';
import { toArray } from '@bemedev/app/bemedev';
import { DEFAULT_DELIMITER } from '@bemedev/app/constants';
import type {
  ActorsConfigMap,
  SyncConfig,
  EventObject,
  EventsMap,
  PrimitiveObject,
  SimpleMachineOptions2,
  State,
  StateValue,
  SyncInterpreter,
  WorkingStatus,
} from '@bemedev/app/types';
import { decomposeSV, merge } from '@bemedev/app/utils';
import { createMemo, createSignal, untrack, type Signal } from 'solid-js';
import { defaultSelector } from '../default';
import type { State_F } from '../types';

export class SolidSyncInterpreter<
  const C extends SyncConfig = SyncConfig,
  const Pc = any,
  const Tc extends PrimitiveObject = PrimitiveObject,
  const E extends EventsMap = EventsMap,
  const A extends ActorsConfigMap = ActorsConfigMap,
  const Ta extends string = string,
  const Eo extends EventObject = EventObject,
  const AllPaths extends string = string,
  const Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  const L extends SimpleMachineOptions2 = SimpleMachineOptions2,
>
  implements Disposable, AsyncDisposable
{
  #service: SyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L>;
  #mainState: Signal<State<Eo, Tc, Ta>>;

  get options() {
    return this.#service.machine.options;
  }

  get #setState() {
    return this.#mainState[1];
  }
  get #state() {
    return this.#mainState[0];
  }

  readonly #initialState: State<Eo, Tc, Ta>;

  constructor(
    service: SyncInterpreter<C, Pc, Tc, E, A, Ta, Eo, AllPaths, Mo, L>,
  ) {
    this.#service = service;
    this.#initialState = service.state;
    this.#mainState = createSignal(this.#initialState);

    this.subscribe(next => {
      this.#setState(prev => merge(prev, next));
    });
  }

  get subscribe() {
    return this.#service.subscribe;
  }

  get send() {
    return this.#service.send;
  }

  get start() {
    return this.#service.start;
  }

  get pause() {
    return this.#service.pause;
  }

  get resume() {
    return this.#service.resume;
  }

  stop = () => {
    this.#service.stop();
    untrack(this.#mainState[0]);
  };

  state: State_F<State<Eo, Tc, Ta>> = (
    accessor = defaultSelector,
    equals,
  ) => {
    return createMemo(
      () => {
        const value = this.#state();
        return accessor(value);
      },
      this.#initialState,
      { equals },
    );
  };

  watcher = <T>(accessor: (state: State<Eo, Tc, Ta>) => T) => {
    return (equals?: false | ((prev: T, next: T) => boolean)) => {
      return this.state(accessor, equals);
    };
  };

  reducer = <T>(accessor: (state: State<Eo, Tc, Ta>) => T) => {
    return <R = T>(
      _accessor: (state: T) => R = defaultSelector,
      equals?: false | ((prev: R, next: R) => boolean),
    ) => {
      return this.state(state => {
        const step1 = accessor(state);
        const step2 = _accessor(step1);
        return step2;
      }, equals);
    };
  };

  hasTags = (...tags: Ta[]) => {
    const currentTags = this.state(({ tags }) => tags)();
    if (!currentTags) return false;
    return tags.every(tag => toArray.typed(currentTags).includes(tag));
  };

  context = this.reducer<Tc>(state => state.context);
  value = this.watcher<StateValue>(state => state.value);
  status = this.watcher<WorkingStatus>(state => state.status);
  tags = this.watcher<SoA<Ta> | undefined>(state => state.tags);

  #dps = this.watcher(({ value }) =>
    decomposeSV
      .low(value)
      .map(entry => entry.replaceAll('.', DEFAULT_DELIMITER)),
  );

  matches = (...values: string[]) => {
    const dps = this.#dps()();
    return createMemo(() => values.every(value => dps.includes(value)));
  };

  contains = (...values: string[]) => {
    const dps = this.#dps()();
    return createMemo(() => values.some(value => dps.includes(value)));
  };

  dispose = () => {
    this.#service.dispose();
    (this.#mainState as any) = undefined;
  };

  [Symbol.dispose] = this.dispose;
  [Symbol.asyncDispose] = async () => this.dispose();
}
