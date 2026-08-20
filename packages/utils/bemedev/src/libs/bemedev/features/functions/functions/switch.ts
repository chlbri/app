/**
 * Function type signature for switching values based on a boolean condition.
 */
type _SwitchValue_F = <T>(params: { condition?: boolean; truthy: T; falsy: T }) => T;

/**
 * Evaluates a condition and returns either the truthy or falsy value.
 *
 * @param params - Object containing condition, truthy, and falsy values.
 *
 * @returns Either truthy or falsy value.
 */
const _switchValue: _SwitchValue_F = ({ condition, truthy, falsy }) => {
  const out = condition ? truthy : falsy;
  return out;
};

/**
 * Parameters object for object-style switchValue call.
 *
 * @template `T` - Value type.
 */
type ParamsO<T> = { condition?: boolean; truthy: T; falsy: T };

/**
 * Parameters tuple for array-style switchValue call.
 *
 * @template `T` - Value type.
 */
type ParamsA<T> = [condition: boolean, first: T, second: T];

/**
 * Selects between two values based on a boolean condition object.
 *
 * @template `T` - Value type.
 *
 * @param params - Configuration object with condition, truthy, and falsy values.
 *
 * @returns Resulting value of type `T`.
 */
export function switchValue<T>(params: ParamsO<T>): T;
/**
 * Selects between two values based on positional boolean arguments.
 *
 * @template `T` - Value type.
 *
 * @param args - Positional tuple containing condition, truthy, and falsy values.
 *
 * @returns Resulting value of type `T`.
 */
export function switchValue<T>(...args: ParamsA<T>): T;

export function switchValue<T>(condition: any, truthy?: T, falsy?: T) {
  const check1 = typeof condition === 'boolean';

  return _switchValue({
    condition: check1,
    truthy: _switchValue({ condition, truthy, falsy }),
    falsy: _switchValue(condition),
  });
}

switchValue.array = <T>(...params: ParamsA<T>) => switchValue(...params);
switchValue.object = <T>(params: ParamsO<T>) => switchValue(params);

/**
 * switchV variable - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export const switchV = switchValue;
