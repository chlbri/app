/**
 * Calculates the integer log10 of a positive index for padding calculations.
 *
 * @param index - Index number (defaults to `0`).
 *
 * @returns Truncated log10 value.
 */
const log10 = (index = 0) => {
  if (index === 0) return 0;
  const log = Math.trunc(Math.log10(index));
  return log;
};

/**
 * Formats a zero-padded index string based on current index and max value.
 *
 * @param index - Current index number (default 0).
 * @param max - Maximum index number (default 0).
 * @returns Padded index string.
 *
 * @see {@linkcode log10}
 */
export const buildIndex = (index = 0, max = 0) => {
  if (index < 0 || max < 0) {
    throw new Error(`index (${index}) and max (${max}) must be positive integers`);
  }

  if (index > max) {
    throw new Error(`index (${index}) must be less than or equal to max (${max})`);
  }

  const logIndex = log10(index);
  const logMax = log10(max);
  const length = logMax - logIndex;
  const zeros = '0'.repeat(length);
  return `${zeros}${index}`;
};

/**
 * Builds a formatted test invite string with indexed prefix.
 *
 * @param invite - Invite description string.
 * @param index - Current test index (default 0).
 * @param max - Maximum index count (default 0).
 * @returns Formatted test title string.
 *
 * @see {@linkcode buildIndex}
 */
export const buildInvite = (invite: string, index = 0, max = 0) => {
  const _index = buildIndex(index, max);
  return `#${_index} => ${invite}`;
};
