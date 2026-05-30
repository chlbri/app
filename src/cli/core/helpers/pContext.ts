const serializePContextType = (node: any): string => {
  try {
    const kind = node.getKindName?.();

    if (kind === 'CallExpression') {
      const callee = node.getExpression?.();
      if (callee?.getText?.() === 'type') {
        const args = node.getArguments?.() ?? [];
        if (args.length > 0) {
          return objectToTypeString(args[0]);
        }
      }
    }

    if (kind === 'ObjectLiteralExpression') {
      return objectToTypeString(node);
    }

    return 'unknown';
  } catch (err) {
    console.warn('Error serializing pContext type:', err);
    return 'unknown';
  }
};

const objectToTypeString = (objNode: any): string => {
  const entries: string[] = [];

  const props = objNode.getProperties?.() ?? [];
  for (const prop of props) {
    if (prop.getKindName?.() === 'PropertyAssignment') {
      const keyNode = prop.getChildAtIndex?.(0);
      const valueNode = prop.getChildAtIndex?.(2);

      const keyName = keyNode?.getText?.().replace(/['"]/g, '');
      const typeStr = valueNodeToTypeString(valueNode);

      if (keyName) {
        entries.push(`${keyName}: ${typeStr}`);
      }
    }
  }

  return `{ ${entries.join('; ')} }`;
};

const valueNodeToTypeString = (node: any): string => {
  const kind = node.getKindName?.();

  if (
    kind === 'StringLiteral' ||
    kind === 'NoSubstitutionTemplateLiteral'
  ) {
    const val = node.getLiteralValue?.();
    switch (val) {
      case 'string':
        return 'string';
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'never':
        return 'never';
      default:
        return `'${val}'`;
    }
  }

  if (kind === 'ObjectLiteralExpression') {
    return objectToTypeString(node);
  }

  if (kind === 'ArrayLiteralExpression') {
    const elements = node.getElements?.() ?? [];
    const types = elements.map((el: any) => valueNodeToTypeString(el));
    return `(${types.join(' | ')})[]`;
  }

  return node.getText?.() ?? 'unknown';
};

export const extractPContextType = (
  typingsArg: any,
  _sourceFile: any,
): string | null => {
  try {
    if (
      !typingsArg ||
      typingsArg.getKindName?.() !== 'ObjectLiteralExpression'
    ) {
      return null;
    }

    const props = typingsArg.getProperties?.() ?? [];
    for (const prop of props) {
      if (prop.getKindName?.() === 'PropertyAssignment') {
        const keyNode = prop.getChildAtIndex?.(0);
        const keyName = keyNode?.getText?.().replace(/['"]/g, '');

        if (keyName === 'pContext') {
          const valueNode = prop.getChildAtIndex?.(2);
          return serializePContextType(valueNode);
        }
      }
    }
  } catch (err) {
    console.warn('Error extracting pContext type:', err);
  }

  return null;
};
