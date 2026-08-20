/**
 * Signature for function that converts a value into a getter function returning that value.
 *
 * @template T - Type of the value to wrap. Defaults to `any`.
 *
 * @param value - Value of type `T`.
 *
 * @returns Function returning `value`.
 */
export type ToFunction_F = <T = any>(value: T) => () => T;

/**
 * Converts a value into a function that returns that value.
 * @param value of type {@linkcode T}, to convert into a function.
 * @returns A function that, when called, returns the original value.
 *
 * @see {@linkcode ToFunction_F}
 */
export const toFunction: ToFunction_F = value => () => value;
