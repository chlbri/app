/**
 * Generic function type signature.
 *
 * @template `Args` - Tuple of the argument types accepted by the function.
 * @template `R` - Return type of the function.
 */
export type Fn<Args extends any[] = any[], R = any> = (...args: Args) => R;

/**
 * Type alias merging extra properties into a function signature.
 *
 * @template | {@linkcode Fn} `Main` - Main function signature.
 * @template `Tr` - Extra properties attached to the function.
 */
export type FnBasic<Main extends Fn, Tr extends object> = Tr & Main;
