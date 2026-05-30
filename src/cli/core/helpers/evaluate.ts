export const evaluateNode = (node: any, sourceFile: any): any => {
  const kind = node.getKindName?.();

  if (
    kind === 'StringLiteral' ||
    kind === 'NoSubstitutionTemplateLiteral'
  ) {
    return node.getLiteralValue?.();
  }
  if (kind === 'NumericLiteral') {
    return Number(node.getLiteralValue?.());
  }
  if (kind === 'TrueKeyword') {
    return true;
  }
  if (kind === 'FalseKeyword') {
    return false;
  }
  if (kind === 'NullKeyword') {
    return null;
  }
  if (kind === 'UndefinedKeyword') {
    return undefined;
  }

  if (kind === 'ArrayLiteralExpression') {
    const elements = node.getElements?.() ?? [];
    return elements.map((el: any) => evaluateNode(el, sourceFile));
  }

  if (kind === 'ObjectLiteralExpression') {
    const result: any = {};
    const props = node.getProperties?.() ?? [];
    for (const prop of props) {
      const propKind = prop.getKindName?.();

      if (propKind === 'PropertyAssignment') {
        const key = prop.getChildAtIndex?.(0);
        const value = prop.getChildAtIndex?.(2);
        const keyName = key?.getText?.().replace(/['"]/g, '');
        if (keyName && value) {
          result[keyName] = evaluateNode(value, sourceFile);
        }
      } else if (propKind === 'ShorthandPropertyAssignment') {
        const keyName = prop.getText?.();
        if (keyName) {
          try {
            const resolved = resolveIdentifier(keyName, sourceFile);
            result[keyName] = resolved;
          } catch {
            throw new Error(`Cannot resolve identifier: ${keyName}`);
          }
        }
      } else if (propKind === 'SpreadAssignment') {
        throw new Error(
          'Spread operators not supported in static config evaluation',
        );
      }
    }
    return result;
  }

  if (kind === 'Identifier') {
    const text = node.getText?.();
    if (text) {
      return resolveIdentifier(text, sourceFile);
    }
    throw new Error('Cannot resolve identifier');
  }

  if (kind === 'PropertyAccessExpression') {
    const text = node.getText?.();
    if (text) {
      return resolveIdentifier(text, sourceFile);
    }
    throw new Error('Cannot resolve property access');
  }

  throw new Error(`Cannot evaluate node kind: ${kind}`);
};

const resolveIdentifier = (name: string, sourceFile: any): any => {
  const parts = name.split('.');
  const baseName = parts[0];

  const declarations = sourceFile.getVariableDeclarations?.() ?? [];
  for (const decl of declarations) {
    if (decl.getName?.() === baseName) {
      const initializer = decl.getInitializer?.();
      if (initializer) {
        const value = evaluateNode(initializer, sourceFile);
        let current = value;
        for (const part of parts.slice(1)) {
          current = current?.[part];
        }
        return current;
      }
    }
  }

  throw new Error(`Cannot resolve identifier: ${name}`);
};
