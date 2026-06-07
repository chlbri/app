import type { inferT } from '@bemedev/typings';
import { ArrayTransitions_Schema, SingleOrArrayT_Schema } from './edges';

const arrT1 = ArrayTransitions_Schema();
type T1 = Exclude<inferT<typeof arrT1>[number], string>['target'];
expectTypeOf<T1>().toEqualTypeOf<string | undefined>();

const arrT2 = ArrayTransitions_Schema('b', 'c');
type _T2 = inferT<typeof arrT2>;
type T2 = Exclude<_T2[number], string>['target'];
expectTypeOf<T2>().toEqualTypeOf<'b' | 'c' | undefined>();

const soT1 = SingleOrArrayT_Schema('b', 'c');
type _T3 = inferT<typeof soT1>;
type T3 = Extract<_T3, string>;
expectTypeOf<T3>().toEqualTypeOf<'b' | 'c'>();
