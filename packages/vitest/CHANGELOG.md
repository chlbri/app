# Changelog

## CHANGELOG

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
