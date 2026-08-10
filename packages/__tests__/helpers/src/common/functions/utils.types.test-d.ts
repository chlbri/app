import type { Fn, FnMap, FnMapR } from '@bemedev/app/types';
import type { IsAsyncConfig, IsAsyncFnMap } from './types';

// ============================================================================
// IsAsyncFnMap Tests
// ============================================================================

// Test 1: Plain Fn type (generic function) - should be false
type Test_IsAsyncFnMap_1 = IsAsyncFnMap<Fn>;
expectTypeOf<Test_IsAsyncFnMap_1>().toEqualTypeOf<false>();

// Test 2: Fn with specific signature returning void - should be false
type Test_IsAsyncFnMap_2 = IsAsyncFnMap<Fn<[any], void>>;
expectTypeOf<Test_IsAsyncFnMap_2>().toEqualTypeOf<false>();

// Test 3: Fn with Promise return type - should be false (Fn doesn't match FnMap or FnMapR)
type Test_IsAsyncFnMap_3 = IsAsyncFnMap<Fn<[any], Promise<void>>>;
expectTypeOf<Test_IsAsyncFnMap_3>().toEqualTypeOf<true>();

// Test 4: FnMapR with Promise return - should be true
type Test_IsAsyncFnMap_4 = IsAsyncFnMap<{
  DATA?: () => any;
  DODO?: () => any;
}>;
expectTypeOf<Test_IsAsyncFnMap_4>().toEqualTypeOf<false>();

type Test_IsAsyncFnMap_4_1 = IsAsyncFnMap<{
  DATA?: () => any;
  DATA2: () => any;
  DODO?: () => Promise<any>;
}>;
expectTypeOf<Test_IsAsyncFnMap_4_1>().toEqualTypeOf<true>();

// Test 5: FnMapR with Promise<string> return - should be true
type Test_IsAsyncFnMap_5 = IsAsyncFnMap<
  FnMapR<any, any, any, Promise<string>>
>;
expectTypeOf<Test_IsAsyncFnMap_5>().toEqualTypeOf<true>();

// Test 6: FnMapR with void return - should be false
type Test_IsAsyncFnMap_6 = IsAsyncFnMap<FnMapR<any, any, any, void>>;
expectTypeOf<Test_IsAsyncFnMap_6>().toEqualTypeOf<false>();

// Test 7: FnMapR with number return - should be false
type Test_IsAsyncFnMap_7 = IsAsyncFnMap<FnMapR<any, any, any, number>>;
expectTypeOf<Test_IsAsyncFnMap_7>().toEqualTypeOf<false>();

// Test 8: FnMapR with string return - should be false
type Test_IsAsyncFnMap_8 = IsAsyncFnMap<FnMapR<any, any, any, string>>;
expectTypeOf<Test_IsAsyncFnMap_8>().toEqualTypeOf<false>();

// Test 9: FnMapR with any return - should be false
type Test_IsAsyncFnMap_9 = IsAsyncFnMap<FnMapR<any, any, any, any>>;
expectTypeOf<Test_IsAsyncFnMap_9>().toEqualTypeOf<false>();

// Test 10: FnMap with Promise return - should be true
type Test_IsAsyncFnMap_10 = IsAsyncFnMap<
  FnMap<any, any, any, any, Promise<void>>
>;
expectTypeOf<Test_IsAsyncFnMap_10>().toEqualTypeOf<true>();

// Test 11: FnMap with Promise<number> return - should be true
type Test_IsAsyncFnMap_11 = IsAsyncFnMap<
  FnMap<any, any, any, any, Promise<number>>
>;
expectTypeOf<Test_IsAsyncFnMap_11>().toEqualTypeOf<true>();

// Test 12: FnMap with void return - should be false
type Test_IsAsyncFnMap_12 = IsAsyncFnMap<FnMap<any, any, any, any, void>>;
expectTypeOf<Test_IsAsyncFnMap_12>().toEqualTypeOf<false>();

// Test 13: FnMap with number return - should be false
type Test_IsAsyncFnMap_13 = IsAsyncFnMap<
  FnMap<any, any, any, any, number>
>;
expectTypeOf<Test_IsAsyncFnMap_13>().toEqualTypeOf<false>();

// Test 14: FnMap with string return - should be false
type Test_IsAsyncFnMap_14 = IsAsyncFnMap<
  FnMap<any, any, any, any, string>
>;
expectTypeOf<Test_IsAsyncFnMap_14>().toEqualTypeOf<false>();

// Test 15: FnMap with any return - should be false
type Test_IsAsyncFnMap_15 = IsAsyncFnMap<FnMap<any, any, any, any, any>>;
expectTypeOf<Test_IsAsyncFnMap_15>().toEqualTypeOf<false>();

// Test 16: Random type that's neither FnMap nor FnMapR - should be false
type Test_IsAsyncFnMap_16 = IsAsyncFnMap<
  { foo: string } & (FnMap | FnMapR)
>;
expectTypeOf<Test_IsAsyncFnMap_16>().toEqualTypeOf<false>();

// Test 17: FnMapR with nested Promise return type - should be true
type Test_IsAsyncFnMap_17 = IsAsyncFnMap<
  FnMapR<any, any, any, Promise<Promise<void>>>
>;
expectTypeOf<Test_IsAsyncFnMap_17>().toEqualTypeOf<true>();

// ============================================================================
// IsAsyncConfig Tests
// ============================================================================

// Test 1: Type with 'after' property - should be true
type Test_IsAsyncConfig_1 = IsAsyncConfig<{ after: () => void }>;
expectTypeOf<Test_IsAsyncConfig_1>().toEqualTypeOf<true>();

// Test 2: Type with 'after' property and other properties - should be true
type Test_IsAsyncConfig_2 = IsAsyncConfig<{ after: 100; foo: string }>;
expectTypeOf<Test_IsAsyncConfig_2>().toEqualTypeOf<true>();

// Test 3: Type with nested states containing 'after' - should be true
type Test_IsAsyncConfig_3 = IsAsyncConfig<{
  states: { idle: { after: 100 }; active: { foo: string } };
}>;
expectTypeOf<Test_IsAsyncConfig_3>().toEqualTypeOf<true>();

// Test 4: Type with states that don't have 'after' - should be false
type Test_IsAsyncConfig_4 = IsAsyncConfig<{
  states: { idle: { foo: string }; active: { bar: number } };
}>;
expectTypeOf<Test_IsAsyncConfig_4>().toEqualTypeOf<false>();

// Test 5: Type without 'after' or 'states' - should be false
type Test_IsAsyncConfig_5 = IsAsyncConfig<{ foo: string; bar: number }>;
expectTypeOf<Test_IsAsyncConfig_5>().toEqualTypeOf<false>();

// Test 6: Empty object - should be false
type Test_IsAsyncConfig_6 = IsAsyncConfig<{}>;
expectTypeOf<Test_IsAsyncConfig_6>().toEqualTypeOf<false>();

// Test 7: Type with deeply nested states with 'after' - should be true
type Test_IsAsyncConfig_7 = IsAsyncConfig<{
  states: { idle: { states: { waiting: { after: 200 } } } };
}>;
expectTypeOf<Test_IsAsyncConfig_7>().toEqualTypeOf<true>();

// Test 8: Type with deeply nested states without 'after' - should be false
type Test_IsAsyncConfig_8 = IsAsyncConfig<{
  states: { idle: { states: { waiting: { foo: string } } } };
}>;
expectTypeOf<Test_IsAsyncConfig_8>().toEqualTypeOf<false>();

// Test 9: Type with 'after' value as null - should be true
type Test_IsAsyncConfig_9 = IsAsyncConfig<{ after: null }>;
expectTypeOf<Test_IsAsyncConfig_9>().toEqualTypeOf<true>();

// Test 10: Type with 'after' value as undefined - should be true
type Test_IsAsyncConfig_10 = IsAsyncConfig<{ after: undefined }>;
expectTypeOf<Test_IsAsyncConfig_10>().toEqualTypeOf<true>();

// Test 11: complex without 'after' - should be false
type Test_IsAsyncConfig_11 = IsAsyncConfig<{
  states: {
    data: {
      states: { loading: { foo: string }; success: { bar: number } };
    };
    idle: { states: { waiting: { foo: string } } };
  };
}>;
expectTypeOf<Test_IsAsyncConfig_11>().toEqualTypeOf<false>();

// Test 12: complex with only on 'after' - should be true
type Test_IsAsyncConfig_12 = IsAsyncConfig<{
  after: 45;
  states: {
    data: {
      states: { loading: { foo: string }; success: { bar: number } };
    };
    idle: { states: { waiting: { foo: string } } };
  };
}>;
expectTypeOf<Test_IsAsyncConfig_12>().toEqualTypeOf<true>();

// Test 13: complex with only on 'after' #2 - should be true
type Test_IsAsyncConfig_13 = IsAsyncConfig<{
  on: { DODO: { actions: ['dodo'] } };
  states: {
    data: {
      states: { loading: { foo: string }; success: { bar: number } };
    };
    idle: { states: { waiting: { foo: string; after: 45 } } };
  };
}>;
expectTypeOf<Test_IsAsyncConfig_13>().toEqualTypeOf<true>();

// Test 14: complex with multiples 'after' - should be true
type Test_IsAsyncConfig_14 = IsAsyncConfig<{
  on: { DODO: { actions: ['dodo'] } };
  states: {
    data: {
      states: {
        loading: { foo: string; after: 45 };
        success: { bar: number };
      };
    };
    idle: { states: { waiting: { foo: string; after: 45 } } };
  };
}>;
expectTypeOf<Test_IsAsyncConfig_14>().toEqualTypeOf<true>();

// Test 15: complex with only on 'after', deep nested #3 - should be true
type Test_IsAsyncConfig_15 = IsAsyncConfig<{
  on: { DODO: { actions: ['dodo'] } };
  states: {
    data: {
      states: { loading: { foo: string }; success: { bar: number } };
    };
    idle: {
      states: {
        waiting: { foo: string; states: { after: { after: 45 } } };
      };
    };
  };
}>;
expectTypeOf<Test_IsAsyncConfig_15>().toEqualTypeOf<true>();
