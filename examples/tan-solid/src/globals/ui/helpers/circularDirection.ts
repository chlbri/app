/**
 * Determines the slide direction for animation.
 * - 1 = slide to the right (new tab to the right)
 * - -1 = slide to the left (new tab to the left)
 *
 * Special case for circular navigation between the first and last tab.
 *
 * @param current - The current tab index.
 * @param previous - The previous tab index.
 * @param last - The last tab index.
 * @returns 1 for right slide, -1 for left slide.
 */
export const circularDirection = (
  current: number,
  previous: number,
  last: number,
) => {
  if (current === 0 && previous === last) return 1; // slide droite
  if (current === last && previous === 0) return -1; // slide gauche
  return current > previous ? 1 : -1;
};
