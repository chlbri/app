---
name: jsdoc
description:
  Enforce comprehensive JSDoc documentation standards across TypeScript
  files. Use when adding or refactoring JSDoc comments for methods,
  properties, classes, types, and functions.
---

# JSDoc Guidelines

Enforce complete, rich, and clean JSDoc documentation across TypeScript
source files.

## Main Rule

- **Run Lint Verification**: After adding or modifying JSDoc comments on any file, check the closest `package.json` (relative to the target file or workspace directory). If a `lint` script exists in that `package.json`, run it (e.g. `pnpm run lint`) to validate code quality, formatting, and linting standards.

## Rules

### 1. Complete Coverage

- Add JSDoc comments for **all** methods, getters, setters, functions, and
  constructors.
- Add JSDoc comments for **all** class variables and properties (including
  `private` and `protected`).

### 2. Access Modifiers & Naming

- Use TypeScript access modifiers (`private`, `protected`, `public`)
  instead of JavaScript hash `#` private field syntax.
- Maintain consistent property naming conventions (e.g. `__field`).

### 3. Rich `{@linkcode}` References & Categorization

- Use `{@linkcode SymbolName}` to reference class names, method names,
  property names, types, parameters, and return types inside JSDoc
  descriptions, `@param`, `@returns`, and `@see`.
- When referencing a top-level **type**, **interface**, or **class** with
  `{@linkcode ...}`:
  - Prefix with ` type`, ` class`, or ` interface` before the
    `{@linkcode ...}` reference.
  - Example: type {@linkcode Error}
  - Example: class {@linkcode CommonScheduler}
  - Example: interface {@linkcode SchedulerConfig}
- **Property/Method Exception:** If the `{@linkcode ...}` reference points
  to a property or method of a class, interface, or type (e.g.
  `CommonScheduler.stop`), **do NOT prefix with `-- type`, `-- class`, or
  `-- interface`**.

### 4. `@template` Parameter Typing with `{@linkcode}`

- When using `@template` and you need to type the template parameter using
  `{@linkcode ...}`, put `| {@linkcode TargetType} \`ParamName\`` to type
  the template parameter.
- Wrap the template parameter name in backticks.

Example:

```ts
/**
 * Function type signature for adding options to an async machine configuration.
 *
 * @template E - Event object type.
 * @template Pc - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 * @template Ta - State tag string type.
 * @template Mo - Simple machine options type.
 * @template L - Existing options type.
 */
export type AsyncAddOptions_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Ta extends string = string,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
  L extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = <const T extends Mo>(
  option: AsyncAddOptionsParam_F<E, Pc, Tc, Ta, T, L>,
) => L & T;
```

### 5. `@see` section

This section concerns all main tokens (functions, methods, interfaces,
types, classes, variables, etc...) used inside the elements we want to
document. Put only relevant tokens

### 6. `@see` Reference Deduplication

- **Do NOT list a token in `@see` if it is already mentioned in the JSDoc
  body description, `@param`, or `@returns`.**
- Only include tokens under `@see` if they provide useful context and are
  **NOT** referenced elsewhere in that same JSDoc block.
- Omit the `@see` tag entirely if all relevant symbols are already linked
  in the description or parameter/return tags.

### 7. `@see` Formatting Rules

- **Only one `@see` tag per JSDoc block.** Combine multiple references into
  a single `@see` tag line.
- Example: `@see -- type {@linkcode Error}`
- Example: `@see {@linkcode CommonScheduler.stop}` (no `-- class` prefix
  because `.stop` is a property/method).
- When referencing a top-level **type**, **interface**, or **class** with
  `{@linkcode ...}`:
  - Prefix with `-- type`, `-- class`, or `-- interface` before the
    `{@linkcode ...}` reference.
  - Example: -- type {@linkcode Error}
  - Example: -- class {@linkcode CommonScheduler}
  - Example: -- interface {@linkcode SchedulerConfig}

### 8. Functions with Multiple Signatures (Overloads)

- For functions or methods with multiple overload signatures, **only add
  JSDoc comments to the overload definitions (signatures)**.
- Do **NOT** add JSDoc comments to the implementation signature.

Example:

````ts
/**
 * React hook that subscribes to any type {@linkcode Subscribable} source and
 * returns a reactive selected value, re-rendering only when the selected
 * slice changes.
 *
 * Internally delegates to {@linkcode useSync} from `@bemedev/react-sync`,
 * which wraps `useSyncExternalStore` with a memoized selector and equality
 * check — making it safe for React concurrent mode.
 *
 * @template T - Type emitted by the subscribable source.
 * @template R - Type of the selected value, defaults to `T`.
 *
 * @param subscribable - Source subscribable of type {@linkcode Subscribable}.
 * @param options - Configuration options.
 * @param options.selector - Optional selector function of type {@linkcode Selector_F}.
 * @param options.equals - Optional equality comparator function of type {@linkcode Equals_F}.
 *
 * @returns The current selected value of type `R | undefined`.
 *
 * @example
 * ```tsx
 * import { BehaviorSubject } from 'rxjs';
 * import { useSubscriber } from '@bemedev/react-subscriber';
 *
 * const counter$ = new BehaviorSubject(0);
 *
 * function Counter() {
 *   const count = useSubscriber(counter$);
 *   return <span>{count}</span>;
 * }
 * ```
 */
export function useSubscriber<T, R = T>(
  subscribable: Subscribable<T>,
  options?: { selector?: Selector_F<T, R>; equals?: Equals_F<NoInfer<R>> },
): R | undefined;

/**
 * React hook that subscribes to any type {@linkcode Subscribable} source and
 * returns a reactive selected value of type `R`, initialized with `defaultValue`.
 *
 * @template T - Type emitted by the subscribable source.
 * @template R - Type of the selected value, defaults to `T`.
 *
 * @param subscribable - Source subscribable of type {@linkcode Subscribable}.
 * @param options - Configuration options including mandatory `defaultValue`.
 * @param options.selector - Optional selector function of type {@linkcode Selector_F}.
 * @param options.equals - Optional equality comparator function of type {@linkcode Equals_F}.
 * @param options.defaultValue - Initial value for the subscriber of type `R`.
 *
 * @returns The current selected value of type `R`.
 */
export function useSubscriber<T, R = T>(
  subscribable: Subscribable<T>,
  options: {
    selector?: Selector_F<T, R>;
    equals?: Equals_F<NoInfer<R>>;
    defaultValue: R;
  },
): R;

// Implementation below is not documented with JSDoc
export function useSubscriber<T, R = T>(
  subscribable: Subscribable<T>,
  options: {
    selector?: Selector_F<T, R>;
    equals?: Equals_F<NoInfer<R>>;
    defaultValue?: R;
  } = {},
): R | undefined {
  // ...The implementation you want
}
````

### 9. Others

Add also jsdoc to type definitions, even if they are alias

so this :

```ts
//before
//****
export type SubscriberBuilder<T, R = T> = SubscriberBuilderClass<T, R>;

//after
//****
/**
 * Type alias for -- class SubscriberBuilderClass<T, R>.
 *
 * @template {unknown} T - The type of the stream to subscribe to.
 * @template {unknown} R - The result type of the operator, defaults to T.
 */

export type SubscriberBuilder<T, R = T> = SubscriberBuilderClass<T, R>;
```
