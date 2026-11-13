import type {
  ContractEventArg,
  ContractPaths,
  ContractPContext,
} from '@bemedev/app-contract';
import contract from './auth.contract';

describe('#01 => generated contract register', () => {
  test('#01 => resolves paths from the generated registry', () => {
    expectTypeOf<ContractPaths<typeof contract>>().toEqualTypeOf<
      '/' | '/idle' | '/authenticated'
    >();
  });

  test('#02 => resolves pContext from the generated registry', () => {
    expectTypeOf<ContractPContext<typeof contract>>().toEqualTypeOf<{
      token: string;
    }>();
  });

  test('#03 => resolves event arguments from the generated registry', () => {
    expectTypeOf<
      Extract<ContractEventArg<typeof contract>, 'LOGIN'>
    >().toEqualTypeOf('LOGIN' as const);
  });

  test('#04 => keeps the runtime contract shape', () => {
    expect(contract.config).toMatchObject({ initial: 'idle' });
    expect(Object.isFrozen(contract)).toBe(true);
  });
});
