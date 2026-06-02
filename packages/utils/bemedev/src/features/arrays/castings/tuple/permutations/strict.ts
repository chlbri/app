import type { Permutations, RuA } from '../../../../../globals/types';
import { _unknown } from '../../../../../globals/utils/_unknown';
import index from './index';

/**
 * Génère toutes les permutations possibles d'un tableau d'éléments.
 * @param arr Le tableau d'éléments à permuter.
 * @returns Un tableau contenant toutes les permutations possibles.
 *
 * **N.B: Sort the array before using this function to prevent unexpected results.**
 */
/**
 * fn const - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
const fn = <const T extends RuA>(...arr: T) => {
  return _unknown<Permutations<T>[]>(index(...arr));
};

export default fn;
