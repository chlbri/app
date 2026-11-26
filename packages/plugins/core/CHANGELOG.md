# Changelog

## CHANGELOG

<details>
<summary>

## **[3.3.1] - 26/11/2026** => _18:31_

</summary>

### Breaking changes

- **4.0.0 roadmap — AI agents first** (upcoming): the next major of the
  `@bemedev/app` family — `@bemedev/app-contract` included — focuses on AI agents and
  removes `description` from **every** token — **actions included** — in contracts
  and machines alike. The `{ name, description }` (`Describer`) form is no longer
  accepted: actions and guards are referenced by their plain string name, while
  states, actors, activities and transitions keep their shape minus the field.
  Descriptions for any token are added with the new `describe` method, available on
  both contracts and machines.
- **ESM-only**: the CommonJS export conditions were removed from every subpath.
- **Peer removed**: `@bemedev/app-utils-bemedev` is no longer a peer; the addons now
  import the shared helpers from `@bemedev/app-contract/bemedev`.

</details>

<br/>

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
