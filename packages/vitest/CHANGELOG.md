# Changelog

## CHANGELOG

<details>
<summary>

## **[1.9.4] - 03/08/2026** => _21:09_

</summary>

### Dependencies

- **Workspace Dependencies**: Bump version to align with the 1.9.4
  workspace release.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.9.3] - 02/08/2026** => _21:50_

</summary>

### Dependencies

- **Workspace Dependencies**: Bump version to align with the 1.9.3
  workspace release.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.9.1] - 01/08/2026** => _17:20_

</summary>

### Dependencies

- **Workspace Dependencies**: Bump devDependencies and peerDependencies to
  align with `@bemedev/app` version `1.9.1`.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.9.0] - 30/07/2026** => _17:30_

</summary>

### Dependencies

- **Workspace Dependencies**: Bump devDependencies and peerDependencies to
  align with `@bemedev/app` version `1.9.0`.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.8.0] - 30/07/2026** => _02:15_

</summary>

### Dependencies

- **Peer Dependencies**: Update `vitest` peer dependency to `^4.1.10` and
  remove `@bemedev/typings`.
- **Dependencies**: Upgrade build tool dependencies including `rolldown` to
  `1.2.1`.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.7.0] - 02/07/2026** => _10:39_

</summary>

### Features

- **Package Metadata**: Add `homepage` key to `package.json` referencing
  documentation links.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.6.0] - 02/07/2026** => _10:11_

</summary>

### Dependencies

- **Workspace and Dev Dependencies**: Bump devDependencies and
  peerDependencies to align with `@bemedev/app` version `1.6.0`.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

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

<br/>

## License

MIT

<br/>

## Author

chlbri (bri_lvi@icloud.com)

[My GitHub](https://github.com/chlbri?tab=repositories)

[<svg width="98" height="96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>](https://github.com/chlbri?tab=repositories)

<br/>

## Links

- [Documentation](https://github.com/chlbri/app/blob/main/packages/reactjs/README.md)
