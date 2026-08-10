import * as v from 'valibot';
import { DescriberSchema } from '../utils/describer';

/**
 * Valibot schema for validating action configuration (string or describer object).
 *
 * @see {@linkcode DescriberSchema}
 */
export const ActionConfig_Schema = v.union([v.string(), DescriberSchema]);
