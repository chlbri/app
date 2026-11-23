import { createContract } from '@bemedev/app-contract';
import type {
  Fn,
  FnMap,
  FnMapR,
  IsAsyncConfig,
  IsAsyncFnMap,
} from '@bemedev/app/types';
import { type } from '@bemedev/typings';

const contract = createContract(
  { initial: 'idle', states: { idle: {}, done: {} } } as const,
  { context: type({ count: 'number' }), sync: true },
);

type Ct = typeof contract;

// ============================================================================
// IsAsyncFnMap Tests
// ============================================================================

type Test_IsAsyncFnMap_1 = IsAsyncFnMap<Fn>;

type Test_IsAsyncFnMap_2 = IsAsyncFnMap<Fn<[any], void>>;

type Test_IsAsyncFnMap_3 = IsAsyncFnMap<Fn<[any], Promise<void>>>;

type Test_IsAsyncFnMap_4 = IsAsyncFnMap<{ DATA?: () => any; DODO?: () => any }>;

type Test_IsAsyncFnMap_4_1 = IsAsyncFnMap<{
  DATA?: () => any;
  DATA2: () => any;
  DODO?: () => Promise<any>;
}>;

type Test_IsAsyncFnMap_5 = IsAsyncFnMap<FnMapR<Ct, Promise<string>>>;

type Test_IsAsyncFnMap_6 = IsAsyncFnMap<FnMapR<Ct, void>>;

type Test_IsAsyncFnMap_7 = IsAsyncFnMap<FnMapR<Ct, number>>;

type Test_IsAsyncFnMap_8 = IsAsyncFnMap<FnMapR<Ct, string>>;

type Test_IsAsyncFnMap_9 = IsAsyncFnMap<FnMapR<Ct, any>>;

type Test_IsAsyncFnMap_10 = IsAsyncFnMap<FnMap<Ct, Promise<void>>>;

type Test_IsAsyncFnMap_11 = IsAsyncFnMap<FnMap<Ct, Promise<number>>>;

type Test_IsAsyncFnMap_12 = IsAsyncFnMap<FnMap<Ct, void>>;

type Test_IsAsyncFnMap_13 = IsAsyncFnMap<FnMap<Ct, number>>;

type Test_IsAsyncFnMap_14 = IsAsyncFnMap<FnMap<Ct, string>>;

type Test_IsAsyncFnMap_15 = IsAsyncFnMap<FnMap<Ct, any>>;

type Test_IsAsyncFnMap_16 = IsAsyncFnMap<{ foo: string } & (FnMap | FnMapR)>;

type Test_IsAsyncFnMap_17 = IsAsyncFnMap<FnMapR<Ct, Promise<Promise<void>>>>;

describe('IsAsyncFnMap', () => {
  describe('#01 => function types', () => {
    test('#01 => plain Fn is false', () => {
      expectTypeOf<Test_IsAsyncFnMap_1>().toEqualTypeOf<false>();
    });

    test('#02 => void-returning Fn is false', () => {
      expectTypeOf<Test_IsAsyncFnMap_2>().toEqualTypeOf<false>();
    });

    test('#03 => Promise-returning Fn is true', () => {
      expectTypeOf<Test_IsAsyncFnMap_3>().toEqualTypeOf<true>();
    });
  });

  describe('#02 => function maps', () => {
    test('#01 => all-optional sync map is false', () => {
      expectTypeOf<Test_IsAsyncFnMap_4>().toEqualTypeOf<false>();
    });

    test('#02 => map with a Promise member is true', () => {
      expectTypeOf<Test_IsAsyncFnMap_4_1>().toEqualTypeOf<true>();
    });

    test('#03 => random intersected type is false', () => {
      expectTypeOf<Test_IsAsyncFnMap_16>().toEqualTypeOf<false>();
    });
  });

  describe('#03 => reduced function maps', () => {
    test('#01 => Promise<string> return is true', () => {
      expectTypeOf<Test_IsAsyncFnMap_5>().toEqualTypeOf<true>();
    });

    test('#02 => void return is false', () => {
      expectTypeOf<Test_IsAsyncFnMap_6>().toEqualTypeOf<false>();
    });

    test('#03 => number return is false', () => {
      expectTypeOf<Test_IsAsyncFnMap_7>().toEqualTypeOf<false>();
    });

    test('#04 => string return is false', () => {
      expectTypeOf<Test_IsAsyncFnMap_8>().toEqualTypeOf<false>();
    });

    test('#05 => any return is false', () => {
      expectTypeOf<Test_IsAsyncFnMap_9>().toEqualTypeOf<false>();
    });

    test('#06 => nested Promise return is true', () => {
      expectTypeOf<Test_IsAsyncFnMap_17>().toEqualTypeOf<true>();
    });
  });

  describe('#04 => function maps with contract context', () => {
    test('#01 => Promise<void> return is true', () => {
      expectTypeOf<Test_IsAsyncFnMap_10>().toEqualTypeOf<true>();
    });

    test('#02 => Promise<number> return is true', () => {
      expectTypeOf<Test_IsAsyncFnMap_11>().toEqualTypeOf<true>();
    });

    test('#03 => void return is false', () => {
      expectTypeOf<Test_IsAsyncFnMap_12>().toEqualTypeOf<false>();
    });

    test('#04 => number return is false', () => {
      expectTypeOf<Test_IsAsyncFnMap_13>().toEqualTypeOf<false>();
    });

    test('#05 => string return is false', () => {
      expectTypeOf<Test_IsAsyncFnMap_14>().toEqualTypeOf<false>();
    });

    test('#06 => any return is false', () => {
      expectTypeOf<Test_IsAsyncFnMap_15>().toEqualTypeOf<false>();
    });
  });
});

// ============================================================================
// IsAsyncConfig Tests
// ============================================================================

type Test_IsAsyncConfig_1 = IsAsyncConfig<{ after: () => void }>;

type Test_IsAsyncConfig_2 = IsAsyncConfig<{ after: 100; foo: string }>;

type Test_IsAsyncConfig_3 = IsAsyncConfig<{
  states: { idle: { after: 100 }; active: { foo: string } };
}>;

type Test_IsAsyncConfig_4 = IsAsyncConfig<{
  states: { idle: { foo: string }; active: { bar: number } };
}>;

type Test_IsAsyncConfig_5 = IsAsyncConfig<{ foo: string; bar: number }>;

type Test_IsAsyncConfig_6 = IsAsyncConfig<{}>;

type Test_IsAsyncConfig_7 = IsAsyncConfig<{
  states: { idle: { states: { waiting: { after: 200 } } } };
}>;

type Test_IsAsyncConfig_8 = IsAsyncConfig<{
  states: { idle: { states: { waiting: { foo: string } } } };
}>;

type Test_IsAsyncConfig_9 = IsAsyncConfig<{ after: null }>;

type Test_IsAsyncConfig_10 = IsAsyncConfig<{ after: undefined }>;

type Test_IsAsyncConfig_11 = IsAsyncConfig<{
  states: {
    data: { states: { loading: { foo: string }; success: { bar: number } } };
    idle: { states: { waiting: { foo: string } } };
  };
}>;

type Test_IsAsyncConfig_12 = IsAsyncConfig<{
  after: 45;
  states: {
    data: { states: { loading: { foo: string }; success: { bar: number } } };
    idle: { states: { waiting: { foo: string } } };
  };
}>;

type Test_IsAsyncConfig_13 = IsAsyncConfig<{
  on: { DODO: { actions: ['dodo'] } };
  states: {
    data: { states: { loading: { foo: string }; success: { bar: number } } };
    idle: { states: { waiting: { foo: string; after: 45 } } };
  };
}>;

type Test_IsAsyncConfig_14 = IsAsyncConfig<{
  on: { DODO: { actions: ['dodo'] } };
  states: {
    data: {
      states: { loading: { foo: string; after: 45 }; success: { bar: number } };
    };
    idle: { states: { waiting: { foo: string; after: 45 } } };
  };
}>;

type Test_IsAsyncConfig_15 = IsAsyncConfig<{
  on: { DODO: { actions: ['dodo'] } };
  states: {
    data: { states: { loading: { foo: string }; success: { bar: number } } };
    idle: { states: { waiting: { foo: string; states: { after: { after: 45 } } } } };
  };
}>;

describe('IsAsyncConfig', () => {
  describe('#01 => direct after property', () => {
    test('#01 => after function is true', () => {
      expectTypeOf<Test_IsAsyncConfig_1>().toEqualTypeOf<true>();
    });

    test('#02 => after with extra properties is true', () => {
      expectTypeOf<Test_IsAsyncConfig_2>().toEqualTypeOf<true>();
    });

    test('#03 => after null is true', () => {
      expectTypeOf<Test_IsAsyncConfig_9>().toEqualTypeOf<true>();
    });

    test('#04 => after undefined is true', () => {
      expectTypeOf<Test_IsAsyncConfig_10>().toEqualTypeOf<true>();
    });
  });

  describe('#02 => nested states', () => {
    test('#01 => nested after is true', () => {
      expectTypeOf<Test_IsAsyncConfig_3>().toEqualTypeOf<true>();
    });

    test('#02 => nested states without after is false', () => {
      expectTypeOf<Test_IsAsyncConfig_4>().toEqualTypeOf<false>();
    });

    test('#03 => without after or states is false', () => {
      expectTypeOf<Test_IsAsyncConfig_5>().toEqualTypeOf<false>();
    });

    test('#04 => empty object is false', () => {
      expectTypeOf<Test_IsAsyncConfig_6>().toEqualTypeOf<false>();
    });

    test('#05 => deeply nested after is true', () => {
      expectTypeOf<Test_IsAsyncConfig_7>().toEqualTypeOf<true>();
    });

    test('#06 => deeply nested without after is false', () => {
      expectTypeOf<Test_IsAsyncConfig_8>().toEqualTypeOf<false>();
    });
  });

  describe('#03 => complex configurations', () => {
    test('#01 => complex without after is false', () => {
      expectTypeOf<Test_IsAsyncConfig_11>().toEqualTypeOf<false>();
    });

    test('#02 => top-level after is true', () => {
      expectTypeOf<Test_IsAsyncConfig_12>().toEqualTypeOf<true>();
    });

    test('#03 => nested after is true', () => {
      expectTypeOf<Test_IsAsyncConfig_13>().toEqualTypeOf<true>();
    });

    test('#04 => multiple nested after values is true', () => {
      expectTypeOf<Test_IsAsyncConfig_14>().toEqualTypeOf<true>();
    });

    test('#05 => deeply nested after is true', () => {
      expectTypeOf<Test_IsAsyncConfig_15>().toEqualTypeOf<true>();
    });
  });
});
