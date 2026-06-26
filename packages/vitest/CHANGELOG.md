# Changelog

## CHANGELOG

<details>
<summary>

## **[1.5.0] - 26/06/2026** => _20:20_

</summary>

### Dependencies

- **Workspace and Dev Dependencies**: Bump devDependencies and
  peerDependencies to align with `@bemedev/app` version `1.5.0`.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.4.0] - 25/06/2026** => _12:05_

</summary>

### Refactor

- **Simplify test configuration**: Simplify test config by replacing custom
  TS aliases plugin with native `resolve.tsconfigPaths` in
  `vitest.config.ts`.

### Dependencies

- **Workspace and Dev Dependencies**: Bump devDependencies and
  peerDependencies to align with `@bemedev/app` version `1.4.0`.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.3.0] - 17/06/2026** => _18:45_

</summary>

### Features

- **Test new options**: Add test cases verifying `assign` and `voidAction`
  helpers with the new `then` sequential chaining handler.

### Refactor

- **Align test cases with catch**: Update async action tests to use the
  renamed `catch` option instead of `error`.

### Dependencies

- **Workspace Dependencies**: Bump workspace dependencies to align with
  `@bemedev/app` version `1.3.0`

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.2.5] - 15/06/2026** => _01:01_

</summary>

### Features

- **`emptyActionFn`**: Add `emptyActionFn` test helper constant supporting
  the new curried error action structure

### Refactor

- **Test Suite Alignment**: Refactor test suites to align with
  `@bemedev/app`'s new curried error handler pattern

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.2.4] - 09/06/2026** => _19:38_

</summary>

### Features

- **Service Exposer**: Update `constructTests` utility options parameter to
  expose `service` directly in the callback helper, allowing custom helpers
  to access the interpreter service instance

### Refactor

- **Strict Interpreters**: Replace `CommonInterpreter` usages with explicit
  `SyncInterpreter` or `AsyncInterpreter` in `ConstructTests_F` and options
  parameters for better type safety
- **Console Mocking Removal**: Remove unused `mockConsole` test helper
  utility from helper modules

### Tests

- **Index Generation**: Add unit test suite for `buildIndex` helper
- **Integration Expansion**: Add integration test coverage for `exceed`
  self transitions limits and various `constructTests` configurations

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.2.2] - 08/06/2026** => _22:15_

</summary>

### Refactor

- **Stricter Type Signatures**: Update type signature of `ConstructTests_F`
  to use stricter `CommonConfig3` type from `@bemedev/app`
- **Standardize Imports**: Update `PrimitiveObject` imports to resolve
  directly from `@bemedev/app/types` instead of `@bemedev/app/bemedev`
- **Pretest Hook**: Add `pnpm run generate` to the `pretest` script to
  ensure types are generated prior to test execution

### Dependencies

- **Dev Dependencies**: Update `@types/node` to `^25.9.2`, `oxfmt` to
  `^0.54.0`, `oxlint` to `^1.69.0`, and `rolldown` to `1.1.0`

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.2.1] - 08/06/2026** => _21:44_

</summary>

### Dependencies

- **Workspace Protocols**: Update workspace protocols to range specifiers
  (`workspace:^`) for workspace package references

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.2.0] - 08/06/2026** => _21:30_

</summary>

### Breaking Changes

- **Signature Change**: Change `constructTests` signature to require `vi`
  (VitestUtils) as the first argument:
  `constructTests(vi, service, helper?, startIndex?)` to allow checking
  fake timers and advancing them contextually.

### Features

- **Fake Timers Auto-Advance**: Integrate automatic timing advancement in
  test cases when fake timers are enabled via `vi.isFakeTimers()`.

### Refactor

- **Decouple Types**: Clean up public exports and remove type definition
  exports like `constructTests.types.ts` from the entrypoint to simplify
  API.
- **Lightweight Dependencies**: Replaced imports from `@bemedev/app/utils`
  and `@bemedev/app/bemedev` with independent helper packages
  (`@bemedev/sleep`, `@bemedev/typings`).

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[0.1.0] - 01/06/2026** => _20:50_

</summary>

- Update: Bump package version from `0.0.2` to `0.1.0`
- Update: Set `@bemedev/app` dev dependency to `^1.1.4` instead of
  `workspace:*`
- Remove: Drop `@bemedev/app` from peer dependencies
- <u>Test coverage **_100%_**</u>

</details>

<br/>

## 0.0.1

- Initial release with `constructTests` helper.
