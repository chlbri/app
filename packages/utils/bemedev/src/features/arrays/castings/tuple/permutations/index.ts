import type { RuA, TupleOf } from '../../../../../globals/types';
import multiply from '../multiply';

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
const fn = <const T extends RuA>(
  ...arr: T
): TupleOf<T[number], T['length']>[] => {
  const n = arr.length;
  if (n < 1) return [];
  const res: any = [];
  const used: boolean[] = multiply(false, n);
  const cur: any = [];

  const backtrack = () => {
    if (cur.length === n) {
      res.push([...cur]);
      return;
    }

    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      used[i] = true;
      cur.push(arr[i] as any);
      backtrack();
      cur.pop();
      used[i] = false;
    }
  };

  backtrack();
  return res;
};

export default fn;
