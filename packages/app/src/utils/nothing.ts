import { DEFAULT_NOTHING } from '#constants';
import { IS_TEST } from './environment';

/**
 * A utility function used when no action is required or when a placeholder value is needed.
 *
 * @returns In test environment constant {@linkcode DEFAULT_NOTHING}, otherwise `undefined`.
 */
export const nothing = () => {
  if (IS_TEST()) {
    console.log(`${DEFAULT_NOTHING} call ${DEFAULT_NOTHING}`);
    return DEFAULT_NOTHING;
  }
  return;
};
