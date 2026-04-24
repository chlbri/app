import type { NodeConfig } from '#states';
import type { ConfigPaths } from '#utils';
import { parseTree } from '#utils';
import { glob } from 'glob';
import { writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { Project } from 'ts-morph';
import { DEFAULT_EXCLUDES, DEFAULT_OUTPUT } from './constants';

// ── PHASE 1: ts-morph extraction ──────────────────────────────────────

/**
 * Recursively unwrap chained method calls to find the innermost createMachine() call.
 *
 * Handles chains like: createMachine(...).provideOptions(...).someMethod(...)
 * by walking down the AST to find the CallExpression that directly invokes createMachine.
 *
 * @param {any} callNode - ts-morph CallExpression node to unwrap
 * @returns {{ name: string; config: NodeConfig; pContextType: string } | null}
 *   The createMachine CallExpression node, or null if not found
 */
function findCreateMachineCall(callNode: any): any | null {
  const callee = callNode.getExpression?.();
  if (!callee) return null;

  // Direct createMachine call
  if (callee.getText?.() === 'createMachine') {
    return callNode;
  }

  // Method call on something else - unwrap the object
  if (callee.getKindName?.() === 'PropertyAccessExpression') {
    const object = callee.getExpression?.();
    if (object && object.getKindName?.() === 'CallExpression') {
      // Recursively unwrap the chain
      return findCreateMachineCall(object);
    }
  }

  return null;
}

/**
 * Extract machine metadata from a TypeScript source file using ts-morph.
 *
 * This function performs static AST analysis to locate and extract the `createMachine` call
 * from a source file, validating that:
 * - The file exports a default `createMachine(name, config, typings?)` call (possibly followed by method chains)
 * - The machine name is a string literal (3-arg form required)
 * - The config object is statically evaluable (no spreads, external calls, or imports)
 * - Optional typings argument is parsed for pContext type information
 *
 * @param {string} sourceFilePath - Absolute path to the source file (*.machine.ts or *.fsm.ts)
 * @param {Project} project - ts-morph Project instance with source files already loaded
 *
 * @returns {{ name: string; config: NodeConfig; pContextType: string } | null}
 *   On success: Object containing:
 *     - `name`: The machine's register key (from first argument)
 *     - `config`: Fully evaluated NodeConfig object for parseTree analysis
 *     - `pContextType`: TypeScript type string for pContext (e.g., "{ data: string }" or "undefined")
 *   On failure: null (with warning logged to console)
 *
 * @throws {Error} Does not throw; catches and logs errors, returning null
 *
 * @example
 * const info = extractMachineInfo('/path/to/user.machine.ts', project);
 * if (info) {
 *   const tree = parseTree(info.config);
 *   // Use tree for type generation
 * }
 */
function extractMachineInfo(
  sourceFilePath: string,
  project: Project,
): { name: string; config: NodeConfig; pContextType: string } | null {
  try {
    const sourceFile = project.getSourceFile(sourceFilePath);
    if (!sourceFile) return null;

    // Find export default createMachine(...) call
    const exportAssignment = sourceFile.getExportAssignments()[0];
    if (!exportAssignment) return null;

    const callExpr = exportAssignment.getExpression();
    if (!callExpr || callExpr.getKindName?.() !== 'CallExpression') {
      return null;
    }

    // Find the createMachine call, unwrapping any method chains
    const callNode = findCreateMachineCall(callExpr as any);
    if (!callNode) {
      return null;
    }

    const args = callNode.getArguments?.() ?? [];
    if (args.length < 2) return null;

    // Arg 0: machine name (string literal)
    const nameArg = args[0];
    const nameText = nameArg.getText?.();
    if (!nameText || !nameText.match(/^['"`]/)) {
      console.warn(
        `[app-ts] Skipping ${sourceFilePath}: missing or non-literal machine name`,
      );
      return null;
    }
    const name = nameText.slice(1, -1);

    // Arg 1: config object (must be statically evaluable)
    const configArg = args[1];
    let config: NodeConfig;
    try {
      config = evaluateNode(configArg, sourceFile);
    } catch (err: any) {
      console.warn(
        `[app-ts] Skipping ${sourceFilePath}: config not statically evaluable (${err.message})`,
      );
      return null;
    }

    // Arg 2 (optional): typings object
    let pContextType = 'undefined';
    if (args.length >= 3) {
      const typingsArg = args[2];
      pContextType =
        extractPContextType(typingsArg, sourceFile) ?? 'undefined';
    }

    return { name, config, pContextType };
  } catch (_err) {
    console.warn(`[app-ts] Error extracting ${sourceFilePath}:`, _err);
    return null;
  }
}

/**
 * Recursively evaluate a TypeScript AST node into a plain JavaScript runtime value.
 *
 * Performs static evaluation of TypeScript expressions, converting AST nodes into
 * their JavaScript runtime equivalents. This enables safe, side-effect-free extraction
 * of configuration values without requiring actual imports or runtime execution.
 *
 * Supported node types:
 * - **Literals**: StringLiteral, NumericLiteral, TrueKeyword, FalseKeyword, NullKeyword, UndefinedKeyword
 * - **Collections**: ArrayLiteralExpression (elements evaluated recursively)
 * - **Objects**: ObjectLiteralExpression with PropertyAssignment and ShorthandPropertyAssignment
 * - **References**: Identifier and PropertyAccessExpression (resolved via sourceFile symbol table)
 *
 * Unsupported constructs (throw Error):
 * - SpreadAssignment (`...obj`)
 * - Function calls (`foo()`)
 * - Imports from external packages
 * - Non-resolvable identifiers
 *
 * @param {any} node - ts-morph AST node (from ts-morph API)
 * @param {any} sourceFile - ts-morph SourceFile instance for symbol resolution
 *
 * @returns {any} The evaluated JavaScript value
 *
 * @throws {Error} If the node kind is not supported or cannot be statically evaluated
 *
 * @example
 * // For node: { initial: 'idle', count: 42 }
 * const value = evaluateNode(objectNode, sourceFile);
 * // Returns: { initial: 'idle', count: 42 }
 */
function evaluateNode(node: any, sourceFile: any): any {
  const kind = node.getKindName?.();

  // Literals
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

  // Array
  if (kind === 'ArrayLiteralExpression') {
    const elements = node.getElements?.() ?? [];
    return elements.map((el: any) => evaluateNode(el, sourceFile));
  }

  // Object literal
  if (kind === 'ObjectLiteralExpression') {
    const result: any = {};
    const props = node.getProperties?.() ?? [];
    for (const prop of props) {
      const propKind = prop.getKindName?.();

      // PropertyAssignment: key: value
      if (propKind === 'PropertyAssignment') {
        const key = prop.getChildAtIndex?.(0);
        const value = prop.getChildAtIndex?.(2);
        const keyName = key?.getText?.().replace(/['"]/g, '');
        if (keyName && value) {
          result[keyName] = evaluateNode(value, sourceFile);
        }
      }
      // ShorthandPropertyAssignment: { foo } -> { foo: foo }
      else if (propKind === 'ShorthandPropertyAssignment') {
        const keyName = prop.getText?.();
        if (keyName) {
          // Try to resolve the identifier
          try {
            const resolved = resolveIdentifier(keyName, sourceFile);
            result[keyName] = resolved;
          } catch {
            throw new Error(`Cannot resolve identifier: ${keyName}`);
          }
        }
      }
      // Spread not supported for static evaluation
      else if (propKind === 'SpreadAssignment') {
        throw new Error(
          'Spread operators not supported in static config evaluation',
        );
      }
    }
    return result;
  }

  // Identifier: resolve via symbol
  if (kind === 'Identifier') {
    const text = node.getText?.();
    if (text) {
      return resolveIdentifier(text, sourceFile);
    }
    throw new Error('Cannot resolve identifier');
  }

  // PropertyAccessExpression: a.b.c
  if (kind === 'PropertyAccessExpression') {
    const text = node.getText?.();
    if (text) {
      return resolveIdentifier(text, sourceFile);
    }
    throw new Error('Cannot resolve property access');
  }

  throw new Error(`Cannot evaluate node kind: ${kind}`);
}

/**
 * Resolve an identifier or dotted property path to its evaluated value in a source file.
 *
 * Searches the source file's scope for const/let/var declarations matching the base
 * identifier, then evaluates the declaration's initializer and optionally navigates
 * through nested property accesses (e.g., `config.states` resolves `config` then accesses `.states`).
 *
 * This enables config objects to reference locally-defined constants:
 * ```typescript
 * const BASE_CONFIG = { initial: 'idle', ... };
 * export default createMachine('test', BASE_CONFIG, ...);
 * ```
 *
 * @param {string} name - Identifier or dotted path (e.g., "foo" or "foo.bar.baz")
 * @param {any} sourceFile - ts-morph SourceFile instance to search for declarations
 *
 * @returns {any} The evaluated value of the identifier (or nested property)
 *
 * @throws {Error} If the identifier cannot be found or its initializer is not evaluable
 *
 * @example
 * // For `const STATES = { idle: {...}, active: {...} };`
 * const value = resolveIdentifier('STATES', sourceFile);
 * // Returns: { idle: {...}, active: {...} }
 *
 * @example
 * // For nested paths
 * const value = resolveIdentifier('config.states.idle', sourceFile);
 */
function resolveIdentifier(name: string, sourceFile: any): any {
  // Try to find a const/let/var declaration with this name
  const parts = name.split('.');
  const baseName = parts[0];

  const declarations = sourceFile.getVariableDeclarations?.() ?? [];
  for (const decl of declarations) {
    if (decl.getName?.() === baseName) {
      const initializer = decl.getInitializer?.();
      if (initializer) {
        const value = evaluateNode(initializer, sourceFile);
        // Navigate through property accesses if needed
        let current = value;
        for (const part of parts.slice(1)) {
          current = current?.[part];
        }
        return current;
      }
    }
  }

  throw new Error(`Cannot resolve identifier: ${name}`);
}

/**
 * Extract the TypeScript type string for pContext from the typings argument.
 *
 * Locates the `pContext` property in the optional third argument to `createMachine`,
 * then delegates to `serializePContextType` to convert it to a TypeScript type string.
 * Enables machines to declare context shape in the Register interface.
 *
 * The typings object typically uses @bemedev/typings notation:
 * ```typescript
 * createMachine('test', config, {
 *   pContext: type({ data: 'string', count: 'number' })
 * })
 * ```
 * Which yields: `{ data: string; count: number }`
 *
 * @param {any} typingsArg - ts-morph node representing the optional typings argument
 * @param {any} _sourceFile - ts-morph SourceFile (unused, kept for consistency)
 *
 * @returns {string | null}
 *   - Extracted type string (e.g., "{ data: string }")
 *   - null if no pContext property found or typings not an object
 *
 * @example
 * // typings: { pContext: type({ userId: 'string' }) }
 * const pType = extractPContextType(typingsNode, sourceFile);
 * // Returns: "{ userId: string }"
 */
function extractPContextType(
  typingsArg: any,
  _sourceFile: any,
): string | null {
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
}

/**
 * Convert a pContext type expression into an inline TypeScript type string.
 *
 * Handles two patterns:
 * 1. **type() helper**: `type({ data: 'string' })` → delegates to objectToTypeString
 * 2. **Plain object**: `{ data: 'string' }` → delegates to objectToTypeString
 *
 * This is a dispatch function that recognizes the expression kind and routes to
 * the appropriate serializer. Returns "unknown" if the node kind is not recognized.
 *
 * @param {any} node - ts-morph node representing the pContext type expression
 *
 * @returns {string} TypeScript type string (e.g., "{ data: string }")
 *
 * @example
 * // For: type({ count: 'number', active: 'boolean' })
 * const typeStr = serializePContextType(callExprNode);
 * // Returns: "{ count: number; active: boolean }"
 */
function serializePContextType(node: any): string {
  try {
    const kind = node.getKindName?.();

    // Handle type(...) call expression
    if (kind === 'CallExpression') {
      const callee = node.getExpression?.();
      if (callee?.getText?.() === 'type') {
        const args = node.getArguments?.() ?? [];
        if (args.length > 0) {
          return objectToTypeString(args[0]);
        }
      }
    }

    // Handle plain object literal
    if (kind === 'ObjectLiteralExpression') {
      return objectToTypeString(node);
    }

    return 'unknown';
  } catch (err) {
    console.warn('Error serializing pContext type:', err);
    return 'unknown';
  }
}

/**
 * Convert an object literal node into a TypeScript object type string.
 *
 * Iterates through PropertyAssignment nodes (key-value pairs), using `valueNodeToTypeString`
 * to convert each value to its TypeScript type notation. Handles nested objects and arrays
 * recursively.
 *
 * @bemedev/typings convention mapping:
 * - `'string'` → `string`
 * - `'number'` → `number`
 * - `'boolean'` → `boolean`
 * - `'never'` → `never`
 * - Nested objects → recursively converted
 *
 * @param {any} objNode - ts-morph ObjectLiteralExpression node
 *
 * @returns {string} TypeScript object type string (e.g., "{ key: type; key2: type }")
 *
 * @example
 * // For: { userId: 'string', age: 'number', tags: ['string'] }
 * const typeStr = objectToTypeString(objNode);
 * // Returns: "{ userId: string; age: number; tags: (string)[] }"
 */
function objectToTypeString(objNode: any): string {
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
}

/**
 * Convert a single value node to TypeScript type notation.
 *
 * Handles various node types and converts them to TypeScript type syntax:
 * - **String literals** (with @bemedev/typings convention):
 *   - `'string'` → `string`, `'number'` → `number`, etc.
 *   - Other string values → preserved as literal types (e.g., `'literal'`)
 * - **Nested objects** → recursively converted via objectToTypeString
 * - **Arrays** → element types joined with `|`, wrapped in `(...)[]`
 * - **Fallback** → uses node.getText() for complex expressions
 *
 * @param {any} node - ts-morph node representing a type value
 *
 * @returns {string} TypeScript type string (e.g., "string", "number", "'custom'", "(string | number)[]")
 *
 * @example
 * // For string literal 'string'
 * const type = valueNodeToTypeString(stringNode);
 * // Returns: "string"
 *
 * @example
 * // For array ['string', 'number']
 * const type = valueNodeToTypeString(arrayNode);
 * // Returns: "(string | number)[]"
 *
 * @example
 * // For custom literal 'custom'
 * const type = valueNodeToTypeString(customNode);
 * // Returns: "'custom'"
 */
function valueNodeToTypeString(node: any): string {
  const kind = node.getKindName?.();

  // String literals (bemedev/typings convention)
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
        return `'${val}'`; // fallback: treat as literal
    }
  }

  // Nested objects
  if (kind === 'ObjectLiteralExpression') {
    return objectToTypeString(node);
  }

  // Array of types
  if (kind === 'ArrayLiteralExpression') {
    const elements = node.getElements?.() ?? [];
    const types = elements.map((el: any) => valueNodeToTypeString(el));
    return `(${types.join(' | ')})[]`;
  }

  // Fallback
  return node.getText?.() ?? 'unknown';
}

// ── PHASE 2: parseTree delegation ─────────────────────────────────────
// No custom walker. parseTree does all symbol extraction.

// ── PHASE 3: Serialization helpers ────────────────────────────────────

/**
 * Convert a BetterSet<string> to a TypeScript string literal union type.
 *
 * Iterates through the set and joins values with pipe operators, producing
 * a string literal union suitable for TypeScript type definitions. Empty sets
 * map to `never` to indicate "no valid values".
 *
 * Used to serialize symbol sets from parseTree into Register interface fields:
 * `options.actions`, `options.guards`, `events`, etc.
 *
 * @param {any} set - BetterSet<string> instance (iterable)
 *
 * @returns {string}
 *   - Non-empty set: `'action1' | 'action2' | 'action3'`
 *   - Empty set: `'never'`
 *
 * @example
 * // For BetterSet with values ['LOAD', 'RESET', 'SAVE']
 * const union = setToUnion(eventSet);
 * // Returns: "'LOAD' | 'RESET' | 'SAVE'"
 *
 * @example
 * // For empty BetterSet
 * const union = setToUnion(emptySet);
 * // Returns: "never"
 */
function setToUnion(set: any): string {
  const values: string[] = [];
  for (const v of set) {
    values.push(v);
  }

  if (values.length === 0) return 'never';
  return values.map(v => `'${v}'`).join(' | ');
}

/**
 * Convert a string array of state paths to a TypeScript string literal union type.
 *
 * Similar to `setToUnion`, but operates on arrays instead of BetterSets.
 * Used to serialize `paths.all` from parseTree output, which lists all reachable
 * state paths in the machine (e.g., ['/', '/idle', '/working', '/error']).
 *
 * @param {string[]} paths - Array of state path strings
 *
 * @returns {string}
 *   - Non-empty array: `'/' | '/idle' | '/working' | '/error'`
 *   - Empty array: `'never'`
 *
 * @example
 * // For paths: ['/', '/idle', '/active', '/done']
 * const union = pathsToUnion(paths);
 * // Returns: "'/' | '/idle' | '/active' | '/done'"
 */
function pathsToUnion(paths: string[]): string {
  if (paths.length === 0) return 'never';
  return paths.map(p => `'${p}'`).join(' | ');
}

/**
 * Convert a ConfigPaths runtime value to an inline TypeScript type literal.
 *
 * Recursively serializes the ConfigPaths structure (from parseTree.paths.map)
 * into a TypeScript type definition. The result is inlined directly into the
 * Register entry's `paths.map` field, preserving the full path hierarchy.
 *
 * Handles:
 * - `targets`: Array of reachable target paths → union type
 * - `initial`: Optional initial child state name
 * - `states`: Nested ConfigPaths map → recursively serialized
 *
 * @param {ConfigPaths} cp - Runtime ConfigPaths object from parseTree
 * @param {number} [indent=0] - Current indentation level (characters) for formatting
 *
 * @returns {string} TypeScript object type literal with proper indentation
 *
 * @example
 * // For paths.map structure:
 * // { targets: ['/', '/idle', '/working'], initial: 'idle', states: { ... } }
 * const typeStr = configPathsToType(cp, 6);
 * // Returns: "{ targets: ('/' | '/idle' | '/working')[]; initial?: 'idle'; states?: { ... } }"
 */
function configPathsToType(cp: ConfigPaths, indent = 0): string {
  const pad = ' '.repeat(indent);
  const nextPad = ' '.repeat(indent + 2);

  const targetUnion =
    cp.targets.length === 0
      ? 'never'
      : cp.targets.map(t => `'${t}'`).join(' | ');

  const lines: string[] = [`{ targets: (${targetUnion})[]; `];

  if (cp.initial) {
    lines.push(`${nextPad}initial?: '${cp.initial}';`);
  }

  if (cp.states && Object.keys(cp.states).length > 0) {
    lines.push(`${nextPad}states?: {`);

    for (const [stateName, stateConfig] of Object.entries(cp.states)) {
      const stateType = configPathsToType(stateConfig, indent + 4);
      lines.push(`${' '.repeat(indent + 4)}'${stateName}': ${stateType};`);
    }

    lines.push(`${nextPad}};`);
  }

  lines.push(`${pad}}`);

  return lines.join('\n');
}

// ── PHASE 4: per-machine entry emitter ────────────────────────────────

/**
 * Emit a complete TypeScript type definition for a single machine in the Register interface.
 *
 * Produces a ready-to-insert Register entry containing all inlined type information
 * extracted from the machine's config via parseTree and the typings argument.
 *
 * The emitted entry structure:
 * ```typescript
 * 'machine-name': {
 *   paths: { map: {...}, all: ... };
 *   events: '...' | '...';
 *   options: { actions, guards, delays, ... };
 *   pContext?: ...;
 *   tags?: ...;
 * }
 * ```
 *
 * No imports or helpers are required—all types are fully inlined for hermetic generation.
 *
 * @param {string} name - Machine's register key (from createMachine's first argument)
 * @param {ReturnType<typeof parseTree>} tree - Output from parseTree(config), containing all symbol sets
 * @param {string} pContextType - TypeScript type string for pContext (from typings arg extraction)
 *
 * @returns {string} Indented TypeScript code for one Register entry
 *
 * @example
 * const tree = parseTree(config);
 * const entry = emitRegisterEntry(
 *   'src/machines/counter.machine',
 *   tree,
 *   '{ count: number; max: number }'
 * );
 * // Produces multi-line Register entry as string
 */
function emitRegisterEntry(
  name: string,
  tree: ReturnType<typeof parseTree>,
  pContextType: string,
): string {
  const configPathsType = configPathsToType(tree.paths.map, 6);

  return [
    `    '${name}': {`,
    `      paths: {`,
    `        map: ${configPathsType};`,
    `        all: ${pathsToUnion(tree.paths.all)};`,
    `      };`,
    `      events: ${setToUnion(tree.events)};`,
    `      options: {`,
    `        children: ${setToUnion(tree.children)};`,
    `        emitters: ${setToUnion(tree.emitters)};`,
    `        tags:     ${setToUnion(tree.tags)};`,
    `        actions:  ${setToUnion(tree.actions)};`,
    `        delays:   ${setToUnion(tree.delays)};`,
    `        guards:   ${setToUnion(tree.guards)};`,
    `      };`,
    `      pContext?: ${pContextType};`,
    `      tags?: ${setToUnion(tree.tags)};`,
    `    };`,
  ].join('\n');
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * Generate app.gen.ts from all *.machine.ts / *.fsm.ts files in the workspace.
 *
 * Main entry point for CLI commands. Orchestrates the entire 4-phase generation pipeline:
 * 1. **Discovery**: Find all machine files matching the glob pattern
 * 2. **Extraction**: Use ts-morph to parse and extract config + typings from each file
 * 3. **Analysis**: Delegate to parseTree for symbol set extraction
 * 4. **Emission**: Generate TypeScript type definitions inlined into app.gen.ts
 *
 * The resulting file is a single module declaration augmenting '@bemedev/app':
 * ```typescript
 * declare module '@bemedev/app' {
 *   interface Register {
 *     'machine-name': { paths: {...}, events, options, pContext?, tags? }
 *     // ... one entry per machine, sorted alphabetically
 *   }
 * }
 * export {};
 * ```
 *
 * Key features:
 * - **Hermetic**: No runtime imports or side effects
 * - **Deterministic**: Entries sorted alphabetically for stable diffs
 * - **Type-safe**: All string options become exact literal unions
 * - **Timestamped**: Output marked with generation time for tracking
 *
 * @param {Object} options - Configuration object
 * @param {string} [options.output='app.gen.ts'] - Output file path (relative to cwd)
 * @param {string[]} [options.excludes] - Glob patterns to exclude (e.g., ['node_modules', 'dist'])
 * @param {string} [options.cwd] - Working directory (defaults to process.cwd())
 * @param {boolean} [options.dryRun=false] - If true, output to stdout instead of writing file
 *
 * @returns {Promise<void>}
 *
 * @example
 * // One-time generation
 * await generateAppGen({ output: 'app.gen.ts', cwd: process.cwd() });
 *
 * @example
 * // Dry-run for inspection
 * await generateAppGen({ dryRun: true });
 *
 * @example
 * // With custom excludes
 * await generateAppGen({
 *   excludes: ['node_modules', 'dist', 'temp'],
 *   cwd: '/path/to/project'
 * });
 */
export async function generateAppGen(options: {
  output?: string;
  excludes?: string[];
  cwd?: string;
  dryRun?: boolean;
}): Promise<void> {
  const cwd = resolve(options.cwd ?? process.cwd());
  const outputPath = resolve(cwd, options.output ?? DEFAULT_OUTPUT);

  // Discover machine files
  const files = await glob('**/*.{machine,fsm}.ts', {
    cwd,
    ignore: [
      ...(options.excludes ?? DEFAULT_EXCLUDES),
      '**/node_modules/**',
      '**/dist/**',
      '**/lib/**',
    ],
    absolute: true,
  });

  if (files.length === 0) {
    console.log('[app-ts] No machine files found.');
    return;
  }

  // Create a single ts-morph Project for all files
  const project = new Project({
    tsConfigFilePath: resolve(cwd, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  });

  for (const f of files) {
    project.addSourceFileAtPath(f);
  }

  // Extract and generate
  const entries: string[] = [];

  for (const f of files.sort()) {
    const info = extractMachineInfo(f, project);
    if (!info) {
      console.warn(`[app-ts] Skipping: ${relative(cwd, f)}`);
      continue;
    }

    const tree = parseTree(info.config);
    entries.push(emitRegisterEntry(info.name, tree, info.pContextType));
  }

  // Emit the generated file
  const content = [
    `/**`,
    ` * This file is auto-generated by the @bemedev/app CLI.`,
    ` * Do not edit manually. Re-run \`app-ts generate\` or restart \`app-ts watch\`.`,
    ` *`,
    ` * Regenerated: ${new Date().toISOString()}`,
    ` */`,
    ``,
    `declare module '@bemedev/app' {`,
    `  interface Register {`,
    ``,
    entries.join('\n\n'),
    ``,
    `  }`,
    `}`,
    ``,
    `export {};`,
    ``,
  ].join('\n');

  if (options.dryRun) {
    process.stdout.write(content);
  } else {
    writeFileSync(outputPath, content, 'utf-8');
    console.log(
      `[app-ts] Written: ${relative(cwd, outputPath)} (${entries.length} machines)`,
    );
  }
}
