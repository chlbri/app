import { describe, expect, test } from 'vitest';
import * as v from 'valibot';
import { extractLiterals } from './extractLiterals';

describe('#01 => extractLiterals', () => {
  const schemaStr = v.union([v.literal('a'), v.literal('b')]);
  const resultStr = extractLiterals(schemaStr);
  const schemaNum = v.union([v.literal(1), v.literal(2)]);
  const resultNum = extractLiterals(schemaNum);
  const schemaBool = v.union([v.literal(true), v.literal(false)]);
  const resultBool = extractLiterals(schemaBool);

  const schemaMixed = v.union([
    v.literal('a'),
    v.literal(1),
    v.literal(true),
  ]);
  const resultMixed = extractLiterals(schemaMixed);

  test('#01 => str', () => expect(resultStr).toEqual(['a', 'b']));
  test('#02 => str len', () => expect(resultStr.length).toBe(2));
  test('#03 => num', () => expect(resultNum).toEqual([1, 2]));
  test('#04 => num len', () => expect(resultNum.length).toBe(2));
  test('#05 => bool', () => expect(resultBool).toEqual([true, false]));
  test('#06 => bool len', () => expect(resultBool.length).toBe(2));
  test('#07 => mixed', () => expect(resultMixed).toEqual(['a', 1, true]));
  test('#08 => mixed len', () => expect(resultMixed.length).toBe(3));
});
