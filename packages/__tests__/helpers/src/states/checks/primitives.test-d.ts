import type { Fn, UnionToTuple } from '@bemedev/app/bemedev';
import type { PrimitiveObject } from '@bemedev/app-contract/typings';
import type {
  ChangeProperties,
  KeyStrings,
  NoExtraKeys,
  NoExtraKeysFor,
  NoExtraKeysRecord,
  NoExtraKeysStrict,
  ValuesOf,
} from '@bemedev/app/types';

export type ExtractLargeKeys<T> = string extends T
  ? never
  : number extends T
    ? never
    : symbol extends T
      ? never
      : T;

type _Simplify<T> = T extends { new: any }
  ? T
  : T extends Fn
    ? Fn<SimplifyArray<Parameters<T>>, ReturnType<T>>
    : T extends object
      ? {
          [P in keyof T as ExtractLargeKeys<P>]: T[P] extends object
            ? Simplify<T[P]>
            : T[P];
        }
      : T;

export type Simplify<T, S = unknown> = Extract<_Simplify<T>, S>;

export type IdxOf<T extends any[]> = Exclude<keyof T, keyof any[]>;

export type _SimplifyArray<T extends any[]> = {
  [K in IdxOf<T>]: Simplify<T[K]>;
};

export type SimplifyArray<T extends any[]> = UnionToTuple<
  ValuesOf<_SimplifyArray<T>>
>;

// #region Fixtures

const ttString = 'str';
const ttNumber = 55;
const ttBoolean = true;
const ttArra1 = [1, 2, 3] as const;
const ttArray2 = [1, 2, 3];
const ttObject = { a: 1, b: 2, c: 3 } as const;
const ttFunction = () => {};
const ttArrowFunction = () => {};
const ttClass = class {};

const complexObject1 = {
  a: 1,
  b: 'str',
  c: true,
  d: [1, 2, 3, { a: 1, b: 2, c: 'str' }],
  e: { a: 1, b: 2, c: [3] },
};

class TC {}
const complexObject2 = {
  a: 1,
  b: 'str',
  c: true,
  d: [1, 2, 3, { a: 1, b: 2, c: 'str' }],
  e: { a: 1, b: 2, c: [3] },
  f: new TC(),
};

type _TT1 = {
  arg1: { arg11: string; arg12: number };
  arg2: number;
  arg3: { arg31: { arg311: string } };
};

type TT11 = Simplify<KeyStrings<_TT1>>;
type TT12 = Simplify<ChangeProperties<_TT1, { arg1: { arg11: 'ert11' } }>>;
type TT13 = Simplify<
  ChangeProperties<
    _TT1,
    { arg1: { arg11: 'ert11'; '@my': 'ert1' }; arg3: { '@my': 'ert3' } }
  >
>;

// #endregion

// #region NoExtraKeys schemas

type BasicSchema = { name: string; value: number; optional?: boolean };

type NestedSchema = {
  id: string;
  config: { enabled: boolean; options?: { timeout: number; retries?: number } };
  tags?: string[];
};

type DeepSchema = {
  targets: string;
  initial?: string;
  states?: Record<string, DeepSchema>;
};

type StateSchema = { target: string; initial?: string };

type ArraySchema = { items: number[]; nested: { values: string[] } };

type FnSchema = {
  handler: () => void;
  config: { callback?: (x: number) => string };
};

type DateSchema = { createdAt: Date; meta: { updatedAt?: Date } };

type CollectionSchema = { map: Map<string, number>; set: Set<string> };

// #endregion

describe('PrimitiveObject', () => {
  test('#01 => primitives and plain objects extend PrimitiveObject', () => {
    expectTypeOf(ttString).toExtend<PrimitiveObject>();
    expectTypeOf(ttNumber).toExtend<PrimitiveObject>();
    expectTypeOf(ttBoolean).toExtend<PrimitiveObject>();
    expectTypeOf(ttArra1).toExtend<PrimitiveObject>();
    expectTypeOf(ttArray2).toExtend<PrimitiveObject>();
    expectTypeOf(ttObject).toExtend<PrimitiveObject>();
    expectTypeOf(complexObject1).toExtend<PrimitiveObject>();
  });

  test('#02 => functions, classes and class instances are rejected', () => {
    expectTypeOf(ttFunction).not.toExtend<PrimitiveObject>();
    expectTypeOf(ttArrowFunction).not.toExtend<PrimitiveObject>();
    expectTypeOf(ttClass).not.toExtend<PrimitiveObject>();
    expectTypeOf(complexObject2).not.toExtend<PrimitiveObject>();
  });
});

describe('Simplify & ChangeProperties', () => {
  test('#01 => KeyStrings', () => {
    expectTypeOf({
      arg1: { arg11: 'example', arg12: 'str', '@my': 'yyt' },
      arg2: 'str',
      arg3: { arg31: { arg311: 'example', '@my': 'yyt' }, '@my': 'yyt' },
    }).toEqualTypeOf<TT11>();
  });

  test('#02 => KeyStrings rejects non-string values', () => {
    expectTypeOf({
      arg1: { arg11: 'example', arg12: '42', '@my': 'yyt' },
      arg2: '100',
      arg3: { arg31: { arg311: 'example' }, '@my': 'yyt' },
    }).not.toExtend<TT11>();
  });

  test('#03 => ChangeProperties', () => {
    expectTypeOf({
      arg1: { arg12: 45, ert11: 'string' },
      arg2: 5,
      arg3: { arg31: { arg311: 'string' } },
    }).toEqualTypeOf<TT12>();
  });

  test('#04 => nested ChangeProperties', () => {
    expectTypeOf({
      ert1: { arg12: 45, ert11: 'string' },
      arg2: 5,
      ert3: { arg31: { arg311: 'string' } },
    }).toEqualTypeOf<TT13>();
  });

  test('#05 => simplified objects extend PrimitiveObject', () => {
    expectTypeOf<{ user: string; password: string }>().toExtend<PrimitiveObject>();
    expectTypeOf<TT11>().toExtend<PrimitiveObject>();
    expectTypeOf<TT13>().toExtend<PrimitiveObject>();
  });
});

// #region NoExtraKeys Tests

describe('NoExtraKeys', () => {
  describe('#01 => Basic', () => {
    type ValidBasic = NoExtraKeys<{ name: 'test'; value: 42 }, BasicSchema>;

    type ValidWithOptional = NoExtraKeys<
      { name: 'test'; value: 42; optional: true },
      BasicSchema
    >;

    type ValidPartial = NoExtraKeys<{ name: 'test'; value: 42 }, BasicSchema>;

    type InvalidExtraKey = NoExtraKeys<
      { name: 'test'; value: 42; extra: string },
      BasicSchema
    >;

    test('#01 => exact match', () => {
      expectTypeOf<ValidBasic>().toMatchObjectType<{ name: 'test'; value: 42 }>();
    });

    test('#02 => with optional property', () => {
      expectTypeOf<ValidWithOptional>().toMatchObjectType<{
        name: 'test';
        value: 42;
        optional: true;
      }>();
    });

    test('#03 => partial object', () => {
      expectTypeOf<ValidPartial>().toMatchObjectType<{ name: 'test'; value: 42 }>();
    });

    test('#04 => extra key is never', () => {
      expectTypeOf<InvalidExtraKey['extra']>().toEqualTypeOf<never>();
    });
  });

  describe('#02 => Nested', () => {
    type ValidNested = NoExtraKeys<
      { id: 'abc'; config: { enabled: true; options: { timeout: 1000 } } },
      NestedSchema
    >;

    type InvalidNestedExtra = NoExtraKeys<
      { id: 'abc'; config: { enabled: true; extra: 'not allowed' } },
      NestedSchema
    >;

    type ValidDeepOptional = NoExtraKeys<
      {
        id: 'xyz';
        config: { enabled: false; options: { timeout: 500; retries: 3 } };
      },
      NestedSchema
    >;

    test('#01 => valid nested object', () => {
      expectTypeOf<ValidNested>().branded.toEqualTypeOf<{
        id: 'abc';
        config: { enabled: true; options: { timeout: 1000 } };
      }>();
    });

    test('#02 => extra key in nested object is kept', () => {
      expectTypeOf<InvalidNestedExtra['config']>().toHaveProperty('extra');
    });

    test('#03 => deep optional', () => {
      expectTypeOf<ValidDeepOptional['config']['options']>().branded.toEqualTypeOf<{
        timeout: 500;
        retries: 3;
      }>();
    });
  });

  describe('#03 => Deep recursive', () => {
    type ValidDeep = NoExtraKeys<
      {
        targets: 'idle | active';
        initial: 'idle';
        states: { idle: { targets: 'active' }; active: { targets: 'idle' } };
      },
      DeepSchema
    >;

    type ValidDeepNested = NoExtraKeys<
      {
        targets: 'parent';
        states: {
          parent: {
            targets: 'child1 | child2';
            initial: 'child1';
            states: { child1: { targets: 'child2' }; child2: { targets: 'child1' } };
          };
        };
      },
      DeepSchema
    >;

    type InvalidDeepRoot = NoExtraKeys<
      { targets: 'test'; extraRoot: true },
      DeepSchema
    >;

    type InvalidDeepNested = NoExtraKeys<
      {
        targets: 'test';
        states: { test: { targets: 'other'; notAllowed: 'value' } };
      },
      DeepSchema
    >;

    test('#01 => valid deep schema', () => {
      expectTypeOf<ValidDeep>().branded.toEqualTypeOf<{
        targets: 'idle | active';
        initial: 'idle';
        states: { idle: { targets: 'active' }; active: { targets: 'idle' } };
      }>();
    });

    test('#02 => valid deeply nested states', () => {
      expectTypeOf<ValidDeepNested['states']>().branded.toEqualTypeOf<{
        parent: {
          targets: 'child1 | child2';
          initial: 'child1';
          states: { child1: { targets: 'child2' }; child2: { targets: 'child1' } };
        };
      }>();
    });

    test('#03 => extra key at root level is never', () => {
      expectTypeOf<InvalidDeepRoot['extraRoot']>().toEqualTypeOf<never>();
    });

    test('#04 => nested state stays non-never', () => {
      expectTypeOf<InvalidDeepNested['states']>().not.toBeNever();
    });
  });

  describe('#04 => NoExtraKeysStrict', () => {
    type ValidStrict = NoExtraKeysStrict<{ name: 'test'; value: 42 }, BasicSchema>;

    // NoExtraKeysStrict requires T to extend Schema
    // This should fail at compile time if uncommented:
    // type InvalidStrict = NoExtraKeysStrict<{ name: 'test' }, BasicSchema>;

    test('#01 => valid strict', () => {
      expectTypeOf<ValidStrict>().branded.toEqualTypeOf<{
        name: 'test';
        value: 42;
      }>();
    });
  });

  describe('#05 => NoExtraKeysRecord', () => {
    type ValidRecord = NoExtraKeysRecord<
      { idle: { target: 'active' }; active: { target: 'idle'; initial: 'sub' } },
      StateSchema
    >;

    type InvalidRecord = NoExtraKeysRecord<
      { idle: { target: 'active'; extra: true } },
      StateSchema
    >;

    test('#01 => valid record', () => {
      expectTypeOf<ValidRecord>().branded.toEqualTypeOf<{
        idle: { target: 'active' };
        active: { target: 'idle'; initial: 'sub' };
      }>();
    });

    test('#02 => extra key in record entry is never', () => {
      expectTypeOf<InvalidRecord['idle']['extra']>().toEqualTypeOf<never>();
    });
  });

  describe('#06 => NoExtraKeysFor', () => {
    type ValidFor = NoExtraKeysFor<BasicSchema, { name: 'partial' }>;

    type InvalidFor = NoExtraKeysFor<BasicSchema, { name: 'test'; extra: 1 }>;

    test('#01 => valid partial', () => {
      expectTypeOf<ValidFor>().branded.toEqualTypeOf<{ name: 'partial' }>();
    });

    test('#02 => extra key is never', () => {
      expectTypeOf<InvalidFor['extra']>().toEqualTypeOf<never>();
    });
  });

  describe('#07 => Edge cases', () => {
    type EmptySchema = NonNullable<object>;
    type EmptyObj = NoExtraKeys<NonNullable<object>, EmptySchema>;

    type ValidArray = NoExtraKeys<
      { items: [1, 2, 3]; nested: { values: ['a', 'b'] } },
      ArraySchema
    >;

    type ValidFn = NoExtraKeys<
      { handler: () => {}; config: { callback: (x: number) => 'test' } },
      FnSchema
    >;

    type ValidDate = NoExtraKeys<
      { createdAt: Date; meta: { updatedAt: Date } },
      DateSchema
    >;

    type ValidCollection = NoExtraKeys<
      { map: Map<string, number>; set: Set<string> },
      CollectionSchema
    >;

    test('#01 => empty object', () => {
      expectTypeOf<EmptyObj>().branded.toEqualTypeOf<NonNullable<object>>();
    });

    test('#02 => arrays are not recursively processed', () => {
      expectTypeOf<ValidArray>().branded.toEqualTypeOf<{
        items: [1, 2, 3];
        nested: { values: ['a', 'b'] };
      }>();
    });

    test('#03 => functions are not recursively processed', () => {
      expectTypeOf<ValidFn['handler']>().toEqualTypeOf<() => {}>();
    });

    test('#04 => Date is not recursively processed', () => {
      expectTypeOf<ValidDate['createdAt']>().toEqualTypeOf<Date>();
    });

    test('#05 => Map and Set are not recursively processed', () => {
      expectTypeOf<ValidCollection['map']>().toEqualTypeOf<Map<string, number>>();
      expectTypeOf<ValidCollection['set']>().toEqualTypeOf<Set<string>>();
    });
  });
});

// #endregion
