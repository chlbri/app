/**
 * Default identity selector function that returns the input value unchanged.
 *
 * @template T - Input type.
 * @template R - Output type, defaulting to `T`.
 *
 * @param a - Value to pass through.
 *
 * @returns The input value cast to `R`.
 */
export const identity = <T, R = T>(a: T): R => a as any;
