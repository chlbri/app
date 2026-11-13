import type { NodeConfig2 } from '@bemedev/app/types';
import type { Project } from 'ts-morph';
import { evaluateNode } from './evaluate';
import { extractPContextType } from './pContext';

/**
 * Names of the factory calls the CLI understands.
 *
 * `createMachine` comes from `@bemedev/app`, while `createContract` comes from
 * `@bemedev/app-contract`. Both expose the same `(name, config, types?)`
 * signature, so they can share the same extraction pipeline.
 */
const FACTORY_NAMES = new Set(['createMachine', 'createContract']);

/**
 * Recursively locates a supported machine factory call within a call expression.
 *
 * @param callNode - AST call expression node.
 *
 * @returns Found call node or `null`.
 */
const findMachineCall = (callNode: any): any => {
  const callee = callNode.getExpression?.();
  if (!callee) return null;

  if (FACTORY_NAMES.has(callee.getText?.())) {
    return callNode;
  }

  if (callee.getKindName?.() === 'PropertyAccessExpression') {
    const object = callee.getExpression?.();
    if (object && object.getKindName?.() === 'CallExpression') {
      return findMachineCall(object);
    }
  }

  return null;
};

/**
 * Extracts machine or contract metadata, static config, and protected context
 * typings from a source file.
 *
 * @param sourceFilePath - Absolute path to machine or contract source file.
 * @param project - `ts-morph` class {@linkcode Project} instance.
 *
 * @returns Extracted machine info object or `null` if invalid/unparseable.
 */
export const extractMachineInfo = (
  sourceFilePath: string,
  project: Project,
): { name: string; config: NodeConfig2; pContextType: string } | null => {
  try {
    const sourceFile = project.getSourceFile(sourceFilePath);
    if (!sourceFile) return null;

    const exportAssignment = sourceFile.getExportAssignments()[0];
    if (!exportAssignment) return null;

    const callExpr = exportAssignment.getExpression();
    if (!callExpr || callExpr.getKindName?.() !== 'CallExpression') {
      return null;
    }

    const callNode = findMachineCall(callExpr as any);
    if (!callNode) {
      return null;
    }

    const args = callNode.getArguments?.() ?? [];
    if (args.length < 2) return null;

    const nameArg = args[0];
    const nameText = nameArg.getText?.();
    if (!nameText || !nameText.match(/^['"`]/)) {
      console.warn(
        `[app] Skipping ${sourceFilePath}: missing or non-literal machine name`,
      );
      return null;
    }
    const name = nameText.slice(1, -1);

    const configArg = args[1];
    let config: NodeConfig2;
    try {
      config = evaluateNode(configArg, sourceFile);
    } catch (err: any) {
      console.warn(
        `[app] Skipping ${sourceFilePath}: config not statically evaluable (${err.message})`,
      );
      return null;
    }

    let pContextType = 'any';
    if (args.length >= 3) {
      const typingsArg = args[2];
      pContextType = extractPContextType(typingsArg) ?? 'any';
    }

    return { name, config, pContextType };
  } catch (_err) {
    console.warn(`[app] Error extracting ${sourceFilePath}:`, _err);
    return null;
  }
};
