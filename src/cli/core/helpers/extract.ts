import type { NodeConfig } from '#states';
import type { Project } from 'ts-morph';
import { evaluateNode } from './evaluate';
import { extractPContextType } from './pContext';

const findCreateMachineCall = (callNode: any): any | null => {
  const callee = callNode.getExpression?.();
  if (!callee) return null;

  if (callee.getText?.() === 'createMachine') {
    return callNode;
  }

  if (callee.getKindName?.() === 'PropertyAccessExpression') {
    const object = callee.getExpression?.();
    if (object && object.getKindName?.() === 'CallExpression') {
      return findCreateMachineCall(object);
    }
  }

  return null;
};

export const extractMachineInfo = (
  sourceFilePath: string,
  project: Project,
): { name: string; config: NodeConfig; pContextType: string } | null => {
  try {
    const sourceFile = project.getSourceFile(sourceFilePath);
    if (!sourceFile) return null;

    const exportAssignment = sourceFile.getExportAssignments()[0];
    if (!exportAssignment) return null;

    const callExpr = exportAssignment.getExpression();
    if (!callExpr || callExpr.getKindName?.() !== 'CallExpression') {
      return null;
    }

    const callNode = findCreateMachineCall(callExpr as any);
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
    let config: NodeConfig;
    try {
      config = evaluateNode(configArg, sourceFile);
    } catch (err: any) {
      console.warn(
        `[app] Skipping ${sourceFilePath}: config not statically evaluable (${err.message})`,
      );
      return null;
    }

    let pContextType = 'undefined';
    if (args.length >= 3) {
      const typingsArg = args[2];
      pContextType =
        extractPContextType(typingsArg, sourceFile) ?? 'undefined';
    }

    return { name, config, pContextType };
  } catch (_err) {
    console.warn(`[app] Error extracting ${sourceFilePath}:`, _err);
    return null;
  }
};
