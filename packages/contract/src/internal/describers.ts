/**
 * Legacy describer types.
 *
 * Config actions and guards are plain strings: descriptions are declared with
 * `describe` on `Contract` / `Machine`, not inside the configuration tokens.
 * These types remain for runtime helpers that still accept legacy describer
 * objects.
 */

/**
 * Describer object used to name an action or a guard.
 *
 * @deprecated Use `describe` on `Contract` / `Machine` for descriptions.
 */
export type Describer = { name: string };

/**
 * Legacy action or guard reference, either a string or a describer object.
 *
 * @deprecated Config actions and guards are plain strings.
 */
export type WithDescriber = string | Describer;
