# Changelog

## CHANGELOG

<details>
<summary>

## **[3.2.0] - 25/11/2026** => _04:14_

</summary>

### Features

- **`createUtilities`**: build the lazy plugin map of a utility module, caching the
  result per addons object and resolving `sync`/`async` entries on first access.
- **`same`**: declare one implementation for both execution modes.
- **`RESOLVE`**: resolve the whole utility map eagerly and synchronously.
- **Addons**: expose the built-in helper map (`assign`, `filter`, `erase`, `batch`,
  `_for`, `_while`, `_doWhile`, `guardBatch`, `sendTo`, activity and timer helpers)
  with contract-derived types.
- **Subpaths**: ship `addons`, `bemedev`, `decompose`, `internal`, `same`, `types`
  and `typings`.
- **`AnyMachine`**: describe the machine surface with contract-derived properties.

### Dependencies

- Depend on `@bemedev/app-contract` and `@bemedev/decompose`, and peer on
  `@bemedev/app-utils-bemedev` and `@bemedev/typings`.

- <u>Test coverage **_100%_**</u>

</details>

<br/>
