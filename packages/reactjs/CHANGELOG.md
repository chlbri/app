# Changelog

## CHANGELOG

<details>
<summary>

## **[1.9.0] - 30/07/2026** => _17:30_

</summary>

### Refactor

- **`useService`**: Refactor hook implementation and selector state
  comparison logic to support both sync and async machines seamlessly.

### Dependencies

- **Workspace Dependencies**: Bump version to align with `@bemedev/app`
  `1.9.0`.

- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[1.8.0] - 30/07/2026** => _02:15_

</summary>

### Dependencies

- **Peer Dependencies**: Update `react` peer dependency to `^19.2.8` and
  remove `@bemedev/decompose`.
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

## **[1.6.0] - 02/07/2026** => _10:08_

</summary>

### Features

- **ReactJS Integration**: Add `useService` hook to bind `@bemedev/app`
  state machine interpreter services to ReactJS component state, using
  `useState` and `useEffect` with unsubscribe cleanup, and employing deep
  state selector comparisons.

### Tests

- **Hook Coverage**: Add integration and unit test suites for `useService`
  hook using `@testing-library/react` renderHook, covering various state
  selectors and transitions.

- <u>Test coverage **_100%_**</u>

</details>

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
