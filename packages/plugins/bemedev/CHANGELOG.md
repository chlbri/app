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
- **Peer removed**: `@bemedev/app-utils-bemedev` is no longer a peer; the plugin now
  imports the shared helpers from `@bemedev/app-contract/bemedev`.

</details>

<br/>

<details>
<summary>

## **[3.2.0] - 25/11/2026** => _04:14_

</summary>

### Features

- **`plugin`**: options plugin adding the `swap` helper to the options surface.
- **`swap`**: remap standard function arguments from decomposed state paths, scoped
  to an event when one is given.
- **`Swap_F`**: exported signature of the `swap` helper.

### Dependencies

- Depend on `@bemedev/app-plugins` and `@bemedev/function-swap`; peer on
  `@bemedev/app-utils-bemedev`, `@bemedev/app-contract`, `@bemedev/typings` and
  `@bemedev/decompose`.

- <u>Test coverage **_100%_**</u>

</details>

<br/>
