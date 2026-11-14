import { type AnyMachine, type OutInterpreter } from '@bemedev/app';
import { createMachine, interpret } from '@bemedev/app';
import type { Contract } from '@bemedev/app-contract';

/**
 * Creates a machine from a contract and attaches options built by
 * `@bemedev/app-options`.
 *
 * @param contract - Contract created with `createContract`.
 * @param options - Options built with `createOptions`.
 *
 * @returns The machine instance, options attached.
 */
export const machineWithOptions = <C extends Contract>(
  contract: C,
  options: NonNullable<C['options']>,
) => {
  const machine = createMachine(contract);
  machine.addOptions(() => ({ ...options }));
  return machine;
};

/**
 * Interprets a machine created from a contract.
 *
 * Contract machines carry the full contract config, typing surface and
 * options, which is too large for TypeScript to resolve inside
 * `InterpretArgs` (it hits the instantiation depth limit). The machine is
 * therefore widened on purpose, while the returned service keeps the
 * interpreter type of the original machine.
 *
 * @param machine - Machine created with `machineWithOptions`.
 * @param config - Interpreter options (context, pContext, ...).
 *
 * @returns The running interpreter of type {@linkcode OutInterpreter}.
 */
export const interpretContract = <M extends AnyMachine>(machine: M, config?: any) =>
  interpret(machine as any, config) as unknown as OutInterpreter<M>;
