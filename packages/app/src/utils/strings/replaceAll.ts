import { escapeRegExp } from './escapeRegExp';

/**
 * Function type signature for replacing all occurrences of a substring in a string.
 *
 * @param params - Object containing `entry`, `match`, and `replacement` properties.
 *
 * @returns The modified string.
 */
export type ReplaceAll_F = (params: {
  entry: string;
  match: string;
  replacement: string;
}) => string;

/**
 * Replaces all occurrences of a specified substring in a string with a replacement string using {@linkcode escapeRegExp}.
 *
 * @param params - Object containing the string to modify, the substring to match, and the replacement string.
 * @param params.entry - The target string to modify.
 * @param params.match - The substring to search for and match.
 * @param params.replacement - The replacement string.
 *
 * @returns The modified string with all occurrences replaced.
 *
 * @see type {@linkcode ReplaceAll_F}
 */
export const replaceAll: ReplaceAll_F = ({ entry, match, replacement }) => {
  const regex = escapeRegExp(match);

  return entry.replace(new RegExp(regex, 'g'), () => replacement);
};
