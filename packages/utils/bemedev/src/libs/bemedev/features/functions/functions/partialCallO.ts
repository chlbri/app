import { Fn } from '../types';
import { expandFn } from '../../../globals/utils/expandFn';

/**
 * Function type signature for partially applying object parameters.
 */
type _PartialCallO_F = <T extends object, U extends T, R>(
  f: Fn<[arg: U], R>,
  headArgs?: T,
) => Fn<[remainArgs: Omit<U, keyof T>], R>;

/**
 * Internal helper to partially apply object properties to a single-argument function.
 *
 * @param f - Function expecting an object parameter.
 * @param headArgs - Default/preset object properties.
 *
 * @returns Function accepting remaining object properties.
 */
const __partialCallO = (f: Fn<[arg: any], any>, headArgs?: object) => {
  return (remainArgs: object) => {
    const params = { ...remainArgs, ...headArgs } as any;
    return f(params);
  };
};

/**
 * Typed implementation of object partial call.
 */
const _partialCallO: _PartialCallO_F = __partialCallO;

/**
 * Reducer for function with ***one object*** parameter which
 *
 * @param f The function to test
 * @param headArgs First arguments for reducing
 * @returns A new function without the ***headArgs*** provided
 */
/**
 * partialCallO variable - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export const partialCallO = expandFn(_partialCallO, {
  /**
   * Use with caution, as it can lead to type inference issues. It's recommended to use the `typed` version instead for better type safety.
   */
  low: __partialCallO,

  /**
   *
   * This version is more flexible but less type-safe, as it doesn't enforce the types of the head and tail arguments. Use it when you need to partially apply a function without strict type constraints.
   *
   * Example usage:
   * ```ts
   * const greet = ({ name, greeting }: { name: string; greeting: string }) => `${greeting}, ${name}!`;
   * const greetHello = partialCallO.typed(greet, { greeting: 'Hello' });
   * console.log(greetHello({ name: 'Alice' }));
   * // Output: "Hello, Alice!"
   *
   * ```
   */
  typed: _partialCallO,
});
