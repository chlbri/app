import type { CreateContract_F } from './contract.types';
import type { DescriptionProps } from './descriptions';
export type * from './contract.types';

/**
 * Runtime implementation shared by the named and unnamed contract forms.
 *
 * The first argument is a string when the contract is registered, in which case
 * the next two arguments are the config and the schemas; otherwise the first
 * argument is the config and the second one the schemas.
 *
 * @param nameOrConfig - Contract name (named form) or machine JSON config (unnamed form).
 * @param configOrTypes - Machine JSON config (named form) or type schemas (unnamed form).
 * @param maybeTypes - Optional type schemas (named form only).
 *
 * @returns A frozen object holding {@linkcode Contract.config},
 * {@linkcode Contract.types} and the description hierarchy set by
 * {@linkcode Contract.describe}.
 */
const createContractImpl = (
  nameOrConfig: any,
  configOrTypes?: any,
  maybeTypes?: any,
) => {
  const named = typeof nameOrConfig === 'string';
  const config = named ? configOrTypes : nameOrConfig;
  const types = (named ? maybeTypes : configOrTypes) ?? {};
  let descriptions: DescriptionProps = {};

  type RuntimeContract = {
    config: any;
    types: any;
    readonly descriptions: DescriptionProps;
    describe: (props: DescriptionProps) => RuntimeContract;
  };

  const contract: RuntimeContract = {
    config,
    types,
    get descriptions() {
      return descriptions;
    },
    describe(props: DescriptionProps) {
      descriptions = props;
      return contract;
    },
  };

  return Object.freeze(contract);
};

/**
 * Registers a lightweight state machine contract: its JSON config, its types
 * and the options surface a machine can expose.
 *
 * A contract is meant to be shared with API layers (or any consumer that only
 * needs the machine's typing surface) without pulling in actions, guards,
 * delays or actors.
 *
 * @param nameOrConfig - Contract identifier (named form) or machine JSON config (unnamed form).
 * @param configOrTypes - Machine JSON config (named form) or type schemas (unnamed form).
 * @param maybeTypes - Optional type schemas matching `createMachine`'s `types`.
 *
 * @returns A frozen contract object of type {@linkcode Contract}.
 *
 * @example
 * ```ts
 * import { createContract } from '@bemedev/app-contract';
 * import { type } from '@bemedev/typings';
 *
 * export const authContract = createContract(
 *   {
 *     initial: 'idle',
 *     states: {
 *       idle: { on: { LOGIN: '/authenticated' } },
 *       authenticated: {},
 *     },
 *   },
 *   {
 *     eventsMap: type({ LOGIN: { email: 'string' } }),
 *   },
 * );
 * ```
 *
 * @example
 * ```ts
 * // Registered form: paths, events and option names come from `Register`.
 * export default createContract('auth', config, types);
 * ```
 *
 * @see -- type {@linkcode CreateContract_F}
 */
export const createContract = createContractImpl as CreateContract_F;

// const tt = createContract({
//   initial: 'state1',
//   states: {
//     state1: {
//       initial: 'state11',
//       states: {
//         state11: { initial: 'state111', states: { state111: {} } },
//         state12: { activities: { DELAY5: 'deal', DELAY17: 'deal17' } },
//       },
//     },
//     state2: {
//       after: {
//         DELAY: { actions: ['dodo1', 'doré'] },
//         DELAY2: '/state2',
//         DELAY3: { actions: 'dodo2' },
//       },
//       on: {
//         EVENT: { actions: ['dodo3', 'doré1'] },
//         EVENT2: '/',
//         EVENT3: { actions: 'dodo5' },
//       },
//       always: [
//         { actions: 'dodo6', guards: 'guard2', target: '/state1/state11' },
//         {
//           actions: ['dodo7', 'doré3', 'doré1'],
//           guards: 'guard2',
//           target: '/state1/state12',
//         },
//         '/state1/state11',
//       ],
//     },
//   },
//   actors: { machine1: { on: {} } },
// }).describe({
//   actions: {
//
// } });
