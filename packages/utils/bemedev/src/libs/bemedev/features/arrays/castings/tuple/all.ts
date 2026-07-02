import { expandFn } from '../../../../globals/utils/expandFn';
import is from '../is';
import _index from './index';
import multiply from './multiply';
import permutations from './permutations/all';

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
const fn = expandFn(_index, {
  multiply,
  is,
  permutations,
});

export default fn;
