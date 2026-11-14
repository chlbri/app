import type {
  ContractEvents,
  ContractPaths,
  ContractPContext,
  ContractSync,
  ContractTags,
} from '@bemedev/app-contract';

import asyncGuards from './contracts/asyncGuards.contract';
import auth from './contracts/auth.contract';
import counter from './contracts/counter.contract';
import parallel from './contracts/parallel.contract';
import stairs from './contracts/stairs.contract';
import wizard from './contracts/wizard.contract';

describe('#01 => generated contract register', () => {
  test('#01 => resolves counter paths', () => {
    expectTypeOf<ContractPaths<typeof counter>>().toEqualTypeOf<
      '/' | '/idle' | '/active'
    >();
  });

  test('#02 => resolves nested compound paths', () => {
    expectTypeOf<ContractPaths<typeof stairs>>().toEqualTypeOf<
      '/' | '/ground' | '/first' | '/first/landing' | '/first/closet' | '/second'
    >();
  });

  test('#03 => resolves parallel region paths', () => {
    expectTypeOf<ContractPaths<typeof parallel>>().toEqualTypeOf<
      | '/'
      | '/left'
      | '/left/off'
      | '/left/on'
      | '/right'
      | '/right/idle'
      | '/right/advanced'
    >();
  });

  test('#04 => resolves typed event payloads', () => {
    expectTypeOf<
      Extract<ContractEvents<typeof wizard>, { type: 'SET_NAME' }>['payload']
    >().toEqualTypeOf<{ name: string }>();
  });

  test('#05 => marks sync contracts', () => {
    expectTypeOf<ContractSync<typeof counter>>().toEqualTypeOf<true>();
    expectTypeOf<ContractSync<typeof parallel>>().toEqualTypeOf<true>();
  });

  test('#06 => marks async contracts', () => {
    expectTypeOf<ContractSync<typeof auth>>().toEqualTypeOf<undefined>();
    expectTypeOf<ContractSync<typeof asyncGuards>>().toEqualTypeOf<undefined>();
  });

  test('#07 => resolves the private context', () => {
    expectTypeOf<ContractPContext<typeof auth>>().toEqualTypeOf<{ token: string }>();
  });

  test('#08 => resolves the tags declared by a contract', () => {
    expectTypeOf<ContractTags<typeof counter>>().toEqualTypeOf<'counting'>();
    expectTypeOf<ContractTags<typeof auth>>().toEqualTypeOf<never>();
  });

  test('#09 => keeps contracts frozen at runtime', () => {
    expect(Object.isFrozen(counter)).toBe(true);
    expect(Object.isFrozen(auth)).toBe(true);
  });
});
