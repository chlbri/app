import * as v from 'valibot';
import { DescriberSchema } from '../utils/describer';

export const ActionConfig_Schema = v.union([v.string(), DescriberSchema]);
