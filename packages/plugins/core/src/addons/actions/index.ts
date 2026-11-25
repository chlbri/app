import type { Contract, ContractContext } from '@bemedev/app-contract';
import type { SubTypeLow } from '@bemedev/app-contract/bemedev';
import type { DecomposeC } from '../types';

export * from './actions.types';
export * from './filter';

/**
 * Function type signature for creating an erase property action helper.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `A` - Action return type.
 *
 * @returns Action of type `A` erasing the supplied context keys.
 */
export type CommonEraseAction<Ct extends Contract = Contract, A = any> = <
  D = 0 extends 1 & ContractContext<Ct>
    ? Record<string, any>
    : SubTypeLow<DecomposeC<ContractContext<Ct>>, undefined>,
  K extends keyof D & string = keyof D & string,
>(
  ...keys: K[]
) => A;
